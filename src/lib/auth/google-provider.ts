import { customFetch } from "@auth/core";
import { fetch, ProxyAgent } from "undici";

export const GOOGLE_AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_ISSUER = "https://accounts.google.com";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export function getGoogleProviderOptions() {
  return {
    authorization: {
      url: GOOGLE_AUTHORIZATION_URL,
      params: {
        scope: "openid email profile",
        response_type: "code",
      },
    },
  };
}

type GoogleProfile = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

const GOOGLE_OAUTH_CHECKS: Array<"pkce" | "state"> = ["pkce", "state"];

export function getAuthProxyUrl(env: Record<string, string | undefined> = process.env) {
  const proxyUrl = env.AUTH_PROXY_URL?.trim();
  if (!proxyUrl) return undefined;
  return /^https?:\/\//i.test(proxyUrl) ? proxyUrl : `http://${proxyUrl}`;
}

function createGoogleFetch() {
  const proxyUrl = getAuthProxyUrl();
  if (!proxyUrl) return undefined;

  const dispatcher = new ProxyAgent(proxyUrl);

  return ((input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input as Parameters<typeof fetch>[0], {
      ...init,
      dispatcher,
    } as Parameters<typeof fetch>[1])) as unknown as typeof globalThis.fetch;
}

export function getGoogleOAuthProvider() {
  return {
    id: "google",
    name: "Google",
    type: "oauth" as const,
    issuer: GOOGLE_ISSUER,
    authorization: getGoogleProviderOptions().authorization,
    token: GOOGLE_TOKEN_URL,
    userinfo: GOOGLE_USERINFO_URL,
    checks: GOOGLE_OAUTH_CHECKS,
    [customFetch]: createGoogleFetch(),
    profile(profile: GoogleProfile) {
      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name,
        image: profile.picture,
      };
    },
  };
}
