import { describe, expect, it } from "vitest";

import {
  filterWritableMemories,
  formatUserMemoriesForPrompt,
  isAllowedMemoryKey,
  shouldSkipMemoryExtraction,
} from "./user-memories";

describe("user memory helpers", () => {
  it("formats remembered profile details without exposing database fields", () => {
    const prompt = formatUserMemoriesForPrompt([
      {
        id: "1",
        userId: "u1",
        boyfriendId: "lin_ting",
        memoryKey: "birthday",
        memoryValue: "3月15日",
        memoryType: "profile",
        confidence: 0.9,
        sourceMessage: "我的生日是3月15日",
        createdAt: new Date("2026-05-09T00:00:00Z"),
        updatedAt: new Date("2026-05-09T00:00:00Z"),
      },
      {
        id: "2",
        userId: "u1",
        boyfriendId: "lin_ting",
        memoryKey: "favorite_food",
        memoryValue: "火锅",
        memoryType: "preference",
        confidence: 0.9,
        sourceMessage: "我最喜欢火锅",
        createdAt: new Date("2026-05-09T00:00:00Z"),
        updatedAt: new Date("2026-05-09T00:00:00Z"),
      },
    ]);

    expect(prompt).toContain("【你已经记住的用户信息】");
    expect(prompt).toContain("用户生日：3月15日");
    expect(prompt).toContain("用户喜欢的食物：火锅");
    expect(prompt).toContain("不要每次机械复述");
    expect(prompt).not.toContain("memory_key");
  });

  it("returns an empty prompt when there are no memories", () => {
    expect(formatUserMemoriesForPrompt([])).toBe("");
  });

  it("filters low confidence, empty, unknown, and sensitive memories", () => {
    const filtered = filterWritableMemories([
      {
        key: "favorite_food",
        value: "火锅",
        type: "preference",
        confidence: 0.9,
        sourceMessage: "我最喜欢吃火锅",
      },
      {
        key: "custom_note",
        value: "手机号 13800138000",
        type: "profile",
        confidence: 0.99,
        sourceMessage: "我的手机号是 13800138000",
      },
      {
        key: "current_goal",
        value: " ",
        type: "recent_status",
        confidence: 0.95,
        sourceMessage: "空",
      },
      {
        key: "hobbies",
        value: "画画",
        type: "preference",
        confidence: 0.55,
        sourceMessage: "我喜欢画画",
      },
      {
        key: "unknown_key",
        value: "不要写入",
        type: "profile",
        confidence: 0.9,
        sourceMessage: "不要写入",
      },
    ]);

    expect(filtered).toEqual([
      {
        key: "favorite_food",
        value: "火锅",
        type: "preference",
        confidence: 0.9,
        sourceMessage: "我最喜欢吃火锅",
      },
    ]);
  });

  it("detects allowed memory keys and explicit no-remember requests", () => {
    expect(isAllowedMemoryKey("birthday")).toBe(true);
    expect(isAllowedMemoryKey("password")).toBe(false);
    expect(shouldSkipMemoryExtraction("这个不要记住，我生日是3月15日")).toBe(true);
    expect(shouldSkipMemoryExtraction("我的生日是3月15日")).toBe(false);
  });
});
