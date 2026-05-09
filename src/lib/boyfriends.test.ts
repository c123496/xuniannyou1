import { describe, expect, it } from "vitest";

import { boyfriends, getBoyfriendById } from "./boyfriends";

describe("boyfriend seed data", () => {
  it("contains the four locked v1 boyfriends", () => {
    expect(boyfriends.map((boyfriend) => boyfriend.id)).toEqual([
      "shen_xingzhou",
      "gu_chengye",
      "lin_ting",
      "zhou_yan",
    ]);
  });

  it("finds a boyfriend by id", () => {
    expect(getBoyfriendById("lin_ting")?.name).toBe("林听");
  });

  it("contains UI theme metadata for every boyfriend", () => {
    for (const boyfriend of boyfriends) {
      expect(boyfriend.themeColor).toMatch(/^#[0-9A-F]{6}$/);
      expect(boyfriend.openingQuote.length).toBeGreaterThan(5);
      expect(boyfriend.cardImageUrl).toMatch(/^https:\/\//);
      expect(boyfriend.avatarImageUrl).toMatch(/^https:\/\//);
    }
  });

  it("returns undefined for an unknown id", () => {
    expect(getBoyfriendById("unknown")).toBeUndefined();
  });
});
