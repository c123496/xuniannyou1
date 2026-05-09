import { describe, expect, it } from "vitest";

import { isGoogleAuthConfigured } from "./auth-env";

describe("auth environment helpers", () => {
  it("returns false when Google credentials are empty", () => {
    expect(
      isGoogleAuthConfigured({
        AUTH_GOOGLE_ID: "",
        AUTH_GOOGLE_SECRET: "",
      }),
    ).toBe(false);
  });

  it("returns true when both Google credentials are present", () => {
    expect(
      isGoogleAuthConfigured({
        AUTH_GOOGLE_ID: "client-id",
        AUTH_GOOGLE_SECRET: "client-secret",
      }),
    ).toBe(true);
  });
});
