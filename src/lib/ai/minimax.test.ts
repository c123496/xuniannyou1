import { describe, expect, it } from "vitest";

import {
  buildMiniMaxTtsBody,
  buildMiniMaxTtsContinueFrame,
  buildMiniMaxTtsStartFrame,
  getMiniMaxTtsHttpUrl,
  getMiniMaxTtsWebSocketUrl,
  getVoiceIdForBoyfriend,
  hexAudioToDataUrl,
  shouldStartMiniMaxTtsTask,
} from "./minimax";

describe("MiniMax TTS helpers", () => {
  it("converts hex audio into a playable data URL", () => {
    expect(hexAudioToDataUrl("4869", "mp3")).toBe("data:audio/mpeg;base64,SGk=");
  });

  it("uses the current MiniMax T2A endpoint by default", () => {
    expect(getMiniMaxTtsHttpUrl()).toBe("https://api.minimaxi.com/v1/t2a_v2");
    expect(getMiniMaxTtsWebSocketUrl()).toBe("wss://api.minimaxi.com/ws/v1/t2a_v2");
  });

  it("builds a t2a request body with role voice settings", () => {
    expect(
      buildMiniMaxTtsBody({
        boyfriendId: "gu_chengye",
        text: "我在。",
      }),
    ).toMatchObject({
      model: "speech-2.8-turbo",
      text: "我在。",
      stream: false,
      voice_setting: {
        voice_id: getVoiceIdForBoyfriend("gu_chengye"),
      },
      audio_setting: {
        format: "mp3",
      },
    });
  });

  it("builds a MiniMax WebSocket task_start frame", () => {
    expect(
      buildMiniMaxTtsStartFrame({
        boyfriendId: "lin_ting",
      }),
    ).toMatchObject({
      event: "task_start",
      model: "speech-2.8-turbo",
      voice_setting: {
        voice_id: getVoiceIdForBoyfriend("lin_ting"),
      },
      audio_setting: {
        format: "mp3",
      },
    });
  });

  it("builds a MiniMax WebSocket task_continue frame with text", () => {
    expect(buildMiniMaxTtsContinueFrame("今晚8点见")).toEqual({
      event: "task_continue",
      text: "今晚8点见",
    });
  });

  it("waits for the MiniMax WebSocket connection success event before starting the task", () => {
    expect(shouldStartMiniMaxTtsTask({ event: "connected_success" })).toBe(true);
    expect(shouldStartMiniMaxTtsTask({ event: "task_started" })).toBe(false);
  });
});
