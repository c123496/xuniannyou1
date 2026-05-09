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
    <main
      className="min-h-screen text-stone-950"
      style={{
        backgroundColor: `${boyfriend.themeColor}10`,
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-4 sm:px-6">
        <header className="sticky top-0 z-10 -mx-4 flex items-center justify-between border-b border-black/5 bg-white/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              aria-label="返回"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-stone-600 shadow-sm"
              href="/home"
            >
              ←
            </Link>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={boyfriend.name}
              className="h-10 w-10 rounded-full object-cover"
              src={boyfriend.avatarImageUrl}
            />
            <div>
              <h1 className="text-base font-semibold">{boyfriend.name}</h1>
              <p className="text-xs" style={{ color: boyfriend.themeColor }}>
                正在输入
              </p>
            </div>
          </div>
          <div
            className="hidden rounded-full px-3 py-1 text-xs font-medium sm:block"
            style={{
              backgroundColor: `${boyfriend.themeColor}14`,
              color: boyfriend.themeColor,
            }}
          >
            上次互动刚刚
          </div>
        </header>

        <ChatPanel boyfriend={boyfriend} />
      </div>
    </main>
  );
}
