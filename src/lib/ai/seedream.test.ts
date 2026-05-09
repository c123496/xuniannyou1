import { describe, expect, it } from "vitest";

import { extractSeedreamImageUrl } from "./seedream";

describe("Seedream image helpers", () => {
  it("extracts the first generated image URL", () => {
    expect(
      extractSeedreamImageUrl({
        data: [{ url: "https://example.com/image.jpeg", size: "2048x2048" }],
      }),
    ).toBe("https://example.com/image.jpeg");
  });

  it("returns undefined when no image URL is present", () => {
    expect(extractSeedreamImageUrl({ data: [] })).toBeUndefined();
  });
});
