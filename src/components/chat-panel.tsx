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

function ShareButton({
  boyfriendId,
  type,
  content,
  imageUrl,
}: {
  boyfriendId: string;
  type: "text" | "image";
  content?: string;
  imageUrl?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const params = new URLSearchParams({ bid: boyfriendId, t: type });
    if (content) params.set("c", content.slice(0, 200));
    if (imageUrl) params.set("img", imageUrl);
    window.open(`/api/share-card?${params.toString()}`, "_blank");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      title="生成分享卡片"
      type="button"
      className="mt-2 flex items-center gap-1 self-end rounded-full border border-[#E2D0C0] bg-[#F7F0E6] px-2.5 py-1 text-[11px] text-[#7C6860] transition hover:border-[#C8553D]/40 hover:text-[#C8553D]"
    >
      {copied ? (
        "已打开 ✓"
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 2H14V6" />
            <path d="M14 2L8 8" />
            <path d="M7 3H3C2.45 3 2 3.45 2 4V13C2 13.55 2.45 14 3 14H12C12.55 14 13 13.55 13 13V9" />
          </svg>
          分享卡片
        </>
      )}
    </button>
  );
}

function AssistantBubble({
  boyfriend,
  message,
}: {
  boyfriend: Boyfriend;
  message: ChatMessage;
}) {
  return (
    <article className="flex max-w-[92%] items-start gap-3 sm:max-w-[76%]">
      <div className="relative mt-1 hidden h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-[#DDD0C0] sm:block">
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
      <div className="flex flex-col">
        <div className="rounded-[22px] rounded-tl-[6px] border border-[#E8D8C8] bg-white/92 px-4 py-3.5 text-[#1A1210] shadow-[0_10px_32px_rgba(60,40,30,0.08)] backdrop-blur sm:px-5 sm:py-4">
          <p className="mb-2.5 text-[11px] font-medium tracking-wide text-[#C8553D]">{boyfriend.name}</p>

          {message.type === "image" ? (
            <figure className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={message.caption ?? "男友发来的图片"}
                className="max-h-[460px] w-full rounded-[16px] object-cover"
                src={message.imageUrl}
              />
              {message.caption ? (
                <figcaption className="text-sm leading-7 text-[#4A3830]">{message.caption}</figcaption>
              ) : null}
            </figure>
          ) : message.type === "audio" ? (
            <div className="space-y-3">
              <p className="text-sm leading-7 text-[#4A3830]">{message.caption ?? "点开听"}</p>
              <audio className="w-full max-w-[320px]" controls src={message.audioUrl}>
                你的浏览器暂时不能播放这条语音。
              </audio>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-[15px] leading-[1.85]">{message.content}</p>
          )}
        </div>

        {/* 分享按钮：文字消息和图片消息都显示 */}
        {message.type === "text" && message.content ? (
          <ShareButton
            boyfriendId={boyfriend.id}
            type="text"
            content={message.content}
          />
        ) : message.type === "image" && message.imageUrl ? (
          <ShareButton
            boyfriendId={boyfriend.id}
            type="image"
            content={message.caption}
            imageUrl={message.imageUrl}
          />
        ) : null}
      </div>
    </article>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <article className="ml-auto max-w-[90%] rounded-[22px] rounded-tr-[6px] bg-[#C8553D] px-4 py-3.5 text-white shadow-[0_12px_36px_rgba(200,85,61,0.28)] sm:max-w-[70%] sm:px-5 sm:py-4">
      {message.type === "image" ? (
        <figure className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={message.caption ?? "发送的图片"}
            className="max-h-[360px] w-full rounded-[15px] object-cover"
            src={message.imageUrl}
          />
          {message.caption ? (
            <figcaption className="text-sm leading-7 text-white/85">{message.caption}</figcaption>
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
        <p className="whitespace-pre-wrap text-[15px] leading-[1.85]">{message.content}</p>
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
      <section className="relative flex flex-1 flex-col gap-4 overflow-hidden py-6">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_20%_8%,rgba(200,85,61,0.07),transparent),linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0.06))]" />

        {messages.map((message) =>
          message.role === "user" ? (
            <UserBubble key={message.id} message={message} />
          ) : (
            <AssistantBubble boyfriend={boyfriend} key={message.id} message={message} />
          ),
        )}

        {isTyping ? (
          <div className="flex max-w-[80%] items-center gap-2.5 sm:max-w-[65%]">
            <div className="relative mt-1 hidden h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-[#DDD0C0] sm:block">
              <Image
                alt={boyfriend.name}
                className="object-cover"
                fill
                sizes="32px"
                src={boyfriend.avatarImageUrl}
                style={{ objectPosition: boyfriend.imagePosition }}
                unoptimized
              />
            </div>
            <div className="flex items-center gap-1.5 rounded-[20px] rounded-tl-[5px] border border-[#E8D8C8] bg-white/92 px-5 py-3.5 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8553D]" style={{ animation: "breatheDot 1.3s ease-in-out infinite", animationDelay: "0s" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8553D]" style={{ animation: "breatheDot 1.3s ease-in-out infinite", animationDelay: "0.22s" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8553D]" style={{ animation: "breatheDot 1.3s ease-in-out infinite", animationDelay: "0.44s" }} />
            </div>
          </div>
        ) : null}
        {error ? (
          <p className="rounded-full border border-[#F5D0C8] bg-[#FEF4F2] px-4 py-2 text-sm text-[#B94C37]">
            {error}
          </p>
        ) : null}
      </section>

      <form
        className="sticky bottom-3 rounded-[26px] border border-white/65 bg-white/88 p-3 shadow-[0_18px_60px_rgba(60,40,30,0.14)] backdrop-blur-xl"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="message">
          消息
        </label>

        {imageDataUrl || audioDataUrl ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {imageDataUrl ? (
              <div className="flex items-center gap-2 rounded-2xl border border-[#E2D0C0] bg-[#F7F0E6] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="待发送图片" className="h-14 w-14 rounded-xl object-cover" src={imageDataUrl} />
                <button className="text-xs text-[#7C6860]" onClick={() => setImageDataUrl(null)} type="button">
                  移除
                </button>
              </div>
            ) : null}
            {audioDataUrl ? (
              <div className="flex items-center gap-2 rounded-2xl border border-[#E2D0C0] bg-[#F7F0E6] p-2">
                <audio className="h-9 w-44" controls src={audioDataUrl} />
                <button className="text-xs text-[#7C6860]" onClick={() => setAudioDataUrl(null)} type="button">
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
            className="flex h-11 cursor-pointer items-center justify-center rounded-full border border-[#DDD0C0] bg-[#F7F0E6] px-4 text-sm text-[#4A3830] transition hover:border-[#C8553D]/38 hover:text-[#C8553D]"
            htmlFor="image-upload"
          >
            图片
          </label>
          <button
            className={`h-11 rounded-full border px-4 text-sm transition ${
              isRecording
                ? "border-[#C8553D]/40 bg-[#C8553D]/8 text-[#C8553D]"
                : "border-[#DDD0C0] bg-[#F7F0E6] text-[#4A3830] hover:border-[#C8553D]/38 hover:text-[#C8553D]"
            }`}
            onClick={toggleRecording}
            type="button"
          >
            {isRecording ? "停止●" : "语音"}
          </button>
          <input
            className="min-h-11 min-w-[180px] flex-1 rounded-full border border-[#DDD0C0] bg-[#FEFCFA] px-5 text-[15px] text-[#1A1210] outline-none transition placeholder:text-[#A89890] focus:border-[#C8553D]/60 focus:ring-1 focus:ring-[#C8553D]/15"
            id="message"
            inputMode="text"
            onChange={(event) => setInput(event.target.value)}
            placeholder={`和${boyfriend.name}说点什么`}
            type="text"
            value={input}
          />
          <button
            className="h-11 rounded-full bg-[#C8553D] px-5 text-sm font-medium text-white shadow-[0_10px_28px_rgba(200,85,61,0.30)] transition hover:bg-[#AB4230] hover:shadow-[0_14px_36px_rgba(200,85,61,0.40)] disabled:bg-[#DDD0C0] disabled:text-[#A89890] disabled:shadow-none"
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
