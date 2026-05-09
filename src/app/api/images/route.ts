import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { generateImage } from "@/lib/ai/seedream";

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
    const imageUrl = await generateImage({ prompt, image: body.image });
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
  }
}
