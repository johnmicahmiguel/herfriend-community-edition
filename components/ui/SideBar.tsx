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
} from "lucide-react";
import { useAuth } from "@/lib/context/auth.context";
import { LoginModal } from "@/components/auth/LoginModal";
import MessagePanel from "@/components/messages/MessagePanel";
import { getUserUnreadCountRef } from "@/lib/firebase/database";
import { onValue, off } from "firebase/database";
import { useEffect } from "react";

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
      <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors">
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
          <p className="font-medium text-sm truncate text-gray-700">
            {lobby.hostName}
          </p>
          <div className="flex items-center mt-0.5">
            {lobby.isLive && (
                <div className="w-2 h-2 bg-unicef rounded-full mr-1.5"></div>
            )}
            <p className="text-xs text-gray-600">
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
      <aside className="hidden md:block w-64 bg-white text-gray-800 p-4 overflow-y-auto border-r border-gray-200">
        {/* Combined Navigation & Actions Menu */}
        <nav className="mb-6 pb-4 border-b border-gray-200">
          <ul className="space-y-2">
            {/* Home Link */}
            <li>
              <Link
                href="/"
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Home size={20} className="text-gray-700" />
                <span className="font-medium text-base">Home</span>
              </Link>
            </li>
            {/* Messages Button */}
            <li>
              <button
                onClick={toggleMessagesPanel}
                className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-gray-100 transition-colors relative"
              >
                <MessageSquare size={20} className="text-gray-700" />
                <span className="font-medium text-base">Messages</span>
                {unreadCount > 0 && (
                  <div className="absolute top-0 left-5 flex items-center justify-center min-w-[20px] h-5 bg-unicef text-white text-xs font-bold rounded-full px-1.5">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </div>
                )}
              </button>
            </li>

             {/* Add Sign In option for anonymous or not logged in users */}
            {!loading && (!user || isAnonymous) && (
              <li>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-gray-100 transition-colors"
                >
                  <LogIn size={20} className="text-unicef" />
                  <span className="font-medium text-base text-unicef">
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
                  className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={20} className="text-red-500" />
                  <span className="font-medium text-base text-red-500">
                    Log Out
                  </span>
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Recommended Lobbies Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 px-2">
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
