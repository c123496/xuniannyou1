import { describe, expect, it } from "vitest";

import {
  getAuthProxyUrl,
  getGoogleOAuthProvider,
  getGoogleProviderOptions,
  GOOGLE_AUTHORIZATION_URL,
  GOOGLE_ISSUER,
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
} from "./google-provider";

describe("Google provider options", () => {
  it("uses an explicit authorization endpoint", () => {
    const options = getGoogleProviderOptions();

    expect(options.authorization.url).toBe(GOOGLE_AUTHORIZATION_URL);
    expect(options.authorization.params.scope).toBe("openid email profile");
  });

  it("builds an OAuth provider with explicit token and userinfo endpoints", () => {
    const provider = getGoogleOAuthProvider();

    expect(provider.type).toBe("oauth");
    expect(provider.issuer).toBe(GOOGLE_ISSUER);
    expect(provider.token).toBe(GOOGLE_TOKEN_URL);
    expect(provider.userinfo).toBe(GOOGLE_USERINFO_URL);
  });

  it("normalizes an auth proxy URL", () => {
    expect(getAuthProxyUrl({ AUTH_PROXY_URL: "127.0.0.1:32081" })).toBe(
      "http://127.0.0.1:32081",
    );
  });
});
