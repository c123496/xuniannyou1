"use client";

import { useEffect, useRef, useState } from "react";

import type { Boyfriend } from "@/lib/boyfriends";
import type { ChatMessage } from "@/lib/chat/messages";

const MIN_DELAY_MS = 900;
const MAX_DELAY_MS = 2200;

function getMessageDelay(content: string) {
  const baseDelay = content.length * 50 + 300;
  return Math.min(MAX_DELAY_MS, Math.max(MIN_DELAY_MS, baseDelay));
}

function AssistantBubble({
  boyfriend,
  message,
}: {
  boyfriend: Boyfriend;
  message: ChatMessage;
}) {
  return (
    <article
      className="max-w-[84%] rounded-lg border border-stone-100 bg-white p-4 shadow-sm"
      style={{
        borderLeftColor: boyfriend.themeColor,
        borderLeftWidth: 4,
      }}
    >
      <p className="mb-2 text-xs font-medium" style={{ color: boyfriend.themeColor }}>
        {boyfriend.name}
      </p>

      {message.type === "image" ? (
        <figure className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={message.caption ?? "男友发来的自拍"}
            className="max-h-[460px] w-full rounded-md object-cover"
            src={message.imageUrl}
          />
          {message.caption ? (
            <figcaption className="text-sm leading-7 text-stone-800">{message.caption}</figcaption>
          ) : null}
        </figure>
      ) : message.type === "audio" ? (
        <div className="space-y-3">
          <p className="text-sm leading-7 text-stone-800">{message.caption ?? "点开听。"}</p>
          <audio className="w-full max-w-[280px]" controls src={message.audioUrl}>
            你的浏览器暂时不能播放这条语音。
          </audio>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-7 text-stone-900">{message.content}</p>
      )}
    </article>
  );
}

export function ChatPanel({ boyfriend }: { boyfriend: Boyfriend }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "opening",
      role: "assistant",
      type: "text",
      content: boyfriend.openingLine,
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = pendingTimers.current;

    return () => {
      for (const timer of timers) {
        clearTimeout(timer);
      }
    };
  }, []);

  function revealAssistantMessages(nextMessages: ChatMessage[]) {
    if (nextMessages.length === 0) return;

    let elapsed = 0;
    setIsTyping(true);

    nextMessages.forEach((message, index) => {
      elapsed += getMessageDelay(message.content);
      const showTimer = setTimeout(() => {
        setMessages((current) => [...current, message]);
        setIsTyping(index < nextMessages.length - 1);
      }, elapsed);

      pendingTimers.current.push(showTimer);
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();
    if (!content || isSending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      type: "text",
      content,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(null);
    setIsSending(true);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boyfriendId: boyfriend.id,
          message: content,
        }),
      });

      if (!response.ok) {
        throw new Error("chat request failed");
      }

      const data = (await response.json()) as { messages?: ChatMessage[] };
      revealAssistantMessages(
        data.messages?.length
          ? data.messages
          : [
              {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                type: "text" as const,
                content: "我刚才有点走神。你再说一遍，好吗？",
              },
            ],
      );
    } catch {
      setIsTyping(false);
      setError("刚才没有连上模型。稍等一下再试。");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <section className="flex flex-1 flex-col gap-4 py-6">
        {messages.map((message) =>
          message.role === "user" ? (
            <div
              className="ml-auto max-w-[82%] rounded-lg bg-stone-950 p-4 text-white shadow-sm"
              key={message.id}
            >
              <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
            </div>
          ) : (
            <AssistantBubble boyfriend={boyfriend} key={message.id} message={message} />
          ),
        )}

        {isTyping ? (
          <div
            className="max-w-[84%] rounded-lg border border-stone-100 bg-white p-4 text-sm text-stone-500 shadow-sm"
            style={{
              borderLeftColor: boyfriend.themeColor,
              borderLeftWidth: 4,
            }}
          >
            {boyfriend.name} 正在输入...
          </div>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </section>

      <form
        className="sticky bottom-4 rounded-lg border bg-white p-3 shadow-lg"
        onSubmit={handleSubmit}
        style={{
          borderColor: `${boyfriend.themeColor}33`,
        }}
      >
        <label className="sr-only" htmlFor="message">
          Message
        </label>
        <div className="flex gap-2">
          <input
            className="min-h-12 flex-1 rounded-md border border-stone-200 px-4 text-base outline-none transition"
            id="message"
            onChange={(event) => setInput(event.target.value)}
            placeholder={`和${boyfriend.name}说点什么`}
            style={{
              borderColor: input ? `${boyfriend.themeColor}66` : undefined,
            }}
            type="text"
            value={input}
          />
          <button
            className="h-12 rounded-md px-5 text-sm font-semibold text-white disabled:bg-stone-300 disabled:text-stone-500"
            disabled={isSending || !input.trim()}
            style={{
              backgroundColor: isSending || !input.trim() ? undefined : boyfriend.themeColor,
            }}
            type="submit"
          >
            发送
          </button>
        </div>
      </form>
    </>
  );
}
