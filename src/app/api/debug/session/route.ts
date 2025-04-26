import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  // Return sanitized session for debugging
  return NextResponse.json({
    authenticated: !!session,
    session: session ? {
      user: {
        id: session.user?.id || "not-available",
        email: session.user?.email || "not-available",
        name: session.user?.name || "not-available",
      },
      expires: session.expires
    } : null
  });
}