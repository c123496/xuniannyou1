import { type NextRequest, NextResponse } from "next/server";

import { sendMissYouToInactiveUsers } from "@/lib/email";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  const authHeader = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");

  const isAuthorized =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (cronSecret && querySecret === cronSecret);

  if (!isAuthorized) {
    return NextResponse.json({ error: "未授权访问" }, { status: 401 });
  }

  try {
    await sendMissYouToInactiveUsers();
    return NextResponse.json({
      success: true,
      message: "晚间召回邮件发送完成",
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("晚间召回邮件发送失败：", error);
    return NextResponse.json({ error: "发送失败" }, { status: 500 });
  }
}
