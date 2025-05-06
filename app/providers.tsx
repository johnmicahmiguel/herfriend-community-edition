"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {/* Add other client-only providers here in the future */}
      {children}
    </PrivyProvider>
  );
} 