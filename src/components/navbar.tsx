import Link from "next/link";

import { auth } from "@/auth";
import { NavbarMobileMenu } from "@/components/navbar-mobile-menu";

const NAV_LINKS = [
  { label: "首页", href: "/" },
  { label: "价格", href: "/pricing" },
  { label: "博客", href: "/blog" },
  { label: "关于我们", href: "/about" },
];

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-3 text-[#C8553D] transition hover:opacity-80">
      <span className="grid grid-cols-2 gap-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="editorial-wordmark text-xl font-semibold">纸片人男友</span>
    </Link>
  );
}

export async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-30 border-b border-[#D8C4B8]/60 bg-[#F3EADF]/90 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
        {/* Logo */}
        <Wordmark />

        {/* 桌面端导航链接 */}
        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#6F5A52] transition hover:bg-[#EFE2D5] hover:text-[#C8553D]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 桌面端登录状态 */}
        <div className="hidden sm:block">
          {isLoggedIn ? (
            <Link
              href="/home"
              className="flex items-center gap-1.5 rounded-full border border-[#C8553D]/30 bg-[#C8553D]/8 px-4 py-2 text-sm font-medium text-[#C8553D] transition hover:bg-[#C8553D]/14"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8553D]" />
              已登录
            </Link>
          ) : (
            <Link
              href="/"
              className="rounded-full bg-[#C8553D] px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(200,85,61,0.30)] transition hover:bg-[#b84834]"
            >
              登录
            </Link>
          )}
        </div>

        {/* 手机端汉堡菜单（客户端组件） */}
        <NavbarMobileMenu isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
}
