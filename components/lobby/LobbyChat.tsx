"use client";

import React from "react";
import Image from "next/image";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ChevronRight } from "lucide-react";
import type { ChatMessage, LobbyChatProps } from "./lobby.types";

export default function LobbyChat({ chatMessages }: LobbyChatProps) {
  return (
    <div className="bg-white flex flex-col flex-grow overflow-hidden border-t border-blue-100">
      {/* Chat messages */}
      <ScrollArea.Root className="flex-grow overflow-hidden bg-white">
        <ScrollArea.Viewport className="h-full px-3 md:px-4 py-2 md:py-3">
          <div className="space-y-3 md:space-y-4">
            {chatMessages.map(message => (
              <div key={message.id} className="flex">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0 mr-2 md:mr-3 border-2 border-blue-200">
                  <Image 
                    src={message.avatar} 
                    alt={message.user}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="max-w-[calc(100%-2.5rem)] md:max-w-[calc(100%-3.25rem)]">
                  <div className="flex items-baseline">
                    <span className="font-medium text-xs md:text-sm mr-2 text-blue-700">{message.user}</span>
                    <span className="text-xs text-gray-400">{message.time}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 bg-white p-2 rounded-lg rounded-tl-none border border-blue-100 break-words">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb className="bg-blue-300 rounded w-1.5" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      
      {/* Chat input */}
      <div className="p-2 md:p-3 border-t border-blue-100 flex-shrink-0 bg-white">
        <div className="flex items-center">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 text-xs md:text-sm border border-blue-200 rounded-full px-3 py-1.5 md:px-4 md:py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          />
          <button className="bg-blue-500 text-white p-1.5 md:p-2 rounded-full ml-2 shadow-sm hover:shadow transition-all">
            <ChevronRight size={16} className="md:hidden" />
            <ChevronRight size={18} className="hidden md:block" />
          </button>
        </div>
      </div>
    </div>
  );
}
