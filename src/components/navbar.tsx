import Link from "next/link";

import { auth } from "@/auth";
import { NavbarMobileMenu } from "@/components/navbar-mobile-menu";

function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 text-[#C8553D] transition hover:opacity-75"
    >
      <span className="grid grid-cols-2 gap-[3px]" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="editorial-wordmark text-xl font-semibold tracking-wide">
        纸片人男友
      </span>
    </Link>
  );
}

export async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-30 bg-[#F3EADF]/92 backdrop-blur-xl">
      {/* 细线边框 */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D8C4B8]/80 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-10">

        {/* ── 桌面端：三列布局 ────────────────────────────────── */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6">

          {/* 左侧链接 */}
          <nav className="flex items-center gap-0.5">
            {[
              { label: "首页", href: "/" },
              { label: "价格", href: "/pricing" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-[#6F5A52] transition-colors duration-150 hover:text-[#C8553D]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 居中 Logo */}
          <Wordmark />

          {/* 右侧链接 + 登录 */}
          <nav className="flex items-center justify-end gap-0.5">
            {[
              { label: "博客", href: "/blog" },
              { label: "关于我们", href: "/about" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-[#6F5A52] transition-colors duration-150 hover:text-[#C8553D]"
              >
                {link.label}
              </Link>
            ))}

            <div className="ml-3">
              {isLoggedIn ? (
                <Link
                  href="/home"
                  className="flex items-center gap-1.5 rounded-full border border-[#C8553D]/25 bg-[#C8553D]/6 px-4 py-1.5 text-sm font-medium text-[#C8553D] transition hover:bg-[#C8553D]/12"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C8553D]" />
                  已登录
                </Link>
              ) : (
                <Link
                  href="/"
                  className="rounded-full bg-[#C8553D] px-5 py-1.5 text-sm font-semibold text-white shadow-[0_3px_12px_rgba(200,85,61,0.28)] transition hover:bg-[#b84834] hover:shadow-[0_5px_18px_rgba(200,85,61,0.36)]"
                >
                  登录
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* ── 手机端：Logo 左 + 汉堡右 ───────────────────────── */}
        <div className="relative flex items-center justify-between sm:hidden">
          <Wordmark />
          <NavbarMobileMenu isLoggedIn={isLoggedIn} />
        </div>

      </div>
    </header>
  );
}
