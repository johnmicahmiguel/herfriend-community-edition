import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/context/auth.context";
import AuthLoadingWrapper from "@/components/auth/AuthLoadingWrapper";
import ConsoleOverride from "@/components/global/ConsoleOverride";
import TopMenuBar from "@/components/ui/TopMenuBar";
import SideBar from "@/components/ui/SideBar";
import { AgoraClientProvider } from "@/lib/context/agora-client.context";
import { AgoraCoreProvider } from "@/lib/context/agora-core.context";
import { AgoraBotsProvider } from "@/lib/context/agora-bots.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Lobby App",
  description:
    "Join lobbies, listen to hosts, chat with users and book hosts for private room"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConsoleOverride />
        <AuthProvider>
          <AuthLoadingWrapper>
            <AgoraClientProvider>
              <AgoraCoreProvider>
                <AgoraBotsProvider>
                  <div className="flex flex-col min-h-screen bg-gray-100">
                    {/* Top Menu Bar */}
                    <TopMenuBar />

                    <div className="flex flex-1">
                      {/* Sidebar with live lobbies */}
                      <SideBar />

                      {/* Main content */}
                      <main className="relative flex-1 flex flex-col overflow-hidden">
                        {children}
                      </main>
                    </div>
                  </div>
                </AgoraBotsProvider>
              </AgoraCoreProvider>
            </AgoraClientProvider>
          </AuthLoadingWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
