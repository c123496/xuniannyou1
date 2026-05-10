import { describe, expect, it } from "vitest";

import {
  buildDeepSeekMessages,
  extractDeepSeekResult,
  extractDeepSeekText,
  SEND_SELFIE_TOOL,
  SEND_VOICE_TOOL,
} from "./deepseek";

describe("DeepSeek client helpers", () => {
  it("extracts assistant text while ignoring thinking blocks", () => {
    expect(
      extractDeepSeekText({
        content: [
          { type: "thinking", thinking: "hidden reasoning" },
          { type: "text", text: "Hello from DeepSeek" },
        ],
      }),
    ).toBe("Hello from DeepSeek");
  });

  it("builds a persona-aware message list", () => {
    const messages = buildDeepSeekMessages({
      systemPrompt: "你是林听，温柔倾听。",
      userMessage: "今天好累",
    });

    expect(messages[0]).toMatchObject({ role: "user" });
    expect(messages[0]?.content).toContain("今天好累");
  });

  it("appends long-term memory context to the system prompt", () => {
    const messages = buildDeepSeekMessages({
      systemPrompt: "你是林听。",
      memoryContext: "【你已经记住的用户信息】\n- 用户喜欢的食物：火锅",
      userMessage: "今天好累",
    });

    expect(messages[0]?.content).toContain("你是林听。");
    expect(messages[0]?.content).toContain("用户喜欢的食物：火锅");
    expect(messages[0]?.content).toContain("今天好累");
  });

  it("defines the send_selfie tool for direct photo requests", () => {
    expect(SEND_SELFIE_TOOL).toMatchObject({
      name: "send_selfie",
      input_schema: {
        type: "object",
        required: ["scene"],
      },
    });
    expect(SEND_SELFIE_TOOL.description).toContain("必须调用");
  });

  it("defines the send_voice tool for direct voice requests", () => {
    expect(SEND_VOICE_TOOL).toMatchObject({
      name: "send_voice",
      input_schema: {
        type: "object",
        required: ["text"],
      },
    });
    expect(SEND_VOICE_TOOL.description).toContain("必须调用");
  });

  it("extracts text and send_selfie tool calls", () => {
    const result = extractDeepSeekResult({
      content: [
        { type: "text", text: "刚拍的，别嫌弃" },
        {
          type: "tool_use",
          id: "toolu_1",
          name: "send_selfie",
          input: {
            scene: "书桌前学代码累了，头发有点乱，对镜头微笑",
            caption: "刚拍的",
          },
        },
        {
          type: "tool_use",
          id: "toolu_2",
          name: "send_voice",
          input: {
            text: "我在，别怕。",
            caption: "点开听。",
          },
        },
      ],
    });

    expect(result.text).toBe("刚拍的，别嫌弃");
    expect(result.selfieCalls).toEqual([
      {
        scene: "书桌前学代码累了，头发有点乱，对镜头微笑",
        caption: "刚拍的",
      },
    ]);
    expect(result.voiceCalls).toEqual([
      {
        text: "我在，别怕。",
        caption: "点开听。",
      },
    ]);
  });
});
