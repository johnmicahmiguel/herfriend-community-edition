"use client";

import React from "react";
import Image from "next/image";
import { Gift, Star, Mic, X, User } from "lucide-react";
import UserProfile from "../user/UserProfile";
import type { Cohost, LobbyData, LobbyHostsTabProps } from "./lobby.types";

export default function LobbyHostsTab({
  showProfileModal,
  setShowProfileModal,
  profileUserId,
  setProfileUserId,
  lobbyData,
  speakingUser,
  coHostsMinimized,
  setCoHostsMinimized,
  visibleCoHostId,
  handleCoHostClick,
  coHostRefs,
  showGoalTooltip,
  setShowGoalTooltip,
  goalTooltipContainerRef,
  showPinnedTooltip,
  setShowPinnedTooltip,
  pinnedTooltipContainerRef,
}: LobbyHostsTabProps) {
  return (
    <>
      <div className="bg-blue-50 rounded-lg">
      <div className="flex flex-col md:flex-row">
        {/* Header with minimize/expand button for mobile */}
        <div className="p-4 pb-0 md:hidden flex items-center justify-between">
          <h3 className="text-sm font-medium text-blue-500">Hosts</h3>
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
              <div className={`w-14 h-14 rounded-full overflow-hidden ${speakingUser === lobbyData.hostName ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                <Image
                  src={lobbyData.hostAvatar}
                  alt={lobbyData.hostName}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              {/* Online status indicator */}
              <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                <Star size={10} />
              </span>
              {/* Speaking indicator */}
              {speakingUser === lobbyData.hostName && (
                <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <div className="relative">
                    <Mic size={12} className="text-blue-500" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center">
                <h4 className="text-base font-medium">{lobbyData.hostName}</h4>
                {/* Online indicator */}
                <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <button 
                  onClick={() => {
                    setProfileUserId('host');
                    setShowProfileModal(true);
                  }}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <User size={16} className="cursor-pointer" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{lobbyData.hostBio}</p>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white p-2 rounded-full flex items-center justify-center w-10 h-10 shadow-sm hover:shadow transition-all">
                    <Gift size={18} className="cursor-pointer" />
                  </button>
                  <button className="bg-blue-100 text-blue-500 px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all cursor-pointer">
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

                    {/* Tooltip/Popover for Lobby Goals */}
                    <div className={`absolute right-0 mt-1 w-64 z-10 ${showGoalTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      <div className="relative bg-white rounded-lg shadow-lg border border-blue-200 p-3">
                        {/* Close Button */}
                        <button
                          onClick={() => setShowGoalTooltip(false)}
                          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          aria-label="Close goals popover"
                        >
                          <X size={16} />
                        </button>
                        <h4 className="text-sm font-medium text-blue-500 mb-2 pr-4">Lobby Goals</h4> {/* Added pr-4 for spacing */}
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <span className="ml-2 text-xs font-medium text-blue-500">65%</span>
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

                    {/* Tooltip/Popover for Pinned Announcement */}
                    <div className={`absolute right-0 mt-1 w-64 z-10 ${showPinnedTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      <div className="relative bg-white rounded-lg shadow-lg border border-amber-200 p-3">
                        {/* Close Button */}
                        <button
                          onClick={() => setShowPinnedTooltip(false)}
                          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          aria-label="Close pinned message popover"
                        >
                          <X size={16} />
                        </button>
                        <h4 className="text-sm font-medium text-amber-700 mb-2 pr-4">Pinned Announcement</h4> {/* Added pr-4 for spacing */}
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
          <h3 className="text-sm font-medium text-blue-500 mb-3">Co-hosts</h3>

          {/* Content */}
          <div className="flex items-center space-x-3 mt-1">
            {lobbyData.cohosts.map(host => (
              <div
                key={host.id}
                className="relative"
                ref={(el) => { coHostRefs.current[host.id] = el; }}
                onClick={() => handleCoHostClick(host.id)}
              >
                {/* Avatar - make it clickable */}
                <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${host.online ? 'border-blue-500' : 'border-gray-300'} ${speakingUser === host.name ? 'ring-2 ring-blue-500 ring-offset-1' : ''} ${!host.online ? 'grayscale opacity-75' : ''} cursor-pointer`}>
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
                      <Mic size={10} className="text-blue-500" />
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                )}

                {/* Clickable popover with details */}
                <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-36 transition-all duration-200 z-10 ${visibleCoHostId === host.id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <div className="bg-white rounded-lg shadow-md p-2 text-center border border-gray-200">
                    <div className="flex items-center justify-center">
                      <p className="font-medium text-sm">{host.name}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileUserId(host.id);
                          setShowProfileModal(true);
                        }}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <User size={14} className="cursor-pointer" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{host.specialty}</p>
                    <div className="flex justify-center gap-1 mt-1">
                      <button className={`${host.online ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'} p-1 rounded-full`}>
                        <Gift size={12} className="cursor-pointer" />
                      </button>
                      <button className={`${host.online ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-500'} px-2 py-0.5 rounded-full text-xs cursor-pointer`}>
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
          <div className={`absolute right-0 mt-1 w-64 z-10 ${showGoalTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="relative bg-white rounded-lg shadow-lg border border-blue-200 p-3">
              {/* Close Button */}
              <button
                onClick={() => setShowGoalTooltip(false)}
                className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                aria-label="Close goals popover"
              >
                <X size={16} />
              </button>
              <h4 className="text-sm font-medium text-blue-500 mb-2 pr-4">Lobby Goals</h4> {/* Added pr-4 for spacing */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="ml-2 text-xs font-medium text-blue-500">65%</span>
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

          {/* Tooltip/Popover for Pinned Announcement */}
          <div className={`absolute right-0 mt-1 w-64 z-10 ${showPinnedTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="relative bg-white rounded-lg shadow-lg border border-amber-200 p-3">
              {/* Close Button */}
              <button
                onClick={() => setShowPinnedTooltip(false)}
                className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                aria-label="Close pinned message popover"
              >
                <X size={16} />
              </button>
              <h4 className="text-sm font-medium text-amber-700 mb-2 pr-4">Pinned Announcement</h4> {/* Added pr-4 for spacing */}
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
      {showProfileModal && (
        profileUserId === 'host' ? (
          <UserProfile 
            user={{
              id: 'host',
              name: lobbyData.hostName,
              avatar: lobbyData.hostAvatar,
              bio: lobbyData.hostBio,
              online: true,
              followers: lobbyData.hostFollowers || 0,
              following: lobbyData.hostFollowing || 0,
              socialMedia: lobbyData.hostSocialMedia,
              posts: lobbyData.hostPosts,
              services: lobbyData.hostServices
            }}
            onClose={() => setShowProfileModal(false)}
            open={showProfileModal}
          />
        ) : (
          <UserProfile 
            user={lobbyData.cohosts.find(h => h.id === profileUserId)!}
            onClose={() => setShowProfileModal(false)}
            open={showProfileModal}
          />
        )
      )}
    </>
  );
}
