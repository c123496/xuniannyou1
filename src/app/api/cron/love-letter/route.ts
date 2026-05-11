import { type NextRequest, NextResponse } from "next/server";

import { sendDailyLoveLetterToAll } from "@/lib/email";

export async function GET(request: NextRequest) {
  // 调试日志（确认后可删除）
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  console.log("[cron] authHeader received:", authHeader);
  console.log("[cron] CRON_SECRET set:", !!cronSecret);
  console.log("[cron] expected:", `Bearer ${cronSecret}`);
  console.log("[cron] match:", authHeader === `Bearer ${cronSecret}`);

  // 第一步：验证请求是否合法
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "未授权访问", debug: { headerReceived: authHeader, secretSet: !!cronSecret } },
      { status: 401 },
    );
  }

  // 第二步：执行任务——给所有用户发情话邮件
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
