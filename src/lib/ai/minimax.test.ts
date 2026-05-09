import { describe, expect, it } from "vitest";

import { buildMiniMaxTtsBody, getVoiceIdForBoyfriend, hexAudioToDataUrl } from "./minimax";

describe("MiniMax TTS helpers", () => {
  it("converts hex audio into a playable data URL", () => {
    expect(hexAudioToDataUrl("4869", "mp3")).toBe("data:audio/mpeg;base64,SGk=");
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
});
