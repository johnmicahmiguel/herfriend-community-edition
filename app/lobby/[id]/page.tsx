"use client";

import React, { useState, useEffect, useRef } from "react";
import UserProfile from "@/components/user/UserProfile";
import { Users } from "lucide-react";
import LobbyHeader from "@/components/lobby/LobbyHeader";
import LobbyHostsTab from "@/components/lobby/LobbyHostsTab";
import LobbyAboutTab from "@/components/lobby/LobbyAboutTab";
import LobbyTabs from "@/components/lobby/LobbyTabs";
import LobbyChat from "@/components/lobby/LobbyChat";
import LobbySidebar from "@/components/lobby/LobbySidebar";

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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

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
        <LobbyHeader
          title={lobbyData.title}
          category={lobbyData.category}
          viewers={lobbyData.viewers}
          gifts={lobbyData.gifts}
        />

        {/* Main content tabs and chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
        </div>
      </div>

      {/* Desktop sidebar */}
      <LobbySidebar topUsers={topUsers} />

      {/* Mobile sidebar */}
      {showMobileSidebar && (
        <LobbySidebar
          topUsers={topUsers}
          isMobile={true}
          onClose={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Floating button for mobile */}
      <div className="md:hidden fixed top-20 right-4 z-10">
        <button 
          onClick={() => setShowMobileSidebar(true)}
          className="bg-unicef text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow" 
          aria-label="View Top Users"
        >
          <Users size={18} />
        </button>
      </div>
    </div>
  );
}
