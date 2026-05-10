import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { isGoogleAuthConfigured } from "@/lib/auth-env";
import { boyfriends } from "@/lib/boyfriends";

function Wordmark() {
  return (
    <div className="flex items-center gap-3 text-[#C8553D]">
      <span className="grid grid-cols-2 gap-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="editorial-wordmark text-2xl font-semibold">纸片人男友</span>
    </div>
  );
}

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F3EADF] text-[#241C18]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between">
          <Wordmark />
          <p className="hidden text-sm text-[#7A6258] sm:block">四个具体的人，陪你把今天说完</p>
        </nav>

        <div className="grid flex-1 gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[#C8553D]">恋爱陪伴感，不是普通聊天窗口</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.04] tracking-normal text-[#241C18] sm:text-6xl lg:text-7xl">
              被认真记住的日常，也会慢慢发光。
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#6F5A52] sm:text-lg">
              选择一个你想靠近的人。他会用文字、图片和语音回应你，也会把你的情绪放在心上。
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <GoogleSignInButton isConfigured={isGoogleAuthConfigured()} />
              <p className="text-sm leading-6 text-[#8A7168]">登录后选择角色，开启只属于你们的对话。</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            {boyfriends.map((boyfriend, index) => (
              <article
                className="group relative min-h-[240px] overflow-hidden rounded-[26px] bg-[#241C18] shadow-[0_24px_70px_rgba(36,28,24,0.22)] sm:min-h-[330px]"
                key={boyfriend.id}
              >
                <Image
                  alt={`${boyfriend.name}的电影感人物海报`}
                  className="object-cover motion-safe:animate-[posterDrift_14s_ease-in-out_infinite] transition duration-700 group-hover:scale-110"
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 42vw, 28vw"
                  src={boyfriend.cardImageUrl}
                  style={{ objectPosition: boyfriend.imagePosition }}
                  unoptimized
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,14,10,0.72)_0%,rgba(20,14,10,0.26)_46%,rgba(20,14,10,0.08)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_16rem)] opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#120D0B]/90 to-transparent" />
                <div className="relative flex h-full min-h-[240px] flex-col justify-end p-4 text-white sm:min-h-[330px] sm:p-5">
                  <p className="text-2xl font-semibold sm:text-3xl">{boyfriend.name}</p>
                  <p className="mt-1 text-xs leading-5 text-white/76 sm:text-sm">
                    {boyfriend.age}岁 · {boyfriend.positioning}
                  </p>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/70 sm:text-sm">
                    “{boyfriend.openingQuote}”
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

        <footer className="border-t border-[#D8C4B8]/60 py-6 mt-4">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-xs text-[#A08C84]">
              © {new Date().getFullYear()} DearMate · For adults 18+ · All characters are fictional
            </p>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-[#8A7168]">
              <Link href="/pricing" className="transition hover:text-[#C8553D]">Pricing</Link>
              <Link href="/terms" className="transition hover:text-[#C8553D]">Terms of Service</Link>
              <Link href="/privacy" className="transition hover:text-[#C8553D]">Privacy Policy</Link>
              <a href="mailto:support@dearmate.mom" className="transition hover:text-[#C8553D]">Contact</a>
            </nav>
          </div>
        </footer>
      </section>
    </main>
  );
}
