import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { createUser } from "@/features/auth/createUser";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      profilePicture?: string | null;
    };
  }

  interface JWT {
    id?: string;
    profilePicture?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, 
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        // Check if the user already exists
        if (user.email && user.name) {
          await createUser(user.email, user.name, user.image ?? ""); // create user
        }
        return true; // Allow sign-in
      } catch (error) {
        console.error("Error creating user:", error);
        return false; // Deny sign-in if there's an error
      }
    },
    async jwt({ token, user }) {
      if (user) {
        // Save the user id and profile picture to the token
        token.id = user.id;
        token.profilePicture = user.image || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string | undefined;
        session.user.profilePicture = token.profilePicture as string | null | undefined;
      }
      return session;
    },
  },
};