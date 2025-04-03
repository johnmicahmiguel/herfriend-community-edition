"use client";

import { useAuth } from "@/lib/context/auth.context";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useEffect, useState } from "react";

export default function AuthLoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user, autoSignInAnonymously, googleSignInProgress } =
    useAuth();
  const [authInProgress, setAuthInProgress] = useState(false);

  // Handle anonymous sign-in with proper loading state tracking
  useEffect(() => {
    // Only attempt sign-in if the auth system is ready (not in initial loading state)
    // and there's no sign-in process already in progress
    if (!loading && !authInProgress && !user) {
      setAuthInProgress(true);

      // Perform the anonymous sign-in
      autoSignInAnonymously()
        .then(() => {
          // Add a small buffer to prevent UI flicker (300ms is usually sufficient)
          setTimeout(() => {
            setAuthInProgress(false);
          }, 300);
        })
        .catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          setAuthInProgress(false);
        });
    }
  }, [loading, autoSignInAnonymously, authInProgress, user]);

  // Show loading screen while either the auth context is loading or any sign-in is in progress
  if (loading || authInProgress || googleSignInProgress) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
