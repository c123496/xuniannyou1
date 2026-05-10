import NextAuth from "next-auth";

import { getGoogleOAuthProvider } from "@/lib/auth/google-provider";

export const { auth, handlers, signIn, signOut } = NextAuth({
  basePath: "https://dearmate.mom/api/auth",
  providers: [getGoogleOAuthProvider()],
  pages: {
    signIn: "/",
  },
});
