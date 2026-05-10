import { describe, expect, it } from "vitest";

import {
  splitAssistantTextMessages,
  toAudioMessage,
  toSelfieImageMessage,
  toUserAudioMessage,
  toUserImageMessage,
} from "./messages";

describe("chat message helpers", () => {
  it("splits assistant text on NEW_MSG boundaries", () => {
    expect(splitAssistantTextMessages("想你了。[NEW_MSG]你别笑我。")).toEqual([
      { role: "assistant", type: "text", content: "想你了。" },
      { role: "assistant", type: "text", content: "你别笑我。" },
    ]);
  });

  it("builds an image message from a selfie tool call", () => {
    expect(
      toSelfieImageMessage({
        imageUrl: "https://example.com/selfie.jpeg",
        caption: "刚拍的，别嫌弃",
      }),
    ).toEqual({
      role: "assistant",
      type: "image",
      imageUrl: "https://example.com/selfie.jpeg",
      caption: "刚拍的，别嫌弃",
      content: "刚拍的，别嫌弃",
    });
  });

  it("builds an audio message from a generated voice clip", () => {
    expect(
      toAudioMessage({
        audioUrl: "data:audio/mpeg;base64,AAAA",
        caption: "我想你了。",
      }),
    ).toEqual({
      role: "assistant",
      type: "audio",
      audioUrl: "data:audio/mpeg;base64,AAAA",
      caption: "我想你了。",
      content: "我想你了。",
    });
  });

  it("builds a user image message from an uploaded picture", () => {
    expect(
      toUserImageMessage({
        imageUrl: "data:image/png;base64,AAAA",
        caption: "衣服搭配",
      }),
    ).toEqual({
      role: "user",
      type: "image",
      imageUrl: "data:image/png;base64,AAAA",
      caption: "衣服搭配",
      content: "衣服搭配",
    });
  });

  it("builds a user audio message from a recorded voice clip", () => {
    expect(
      toUserAudioMessage({
        audioUrl: "data:audio/webm;base64,AAAA",
        caption: "语音消息",
      }),
    ).toEqual({
      role: "user",
      type: "audio",
      audioUrl: "data:audio/webm;base64,AAAA",
      caption: "语音消息",
      content: "语音消息",
    });
  });
});
