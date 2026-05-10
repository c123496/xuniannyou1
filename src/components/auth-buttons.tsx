import { signIn, signOut } from "@/auth";

type GoogleSignInButtonProps = {
  isConfigured: boolean;
};

export function GoogleSignInButton({ isConfigured }: GoogleSignInButtonProps) {
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

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/home" });
      }}
    >
      <button
        className="inline-flex h-12 items-center justify-center rounded-full bg-[#C8553D] px-7 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(200,85,61,0.28)] transition hover:bg-[#B94C37]"
        type="submit"
      >
        进入我的纸片人关系
      </button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        className="inline-flex h-10 items-center justify-center rounded-full border border-[#C8553D]/20 bg-white/60 px-4 text-sm font-medium text-[#5F463E] shadow-sm transition hover:border-[#C8553D]/45 hover:text-[#C8553D]"
        type="submit"
      >
        退出
      </button>
    </form>
  );
}
