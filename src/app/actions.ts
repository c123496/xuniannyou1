"use server";

import { signIn, signOut } from "@/auth";
import { verifyTurnstileToken } from "@/lib/auth/turnstile";

export async function googleSignInAction(formData: FormData) {
  const token = formData.get("cf-turnstile-response") as string | null;

  if (!token) {
    throw new Error("请完成人机验证后再登录。");
  }

  const valid = await verifyTurnstileToken(token);
  if (!valid) {
    throw new Error("人机验证失败，请刷新后重试。");
  }

  await signIn("google", { redirectTo: "/home" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
