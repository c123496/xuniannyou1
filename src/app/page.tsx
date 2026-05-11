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
      <span className="grid grid-cols-2 gap-[3px]" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="editorial-wordmark text-xl font-semibold">纸片人男友</span>
    </div>
  );
}

function DecorativeRule() {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C8553D]/35 to-transparent" />
      <span className="text-[9px] tracking-[0.28em] text-[#C8553D]/55 uppercase">DearMate</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C8553D]/35 to-transparent" />
    </div>
  );
}

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen overflow-hidden text-[#1A1210]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">

        {/* Nav */}
        <nav className="flex items-center justify-between animate-fade-in">
          <Wordmark />
          <p className="hidden text-xs tracking-wide text-[#7C6860] sm:block">
            四个具体的人，陪你把今天说完
          </p>
        </nav>

        {/* Main grid */}
        <div className="grid flex-1 gap-10 py-10 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-16">

          {/* Left: copy */}
          <div className="max-w-xl animate-fade-up">
            <div className="mb-7 max-w-[16rem]">
              <DecorativeRule />
            </div>

            <p className="mb-4 text-xs font-medium tracking-[0.15em] text-[#C8553D] uppercase">
              恋爱陪伴感，不是普通聊天窗口
            </p>

            <h1 className="text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.01em] text-[#1A1210] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              被认真记住的日常，
              <br />
              <span className="text-[#C8553D]">也会慢慢发光。</span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-8 text-[#4A3830] sm:text-base sm:leading-9">
              选择一个你想靠近的人。他会用文字、图片和语音回应你，也会把你的情绪放在心上。
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <GoogleSignInButton isConfigured={isGoogleAuthConfigured()} />
              <p className="text-xs leading-6 text-[#7C6860]">
                登录后选择角色，开启只属于你们的对话。
              </p>
            </div>

            {/* Subtle stats */}
            <div className="mt-10 flex items-center gap-6 border-t border-[#DED0C0]/60 pt-6">
              <div>
                <p className="text-xl font-semibold text-[#1A1210]">4</p>
                <p className="mt-0.5 text-xs text-[#7C6860]">独立角色</p>
              </div>
              <div className="h-7 w-px bg-[#DED0C0]" />
              <div>
                <p className="text-xl font-semibold text-[#1A1210]">文·图·声</p>
                <p className="mt-0.5 text-xs text-[#7C6860]">三种回应</p>
              </div>
              <div className="h-7 w-px bg-[#DED0C0]" />
              <div>
                <p className="text-xl font-semibold text-[#1A1210]">∞</p>
                <p className="mt-0.5 text-xs text-[#7C6860]">记忆积累</p>
              </div>
            </div>
          </div>

          {/* Right: character cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {boyfriends.map((boyfriend, index) => (
              <article
                key={boyfriend.id}
                className="group relative min-h-[240px] overflow-hidden rounded-[22px] bg-[#1A1210] shadow-[0_20px_56px_rgba(26,19,16,0.20)] sm:min-h-[310px] animate-fade-up"
                style={{ animationDelay: `${0.08 + index * 0.08}s` }}
              >
                <Image
                  alt={`${boyfriend.name}的电影感人物海报`}
                  className="object-cover motion-safe:animate-[posterDrift_16s_ease-in-out_infinite] transition duration-700 group-hover:scale-110"
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 42vw, 28vw"
                  src={boyfriend.cardImageUrl}
                  style={{ objectPosition: boyfriend.imagePosition }}
                  unoptimized
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/15 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/88 via-black/45 to-transparent" />
                {/* Hover shimmer */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.13),transparent_58%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex h-full min-h-[240px] flex-col justify-end p-4 text-white sm:min-h-[310px] sm:p-5">
                  {/* Positioning badge */}
                  <div className="mb-2 inline-flex w-fit items-center rounded-full border border-white/12 bg-white/8 px-2 py-0.5 text-[9px] tracking-wide text-white/65 backdrop-blur-sm">
                    {boyfriend.positioning}
                  </div>
                  <p className="text-2xl font-semibold tracking-wide sm:text-[1.7rem]">
                    {boyfriend.name}
                  </p>
                  <p className="mt-1 text-[11px] text-white/55 sm:text-xs">
                    {boyfriend.age} 岁
                  </p>
                  <p className="mt-2.5 line-clamp-2 text-xs italic leading-5 text-white/65 sm:text-sm sm:leading-6">
                    "{boyfriend.openingQuote}"
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DDD0BF]/50 py-5">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-[11px] text-[#A89890]">
              © {new Date().getFullYear()} DearMate · For adults 18+ · All characters are fictional
            </p>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[11px] text-[#7C6860]">
              <Link href="/pricing" className="transition hover:text-[#C8553D]">Pricing</Link>
              <Link href="/terms" className="transition hover:text-[#C8553D]">Terms of Service</Link>
              <Link href="/privacy" className="transition hover:text-[#C8553D]">Privacy Policy</Link>
              <a href="mailto:support@dearmate.mom" className="transition hover:text-[#C8553D]">Contact</a>
              <a href="https://discord.gg/h6xyDQuzT" target="_blank" rel="noopener noreferrer" className="transition hover:text-[#5865F2]">
                Discord
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}
