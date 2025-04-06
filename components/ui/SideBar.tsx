"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lobby } from "@/types/lobby";
import {
  Home,
  MessageSquare,
  Wallet,
  Package,
  LogIn,
  LogOut,
  Construction,
  LayoutDashboard,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth.context";
import { LoginModal } from "@/components/auth/LoginModal";
import MessagePanel from "@/components/messages/MessagePanel";
import { getUserUnreadCountRef } from "@/lib/firebase/database";
import { onValue, off } from "firebase/database";
import { useEffect } from "react";
import { useSidebar } from "@/lib/context/sidebar.context";
import { usePathname } from "next/navigation";

// Dummy data for lobbies (Copied from LobbyGrid for now)
const DUMMY_LOBBIES: Lobby[] = [
    {
    id: "670e40bd2aebcc000732a4e6",
    title: "Social Experience with Nature",
    hostName: "Nature",
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1000",
    viewers: 1245,
    category: "Education",
    isLive: true,
  },
  {
    id: "2",
    title: "Clean Water Initiative",
    hostName: "WASH Program",
    thumbnail:
      "https://images.unsplash.com/photo-1538300342682-cf57afb97285?q=80&w=1000",
    viewers: 3782,
    category: "Health",
    isLive: true,
  },
    // ... other dummy lobbies
    {
    id: "8",
    title: "Nutrition for Growth",
    hostName: "Nutrition Team",
    thumbnail:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1000",
    viewers: 1532,
    category: "Health",
    isLive: true,
  },
];

// Helper function to format viewer count like Twitch (e.g., 1.2K)
function formatViewerCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toString();
}

// Memoized lobby item component
const LobbyItem = memo(
  ({
    lobby,
  }: {
    lobby: Pick<Lobby, "id" | "hostName" | "thumbnail" | "viewers" | "isLive">;
  }) => (
    <Link href={`/lobby/${lobby.id}`} className="block">
      <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors dark:hover:bg-gray-800">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            src={lobby.thumbnail}
            alt={lobby.hostName}
            fill
            sizes="40px"
            className="object-cover rounded"
          />
        </div>
        <div className="overflow-hidden">
          <p className="font-medium text-sm truncate text-gray-700 dark:text-gray-300">
            {lobby.hostName}
          </p>
          <div className="flex items-center mt-0.5">
            {lobby.isLive && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></div>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {lobby.isLive ? `${formatViewerCount(lobby.viewers)} viewers` : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  ),
);

LobbyItem.displayName = "LobbyItem";

export default function SideBar() {
  const { user, isAnonymous, loading, signOut } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [messagesPanelOpen, setMessagesPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useSidebar();
  const pathname = usePathname();

  // Auto-close sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname, setIsMobileSidebarOpen]);

  // Listen for unread message count changes when user is authenticated
  useEffect(() => {
    if (!user || isAnonymous) {
      setUnreadCount(0);
      return;
    }

    // Listen for unread count changes
    const unreadCountRef = getUserUnreadCountRef(user.uid);

    const handleUnreadCountUpdate = (snapshot: any) => {
      const count = snapshot.exists() ? snapshot.val() : 0;
      setUnreadCount(count);
    };

    onValue(unreadCountRef, handleUnreadCountUpdate);

    // Clean up listener on unmount
    return () => {
      off(unreadCountRef);
    };
  }, [user, isAnonymous]);

  const toggleMessagesPanel = () => {
    if (!user || isAnonymous) {
      setLoginModalOpen(true);
    } else {
      setMessagesPanelOpen(!messagesPanelOpen);
    }
  };

  return (
    <>

      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 md:top-16 left-0 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white text-gray-800 p-4 overflow-y-auto border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200
          transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? "z-50 translate-x-0" : "z-50 -translate-x-full"}
          md:translate-x-0 md:block md:transition-none
        `}
      >
        {/* Close button on mobile */}
        <div className="flex justify-end mb-4 md:hidden">
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Combined Navigation & Actions Menu */}
        <nav className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <ul className="space-y-2">
            {/* Home Link */}
            <li>
              <Link
                href="/"
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
              >
                <Home size={20} className="text-gray-700 dark:text-gray-400" />
                <span className="font-medium text-base dark:text-gray-200">Home</span>
              </Link>
            </li>
            {/* Messages Button */}
            <li>
              <button
                onClick={toggleMessagesPanel}
                className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-gray-100 transition-colors relative dark:hover:bg-gray-800"
              >
                <MessageSquare size={20} className="text-gray-700 dark:text-gray-400" />
                <span className="font-medium text-base dark:text-gray-200">Messages</span>
                {unreadCount > 0 && (
                  <div className="absolute top-0 left-5 flex items-center justify-center min-w-[20px] h-5 bg-blue-500 text-white text-xs font-bold rounded-full px-1.5">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </div>
                )}
              </button>
            </li>

            {/* Mission Center - Only show for authenticated users */}
            {!loading && user && !isAnonymous && (
              <li>
                <Link
                  href="/missions"
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
                >
                  <Trophy size={20} className="text-yellow-500 dark:text-yellow-400" />
                  <span className="font-medium text-base dark:text-gray-200">Mission Center</span>
                </Link>
              </li>
            )}

            {/* Add Sign In option for anonymous or not logged in users */}
            {!loading && (!user || isAnonymous) && (
              <li>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
                >
                  <LogIn size={20} className="text-blue-500" />
                  <span className="font-medium text-base text-blue-500 dark:text-blue-400">
                    Sign In
                  </span>
                </button>
              </li>
            )}

            {/* Add Log Out option for authenticated users */}
            {!loading && user && !isAnonymous && (
              <li>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
                >
                  <LogOut size={20} className="text-red-500 dark:text-red-400" />
                  <span className="font-medium text-base text-red-500 dark:text-red-400">
                    Log Out
                  </span>
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Recommended Lobbies Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 px-2 dark:text-gray-400">
            Recommended Lobbies
          </h3>
          <ul className="space-y-1">
            {DUMMY_LOBBIES.map((lobby) => (
              <li key={lobby.id}>
                <LobbyItem lobby={lobby} />
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />

      {/* Messages Panel */}
      <MessagePanel
        open={messagesPanelOpen}
        onClose={() => setMessagesPanelOpen(false)}
      />
    </>
  );
}

