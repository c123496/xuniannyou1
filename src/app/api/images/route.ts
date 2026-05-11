import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { generateImage } from "@/lib/ai/seedream";
import { uploadToR2 } from "@/lib/r2";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    prompt?: string;
    image?: string;
  };

  const prompt = body.prompt?.trim();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    // 1. 直接拿到 buffer（b64_json，无需二次 fetch）
    const { buffer, mimeType } = await generateImage({ prompt, image: body.image });

    // 2. 上传到 R2，返回永久链接
    const fileName = `images/${nanoid()}.png`;
    const permanentUrl = await uploadToR2(buffer, fileName, mimeType);

    return NextResponse.json({ imageUrl: permanentUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
  }
}
