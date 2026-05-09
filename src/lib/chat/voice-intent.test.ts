import { describe, expect, it } from "vitest";

import { buildFallbackVoiceCall, isDirectVoiceRequest } from "./voice-intent";

describe("voice intent detection", () => {
  it.each(["发条语音", "我想听你的声音", "语音说给我听", "念给我听", "用声音哄我"])(
    "detects direct voice request: %s",
    (message) => {
      expect(isDirectVoiceRequest(message)).toBe(true);
    },
  );

  it("does not trigger on unrelated chat", () => {
    expect(isDirectVoiceRequest("今天想吃什么")).toBe(false);
  });

  it("builds a fallback voice call from assistant text", () => {
    expect(buildFallbackVoiceCall("我在。")).toEqual({
      text: "我在。",
      caption: "我在。",
    });
  });
});
