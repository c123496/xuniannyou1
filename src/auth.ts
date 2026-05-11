import NextAuth from "next-auth";

import { getGoogleOAuthProvider } from "@/lib/auth/google-provider";
import { sendWelcomeEmail } from "@/lib/email";
import { getPool } from "@/lib/db/pool";

async function isNewUser(userId: string): Promise<boolean> {
  const db = getPool();
  if (!db) return false;
  try {
    const result = await db.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM messages WHERE user_id = $1 LIMIT 1",
      [userId],
    );
    return parseInt(result.rows[0]?.count ?? "0", 10) === 0;
  } catch {
    return false;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [getGoogleOAuthProvider()],
  pages: {
    signIn: "/",
  },
  events: {
    async signIn({ user }) {
      const userId = user.email ?? user.name;
      if (!userId || !user.email) return;

      // 只对新用户（无任何历史消息）发送欢迎邮件
      const newUser = await isNewUser(userId);
      if (newUser) {
        await sendWelcomeEmail(user.email, user.name ?? "你").catch((err) => {
          console.error("[email] 欢迎邮件发送失败:", err);
        });
      }
    },
  },
});
