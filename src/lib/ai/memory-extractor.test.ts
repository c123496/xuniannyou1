import { afterEach, describe, expect, it, vi } from "vitest";

import { extractUserMemoriesFromConversation, parseMemoryExtractorResponse } from "./memory-extractor";

describe("memory extractor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.DEEPSEEK_API_KEY;
  });

  it("parses a strict JSON array from the model", () => {
    expect(
      parseMemoryExtractorResponse(
        JSON.stringify([
          {
            key: "favorite_food",
            value: "火锅",
            type: "preference",
            confidence: 0.9,
            sourceMessage: "我最喜欢吃火锅",
          },
        ]),
      ),
    ).toEqual([
      {
        key: "favorite_food",
        value: "火锅",
        type: "preference",
        confidence: 0.9,
        sourceMessage: "我最喜欢吃火锅",
      },
    ]);
  });

  it("returns an empty list when the model returns invalid JSON", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(parseMemoryExtractorResponse("不是 JSON")).toEqual([]);
    expect(warn).toHaveBeenCalled();
  });

  it("does not call DeepSeek when the user asks not to remember", async () => {
    process.env.DEEPSEEK_API_KEY = "test-key";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      extractUserMemoriesFromConversation({
        userMessage: "不要记住这个，我喜欢火锅",
        assistantText: "好",
        boyfriendId: "lin_ting",
        boyfriendName: "林听",
      }),
    ).resolves.toEqual([]);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("calls DeepSeek and parses extracted memories", async () => {
    process.env.DEEPSEEK_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          content: [
            {
              type: "text",
              text: '[{"key":"favorite_food","value":"火锅","type":"preference","confidence":0.9,"sourceMessage":"我最喜欢吃火锅"}]',
            },
          ],
        }),
      }),
    );

    await expect(
      extractUserMemoriesFromConversation({
        userMessage: "我最喜欢吃火锅",
        assistantText: "那下次带你去吃。",
        boyfriendId: "lin_ting",
        boyfriendName: "林听",
      }),
    ).resolves.toEqual([
      {
        key: "favorite_food",
        value: "火锅",
        type: "preference",
        confidence: 0.9,
        sourceMessage: "我最喜欢吃火锅",
      },
    ]);
  });
});
