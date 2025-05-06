"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Gift, Star, Mic, X, User } from "lucide-react";
import UserProfileModal from "../user/UserProfileModal";
import BookingRequestForm from "../messages/BookingRequestForm";
import * as Dialog from "@radix-ui/react-dialog";
import type { Cohost, LobbyData, LobbyHostsTabProps } from "./lobby.types";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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

  // Add state for gift dialog and animation
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [showGiftAnimation, setShowGiftAnimation] = useState(false);
  const [dotLottie, setDotLottie] = React.useState<any>(null);
  const [showGiftFlyToHost, setShowGiftFlyToHost] = useState(false);
  const [giftFlyStyle, setGiftFlyStyle] = useState<any>({});
  // Store refs for all avatars (main host and co-hosts)
  const hostAvatarRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const [flyGiftImage, setFlyGiftImage] = useState<string | null>(null);
  const [giftTargetHostId, setGiftTargetHostId] = useState<string | null>(null);

  // Gift data
  const gifts = [
    {
      key: "blooming-strength",
      name: "Blooming Strength",
      image: "/images/gifts/blooming-strength.png",
      animation: "/images/gifts/blooming-strength.lottie",
    },
    {
      key: "soaring-spirit",
      name: "Soaring Spirit",
      image: "/images/gifts/soaring-spirit.png",
      animation: "/images/gifts/soaring-spirit.lottie",
    },
    {
      key: "voice-amplified",
      name: "Voice Amplified",
      image: "/images/gifts/voice-amplified.png",
      animation: "/images/gifts/voice-amplified.lottie",
    },
  ];

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

  // Handle send gift
  const handleSendGift = () => {
    if (selectedGift && giftTargetHostId) {
      setShowGiftAnimation(true);
      setShowGiftDialog(false);
    }
  };

  // Split cohosts into rows of 4
  const cohostRows = chunkArray(lobbyData.cohosts, 4);

  useEffect(() => {

    // This function will be called when the animation starts playing.
    function onPlay() {
      console.log('Animation start playing');
    }

    // This function will be called when the animation is paused.
    function onPause() {
      console.log('Animation paused');
    }

    // This function will be called when the animation is completed.
    function onComplete() {
      setShowGiftAnimation(false);
      // Fly-to-avatar effect for any host/co-host
      if (selectedGift && giftTargetHostId && hostAvatarRefs.current[giftTargetHostId]) {
        const avatarNode = hostAvatarRefs.current[giftTargetHostId];
        const avatarRect = avatarNode!.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const avatarX = avatarRect.left + avatarRect.width / 2;
        const avatarY = avatarRect.top + avatarRect.height / 2;
        setGiftFlyStyle({
          position: 'fixed',
          left: centerX - 32, // 64x64 image
          top: centerY - 32,
          width: 64,
          height: 64,
          zIndex: 200,
          transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
        });
        setFlyGiftImage(gifts.find(g => g.key === selectedGift)?.image || null);
        setShowGiftFlyToHost(true);
        setTimeout(() => {
          setGiftFlyStyle((prev: any) => ({
            ...prev,
            left: avatarX - 32,
            top: avatarY - 32,
            opacity: 0.7,
            transform: 'scale(0.7)',
          }));
        }, 30);
        setTimeout(() => {
          setShowGiftFlyToHost(false);
          setFlyGiftImage(null);
        }, 900);
      }
      console.log('Animation completed');
    }

    function onFrameChange({currentFrame}: {currentFrame: any}) {
      // console.log('Current frame: ', currentFrame);
    }

    // Listen to events emitted by the DotLottie instance when it is available.
    if (dotLottie) {
      dotLottie.addEventListener('play', onPlay);
      dotLottie.addEventListener('pause', onPause);
      dotLottie.addEventListener('complete', onComplete);
      dotLottie.addEventListener('frame', onFrameChange);
    }

    return () => {
      // Remove event listeners when the component is unmounted.
      if (dotLottie) {
        dotLottie.removeEventListener('play', onPlay);
        dotLottie.removeEventListener('pause', onPause);
        dotLottie.removeEventListener('complete', onComplete);
        dotLottie.removeEventListener('frame', onFrameChange);
      }
    };
  }, [dotLottie]);

  const dotLottieRefCallback = (dotLottie: any) => {
    setDotLottie(dotLottie);
  };

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
            <div className="relative mr-3" ref={el => { hostAvatarRefs.current['host'] = el; }}>
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
                  <button
                    className="bg-blue-500 text-white p-2 rounded-full flex items-center justify-center w-10 h-10 shadow-sm hover:shadow transition-all"
                    onClick={() => { setShowGiftDialog(true); setGiftTargetHostId('host'); }}
                    aria-label="Send Gift"
                  >
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
                    ref={el => { hostAvatarRefs.current[host.id] = el; coHostRefs.current[host.id] = el; }}
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
                          <button 
                            className={`${host.online ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'} p-1 rounded-full`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (host.online) {
                                setShowGiftDialog(true);
                                setGiftTargetHostId(host.id);
                              }
                            }}
                          >
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

      {/* Gift Dialog for Jane Smith (now for any host) */}
      <Dialog.Root open={showGiftDialog} onOpenChange={setShowGiftDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-[350px] bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-6 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <Dialog.Title className="text-lg font-bold mb-4 text-blue-500">Send a Gift</Dialog.Title>
            <div className="flex gap-4 mb-6">
              {gifts.map(gift => (
                <button
                  key={gift.key}
                  className={`flex flex-col items-center border-2 rounded-lg p-2 transition-all focus:outline-none ${selectedGift === gift.key ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
                  onClick={() => setSelectedGift(gift.key)}
                >
                  <img src={gift.image} alt={gift.name} className="w-14 h-14 object-contain mb-1" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{gift.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleSendGift}
              disabled={!selectedGift}
              className={`w-full py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${selectedGift ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'}`}
            >
              Send Gift
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Gift Animation Overlay (Lottie, transparent, auto-dismiss) */}
      {showGiftAnimation && selectedGift && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-transparent">
          <DotLottieReact
            src={gifts.find(g => g.key === selectedGift)?.animation || ""}
            loop={false}
            autoplay={true}
            dotLottieRefCallback={dotLottieRefCallback}
          />
        </div>
      )}
      {/* Fly-to-avatar animation */}
      {showGiftFlyToHost && flyGiftImage && (
        <img
          src={flyGiftImage}
          alt="Gift fly to host"
          style={giftFlyStyle}
        />
      )}
    </>
  );
}
