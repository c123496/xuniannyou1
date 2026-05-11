import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth-buttons";
import { LeaveFeedbackModal } from "@/components/leave-feedback-modal";
import { Navbar } from "@/components/navbar";
import { boyfriends } from "@/lib/boyfriends";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen text-[#1A1210]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-10">

        {/* Editorial header */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
          <div>
            <p className="mb-1.5 text-[10px] tracking-[0.22em] text-[#C8553D]/70 uppercase">Choose</p>
            <h1 className="text-3xl font-semibold tracking-[-0.01em] text-[#1A1210] sm:text-4xl">
              今天，想先见谁？
            </h1>
            <div className="mt-3 h-px w-20 bg-gradient-to-r from-[#C8553D]/50 to-transparent" />
          </div>
          <SignOutButton />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
          {boyfriends.map((boyfriend, index) => (
            <Link
              key={boyfriend.id}
              href={`/chat/${boyfriend.id}`}
              className="group relative flex aspect-[3/4] min-w-0 flex-col overflow-hidden rounded-[20px] bg-[#1A1210] shadow-[0_16px_44px_rgba(26,19,16,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_68px_rgba(26,19,16,0.28)] sm:rounded-[24px] animate-fade-up"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <Image
                alt={`${boyfriend.name}的角色海报`}
                className="object-cover motion-safe:animate-[posterDrift_16s_ease-in-out_infinite] transition duration-700 group-hover:scale-110"
                fill
                loading={index < 2 ? "eager" : "lazy"}
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 25vw"
                src={boyfriend.cardImageUrl}
                style={{ objectPosition: boyfriend.imagePosition }}
                unoptimized
              />
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/92 via-black/52 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.13),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Content */}
              <div className="relative mt-auto flex flex-col p-4 text-white sm:p-5">
                <p className="text-2xl font-semibold leading-none tracking-wide sm:text-[1.65rem]">
                  {boyfriend.name}
                </p>
                <p className="mt-1.5 text-[11px] text-white/55 sm:text-xs">
                  {boyfriend.age}岁 · {boyfriend.positioning}
                </p>
                <p className="mt-2.5 line-clamp-2 text-xs italic leading-5 text-white/65 sm:mt-3 sm:text-[13px] sm:leading-6">
                  "{boyfriend.openingQuote}"
                </p>
                <p className="mt-2 hidden text-[11px] leading-5 text-white/38 sm:line-clamp-1">
                  {boyfriend.statusLine}
                </p>
                <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-[#C8553D] py-2.5 text-xs font-semibold text-white shadow-[0_8px_24px_rgba(200,85,61,0.38)] transition-all duration-200 group-hover:bg-[#AE432B] group-hover:shadow-[0_14px_36px_rgba(200,85,61,0.50)] sm:py-3 sm:text-sm">
                  <span>开始聊天</span>
                  <span className="translate-x-0 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-80">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="pb-10 text-center">
        <LeaveFeedbackModal
          trigger={
            <span className="text-xs text-[#B8A89A] transition hover:text-[#C8553D]">
              取消订阅 / 注销账号
            </span>
          }
        />
      </footer>
    </main>
  );
}
