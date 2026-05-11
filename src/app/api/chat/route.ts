import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { scoreAffectionDelta } from "@/lib/ai/affection-scorer";
import { generateBoyfriendReply } from "@/lib/ai/deepseek";
import { extractUserMemoriesFromConversation } from "@/lib/ai/memory-extractor";
import { generateSpeechAudio } from "@/lib/ai/minimax";
import { generateImage } from "@/lib/ai/seedream";
import { getBoyfriendById } from "@/lib/boyfriends";
import { uploadToR2 } from "@/lib/r2";
import {
  splitAssistantTextMessages,
  toAudioMessage,
  toSelfieImageMessage,
  toUserAudioMessage,
  toUserImageMessage,
  withClientIds,
} from "@/lib/chat/messages";
import { ensureSelfieForDirectRequest, isDirectSelfieRequest } from "@/lib/chat/selfie-intent";
import { ensureVoiceForDirectRequest, isDirectVoiceRequest } from "@/lib/chat/voice-intent";
import { saveChatMessages } from "@/lib/db/messages";
import { getAffectionScore, updateAffectionScore } from "@/lib/db/user-affection";
import { formatUserMemoriesForPrompt, getUserMemories, upsertUserMemories } from "@/lib/db/user-memories";

// 允许图片+语音并行生成，最长 60s
export const maxDuration = 60;

function buildSelfieImagePrompt({
  boyfriendName,
  scene,
}: {
  boyfriendName: string;
  scene: string;
}) {
  return [
    `生成一张${boyfriendName}发给女友的真实手机自拍。`,
    `场景：${scene}`,
    "风格：自然、真实、像微信聊天里刚拍的照片，不要漫画感，不要文字水印，不要多人合照。",
  ].join("\n");
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    boyfriendId?: string;
    message?: string;
    imageDataUrl?: string;
    audioDataUrl?: string;
  };

  const message = body.message?.trim();
  const imageDataUrl = body.imageDataUrl?.trim();
  const audioDataUrl = body.audioDataUrl?.trim();
  const boyfriend = body.boyfriendId ? getBoyfriendById(body.boyfriendId) : undefined;

  if (!boyfriend) {
    return NextResponse.json({ error: "Unknown boyfriend" }, { status: 400 });
  }

  if (!message && !imageDataUrl && !audioDataUrl) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const userId = session.user.email ?? session.user.name ?? "unknown-user";
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // 客户端已断开，忽略
        }
      };

      try {
        // 并行加载记忆和好感度
        let memoryContext = "";
        let affectionState: import("@/lib/db/user-affection").AffectionState = { score: 60, level: "warm" };

        const [memoriesResult, affectionResult] = await Promise.allSettled([
          getUserMemories({ userId, boyfriendId: boyfriend.id }),
          getAffectionScore({ userId, boyfriendId: boyfriend.id }),
        ]);

        if (memoriesResult.status === "fulfilled") {
          memoryContext = formatUserMemoriesForPrompt(memoriesResult.value);
        } else {
          console.warn("[memory] failed to load", memoriesResult.reason);
        }

        if (affectionResult.status === "fulfilled") {
          affectionState = affectionResult.value;
        }

        const userPrompt = [
          message || "",
          imageDataUrl ? "[用户发送了一张图片，请结合她的文字语气回应。如果需要看图细节，可以先温柔地说明你收到了图片。]" : "",
          audioDataUrl ? "[用户发送了一条语音消息，请像收到语音一样自然回应。]" : "",
        ]
          .filter(Boolean)
          .join("\n");

        let result;
        try {
          result = await generateBoyfriendReply({ boyfriend, userMessage: userPrompt, memoryContext, affectionState });
        } catch (error) {
          console.error("DeepSeek request failed:", error);
          send({ type: "error", message: "LLM request failed" });
          controller.close();
          return;
        }

        const isDirectPhotoRequest = message ? isDirectSelfieRequest(message) : false;
        const isDirectVoiceMessageRequest = message ? isDirectVoiceRequest(message) : false;
        const selfieCalls = ensureSelfieForDirectRequest({
          boyfriendId: boyfriend.id,
          userMessage: message || "",
          selfieCalls: result.selfieCalls,
        });
        const voiceCalls = ensureVoiceForDirectRequest({
          userMessage: message || "",
          assistantText: result.text,
          voiceCalls: result.voiceCalls,
        });

        const textMessages =
          (isDirectPhotoRequest && result.selfieCalls.length === 0) || isDirectVoiceMessageRequest
            ? []
            : splitAssistantTextMessages(result.text);

        const hasMedia = selfieCalls.length > 0 || voiceCalls.length > 0;

        // ── Step 1：立即推送文字消息 ────────────────────────────────
        send({ type: "text", messages: withClientIds(textMessages), hasMedia });

        const userMessages = [
          ...(message
            ? [{ role: "user" as const, type: "text" as const, content: message }]
            : []),
          ...(imageDataUrl
            ? [toUserImageMessage({ imageUrl: imageDataUrl, caption: message || "图片消息" })]
            : []),
          ...(audioDataUrl
            ? [toUserAudioMessage({ audioUrl: audioDataUrl, caption: message || "语音消息" })]
            : []),
        ];

        // 异步保存用户消息 + 文字消息（不阻塞流）
        saveChatMessages({
          userId,
          boyfriendId: boyfriend.id,
          messages: [...userMessages, ...textMessages],
        }).catch((err) => console.error("Failed to save text messages:", err));

        const assistantTextForMemory = textMessages.map((m) => m.content).join("\n");

        // ── Step 2：并行生成图片和语音，生成完立即推送 ───────────────
        if (hasMedia) {
          const [imageMessages, audioMessages] = await Promise.all([
            Promise.allSettled(
              selfieCalls.map(async (selfieCall) => {
                const { buffer, mimeType } = await generateImage({
                  prompt: buildSelfieImagePrompt({
                    boyfriendName: boyfriend.name,
                    scene: selfieCall.scene,
                  }),
                });
                const fileName = `selfies/${nanoid()}.png`;
                const imageUrl = await uploadToR2(buffer, fileName, mimeType);
                return toSelfieImageMessage({ imageUrl, caption: selfieCall.caption });
              }),
            ).then((results) =>
              results.flatMap((r) => {
                if (r.status === "rejected") console.error("Image generation failed:", r.reason);
                return r.status === "fulfilled" ? [r.value] : [];
              }),
            ),
            Promise.allSettled(
              voiceCalls.map(async (voiceCall) => {
                const audioUrl = await generateSpeechAudio({
                  boyfriendId: boyfriend.id,
                  text: voiceCall.text,
                });
                return toAudioMessage({ audioUrl, caption: voiceCall.caption ?? voiceCall.text });
              }),
            ).then((results) =>
              results.flatMap((r) => {
                if (r.status === "rejected") console.error("Voice generation failed:", r.reason);
                return r.status === "fulfilled" ? [r.value] : [];
              }),
            ),
          ]);

          const mediaMessages = [...imageMessages, ...audioMessages];
          if (mediaMessages.length > 0) {
            send({ type: "media", messages: withClientIds(mediaMessages) });
            saveChatMessages({
              userId,
              boyfriendId: boyfriend.id,
              messages: mediaMessages,
            }).catch((err) => console.error("Failed to save media messages:", err));
          }
        }

        send({ type: "done" });

        // 非阻塞：记忆提取 + 好感度更新
        if (message) {
          Promise.allSettled([
            extractUserMemoriesFromConversation({
              userMessage: message,
              assistantText: assistantTextForMemory,
              boyfriendId: boyfriend.id,
              boyfriendName: boyfriend.name,
            }).then(async (extractedMemories) => {
              if (extractedMemories.length > 0) {
                await upsertUserMemories({ userId, boyfriendId: boyfriend.id, memories: extractedMemories });
              }
            }),
            scoreAffectionDelta({ userMessage: message, assistantText: assistantTextForMemory })
              .then((delta) => {
                console.log(`[affection] ${userId} ← ${boyfriend.id}: delta=${delta}, before=${affectionState.score}`);
                return updateAffectionScore({ userId, boyfriendId: boyfriend.id, delta });
              })
              .then(({ score, level }) => {
                console.log(`[affection] after=${score} (${level})`);
              }),
          ]).catch(() => {});
        }
      } catch (error) {
        console.error("Stream error:", error);
        send({ type: "error", message: "request failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
