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
    // 1. 调用 Seedream AI 生成图片，拿到临时链接
    const tempImageUrl = await generateImage({ prompt, image: body.image });

    // 2. 下载临时图片
    const imageResponse = await fetch(tempImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // 3. 生成唯一文件名并上传到 R2
    const fileName = `images/${nanoid()}.png`;
    const permanentUrl = await uploadToR2(imageBuffer, fileName, "image/png");

    // 4. 返回永久链接
    return NextResponse.json({ imageUrl: permanentUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
  }
}
