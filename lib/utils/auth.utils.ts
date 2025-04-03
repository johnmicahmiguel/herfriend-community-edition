"use client";

import { useAuth } from "@/lib/context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to protect client-side routes
 * @param redirectTo The path to redirect to if not authenticated
 * @returns An object with the user, loading state, and isAnonymous flag
 */
export function useProtectedRoute(redirectTo: string = "/") {
  const { user, loading, isAnonymous } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || isAnonymous)) {
      router.push(redirectTo);
    }
  }, [user, loading, isAnonymous, router, redirectTo]);

  return { user, loading, isAnonymous };
}

/**
 * Function to handle server action errors
 * @param error The error to handle
 * @param router The Next.js router
 * @param redirectTo The path to redirect to if unauthorized
 * @returns The error message
 */
export function handleServerActionError(
  error: any,
  router: ReturnType<typeof useRouter>,
  redirectTo: string = "/",
): string {
  console.error("Server action error:", error);

  // Check if the error is an authentication error
  if (error?.message?.includes("Unauthorized")) {
    // Redirect to login page
    router.push(redirectTo);
    return "Authentication required. Please log in.";
  }

  // Return a generic error message
  return error?.message || "An error occurred. Please try again.";
}
