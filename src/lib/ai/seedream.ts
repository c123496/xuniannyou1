const SEEDREAM_IMAGE_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations";
const SEEDREAM_MODEL = "doubao-seedream-5-0-260128";

type SeedreamResponse = {
  data?: Array<{
    url?: string;
    size?: string;
  }>;
};

export function extractSeedreamImageUrl(response: SeedreamResponse) {
  return response.data?.find((item) => item.url)?.url;
}

export async function generateImage({
  prompt,
  image,
}: {
  prompt: string;
  image?: string;
}) {
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
      response_format: "url",
      size: "2K",
      stream: false,
      watermark: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Seedream request failed with status ${response.status}`);
  }

  const data = (await response.json()) as SeedreamResponse;
  const imageUrl = extractSeedreamImageUrl(data);

  if (!imageUrl) {
    throw new Error("Seedream response did not include an image URL");
  }

  return imageUrl;
}
