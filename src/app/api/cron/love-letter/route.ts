import { type NextRequest, NextResponse } from "next/server";

import { sendDailyLoveLetterToAll } from "@/lib/email";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  // ── 调试：列出所有包含 CRON / SECRET 的 env key（不打印值）──────────────────
  const envKeys = Object.keys(process.env).filter(
    (k) => k.includes("CRON") || k.includes("SECRET"),
  );
  console.log("[cron] env keys with CRON/SECRET:", envKeys);
  console.log("[cron] CRON_SECRET set:", !!cronSecret);

  // ── 接受两种认证方式：Bearer header 或 ?secret= 查询参数 ──────────────────
  const authHeader = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");

  const isAuthorized =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (cronSecret && querySecret === cronSecret);

  console.log("[cron] auth via header:", authHeader === `Bearer ${cronSecret}`);
  console.log("[cron] auth via query:", querySecret === cronSecret);

  if (!isAuthorized) {
    return NextResponse.json(
      {
        error: "未授权访问",
        debug: {
          secretSet: !!cronSecret,
          headerProvided: !!authHeader,
          queryProvided: !!querySecret,
          envKeysFound: envKeys,
        },
      },
      { status: 401 },
    );
  }

  // ── 执行任务：给所有用户发情话邮件 ──────────────────────────────────────────
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
