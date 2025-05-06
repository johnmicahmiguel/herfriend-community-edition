"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gift, Star, Mic, X, User } from "lucide-react";
import UserProfileModal from "../user/UserProfileModal";
import BookingRequestForm from "../messages/BookingRequestForm";
import * as Dialog from "@radix-ui/react-dialog";
import type { Cohost, LobbyData, LobbyHostsTabProps } from "./lobby.types";

// Helper function to chunk array
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

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
}: LobbyHostsTabProps) {
  // Add state for booking form
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingHost, setBookingHost] = useState<{
    id: string;
    name: string;
    avatar: string;
    services?: Array<{title: string, price: string, description: string}>;
  } | null>(null);

  // Handle booking dialog open
  const handleBookClick = (host: any, isMainHost = false) => {
    setBookingHost({
      id: isMainHost ? 'host' : host.id,
      name: isMainHost ? lobbyData.hostName : host.name,
      avatar: isMainHost ? lobbyData.hostAvatar : host.avatar,
      services: isMainHost ? lobbyData.hostServices : host.services
    });
    setShowBookingForm(true);
  };

  // Handle booking request submission
  const handleBookingRequest = (bookingData: any, note?: string) => {
    console.log("Creating booking request:", bookingData, note);
    console.log("For host:", bookingHost);
    // In a real implementation, this would:
    // 1. Save booking data to database
    // 2. Create a booking message in the chat (if messaging the host)
    // 3. Notify the host
    setShowBookingForm(false);
  };

  // Split cohosts into rows of 4
  const cohostRows = chunkArray(lobbyData.cohosts, 4);

  return (
    <>
      <div className="bg-blue-50 dark:bg-gray-800 rounded-lg">
      <div className="flex flex-col md:flex-row">
        {/* Header with minimize/expand button for mobile */}
        <div className="p-4 pb-0 md:hidden flex items-center justify-between">
          <h3 className="text-sm font-medium text-blue-500 dark:text-blue-400">Hosts</h3>
          <button
            onClick={() => setCoHostsMinimized(!coHostsMinimized)}
            className="text-blue-600 dark:text-blue-400 text-xs flex items-center"
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
              <div className={`w-14 h-14 rounded-full overflow-hidden ${speakingUser === lobbyData.hostName ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''}`}>
                <Image
                  src={"https://randomuser.me/api/portraits/women/44.jpg"}
                  alt={"Jane Smith"}
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
                <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-700 rounded-full p-0.5 shadow-sm">
                  <div className="relative">
                    <Mic size={12} className="text-blue-500" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center">
                <h4 className="text-base font-medium dark:text-gray-100">Jane Smith</h4>
                {/* Online indicator */}
                <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <button 
                  onClick={() => {
                    setProfileUserId('host');
                    setShowProfileModal(true);
                  }}
                  className="ml-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  <User size={16} className="cursor-pointer" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Hi! I'm Jane Smith, a passionate explorer and creator of social experiments with nature. My mission is to connect people with the outdoors, foster curiosity, and inspire positive change through immersive, interactive experiences. Join me as we discover the wonders of the natural world together!
              </p>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white p-2 rounded-full flex items-center justify-center w-10 h-10 shadow-sm hover:shadow transition-all">
                    <Gift size={18} className="cursor-pointer" />
                  </button>
                  <button 
                    onClick={() => handleBookClick(null, true)}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Co-hosts - completely hidden on mobile when minimized */}
        <div className={`md:w-1/2 p-4 ${coHostsMinimized ? 'hidden md:block' : 'block'}`}>
          <h3 className="text-sm font-medium text-blue-500 dark:text-blue-400 mb-3">Co-hosts</h3>

          {/* Content */}
          <div className="flex flex-col gap-4 mt-1">
            {cohostRows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center justify-start gap-3">
                {row.map(host => (
                  <div
                    key={host.id}
                    className="relative"
                    ref={(el) => { coHostRefs.current[host.id] = el; }}
                    onClick={() => handleCoHostClick(host.id)}
                  >
                    {/* Avatar - make it clickable */}
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${host.online ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'} ${speakingUser === host.name ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800' : ''} ${!host.online ? 'grayscale opacity-75' : ''} cursor-pointer`}>
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
                      <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-700 rounded-full p-0.5 shadow-sm">
                        <div className="relative">
                          <Mic size={10} className="text-blue-500" />
                          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                        </div>
                      </div>
                    )}

                    {/* Clickable popover with details */}
                    <div className={`absolute right-full mr-2 top-1/2 -translate-y-1/2 w-36 transition-all duration-200 z-10 ${visibleCoHostId === host.id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 text-center border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center">
                          <p className="font-medium text-sm dark:text-gray-200">{host.name}</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfileUserId(host.id);
                              setShowProfileModal(true);
                            }}
                            className="ml-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                          >
                            <User size={14} className="cursor-pointer" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{host.specialty}</p>
                        <div className="flex justify-center gap-1 mt-1">
                          <button className={`${host.online ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'} p-1 rounded-full`}>
                            <Gift size={12} className="cursor-pointer" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (host.online) {
                                handleBookClick(host);
                              }
                            }}
                            className={`${host.online ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'} px-2 py-0.5 rounded-full text-xs cursor-pointer`}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add more hosts button (only on last row) */}
                {rowIdx === cohostRows.length - 1 && (
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-blue-300 dark:border-blue-600 flex items-center justify-center text-blue-400 dark:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* User Profile Modal */}
      {showProfileModal && (
        profileUserId === 'host' ? (
          <UserProfileModal 
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
          <UserProfileModal 
            user={lobbyData.cohosts.find(h => h.id === profileUserId)!}
            onClose={() => setShowProfileModal(false)}
            open={showProfileModal}
          />
        )
      )}

      {/* Booking Form Dialog */}
      <Dialog.Root open={showBookingForm} onOpenChange={setShowBookingForm}>
        {bookingHost && (
          <Dialog.Portal>
            <BookingRequestForm 
              hostId={bookingHost.id}
              hostName={bookingHost.name}
              hostAvatar={bookingHost.avatar}
              services={bookingHost.services?.map(service => ({
                title: service.title,
                price: service.price,
                description: service.description
              }))}
              onSubmit={handleBookingRequest}
              onCancel={() => setShowBookingForm(false)}
            />
          </Dialog.Portal>
        )}
      </Dialog.Root>
    </>
  );
}
