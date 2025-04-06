"use client";

import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Star } from "lucide-react";
import LobbyHostsTab from "./LobbyHostsTab"; // Import the hosts tab component
import LobbyAboutTab from "./LobbyAboutTab"; // Import the about tab component

// Re-define necessary props based on what LobbyHostsTab and LobbyAboutTab need
interface Cohost {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  online: boolean;
  bio?: string;
  followers?: number;
  following?: number;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  posts?: {
    id: string;
    image: string;
    caption: string;
    likes: number;
    comments: number;
    timestamp: string;
  }[];
  services?: {
    title: string;
    price: string;
    description: string;
  }[];
}

interface LobbyDataForTabs {
  hostName: string;
  hostAvatar: string;
  hostBio: string;
  hostFollowers?: number;
  hostFollowing?: number;
  hostSocialMedia?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  hostServices?: {
    title: string;
    price: string;
    description: string;
  }[];
  hostPosts?: {
    id: string;
    image: string;
    caption: string;
    likes: number;
    comments: number;
    timestamp: string;
  }[];
  cohosts: Cohost[];
  description: string;
  schedule: string;
}

interface LobbyTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lobbyData: LobbyDataForTabs; // Use the combined data type
  speakingUser: string;
  coHostsMinimized: boolean;
  setCoHostsMinimized: (minimized: boolean) => void;
  visibleCoHostId: string | null;
  handleCoHostClick: (hostId: string) => void;
  coHostRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  showGoalTooltip: boolean;
  setShowGoalTooltip: (show: boolean) => void;
  goalTooltipContainerRef: React.RefObject<HTMLDivElement | null>;
  showPinnedTooltip: boolean;
  setShowPinnedTooltip: (show: boolean) => void;
  pinnedTooltipContainerRef: React.RefObject<HTMLDivElement | null>;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  profileUserId: string | null;
  setProfileUserId: (id: string | null) => void;
}

export default function LobbyTabs({
  activeTab,
  setActiveTab,
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
  showProfileModal,
  setShowProfileModal,
  profileUserId,
  setProfileUserId,
}: LobbyTabsProps) {
  return (
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

        {/* Tabs content */}
        <Tabs.Content value="hosts" className="p-3 md:p-4 bg-blue-50">
          <LobbyHostsTab
            lobbyData={lobbyData} // Pass the relevant part of lobbyData
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
        </Tabs.Content>

        <Tabs.Content value="about" className="bg-blue-50 p-3 md:p-4">
          <LobbyAboutTab
            description={lobbyData.description}
            schedule={lobbyData.schedule}
          />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
