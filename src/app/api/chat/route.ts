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
    return NextResponse.json({ error: "LLM request failed" }, { status: 502 });
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

  console.log("Chat API - voiceCalls:", JSON.stringify(voiceCalls));
  console.log("Chat API - selfieCalls:", JSON.stringify(selfieCalls));
  console.log("Chat API - isDirectVoiceRequest:", isDirectVoiceMessageRequest);

  const textMessages =
    (isDirectPhotoRequest && result.selfieCalls.length === 0) || isDirectVoiceMessageRequest
      ? []
      : splitAssistantTextMessages(result.text);

  const imageMessages = (
    await Promise.allSettled(
      selfieCalls.map(async (selfieCall) => {
        // 1. 调用 Seedream 直接拿到 buffer（b64_json 格式，无需二次 fetch）
        const { buffer, mimeType } = await generateImage({
          prompt: buildSelfieImagePrompt({
            boyfriendName: boyfriend.name,
            scene: selfieCall.scene,
          }),
        });

        // 2. 直接上传 buffer 到 R2，获取永久链接
        const fileName = `selfies/${nanoid()}.png`;
        const imageUrl = await uploadToR2(buffer, fileName, mimeType);

        return toSelfieImageMessage({
          imageUrl,
          caption: selfieCall.caption,
        });
      }),
    )
  ).flatMap((r) => {
    if (r.status === "rejected") {
      console.error("Image generation failed:", r.reason);
    }
    return r.status === "fulfilled" ? [r.value] : [];
  });

  const audioMessages = (
    await Promise.allSettled(
      voiceCalls.map(async (voiceCall) => {
        const audioUrl = await generateSpeechAudio({
          boyfriendId: boyfriend.id,
          text: voiceCall.text,
        });

        return toAudioMessage({
          audioUrl,
          caption: voiceCall.caption ?? voiceCall.text,
        });
      }),
    )
  ).flatMap((r) => {
    if (r.status === "rejected") {
      console.error("Voice generation failed:", r.reason);
    }
    return r.status === "fulfilled" ? [r.value] : [];
  });

  const assistantMessages = [...textMessages, ...imageMessages, ...audioMessages];
  const assistantTextForMemory = textMessages.map((item) => item.content).join("\n");
  const userMessages = [
    ...(message
      ? [
          {
            role: "user" as const,
            type: "text" as const,
            content: message,
          },
        ]
      : []),
    ...(imageDataUrl
      ? [
          toUserImageMessage({
            imageUrl: imageDataUrl,
            caption: message || "图片消息",
          }),
        ]
      : []),
    ...(audioDataUrl
      ? [
          toUserAudioMessage({
            audioUrl: audioDataUrl,
            caption: message || "语音消息",
          }),
        ]
      : []),
  ];

  try {
    await saveChatMessages({
      userId,
      boyfriendId: boyfriend.id,
      messages: [...userMessages, ...assistantMessages],
    });
  } catch (error) {
    console.error("Failed to save chat messages:", error);
  }

  // 并行执行：记忆提取 + 好感度更新（不阻塞响应）
  if (message) {
    Promise.allSettled([
      // 记忆提取
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

      // 好感度评分 + 更新
      scoreAffectionDelta({ userMessage: message, assistantText: assistantTextForMemory })
        .then((delta) => {
          console.log(`[affection] ${userId} ← ${boyfriend.id}: delta=${delta}, before=${affectionState.score}`);
          return updateAffectionScore({ userId, boyfriendId: boyfriend.id, delta });
        })
        .then(({ score, level }) => {
          console.log(`[affection] after=${score} (${level})`);
        }),
    ]).catch(() => {
      // 静默，不影响主流程
    });
  }

  return NextResponse.json({
    messages: withClientIds(assistantMessages),
  });
}
