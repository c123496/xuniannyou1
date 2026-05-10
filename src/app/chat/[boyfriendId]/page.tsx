import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { ChatPanel } from "@/components/chat-panel";
import { getBoyfriendById } from "@/lib/boyfriends";

type ChatPageProps = {
  params: Promise<{
    boyfriendId: string;
  }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { boyfriendId } = await params;
  const boyfriend = getBoyfriendById(boyfriendId);

  if (!boyfriend) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F3EADF] text-[#241C18]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-3 py-3 sm:px-5">
        <header className="sticky top-3 z-10 overflow-hidden rounded-[26px] border border-white/55 bg-[#241C18] text-white shadow-[0_20px_70px_rgba(36,28,24,0.20)]">
          <Image
            alt=""
            className="object-cover opacity-38 motion-safe:animate-[posterDrift_18s_ease-in-out_infinite]"
            fill
            priority={false}
            sizes="(max-width: 1024px) 100vw, 1024px"
            src={boyfriend.cardImageUrl}
            style={{ objectPosition: boyfriend.imagePosition }}
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,13,11,0.86)_0%,rgba(18,13,11,0.62)_42%,rgba(18,13,11,0.34)_100%)]" />

          <div className="relative flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                aria-label="返回角色选择"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/92 text-xl text-[#4A332C] shadow-sm transition hover:bg-white"
                href="/home"
              >
                ←
              </Link>
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/75">
                <Image
                  alt={boyfriend.name}
                  className="object-cover"
                  fill
                  sizes="56px"
                  src={boyfriend.avatarImageUrl}
                  style={{ objectPosition: boyfriend.imagePosition }}
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold">{boyfriend.name}</h1>
                <p className="mt-1 truncate text-sm text-white/72">{boyfriend.presenceLine}</p>
              </div>
            </div>
            <p className="hidden max-w-[280px] rounded-full border border-white/20 bg-white/12 px-4 py-2 text-right text-sm leading-5 text-white/78 sm:block">
              {boyfriend.statusLine}
            </p>
          </div>
        </header>

        <ChatPanel boyfriend={boyfriend} />
      </div>
    </main>
  );
}
