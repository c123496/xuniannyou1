import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { generateBoyfriendReply } from "@/lib/ai/deepseek";
import { generateSpeechAudio } from "@/lib/ai/minimax";
import { generateImage } from "@/lib/ai/seedream";
import { getBoyfriendById } from "@/lib/boyfriends";
import {
  splitAssistantTextMessages,
  toAudioMessage,
  toSelfieImageMessage,
  withClientIds,
} from "@/lib/chat/messages";
import { ensureSelfieForDirectRequest, isDirectSelfieRequest } from "@/lib/chat/selfie-intent";
import { ensureVoiceForDirectRequest, isDirectVoiceRequest } from "@/lib/chat/voice-intent";
import { saveChatMessages } from "@/lib/db/messages";

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
  };

  const message = body.message?.trim();
  const boyfriend = body.boyfriendId ? getBoyfriendById(body.boyfriendId) : undefined;

  if (!boyfriend) {
    return NextResponse.json({ error: "Unknown boyfriend" }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const result = await generateBoyfriendReply({ boyfriend, userMessage: message });
    const isDirectPhotoRequest = isDirectSelfieRequest(message);
    const isDirectVoiceMessageRequest = isDirectVoiceRequest(message);
    const selfieCalls = ensureSelfieForDirectRequest({
      boyfriendId: boyfriend.id,
      userMessage: message,
      selfieCalls: result.selfieCalls,
    });
    const voiceCalls = ensureVoiceForDirectRequest({
      userMessage: message,
      assistantText: result.text,
      voiceCalls: result.voiceCalls,
    });
    const textMessages =
      (isDirectPhotoRequest && result.selfieCalls.length === 0) || isDirectVoiceMessageRequest
        ? []
        : splitAssistantTextMessages(result.text);
    const imageMessages = await Promise.all(
      selfieCalls.map(async (selfieCall) => {
        const imageUrl = await generateImage({
          prompt: buildSelfieImagePrompt({
            boyfriendName: boyfriend.name,
            scene: selfieCall.scene,
          }),
        });

        return toSelfieImageMessage({
          imageUrl,
          caption: selfieCall.caption,
        });
      }),
    );
    const audioMessages = await Promise.all(
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
    );
    const assistantMessages = [...textMessages, ...imageMessages, ...audioMessages];
    const userMessage = {
      role: "user" as const,
      type: "text" as const,
      content: message,
    };

    await saveChatMessages({
      userId: session.user.email ?? session.user.name ?? "unknown-user",
      boyfriendId: boyfriend.id,
      messages: [userMessage, ...assistantMessages],
    });

    return NextResponse.json({
      messages: withClientIds(assistantMessages),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "LLM request failed" }, { status: 502 });
  }
}
