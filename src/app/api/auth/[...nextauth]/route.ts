import { handlers } from "@/auth";

const TARGET_HOST = "dearmate.mom";

function rewriteHost(request: Request): Request {
  const url = new URL(request.url);
  if (url.hostname !== TARGET_HOST) {
    url.hostname = TARGET_HOST;
    url.port = "";
    return new Request(url.toString(), request);
  }
  return request;
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
