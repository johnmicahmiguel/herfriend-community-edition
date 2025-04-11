"use client";

import React, { useState, useEffect, useRef } from "react";
import { Users, Trophy, X, Award } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import LobbyHeader from "@/components/lobby/LobbyHeader";
import LobbyTabs from "@/components/lobby/LobbyTabs";
import LobbyChat from "@/components/lobby/LobbyChat";
import LobbySidebar from "@/components/lobby/LobbySidebar";
import { useAuth } from "@/lib/context/auth.context";
import MissionCenterContent from "@/components/user/MissionCenterContent";
import { Mission, UserLevel } from "@/components/user/MissionTypes"; // Import types
import type { ChatMessage } from "@/components/lobby/lobby.types"; // Import type
import BookingNotification from "@/components/user/BookingNotification";
import { getNextUpcomingBooking } from "@/app/(protected)/bookings/page";

// Mock data for Mission Center (replace with actual data fetching later)
const mockDailyMissions: Mission[] = [
  {
    id: "d1",
    title: "Visit a Lobby",
    description: "Join any lobby for at least 5 minutes",
    reward: {
      type: "xp" as const,
      value: 50,
    },
    progress: 1,
    total: 1,
    completed: true,
  },
  {
    id: "d2",
    title: "Send 5 Messages",
    description: "Send messages in any lobby chat",
    reward: {
      type: "xp" as const,
      value: 30,
    },
    progress: 3,
    total: 5,
    completed: false,
  },
];
const mockWeeklyMissions: Mission[] = [
  {
    id: "w1",
    title: "Visit 10 Different Lobbies",
    description: "Explore different lobbies throughout the week",
    reward: {
      type: "xp" as const,
      value: 200,
    },
    progress: 4,
    total: 10,
    completed: false,
  },
  {
    id: "w2",
    title: "Send 50 Messages",
    description: "Be active in lobby chats this week",
    reward: {
      type: "coin" as const,
      value: 100,
    },
    progress: 22,
    total: 50,
    completed: false,
  },
];
const mockOnetimeMissions: Mission[] = [
  {
    id: "o1",
    title: "Create Your Profile",
    description: "Complete your profile with a picture and bio",
    reward: {
      type: "xp" as const,
      value: 100,
    },
    progress: 1,
    total: 1,
    completed: true,
  },
  {
    id: "o3",
    title: "Reach Level 10",
    description: "Continue to complete missions to reach level 10",
    reward: {
      type: "item" as const,
      value: "Exclusive Avatar Frame",
    },
    progress: 3,
    total: 10,
    completed: false,
  },
];
const mockUserLevel: UserLevel = {
  level: 3,
  currentXP: 742,
  requiredXP: 1000,
  progress: 74.2,
};

export default function LobbyPage() {
  const { user, loading, isAnonymous } = useAuth();
  const [activeTab, setActiveTab] = useState("hosts");
  const [speakingUser, setSpeakingUser] = useState("Jane Smith");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [coHostsMinimized, setCoHostsMinimized] = useState(false);
  const [showPinnedTooltip, setShowPinnedTooltip] = useState(false);
  const [showGoalTooltip, setShowGoalTooltip] = useState(false);
  const [visibleCoHostId, setVisibleCoHostId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [missionCenterOpen, setMissionCenterOpen] = useState(false);
  const [showBookingNotification, setShowBookingNotification] = useState(false);
  const [nextBooking, setNextBooking] = useState(getNextUpcomingBooking());

  const coHostRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const goalTooltipContainerRef = useRef<HTMLDivElement | null>(null);
  const pinnedTooltipContainerRef = useRef<HTMLDivElement | null>(null);

  // Dummy data for demonstration
  const lobbyData = {
    title: "Social Experience with Nature",
    description: "Join us to learn more about nature and how it affects our daily lives.",
    schedule: "Every Monday and Wednesday at 7PM EST",
    category: "Education",
    hostName: "Jane Smith",
    hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000",
    hostBio: "Nature enthusiast and educator with 10+ years of experience.",
    hostFollowers: 1245,
    hostFollowing: 87,
    hostSocialMedia: {
      instagram: "https://instagram.com/janesmith",
      twitter: "https://twitter.com/janesmith",
    },
    hostPosts: [
      {
        id: "1",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000",
        caption: "Nature is amazing! Join our next session to learn more about conservation.",
        likes: 124,
        comments: 23,
        timestamp: "2 days ago"
      },
      {
        id: "2",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000",
        caption: "Forest walks and meditation sessions coming next week!",
        likes: 98,
        comments: 14,
        timestamp: "5 days ago"
      }
    ],
    hostServices: [
      {
        title: "1-on-1 Consultation",
        price: "$99",
        description: "Personal consultation session about nature and conservation."
      },
      {
        title: "Group Workshop",
        price: "$49",
        description: "Join our group workshop to learn conservation techniques."
      }
    ],
    cohosts: [
      {
        id: "1",
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000",
        specialty: "Wildlife expert",
        online: true,
        bio: "Wildlife photographer and conservationist with a passion for endangered species.",
        followers: 670,
        following: 42,
        socialMedia: {
          instagram: "https://instagram.com/johndoe",
          twitter: "https://twitter.com/johndoe"
        },
        posts: [
          {
            id: "1",
            image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1000",
            caption: "Sharing my expertise on wildlife preservation.",
            likes: 87,
            comments: 12,
            timestamp: "1 week ago"
          }
        ],
        services: [
          {
            title: "Expert Guidance",
            price: "$79",
            description: "Get expert guidance on environmental topics."
          }
        ]
      },
      {
        id: "2",
        name: "Maria Garcia",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000",
        specialty: "Environmental scientist",
        online: false,
        bio: "PhD in Environmental Sciences with focus on climate change impact.",
        followers: 892,
        following: 150,
        socialMedia: {
          instagram: "https://instagram.com/mariagarcia",
          twitter: "https://twitter.com/mariagarcia"
        },
        posts: [
          {
            id: "1",
            image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=1000",
            caption: "New research on climate change effects on ecosystems.",
            likes: 142,
            comments: 28,
            timestamp: "3 days ago"
          }
        ],
        services: [
          {
            title: "Research Consultation",
            price: "$120",
            description: "Expert consultation on environmental research projects."
          }
        ]
      }
    ],
    viewers: 1245,
    gifts: 345
  };
  
  // Dummy data for chat messages
  const chatMessages: ChatMessage[] = [
    { id: "1", user: "Alex", message: "This is so informative!", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000", time: "2 mins ago", level: 55, badge: "Ultimate Boss" },
    { id: "2", user: "Sarah", message: "I love learning about nature!", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000", time: "5 mins ago", level: 22, badge: "Most Loyal" },
    { id: "3", user: "Michael", message: "Can you explain more about ecosystems?", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000", time: "7 mins ago", level: 8, badge: "Newbie" },
    { id: "4", user: "HostJane", message: "Welcome everyone! Happy to answer questions.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000", time: "1 min ago", level: 32, badge: "Grinder" },
  ];
  
  // Dummy data for side bar
  const sideBarData = {
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
      if (visibleCoHostId) {
        const clickedCoHostRef = coHostRefs.current[visibleCoHostId];
        if (clickedCoHostRef && !clickedCoHostRef.contains(event.target as Node)) {
          setVisibleCoHostId(null);
        }
      }

      if (showGoalTooltip && goalTooltipContainerRef.current && !goalTooltipContainerRef.current.contains(event.target as Node)) {
        setShowGoalTooltip(false);
      }

      if (showPinnedTooltip && pinnedTooltipContainerRef.current && !pinnedTooltipContainerRef.current.contains(event.target as Node)) {
        setShowPinnedTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visibleCoHostId, showGoalTooltip, showPinnedTooltip]);

  // Effect to check for upcoming bookings
  useEffect(() => {
    if (!loading && user && !isAnonymous) {
      // In a real app, this would fetch from an API
      const upcomingBooking = getNextUpcomingBooking();
      if (upcomingBooking) {
        setNextBooking(upcomingBooking);
        setShowBookingNotification(true);
      }
    }
  }, [loading, user, isAnonymous]);

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header section */}
        <LobbyHeader
          title={lobbyData.title}
          category={lobbyData.category}
          viewers={lobbyData.viewers}
          gifts={lobbyData.gifts}
        />

        {/* Main content tabs and chat - Added relative positioning */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <LobbyTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            lobbyData={lobbyData}
            speakingUser={speakingUser}
            coHostsMinimized={coHostsMinimized}
            setCoHostsMinimized={setCoHostsMinimized}
            visibleCoHostId={visibleCoHostId}
            handleCoHostClick={handleCoHostClick}
            coHostRefs={coHostRefs}
            showGoalTooltip={showGoalTooltip}
            setShowGoalTooltip={setShowGoalTooltip}
            goalTooltipContainerRef={goalTooltipContainerRef}
            showPinnedTooltip={showPinnedTooltip}
            setShowPinnedTooltip={setShowPinnedTooltip}
            pinnedTooltipContainerRef={pinnedTooltipContainerRef}
            showProfileModal={showProfileModal}
            setShowProfileModal={setShowProfileModal}
            profileUserId={profileUserId}
            setProfileUserId={setProfileUserId}
          />
          
          {/* Chat section */}
          <LobbyChat chatMessages={chatMessages} />

          {/* Floating Buttons Container - Positioned above chat input */}
          <div className="absolute bottom-20 right-4 z-10 flex flex-col items-end gap-3">
            {/* Mobile Top Users button */}
            <div className="md:hidden">
              <button 
                onClick={() => setShowMobileSidebar(true)}
                className="bg-blue-500 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow" 
                aria-label="View Top Users"
              >
                <Users size={18} />
              </button>
            </div>

            {/* Notification Buttons Row */}
            {!loading && user && !isAnonymous && (
              <div className="flex gap-2">
                {/* Booking Notification Button */}
                {showBookingNotification && nextBooking && (
                  <BookingNotification 
                    booking={nextBooking}
                    visible={showBookingNotification}
                    onDismiss={() => setShowBookingNotification(false)}
                  />
                )}
                
                {/* Mission Center Button */}
                <button 
                  onClick={() => setMissionCenterOpen(true)}
                  className="bg-yellow-500 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" 
                  aria-label="View Mission Center"
                >
                  <Trophy size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <LobbySidebar topUsers={sideBarData} />

      {/* Mobile sidebar */}
      {showMobileSidebar && (
        <LobbySidebar
          topUsers={sideBarData}
          isMobile={true}
          onClose={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Mission Center Dialog */}
      <Dialog.Root open={missionCenterOpen} onOpenChange={setMissionCenterOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="text-amber-500" size={20} />
                <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Mission Center
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <MissionCenterContent 
                dailyMissions={mockDailyMissions}
                weeklyMissions={mockWeeklyMissions}
                onetimeMissions={mockOnetimeMissions}
                userLevel={mockUserLevel}
              />
            </div>
            
            {/* Optional: Add a close button at the bottom if needed */}
            {/* <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium transition-colors">
                  Close
                </button>
              </Dialog.Close>
            </div> */}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
