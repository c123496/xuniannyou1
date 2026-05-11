import { type NextRequest, NextResponse } from "next/server";

import { sendDailyLoveLetterToAll } from "@/lib/email";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  // 接受两种认证方式：Bearer header 或 ?secret= 查询参数
  const authHeader = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");

  const isAuthorized =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (cronSecret && querySecret === cronSecret);

  if (!isAuthorized) {
    return NextResponse.json({ error: "未授权访问" }, { status: 401 });
  }

  try {
    await sendDailyLoveLetterToAll();
    return NextResponse.json({
      success: true,
      message: "每日情话发送完成",
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("每日情话发送失败：", error);
    return NextResponse.json({ error: "发送失败" }, { status: 500 });
  }
}
