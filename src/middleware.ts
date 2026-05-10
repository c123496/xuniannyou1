import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TARGET_HOST = "dearmate.mom";

export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname !== TARGET_HOST && request.nextUrl.pathname.startsWith("/api/auth")) {
    const url = request.nextUrl.clone();
    url.hostname = TARGET_HOST;
    url.port = "";

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-forwarded-host", TARGET_HOST);
    requestHeaders.set("host", TARGET_HOST);

    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }
}

export const config = {
  matcher: "/api/auth/:path*",
};
