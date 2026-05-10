import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getBoyfriendById } from "@/lib/boyfriends";
import { getUserMemories } from "@/lib/db/user-memories";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const boyfriendId = searchParams.get("boyfriendId")?.trim();

  if (!boyfriendId) {
    return NextResponse.json({ error: "boyfriendId is required" }, { status: 400 });
  }

  if (!getBoyfriendById(boyfriendId)) {
    return NextResponse.json({ error: "Unknown boyfriend" }, { status: 400 });
  }

  const userId = session.user.email ?? session.user.name ?? "unknown-user";
  const memories = await getUserMemories({ userId, boyfriendId });

  return NextResponse.json({ memories });
}
