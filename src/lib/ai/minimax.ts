const MINIMAX_TTS_URL = "https://api.minimaxi.com/v1/t2a_v2";
const DEFAULT_MINIMAX_TTS_MODEL = "speech-2.8-turbo";
const DEFAULT_AUDIO_FORMAT = "mp3";

const boyfriendVoices: Record<string, string> = {
  shen_xingzhou: "male-qn-qingse",
  gu_chengye: "male-qn-jingying",
  lin_ting: "junlang_nanyou",
  zhou_yan: "male-qn-jingying",
};

type MiniMaxTtsResponse = {
  data?: {
    audio?: string;
  };
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
};

export function getVoiceIdForBoyfriend(boyfriendId: string) {
  return boyfriendVoices[boyfriendId] ?? "junlang_nanyou";
}

export function hexAudioToDataUrl(hexAudio: string, format = DEFAULT_AUDIO_FORMAT) {
  const normalizedFormat = format === "mp3" ? "mpeg" : format;
  const base64Audio = Buffer.from(hexAudio, "hex").toString("base64");

  return `data:audio/${normalizedFormat};base64,${base64Audio}`;
}

export function buildMiniMaxTtsBody({
  boyfriendId,
  text,
}: {
  boyfriendId: string;
  text: string;
}) {
  return {
    model: process.env.MINIMAX_TTS_MODEL || DEFAULT_MINIMAX_TTS_MODEL,
    text,
    stream: false,
    voice_setting: {
      voice_id: getVoiceIdForBoyfriend(boyfriendId),
      speed: 1,
      vol: 1,
      pitch: 0,
    },
    audio_setting: {
      sample_rate: 32000,
      bitrate: 128000,
      format: DEFAULT_AUDIO_FORMAT,
      channel: 1,
    },
  };
}

export async function generateSpeechAudio({
  boyfriendId,
  text,
}: {
  boyfriendId: string;
  text: string;
}) {
  const apiKey = process.env.MINIMAX_API_KEY;

  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY is not configured");
  }

  const response = await fetch(MINIMAX_TTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildMiniMaxTtsBody({ boyfriendId, text })),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`MiniMax TTS request failed with status ${response.status}: ${responseText}`);
  }

  const data = JSON.parse(responseText) as MiniMaxTtsResponse;

  if (data.base_resp?.status_code && data.base_resp.status_code !== 0) {
    throw new Error(`MiniMax TTS request failed: ${data.base_resp.status_msg ?? "unknown error"}`);
  }

  if (!data.data?.audio) {
    throw new Error("MiniMax TTS response did not include audio data");
  }

  return hexAudioToDataUrl(data.data.audio, DEFAULT_AUDIO_FORMAT);
}
