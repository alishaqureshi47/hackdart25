'use client';

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/contexts/UserContext";
import type { Session } from "next-auth";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        {children}
      </UserProvider>
    </SessionProvider>
  );
}