import { getSession } from "next-auth/react";

/**
 * Checks if the user is logged in by verifying the NextAuth session.
 * @returns {Promise<boolean>} - Returns true if the user is logged in, false otherwise.
 */
export async function isUserLoggedIn(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}