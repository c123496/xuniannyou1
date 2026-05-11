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
    <main className="min-h-screen bg-[#F3EADF] text-[#241C18]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            今天想先见谁？
          </h1>
          <SignOutButton />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
          {boyfriends.map((boyfriend, index) => (
            <Link
              key={boyfriend.id}
              href={`/chat/${boyfriend.id}`}
              className="group relative flex aspect-[4/5] min-w-0 flex-col overflow-hidden rounded-[24px] bg-[#241C18] shadow-[0_18px_54px_rgba(36,28,24,0.20)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(36,28,24,0.28)] sm:rounded-[28px]"
            >
              <Image
                alt={`${boyfriend.name}的角色海报`}
                className="object-cover motion-safe:animate-[posterDrift_14s_ease-in-out_infinite] transition duration-700 group-hover:scale-110"
                fill
                loading={index < 2 ? "eager" : "lazy"}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                src={boyfriend.cardImageUrl}
                style={{ objectPosition: boyfriend.imagePosition }}
                unoptimized
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,13,11,0.70)_0%,rgba(18,13,11,0.34)_42%,rgba(18,13,11,0.08)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_18rem)] opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#120D0B] via-[#120D0B]/68 to-transparent" />

              <div className="relative mt-auto flex flex-col justify-end p-4 text-white sm:p-5">
                <p className="text-2xl font-semibold leading-none sm:text-3xl">{boyfriend.name}</p>
                <p className="mt-2 text-xs leading-5 text-white/76 sm:mt-3 sm:text-sm sm:leading-6">
                  {boyfriend.age}岁 · {boyfriend.positioning}
                </p>
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/72 sm:mt-4 sm:text-sm sm:leading-7">
                  “{boyfriend.openingQuote}”
                </p>
                <p className="mt-3 hidden text-xs leading-5 text-white/52 sm:mt-4 sm:line-clamp-2">
                  {boyfriend.statusLine}
                </p>
                <div className="mt-4 flex items-center justify-center rounded-full bg-[#C8553D] px-3 py-2.5 text-xs font-semibold text-white shadow-[0_16px_36px_rgba(200,85,61,0.35)] sm:mt-5 sm:px-4 sm:py-3 sm:text-sm">
                  开始聊天
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="pb-8 text-center">
        <LeaveFeedbackModal
          trigger={
            <span className="text-xs text-[#C4B0A8] transition hover:text-[#C8553D]">
              取消订阅 / 注销账号
            </span>
          }
        />
      </footer>
    </main>
  );
}
