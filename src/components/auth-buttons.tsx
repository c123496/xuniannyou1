import { signIn, signOut } from "@/auth";

type GoogleSignInButtonProps = {
  isConfigured: boolean;
};

export function GoogleSignInButton({ isConfigured }: GoogleSignInButtonProps) {
  if (!isConfigured) {
    return (
      <div className="flex flex-col gap-2">
        <button
          className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full bg-stone-300 px-6 text-sm font-semibold text-stone-500"
          disabled
          type="button"
        >
          Continue with Google
        </button>
        <p className="max-w-sm text-sm leading-6 text-amber-700">
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
        className="inline-flex h-12 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-800"
        type="submit"
      >
        Continue with Google
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
        className="inline-flex h-10 items-center justify-center rounded-full border border-stone-300 bg-white/70 px-4 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
        type="submit"
      >
        Sign out
      </button>
    </form>
  );
}
