import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-7xl font-semibold text-[#C8553D]">404</p>
      <h1 className="text-2xl font-semibold text-[#241C18]">页面不见了</h1>
      <p className="max-w-sm text-sm leading-6 text-[#A08C84]">
        你要找的页面不存在，可能已被移动或删除。
      </p>
      <div className="flex flex-col items-center gap-3">
        <Link
          href="/home"
          className="rounded-full bg-[#C8553D] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(200,85,61,0.30)] transition hover:bg-[#b84834]"
        >
          回到主页
        </Link>
        <a
          href="mailto:support@dearmate.mom?subject=页面404反馈"
          className="text-xs text-[#A08C84] transition hover:text-[#C8553D]"
        >
          遇到问题？联系我们 → support@dearmate.mom
        </a>
      </div>
    </main>
  );
}
