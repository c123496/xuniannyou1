import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { isGoogleAuthConfigured } from "@/lib/auth-env";
import { boyfriends } from "@/lib/boyfriends";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-stone-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-5 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between text-sm">
          <span className="font-semibold tracking-wide">Paper Boyfriend</span>
          <span className="text-stone-500">Google login only</span>
        </nav>

        <div className="grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.28em] text-stone-500">
              纸片人男友
            </p>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
              被记住的日常陪伴。
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              四个稳定人格，一段段独立关系。先从一句“我在”开始，把今天慢慢说完。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <GoogleSignInButton isConfigured={isGoogleAuthConfigured()} />
              <p className="text-sm text-stone-500">只做 Google 登录。</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {boyfriends.map((boyfriend) => (
              <div
                className="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm"
                key={boyfriend.id}
              >
                <p className="text-base font-semibold">{boyfriend.name}</p>
                <p className="mt-1 text-sm text-stone-500">{boyfriend.positioning}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="pb-2 text-sm text-stone-500">
          First slice: login, character selection, and chat shell.
        </p>
      </section>
    </main>
  );
}
