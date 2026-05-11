"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "首页", href: "/" },
  { label: "价格", href: "/pricing" },
  { label: "博客", href: "/blog" },
  { label: "关于我们", href: "/about" },
];

export function NavbarMobileMenu({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 汉堡按钮 */}
      <button
        aria-label={open ? "关闭菜单" : "打开菜单"}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6F5A52] transition hover:bg-[#EFE2D5] sm:hidden"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          /* × 关闭图标 */
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          /* ☰ 汉堡图标 */
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* 展开菜单 */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-40 border-t border-[#D8C4B8]/60 bg-[#F3EADF]/96 px-5 py-4 shadow-lg backdrop-blur-xl sm:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#241C18] transition hover:bg-[#EFE2D5] hover:text-[#C8553D]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-[#D8C4B8]/60 pt-2">
              {isLoggedIn ? (
                <Link
                  href="/home"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#C8553D]"
                  onClick={() => setOpen(false)}
                >
                  ✦ 已登录
                </Link>
              ) : (
                <Link
                  href="/"
                  className="block rounded-lg bg-[#C8553D] px-3 py-2.5 text-center text-sm font-semibold text-white shadow-[0_4px_14px_rgba(200,85,61,0.30)] transition hover:bg-[#b84834]"
                  onClick={() => setOpen(false)}
                >
                  登录
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
