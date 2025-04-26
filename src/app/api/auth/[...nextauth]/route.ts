import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { createUser } from "@/features/auth/createUser"; // Ensure this is the correct path

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id?: string;
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
  },
  callbacks: {
    async signIn({ user }) {
      try {
        // Check if the user already exists
        if (user.email && user.name) {
          await createUser(user.email, user.name); // Call your createUser function
        }
        return true; // Allow sign-in
      } catch (error) {
        console.error("Error creating user:", error);
        return false; // Deny sign-in if there's an error
      }
    },
    async jwt({ token, user }) {
      if (user) {
        // Save the user id to the token (if needed)
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && typeof token.id === "string") {
        session.user.id = token.id; // Attach the user id to the session
      }
      return session;
    },
  },
};

// Export the NextAuth handler as the default export
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };