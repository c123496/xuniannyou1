"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";

import { googleSignInAction, signOutAction } from "@/app/actions";

type GoogleSignInButtonProps = {
  isConfigured: boolean;
};

export function GoogleSignInButton({ isConfigured }: GoogleSignInButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (!isConfigured) {
    return (
      <div className="flex flex-col gap-2">
        <button
          className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full bg-[#C8553D]/30 px-7 text-sm font-semibold text-[#8C6E64]"
          disabled
          type="button"
        >
          使用 Google 登录
        </button>
        <p className="max-w-sm text-sm leading-6 text-[#8C6E64]">
          先在 .env.local 填入 Google OAuth 的 ID 和 Secret，登录按钮才会启用。
        </p>
      </div>
    );
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    if (!turnstileToken) {
      setError("请先完成人机验证。");
      return;
    }
    formData.set("cf-turnstile-response", turnstileToken);
    setPending(true);
    try {
      await googleSignInAction(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes("NEXT_REDIRECT")) {
        setError(message);
        setPending(false);
      }
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => {
          setTurnstileToken(token);
        }}
        options={{ theme: "light", size: "normal" }}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        className="inline-flex h-12 items-center justify-center rounded-full bg-[#C8553D] px-7 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(200,85,61,0.28)] transition hover:bg-[#B94C37] disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={pending || !turnstileToken}
      >
        {pending ? "正在跳转..." : "进入我的纸片人关系"}
      </button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        className="inline-flex h-10 items-center justify-center rounded-full border border-[#C8553D]/20 bg-white/60 px-4 text-sm font-medium text-[#5F463E] shadow-sm transition hover:border-[#C8553D]/45 hover:text-[#C8553D]"
        type="submit"
      >
        退出
      </button>
    </form>
  );
}
