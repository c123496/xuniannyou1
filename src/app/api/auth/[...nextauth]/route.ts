import { handlers } from "@/auth";

const TARGET_HOST = "dearmate.mom";

function rewriteHost(request: Request): Request {
  const url = new URL(request.url);
  if (url.hostname === TARGET_HOST) return request;

  url.hostname = TARGET_HOST;
  url.port = "";

  const headers = new Headers(request.headers);
  headers.set("host", TARGET_HOST);
  headers.set("x-forwarded-host", TARGET_HOST);
  headers.set("x-forwarded-proto", "https");

  return new Request(url.toString(), {
    method: request.method,
    headers,
    body: request.body,
    // @ts-expect-error duplex needed for streaming body
    duplex: "half",
  });
}

async function handleRequest(request: Request) {
  const rewritten = rewriteHost(request);
  const method = rewritten.method.toUpperCase();
  if (method === "POST") {
    return handlers.POST(rewritten);
  }
  return handlers.GET(rewritten);
}

export { handleRequest as GET, handleRequest as POST };
