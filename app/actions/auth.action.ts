"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { createOrUpdateUser } from "@/lib/services/user.service";

// Verify the Firebase ID token and create a session
export async function createServerSession(token: string) {
  try {
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Determine if user is anonymous
    const isAnonymous = decodedToken.firebase?.sign_in_provider === "anonymous";

    // Create or update user in the database ONLY for non-anonymous users
    if (!isAnonymous && decodedToken.email) {
      console.log(decodedToken)
      await createOrUpdateUser({
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || null,
        emailVerified: decodedToken.email_verified || false,
        photoURL: decodedToken.picture || null,
        isAnonymous: false,
        getIdToken: async () => token,
      } as any);
    }

    // Set a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn,
    });

    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return { success: true, token: sessionCookie, decodedToken };
  } catch (error) {
    console.error("Error creating session:", error);
    return { success: false, error: "Failed to create session" };
  }
}

// Get the current session
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return null;
    }

    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true,
    );
    return decodedClaims;
  } catch (error) {
    return null;
  }
}

// Sign out
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  //TODO: delete apiTkn cookie as well
  return { success: true };
}
