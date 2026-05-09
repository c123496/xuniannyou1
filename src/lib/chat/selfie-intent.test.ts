import { describe, expect, it } from "vitest";

import { buildFallbackSelfieCall, isDirectSelfieRequest } from "./selfie-intent";

describe("selfie intent detection", () => {
  it.each(["给我发张照片", "我想看你", "自拍一张", "拍一张给我看", "想你想看看你"])(
    "detects direct selfie request: %s",
    (message) => {
      expect(isDirectSelfieRequest(message)).toBe(true);
    },
  );

  it("does not trigger on unrelated chat", () => {
    expect(isDirectSelfieRequest("今天工作好累")).toBe(false);
  });

  it("builds a role-specific fallback scene", () => {
    expect(buildFallbackSelfieCall("zhou_yan")).toMatchObject({
      scene: expect.stringContaining("工作室"),
    });
  });
});
