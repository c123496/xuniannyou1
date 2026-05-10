import { handlers } from "@/auth";

const TARGET_HOST = "dearmate.mom";

function rewriteRequest(request: Request): Request {
  const url = new URL(request.url);
  if (url.host === TARGET_HOST) return request;

  url.host = TARGET_HOST;
  url.port = "";

  return new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    // @ts-expect-error duplex needed for streaming body
    duplex: "half",
  });
}

export async function GET(request: Request) {
  return handlers.GET(rewriteRequest(request));
}

export async function POST(request: Request) {
  return handlers.POST(rewriteRequest(request));
}
