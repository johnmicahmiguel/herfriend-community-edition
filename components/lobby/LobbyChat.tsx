"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ChevronRight, User } from "lucide-react";
import UserProfileModal from "../user/UserProfileModal";
import type { ChatMessage, LobbyChatProps } from "./lobby.types";

// Helper function to get badge styling based on text and level
const getBadgeStyle = (badgeText: string, level: number): string => {
  let baseClasses = "text-xs font-semibold px-1.5 py-0.5 rounded-full ";
  let colorClasses = "";

  // Determine base color by badge text
  switch (badgeText.toLowerCase()) {
    case "ultimate boss":
      colorClasses = "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
      break;
    case "most loyal":
      colorClasses = "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
      break;
    case "grinder":
      colorClasses = "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300";
      break;
    case "newbie":
      colorClasses = "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
      break;
    case "host": // Example for host badge
      colorClasses = "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300";
      break;
    default: // Default color if badge text doesn't match
      colorClasses = "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300";
  }

  // Enhance style based on level
  if (level >= 50) {
    // Make high-level badges brighter/bolder - adjust classes as needed
    // Example: Add a subtle border or slightly different shade
    //colorClasses += " ring-1 ring-offset-1 ring-yellow-400 dark:ring-yellow-500 dark:ring-offset-gray-800"; // Add a ring for very high levels
  } else if (level >= 30) {
    // Slightly enhance mid-level badges
    // Example: use a slightly darker text color
    colorClasses = colorClasses.replace("700", "800").replace("300", "200"); 
  }

  return baseClasses + colorClasses;
};

export default function LobbyChat({ chatMessages }: LobbyChatProps) {
  const [visiblePopoverId, setVisiblePopoverId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (visiblePopoverId === null) return;

      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setVisiblePopoverId(null);
      }
    }

    if (visiblePopoverId !== null) {
        document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visiblePopoverId]);

  return (
    <div className="bg-white dark:bg-gray-800 flex flex-col flex-grow overflow-hidden border-t border-blue-100 dark:border-gray-700">
      {/* Chat messages */}
      <ScrollArea.Root className="flex-grow bg-white dark:bg-gray-800">
        <ScrollArea.Viewport className="h-full px-3 md:px-4 py-2 md:py-3">
          <div className="space-y-3 md:space-y-4">
            {chatMessages.map(message => {
              // Get dynamic styles for level and badge
              const levelStyle = "text-xs font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
              const badgeStyle = message.badge && message.level !== undefined 
                                 ? getBadgeStyle(message.badge, message.level)
                                 : "";
              
              return (
                <div key={message.id} className="flex relative">
                  {/* Profile Image with popover trigger */}
                  <button 
                    ref={triggerRef}
                    onClick={() => setVisiblePopoverId(visiblePopoverId === message.id ? null : message.id)}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0 mr-2 md:mr-3 border-2 border-blue-200 dark:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer"
                  >
                    <Image 
                      src={message.avatar} 
                      alt={message.user}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </button>
                  <div className="max-w-[calc(100%-2.5rem)] md:max-w-[calc(100%-3.25rem)]">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      {/* User Level Badge */}
                      {message.level !== undefined && (
                        <span className={levelStyle}>
                          Lv {message.level}
                        </span>
                      )}
                      
                      {/* Username (now a span) */}
                      <span 
                        className="font-medium text-xs md:text-sm text-blue-700 dark:text-blue-400 break-all"
                      >
                        {message.user}
                      </span>
                      
                      {/* User Badge Text Tag (Dynamic Style) */}
                      {message.badge && badgeStyle && (
                        <span className={badgeStyle} title={`Badge: ${message.badge}`}>
                          {message.badge}
                        </span>
                      )}
                      
                      {/* Timestamp */}
                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{message.time}</span>
                    </div>
                    <p className="mt-1 text-xs md:text-sm text-gray-700 dark:text-gray-200 p-2 rounded-lg rounded-tl-none break-words">{message.message}</p>
                  </div>
                  
                  {/* Popover for username */}
                  <div 
                    ref={popoverRef}
                    className={`absolute left-12 top-0 w-36 transition-all duration-200 z-50 ${visiblePopoverId === message.id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 text-center border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-center">
                        <p className="font-medium text-sm dark:text-gray-200">{message.user}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileUserId(message.id);
                            setShowProfileModal(true);
                          }}
                          className="ml-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                        >
                          <User size={14} className="cursor-pointer" />
                        </button>
                      </div>
                      {message.badge && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 mt-1">{message.badge}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb className="bg-blue-300 dark:bg-blue-600 rounded w-1.5" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      
      {/* Chat input */}
      <div className="p-2 md:p-3 border-t border-blue-100 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 text-xs md:text-sm border border-blue-200 dark:border-gray-600 rounded-full px-3 py-1.5 md:px-4 md:py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
          />
          <button className="bg-blue-500 text-white p-1.5 md:p-2 rounded-full ml-2 shadow-sm hover:shadow transition-all cursor-pointer">
            <ChevronRight size={16} className="md:hidden" />
            <ChevronRight size={18} className="hidden md:block" />
          </button>
        </div>
      </div>
      
      {showProfileModal && profileUserId && (
        <UserProfileModal 
          user={{
            id: profileUserId,
            name: chatMessages.find(m => m.id === profileUserId)?.user || '',
            avatar: chatMessages.find(m => m.id === profileUserId)?.avatar || '',
            online: true, // Add online status
            // Add other properties like bio, followers, etc. as needed
          }}
          onClose={() => setShowProfileModal(false)}
          open={showProfileModal}
        />
      )}
    </div>
  );
}
