import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { storeUserData } from "@/features/auth/userData";

// Add type declaration for the session
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Make sure ID is required
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Keep the user ID in the token
      if (account && user) {
        token.userId = user.id; // Store as userId to be explicit
      }
      return token;
    },
    async session({ session, token, user }) {
      // Add the user ID to the session
      if (session.user) {
        // Important: Add the user ID from the token
        session.user.id = token.userId as string || token.sub as string;
      }
      console.log("Session callback: User ID added to session", session.user.id);
      return session;
    },
  },
  debug: true,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };