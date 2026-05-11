"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-7xl font-semibold text-[#C8553D]">500</p>
      <h1 className="text-2xl font-semibold text-[#241C18]">出了点小问题</h1>
      <p className="max-w-sm text-sm leading-6 text-[#A08C84]">
        服务器遇到了一些麻烦，我们已经收到通知。你可以尝试刷新页面。
      </p>
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-[#C8553D] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(200,85,61,0.30)] transition hover:bg-[#b84834]"
        >
          重新加载
        </button>
        <a
          href="mailto:support@dearmate.mom?subject=页面报错反馈"
          className="text-xs text-[#A08C84] transition hover:text-[#C8553D]"
        >
          遇到问题？联系我们 → support@dearmate.mom
        </a>
      </div>
    </main>
  );
}
