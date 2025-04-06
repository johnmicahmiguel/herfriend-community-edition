"use client";

import { useAuth } from "@/lib/context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAnonymous } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || isAnonymous)) {
      router.push("/");
    }
  }, [user, loading, isAnonymous, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-500 text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, return null (the useEffect will handle the redirect)
  if (!user || isAnonymous) {
    return null;
  }

  // User is authenticated, render the children
  return <>{children}</>;
}
