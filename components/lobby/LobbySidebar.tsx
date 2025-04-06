"use client";

import React from "react";
import Image from "next/image";
import * as Separator from "@radix-ui/react-separator";
import type { TopUser, TopUsers, LobbySidebarProps } from "./lobby.types";

export default function LobbySidebar({ topUsers, isMobile = false, onClose }: LobbySidebarProps) {
  const sidebarContent = (
    <>
      {!isMobile && (
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-medium flex items-center">
            <span className="mr-2">👑</span>
            Top Users
          </h2>
        </div>
      )}
      
      {/* Users content */}
      <div className="flex-grow overflow-auto">
        {/* Top Gifters section */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Top Gifters</h3>
          <div className="space-y-3">
            {topUsers.gifters.map(user => (
              <div key={user.id} className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image 
                    src={user.avatar} 
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-sm">{user.name}</span>
                  <span className="text-sm text-unicef font-medium">{user.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Separator.Root className="h-px bg-gray-100" />
        
        {/* Top Earners section */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Top Earners</h3>
          <div className="space-y-3">
            {topUsers.earners.map(user => (
              <div key={user.id} className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image 
                    src={user.avatar} 
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-sm">{user.name}</span>
                  <span className="text-sm text-green-600 font-medium">{user.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Separator.Root className="h-px bg-gray-100" />
        
        {/* Recently Joined section */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Recently Joined</h3>
          <div className="space-y-3">
            {topUsers.recentJoined.map(user => (
              <div key={user.id} className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image 
                    src={user.avatar} 
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-sm">{user.name}</span>
                  <span className="text-sm text-gray-400">{user.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute left-0 right-0 bottom-0 bg-white shadow-lg rounded-t-xl transition-transform duration-300 transform ${isMobile ? 'translate-y-0' : 'translate-y-full'} flex flex-col max-h-[80vh]`}>
          {/* Header with close button and handle */}
          <div className="flex flex-col items-center">
            {/* Drag handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full my-3"></div>
            
            <div className="w-full p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-medium flex items-center">
                <span className="mr-2">👑</span>
                Top Users
              </h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Users content */}
          <div className="flex-grow overflow-auto">
            {sidebarContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block md:w-72 bg-white shadow-sm md:flex-col overflow-hidden border-l border-gray-200">
      {sidebarContent}
    </div>
  );
}
