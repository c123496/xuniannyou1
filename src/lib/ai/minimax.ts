import { WebSocket } from "undici";

const DEFAULT_MINIMAX_TTS_URL = "https://api.minimaxi.com/v1/t2a_v2";
const DEFAULT_MINIMAX_TTS_WS_URL = "wss://api.minimaxi.com/ws/v1/t2a_v2";
const DEFAULT_MINIMAX_TTS_MODEL = "speech-2.8-turbo";
const DEFAULT_AUDIO_FORMAT = "mp3";
const MINIMAX_WS_TIMEOUT_MS = 45000;

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

type MiniMaxWebSocketMessage = {
  event?: string;
  data?: {
    audio?: string;
    status?: number;
  };
  is_final?: boolean;
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
};

export function getVoiceIdForBoyfriend(boyfriendId: string) {
  return boyfriendVoices[boyfriendId] ?? "junlang_nanyou";
}

export function getMiniMaxTtsHttpUrl() {
  return process.env.MINIMAX_TTS_URL || DEFAULT_MINIMAX_TTS_URL;
}

export function getMiniMaxTtsWebSocketUrl() {
  return process.env.MINIMAX_TTS_WS_URL || DEFAULT_MINIMAX_TTS_WS_URL;
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

export function buildMiniMaxTtsStartFrame({ boyfriendId }: { boyfriendId: string }) {
  return {
    event: "task_start",
    model: process.env.MINIMAX_TTS_MODEL || DEFAULT_MINIMAX_TTS_MODEL,
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

export function buildMiniMaxTtsContinueFrame(text: string) {
  return {
    event: "task_continue",
    text,
  };
}

function buildMiniMaxTtsFinishFrame() {
  return {
    event: "task_finish",
  };
}

function parseMiniMaxWebSocketMessage(raw: unknown): MiniMaxWebSocketMessage {
  const text =
    typeof raw === "string"
      ? raw
      : raw instanceof ArrayBuffer
        ? Buffer.from(raw).toString("utf8")
        : Buffer.isBuffer(raw)
          ? raw.toString("utf8")
          : "";

  if (!text) return {};

  return JSON.parse(text) as MiniMaxWebSocketMessage;
}

export function shouldStartMiniMaxTtsTask(message: MiniMaxWebSocketMessage) {
  return message.event === "connected_success";
}

async function generateSpeechAudioWithRest({
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

  const response = await fetch(getMiniMaxTtsHttpUrl(), {
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

export async function generateSpeechAudioWithWebSocket({
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

  return new Promise<string>((resolve, reject) => {
    const audioChunks: string[] = [];
    let started = false;
    let finished = false;
    const timeout = setTimeout(() => {
      if (!finished) {
        finished = true;
        socket.close();
        reject(new Error("MiniMax TTS WebSocket request timed out"));
      }
    }, MINIMAX_WS_TIMEOUT_MS);

    const socket = new WebSocket(getMiniMaxTtsWebSocketUrl(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    function fail(error: Error) {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      socket.close();
      reject(error);
    }

    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      socket.close();

      if (audioChunks.length === 0) {
        reject(new Error("MiniMax TTS WebSocket response did not include audio data"));
        return;
      }

      resolve(hexAudioToDataUrl(audioChunks.join(""), DEFAULT_AUDIO_FORMAT));
    }

    socket.addEventListener("message", (event) => {
      try {
        const message = parseMiniMaxWebSocketMessage(event.data);

        if (message.base_resp?.status_code && message.base_resp.status_code !== 0) {
          fail(new Error(`MiniMax TTS WebSocket request failed: ${message.base_resp.status_msg ?? "unknown error"}`));
          return;
        }

        if (!started && shouldStartMiniMaxTtsTask(message)) {
          socket.send(JSON.stringify(buildMiniMaxTtsStartFrame({ boyfriendId })));
          return;
        }

        if (!started && message.event === "task_started") {
          started = true;
          socket.send(JSON.stringify(buildMiniMaxTtsContinueFrame(text)));
          socket.send(JSON.stringify(buildMiniMaxTtsFinishFrame()));
          return;
        }

        if (message.data?.audio) {
          audioChunks.push(message.data.audio);
        }

        if (message.is_final) {
          finish();
        }
      } catch (error) {
        fail(error instanceof Error ? error : new Error("Failed to parse MiniMax TTS WebSocket response"));
      }
    });

    socket.addEventListener("error", () => {
      fail(new Error("MiniMax TTS WebSocket connection failed"));
    });

    socket.addEventListener("close", () => {
      if (!finished && started) {
        finish();
      } else if (!finished) {
        fail(new Error("MiniMax TTS WebSocket closed before task started"));
      }
    });
  });
}

export async function generateSpeechAudio({
  boyfriendId,
  text,
}: {
  boyfriendId: string;
  text: string;
}) {
  if (process.env.MINIMAX_TTS_TRANSPORT !== "rest") {
    try {
      return await generateSpeechAudioWithWebSocket({ boyfriendId, text });
    } catch (error) {
      console.error("MiniMax TTS WebSocket failed, falling back to REST:", error);
    }
  }

  return generateSpeechAudioWithRest({ boyfriendId, text });
}
