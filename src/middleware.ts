import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TARGET_HOST = "dearmate.mom";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-forwarded-host", TARGET_HOST);
    requestHeaders.set("x-forwarded-proto", "https");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
}

export const config = {
  matcher: "/api/auth/:path*",
};
