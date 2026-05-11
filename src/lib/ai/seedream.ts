const SEEDREAM_IMAGE_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations";
const SEEDREAM_MODEL = "doubao-seedream-5-0-260128";

type SeedreamResponse = {
  data?: Array<{
    url?: string;
    b64_json?: string;
    size?: string;
  }>;
};

export function extractSeedreamImageUrl(response: SeedreamResponse) {
  return response.data?.find((item) => item.url)?.url;
}

export function extractSeedreamB64(response: SeedreamResponse) {
  return response.data?.find((item) => item.b64_json)?.b64_json;
}

/**
 * 生成图片并返回 { buffer, mimeType }。
 * 使用 b64_json 格式，避免从 Seedream 临时签名 URL 再次 fetch（会被拒绝）。
 */
export async function generateImage({
  prompt,
  image,
}: {
  prompt: string;
  image?: string;
}): Promise<{ buffer: Buffer; mimeType: "image/png" }> {
  const apiKey = process.env.SEEDREAM_API_KEY;

  if (!apiKey) {
    throw new Error("SEEDREAM_API_KEY is not configured");
  }

  const response = await fetch(SEEDREAM_IMAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: SEEDREAM_MODEL,
      prompt,
      image,
      sequential_image_generation: "disabled",
      response_format: "b64_json",
      size: "2K",
      stream: false,
      watermark: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Seedream request failed with status ${response.status}`);
  }

  const data = (await response.json()) as SeedreamResponse;
  const b64 = extractSeedreamB64(data);

  if (!b64) {
    throw new Error("Seedream response did not include image data");
  }

  return {
    buffer: Buffer.from(b64, "base64"),
    mimeType: "image/png",
  };
}
