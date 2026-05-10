"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Boyfriend } from "@/lib/boyfriends";
import type { ChatMessage } from "@/lib/chat/messages";
import { toUserAudioMessage, toUserImageMessage } from "@/lib/chat/messages";

const MIN_DELAY_MS = 900;
const MAX_DELAY_MS = 2200;

function getMessageDelay(content: string) {
  const baseDelay = content.length * 44 + 280;
  return Math.min(MAX_DELAY_MS, Math.max(MIN_DELAY_MS, baseDelay));
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function AssistantBubble({
  boyfriend,
  message,
}: {
  boyfriend: Boyfriend;
  message: ChatMessage;
}) {
  return (
    <article className="flex max-w-[92%] items-start gap-3 sm:max-w-[78%]">
      <div className="relative mt-1 hidden h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-[#E5D4C7] sm:block">
        <Image
          alt={boyfriend.name}
          className="object-cover"
          fill
          sizes="36px"
          src={boyfriend.avatarImageUrl}
          style={{ objectPosition: boyfriend.imagePosition }}
          unoptimized
        />
      </div>
      <div className="rounded-[24px] rounded-tl-md border border-[#E8D7C9] bg-white/90 px-4 py-3 text-[#241C18] shadow-[0_14px_36px_rgba(70,48,39,0.08)] backdrop-blur sm:px-5 sm:py-4">
        <p className="mb-2 text-xs font-semibold text-[#C8553D]">{boyfriend.name}</p>

        {message.type === "image" ? (
          <figure className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={message.caption ?? "男友发来的图片"}
              className="max-h-[460px] w-full rounded-[18px] object-cover"
              src={message.imageUrl}
            />
            {message.caption ? (
              <figcaption className="text-sm leading-7 text-[#4C3B35]">{message.caption}</figcaption>
            ) : null}
          </figure>
        ) : message.type === "audio" ? (
          <div className="space-y-3">
            <p className="text-sm leading-7 text-[#4C3B35]">{message.caption ?? "点开听"}</p>
            <audio className="w-full max-w-[320px]" controls src={message.audioUrl}>
              你的浏览器暂时不能播放这条语音。
            </audio>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-[15px] leading-8">{message.content}</p>
        )}
      </div>
    </article>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <article className="ml-auto max-w-[90%] rounded-[24px] rounded-tr-md bg-[#C8553D] px-4 py-3 text-white shadow-[0_16px_40px_rgba(200,85,61,0.22)] sm:max-w-[72%] sm:px-5 sm:py-4">
      {message.type === "image" ? (
        <figure className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={message.caption ?? "发送的图片"}
            className="max-h-[360px] w-full rounded-[18px] object-cover"
            src={message.imageUrl}
          />
          {message.caption ? (
            <figcaption className="text-sm leading-7 text-white/88">{message.caption}</figcaption>
          ) : null}
        </figure>
      ) : message.type === "audio" ? (
        <div className="space-y-3">
          <p className="text-sm leading-7 text-white/90">{message.caption ?? "语音消息"}</p>
          <audio className="w-full max-w-[320px]" controls src={message.audioUrl}>
            你的浏览器暂时不能播放这条语音。
          </audio>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-[15px] leading-8">{message.content}</p>
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
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = pendingTimers.current;

    return () => {
      for (const timer of timers) {
        clearTimeout(timer);
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function revealAssistantMessages(nextMessages: ChatMessage[]) {
    if (nextMessages.length === 0) {
      setIsTyping(false);
      return;
    }

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

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImageDataUrl(await readFileAsDataUrl(file));
      setError(null);
    } catch {
      setError("图片读取失败，换一张试试。");
    } finally {
      event.target.value = "";
    }
  }

  async function toggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("当前浏览器不支持录音。");
      return;
    }

    try {
      recordedChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener("stop", async () => {
        const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        setIsRecording(false);

        if (blob.size === 0) return;
        setAudioDataUrl(await readFileAsDataUrl(new File([blob], "voice.webm", { type: blob.type })));
      });

      recorder.start();
      setIsRecording(true);
      setError(null);
    } catch {
      setIsRecording(false);
      setError("没有拿到麦克风权限，先检查浏览器授权。");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();
    if ((!content && !imageDataUrl && !audioDataUrl) || isSending) return;

    const optimisticMessages: ChatMessage[] = [
      ...(content
        ? [
            {
              id: crypto.randomUUID(),
              role: "user" as const,
              type: "text" as const,
              content,
            },
          ]
        : []),
      ...(imageDataUrl
        ? [
            {
              ...toUserImageMessage({
                imageUrl: imageDataUrl,
                caption: content || "图片消息",
              }),
              id: crypto.randomUUID(),
            },
          ]
        : []),
      ...(audioDataUrl
        ? [
            {
              ...toUserAudioMessage({
                audioUrl: audioDataUrl,
                caption: content || "语音消息",
              }),
              id: crypto.randomUUID(),
            },
          ]
        : []),
    ];

    setMessages((current) => [...current, ...optimisticMessages]);
    setInput("");
    setImageDataUrl(null);
    setAudioDataUrl(null);
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
          imageDataUrl,
          audioDataUrl,
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
      <section className="relative flex flex-1 flex-col gap-5 overflow-hidden py-6">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[32px] bg-[radial-gradient(circle_at_20%_10%,rgba(200,85,61,0.10),transparent_26rem),linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,255,255,0.08))]" />

        {messages.map((message) =>
          message.role === "user" ? (
            <UserBubble key={message.id} message={message} />
          ) : (
            <AssistantBubble boyfriend={boyfriend} key={message.id} message={message} />
          ),
        )}

        {isTyping ? (
          <div className="flex max-w-[92%] items-center gap-3 rounded-[22px] rounded-tl-md border border-[#E8D7C9] bg-white/86 px-4 py-3 text-sm text-[#826C62] shadow-sm sm:max-w-[72%]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#C8553D]" />
            {boyfriend.name} 正在认真读你的消息...
          </div>
        ) : null}
        {error ? <p className="rounded-full bg-white/80 px-4 py-2 text-sm text-[#B94C37]">{error}</p> : null}
      </section>

      <form
        className="sticky bottom-3 rounded-[28px] border border-white/70 bg-white/86 p-3 shadow-[0_20px_70px_rgba(70,48,39,0.16)] backdrop-blur-xl"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="message">
          消息
        </label>

        {imageDataUrl || audioDataUrl ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {imageDataUrl ? (
              <div className="flex items-center gap-2 rounded-2xl border border-[#E5D4C7] bg-[#F8F1EA] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="待发送图片" className="h-14 w-14 rounded-xl object-cover" src={imageDataUrl} />
                <button className="text-xs text-[#8A7168]" onClick={() => setImageDataUrl(null)} type="button">
                  移除
                </button>
              </div>
            ) : null}
            {audioDataUrl ? (
              <div className="flex items-center gap-2 rounded-2xl border border-[#E5D4C7] bg-[#F8F1EA] p-2">
                <audio className="h-9 w-44" controls src={audioDataUrl} />
                <button className="text-xs text-[#8A7168]" onClick={() => setAudioDataUrl(null)} type="button">
                  移除
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <input
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={handleImageChange}
            type="file"
          />
          <label
            className="flex h-12 cursor-pointer items-center justify-center rounded-full border border-[#E0CABC] bg-[#F8F1EA] px-4 text-sm font-semibold text-[#5F463E] transition hover:border-[#C8553D]/40"
            htmlFor="image-upload"
          >
            图片
          </label>
          <button
            className="h-12 rounded-full border border-[#E0CABC] bg-[#F8F1EA] px-4 text-sm font-semibold text-[#5F463E] transition hover:border-[#C8553D]/40"
            onClick={toggleRecording}
            type="button"
          >
            {isRecording ? "停止" : "语音"}
          </button>
          <input
            className="min-h-12 min-w-[180px] flex-1 rounded-full border border-[#E0CABC] bg-[#FFFDFC] px-5 text-base text-[#241C18] outline-none transition placeholder:text-[#AA948A] focus:border-[#C8553D]/70"
            id="message"
            inputMode="text"
            onChange={(event) => setInput(event.target.value)}
            placeholder={`和${boyfriend.name}说点什么`}
            type="text"
            value={input}
          />
          <button
            className="h-12 rounded-full bg-[#C8553D] px-6 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(200,85,61,0.28)] transition hover:bg-[#B94C37] disabled:bg-[#D9C6BA] disabled:text-[#8A7168] disabled:shadow-none"
            disabled={isSending || (!input.trim() && !imageDataUrl && !audioDataUrl)}
            type="submit"
          >
            发送
          </button>
        </div>
      </form>
    </>
  );
}
