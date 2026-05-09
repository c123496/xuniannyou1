import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth-buttons";
import { boyfriends } from "@/lib/boyfriends";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-stone-950">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#f6f8fb]/90 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">Paper Boyfriend</p>
            <h1 className="mt-1 text-xl font-semibold tracking-normal">今天想先见谁？</h1>
          </div>
          <SignOutButton />
        </div>
      </header>

      <section className="mx-auto flex max-w-3xl flex-col px-4 pb-[20vh] pt-4">
        {boyfriends.map((boyfriend, index) => (
          <article
            className="relative mb-[-20vh] h-[80vh] min-h-[560px] overflow-hidden rounded-lg bg-stone-900 shadow-xl"
            key={boyfriend.id}
            style={{
              zIndex: index + 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={boyfriend.name}
              className="absolute inset-0 h-full w-full object-cover"
              src={boyfriend.cardImageUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/70" />
            <div
              className="absolute inset-0 opacity-35 mix-blend-soft-light"
              style={{ backgroundColor: boyfriend.themeColor }}
            />

            <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8">
              <div className="max-w-[78%] pt-3">
                <p className="text-4xl font-semibold tracking-normal sm:text-5xl">
                  {boyfriend.name}
                </p>
                <p className="mt-5 text-xl font-medium italic leading-9 text-white/90">
                  “{boyfriend.openingQuote}”
                </p>
              </div>

              <div className="flex items-end justify-between gap-4">
                <p className="max-w-[65%] text-sm text-white/75">还没说过话</p>
                <Link
                  aria-label={`进入${boyfriend.name}的聊天`}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-white shadow-lg ring-1 ring-white/30 backdrop-blur transition hover:scale-105"
                  href={`/chat/${boyfriend.id}`}
                  style={{
                    backgroundColor: `${boyfriend.themeColor}E6`,
                  }}
                >
                  →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
