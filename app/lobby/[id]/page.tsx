"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import * as Tabs from "@radix-ui/react-tabs";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import { Users, Gift, ChevronRight, Star, Mic } from "lucide-react";

export default function LobbyPage() {
  const [activeTab, setActiveTab] = useState("hosts");
  // Track speaking state (in a real app, this would be controlled by audio detection)
  const [speakingUser, setSpeakingUser] = useState("Jane Smith");
  // State for mobile sidebar visibility
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  // State for minimizing co-host section
  const [coHostsMinimized, setCoHostsMinimized] = useState(false);
  // State for tooltips visibility (for mobile and desktop click)
  const [showPinnedTooltip, setShowPinnedTooltip] = useState(false);
  const [showGoalTooltip, setShowGoalTooltip] = useState(false);
  const [visibleCoHostId, setVisibleCoHostId] = useState<string | null>(null); // State for co-host popover

  // Refs for click outside detection
  const coHostRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const goalTooltipContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the container including button and popover
  const pinnedTooltipContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the container including button and popover

  // Dummy data for demonstration
  const lobbyData = {
    title: "Social Experience with Nature",
    description: "Join us to learn more about nature and how it affects our daily lives.",
    schedule: "Every Monday and Wednesday at 7PM EST",
    category: "Education",
    hostName: "Jane Smith",
    hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000",
    hostBio: "Nature enthusiast and educator with 10+ years of experience.",
    cohosts: [
      {
        id: "1",
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000",
        specialty: "Wildlife expert",
        online: true
      },
      {
        id: "2",
        name: "Maria Garcia",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000",
        specialty: "Environmental scientist",
        online: false
      }
    ],
    viewers: 1245,
    gifts: 345
  };
  
  // Dummy data for chat messages
  const chatMessages = [
    { id: "1", user: "Alex", message: "This is so informative!", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000", time: "2 mins ago" },
    { id: "2", user: "Sarah", message: "I love learning about nature!", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000", time: "5 mins ago" },
    { id: "3", user: "Michael", message: "Can you explain more about ecosystems?", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000", time: "7 mins ago" }
  ];
  
  // Dummy data for top users
  const topUsers = {
    gifters: [
      { id: "1", name: "David Kim", amount: "$250", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000" },
      { id: "2", name: "Lisa Wang", amount: "$180", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000" }
    ],
    earners: [
      { id: "1", name: "Jane Smith", amount: "$1,200", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000" },
      { id: "2", name: "John Doe", amount: "$850", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000" }
    ],
    recentJoined: [
      { id: "1", name: "Carlos Rodriguez", time: "2 mins ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000" },
      { id: "2", name: "Emma Wilson", time: "5 mins ago", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000" }
    ]
  };

  // Simulate changing speaker every few seconds (for demo purposes)
  React.useEffect(() => {
    const interval = setInterval(() => {
      const speakers = [lobbyData.hostName, ...lobbyData.cohosts.filter(host => host.online).map(host => host.name)];
      const randomIndex = Math.floor(Math.random() * speakers.length);
      setSpeakingUser(speakers[randomIndex]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [lobbyData]);

  const handleCoHostClick = (hostId: string) => {
    setVisibleCoHostId(prevId => (prevId === hostId ? null : hostId));
  };

  // Effect for handling clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Co-host popover
      if (visibleCoHostId) {
        const clickedCoHostRef = coHostRefs.current[visibleCoHostId];
        // Check if the click is outside the specific co-host element that's currently open
        if (clickedCoHostRef && !clickedCoHostRef.contains(event.target as Node)) {
          setVisibleCoHostId(null);
        }
      }

      // Goal tooltip
      if (showGoalTooltip && goalTooltipContainerRef.current && !goalTooltipContainerRef.current.contains(event.target as Node)) {
        setShowGoalTooltip(false);
      }

      // Pinned tooltip
      if (showPinnedTooltip && pinnedTooltipContainerRef.current && !pinnedTooltipContainerRef.current.contains(event.target as Node)) {
        setShowPinnedTooltip(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    // Remove event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // Dependencies: Re-run if the visibility states change
  }, [visibleCoHostId, showGoalTooltip, showPinnedTooltip]);

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-gray-50">
      {/* Main content area - Removed pb-14 since we're using a floating button instead */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header section */}
        <div className="bg-white shadow-sm p-3 md:p-4">
          <h1 className="text-xl md:text-2xl font-bold text-unicef">{lobbyData.title}</h1>
          <div className="flex flex-wrap items-center mt-2 gap-y-2">
            <span className="bg-unicef text-white text-xs md:text-sm px-2 md:px-3 py-0.5 rounded-md mr-3 md:mr-4">{lobbyData.category}</span>
            <div className="flex items-center text-gray-600 text-xs md:text-sm mr-3 md:mr-4">
              <Users size={14} className="mr-1" />
              <span>{lobbyData.viewers} viewers</span>
            </div>
            <div className="flex items-center text-gray-600 text-xs md:text-sm">
              <Gift size={14} className="mr-1" />
              <span>{lobbyData.gifts} gifts</span>
            </div>
          </div>
        </div>

        {/* Main content tabs and chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs navigation */}
          <div className="bg-white flex-shrink-0">
            <Tabs.Root 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <Tabs.List className="flex border-b border-gray-200">
                <Tabs.Trigger 
                  value="hosts" 
                  className={`flex-1 py-2 md:py-3 text-sm md:text-base font-medium ${activeTab === "hosts" ? "text-unicef border-b-2 border-unicef relative -mb-[2px]" : "text-gray-600"}`}
                >
                  <Star size={16} className="inline mr-1 md:mr-2" />
                  Hosts
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="about" 
                  className={`flex-1 py-2 md:py-3 text-sm md:text-base font-medium ${activeTab === "about" ? "text-unicef border-b-2 border-unicef relative -mb-[2px]" : "text-gray-600"}`}
                >
                  About
                </Tabs.Trigger>
              </Tabs.List>

              {/* Tabs content - removed nested scrollbar container */}
              <Tabs.Content value="hosts" className="p-3 md:p-4 bg-blue-50">
                {/* Hosts section in a single container */}
                <div className="bg-blue-50 rounded-lg">
                  <div className="flex flex-col md:flex-row">
                    {/* Header with minimize/expand button for mobile */}
                    <div className="p-4 pb-0 md:hidden flex items-center justify-between">
                      <h3 className="text-sm font-medium text-unicef">Hosts</h3>
                      <button 
                        onClick={() => setCoHostsMinimized(!coHostsMinimized)}
                        className="text-blue-600 text-xs flex items-center"
                      >
                        Co-hosts {coHostsMinimized ? 'Show' : 'Hide'}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ml-1 transition-transform ${coHostsMinimized ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Left side - Main Host */}
                    <div className="md:w-1/2 p-4 pt-2 md:pt-4">
                      
                      
                      <div className="flex items-start">
                        <div className="relative mr-3">
                          {/* Avatar with speaking indicator */}
                          <div className={`w-14 h-14 rounded-full overflow-hidden ${speakingUser === lobbyData.hostName ? 'ring-2 ring-unicef ring-offset-2' : ''}`}>
                            <Image 
                              src={lobbyData.hostAvatar} 
                              alt={lobbyData.hostName}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          {/* Online status indicator */}
                          <span className="absolute bottom-0 right-0 bg-unicef text-white p-1 rounded-full">
                            <Star size={10} />
                          </span>
                          {/* Speaking indicator */}
                          {speakingUser === lobbyData.hostName && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                              <div className="relative">
                                <Mic size={12} className="text-unicef" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-unicef rounded-full animate-pulse"></span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="text-base font-medium">{lobbyData.hostName}</h4>
                            {/* Online indicator */}
                            <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{lobbyData.hostBio}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <button className="bg-unicef text-white p-2 rounded-full flex items-center justify-center w-10 h-10 shadow-sm hover:shadow transition-all">
                                <Gift size={18} />
                              </button>
                              <button className="bg-blue-100 text-unicef px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all">
                                Book
                              </button>
                            </div>
                            
                            {/* Action buttons moved to main host section for mobile */}
                            <div className="md:hidden flex">
                              {/* Lobby Goals Icon Button Container */}
                              <div className="relative" ref={goalTooltipContainerRef}>
                                <button
                                  onClick={() => setShowGoalTooltip(!showGoalTooltip)}
                                  className="bg-blue-200 hover:bg-blue-300 text-blue-700 p-2 rounded-full border border-blue-300 flex items-center justify-center shadow-sm mx-1 cursor-pointer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                </button>
                                
                                {/* Tooltip/Popover for Lobby Goals - appears on click */}
                                <div className={`absolute right-0 mt-1 w-64 transition-all duration-200 z-10 ${showGoalTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                  <div className="bg-white rounded-lg shadow-lg border border-blue-200 p-3">
                                    <h4 className="text-sm font-medium text-unicef mb-2">Lobby Goals</h4>
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                          <div className="h-full bg-unicef rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <span className="ml-2 text-xs font-medium text-unicef">65%</span>
                                      </div>
                                      <p className="text-xs text-gray-600">Help us reach our goal of 10,000 participants!</p>
                                      <div className="flex items-center justify-between text-xs">
                                        <span>6,500 joined</span>
                                        <span>10,000 goal</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Pinned Announcement Icon Button Container */}
                              <div className="relative" ref={pinnedTooltipContainerRef}>
                                <button
                                  onClick={() => setShowPinnedTooltip(!showPinnedTooltip)}
                                  className="bg-amber-200 hover:bg-amber-300 text-amber-700 p-2 rounded-full border border-amber-300 flex items-center justify-center shadow-sm mx-1 cursor-pointer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                
                                {/* Tooltip/Popover for Pinned Announcement - appears on click */}
                                <div className={`absolute right-0 mt-1 w-64 transition-all duration-200 z-10 ${showPinnedTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                  <div className="bg-white rounded-lg shadow-lg border border-amber-200 p-3">
                                    <h4 className="text-sm font-medium text-amber-700 mb-2">Pinned Announcement</h4>
                                    <div className="bg-amber-100 p-2 rounded border border-amber-200">
                                      <p className="text-xs text-gray-800">🎉 Special guest joining next Monday! Wildlife photographer James Wilson will share his latest expedition photos.</p>
                                      <div className="mt-1 flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Posted 2 days ago</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Co-hosts - completely hidden on mobile when minimized */}
                    <div className={`md:w-1/2 p-4 ${coHostsMinimized ? 'hidden md:block' : 'block'}`}>
                      <h3 className="text-sm font-medium text-unicef mb-3">Co-hosts</h3>
                      
                      {/* Content */}
                      <div className="flex items-center space-x-3 mt-1">
                        {lobbyData.cohosts.map(host => (
                          <div 
                            key={host.id}
                            className="relative"
                            // Correct ref assignment: ensure the callback returns void
                            ref={(el) => { coHostRefs.current[host.id] = el; }}
                            onClick={() => handleCoHostClick(host.id)} // Keep onClick handler
                          >
                            {/* Avatar - make it clickable */}
                            <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${host.online ? 'border-unicef' : 'border-gray-300'} ${speakingUser === host.name ? 'ring-2 ring-unicef ring-offset-1' : ''} ${!host.online ? 'grayscale opacity-75' : ''} cursor-pointer`}>
                              <Image
                                src={host.avatar}
                                alt={host.name}
                                width={56}
                                height={56}
                                className="object-cover"
                              />
                            </div>
                            
                            {/* Speaking indicator */}
                            {speakingUser === host.name && host.online && (
                              <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <div className="relative">
                                  <Mic size={10} className="text-unicef" />
                                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-unicef rounded-full animate-pulse"></span>
                                </div>
                              </div>
                            )}
                            
                            {/* Clickable popover with details */}
                            <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-36 transition-all duration-200 z-10 ${visibleCoHostId === host.id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                              <div className="bg-white rounded-lg shadow-md p-2 text-center border border-gray-200">
                                <p className="font-medium text-sm">{host.name}</p>
                                <p className="text-xs text-gray-600 mb-1">{host.specialty}</p>
                                <div className="flex justify-center gap-1 mt-1">
                                  <button className={`${host.online ? 'bg-unicef text-white' : 'bg-gray-200 text-gray-500'} p-1 rounded-full`}>
                                    <Gift size={12} />
                                  </button>
                                  <button className={`${host.online ? 'bg-blue-100 text-unicef' : 'bg-gray-200 text-gray-500'} px-2 py-0.5 rounded-full text-xs`}>
                                    Book
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add more hosts button */}
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center text-blue-400 hover:bg-blue-100 cursor-pointer transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons aligned to right - only visible on desktop */}
                  <div className="hidden md:flex justify-end px-4 pb-3">
                    {/* Lobby Goals Icon Button Container */}
                    <div className="relative" ref={goalTooltipContainerRef}>
                      <button
                        onClick={() => setShowGoalTooltip(!showGoalTooltip)}
                        className="bg-blue-200 hover:bg-blue-300 text-blue-700 p-2 rounded-full border border-blue-300 flex items-center justify-center shadow-sm mx-1 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </button>
                      
                      {/* Tooltip/Popover for Lobby Goals - appears on click */}
                      <div className={`absolute right-0 mt-1 w-64 transition-all duration-200 z-10 ${showGoalTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                        <div className="bg-white rounded-lg shadow-lg border border-blue-200 p-3">
                          <h4 className="text-sm font-medium text-unicef mb-2">Lobby Goals</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-unicef rounded-full" style={{ width: '65%' }}></div>
                              </div>
                              <span className="ml-2 text-xs font-medium text-unicef">65%</span>
                            </div>
                            <p className="text-xs text-gray-600">Help us reach our goal of 10,000 participants!</p>
                            <div className="flex items-center justify-between text-xs">
                              <span>6,500 joined</span>
                              <span>10,000 goal</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Pinned Announcement Icon Button Container */}
                    <div className="relative" ref={pinnedTooltipContainerRef}>
                      <button
                        onClick={() => setShowPinnedTooltip(!showPinnedTooltip)}
                        className="bg-amber-200 hover:bg-amber-300 text-amber-700 p-2 rounded-full border border-amber-300 flex items-center justify-center shadow-sm mx-1 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      {/* Tooltip/Popover for Pinned Announcement - appears on click */}
                      <div className={`absolute right-0 mt-1 w-64 transition-all duration-200 z-10 ${showPinnedTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                        <div className="bg-white rounded-lg shadow-lg border border-amber-200 p-3">
                          <h4 className="text-sm font-medium text-amber-700 mb-2">Pinned Announcement</h4>
                          <div className="bg-amber-100 p-2 rounded border border-amber-200">
                            <p className="text-xs text-gray-800">🎉 Special guest joining next Monday! Wildlife photographer James Wilson will share his latest expedition photos.</p>
                            <div className="mt-1 flex justify-between items-center">
                              <span className="text-xs text-gray-500">Posted 2 days ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              {/* About tab content */}
              <Tabs.Content value="about" className="bg-blue-50 p-3 md:p-4">
                <h3 className="text-sm md:text-base font-medium mb-2 text-unicef">About this Lobby</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">{lobbyData.description}</p>
                
                <h3 className="text-sm md:text-base font-medium mb-2 text-unicef">Schedule</h3>
                <p className="text-xs md:text-sm text-gray-600">{lobbyData.schedule}</p>
              </Tabs.Content>
            </Tabs.Root>
          </div>
          
          {/* Chat section - removed header, using border for separation */}
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
                  className="flex-1 text-xs md:text-sm border border-blue-200 rounded-full px-3 py-1.5 md:px-4 md:py-2 focus:outline-none focus:border-unicef focus:ring-1 focus:ring-unicef bg-white"
                />
                <button className="bg-unicef text-white p-1.5 md:p-2 rounded-full ml-2 shadow-sm hover:shadow transition-all">
                  <ChevronRight size={16} className="md:hidden" />
                  <ChevronRight size={18} className="hidden md:block" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - desktop version */}
      <div className="hidden md:block md:w-72 bg-white shadow-sm md:flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-medium flex items-center">
            <span className="mr-2">👑</span>
            Top Users
          </h2>
        </div>
        
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
      </div>
      
      {/* Mobile bottom sheet - only visible when toggled */}
      <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${showMobileSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute left-0 right-0 bottom-0 bg-white shadow-lg rounded-t-xl transition-transform duration-300 transform ${showMobileSidebar ? 'translate-y-0' : 'translate-y-full'} flex flex-col max-h-[80vh]`}>
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
                onClick={() => setShowMobileSidebar(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Users content - same as desktop sidebar */}
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
        </div>
      </div>
      
      {/* Floating button for mobile - only visible on mobile */}
      <div className="md:hidden fixed top-20 right-4 z-10"> {/* Moved from bottom-4 to top-20 */}
        <button 
          onClick={() => setShowMobileSidebar(true)}
          className="bg-unicef text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow" 
          aria-label="View Top Users"
        >
          <Users size={18} /> {/* Reduced icon size from 20 to 16 */}
        </button>
      </div>
    </div>
  );
}
