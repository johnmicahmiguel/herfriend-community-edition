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
import { SidebarProvider } from "@/lib/context/sidebar.context";
import { ThemeProvider } from "next-themes";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ConsoleOverride />
          <AuthProvider>
            <SidebarProvider>
              <AuthLoadingWrapper>
                <AgoraClientProvider>
                  <AgoraCoreProvider>
                    <AgoraBotsProvider>
                      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
                        {/* Top Menu Bar */}
                        <TopMenuBar />

                        <div className="flex flex-1">
                          {/* Sidebar with live lobbies */}
                          <SideBar />

                          {/* Main content */}
                          <main className="relative flex-1 flex flex-col overflow-y-auto ml-0 md:ml-64">
                            {children}
                          </main>
                        </div>
                      </div>
                    </AgoraBotsProvider>
                  </AgoraCoreProvider>
                </AgoraClientProvider>
              </AuthLoadingWrapper>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
