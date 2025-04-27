// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface JWT {
	id?: string;
	profilePicture?: string | null;
  }

  interface Session {
	user: {
	  id?: string;
	  profilePicture?: string | null;
	} & DefaultSession["user"];
  }
}