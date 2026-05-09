import type { VoiceToolCall } from "../ai/deepseek";

const directVoicePatterns = [
  /发.*语音/,
  /语音.*说/,
  /想听.*声音/,
  /听.*声音/,
  /念给我听/,
  /读给我听/,
  /用声音/,
  /说给我听/,
];

export function isDirectVoiceRequest(message: string) {
  return directVoicePatterns.some((pattern) => pattern.test(message));
}

export function buildFallbackVoiceCall(text: string): VoiceToolCall {
  const voiceText = text.trim() || "我在。";

  return {
    text: voiceText,
    caption: voiceText,
  };
}

export function ensureVoiceForDirectRequest({
  userMessage,
  assistantText,
  voiceCalls,
}: {
  userMessage: string;
  assistantText: string;
  voiceCalls: VoiceToolCall[];
}) {
  if (!isDirectVoiceRequest(userMessage) || voiceCalls.length > 0) {
    return voiceCalls;
  }

  return [buildFallbackVoiceCall(assistantText)];
}
