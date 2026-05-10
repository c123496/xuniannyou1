import NextAuth from "next-auth";

import { getGoogleOAuthProvider } from "@/lib/auth/google-provider";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [getGoogleOAuthProvider()],
  pages: {
    signIn: "/",
  },
});
