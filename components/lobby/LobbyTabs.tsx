"use client";

import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Star } from "lucide-react";
import LobbyHostsTab from "./LobbyHostsTab";
import LobbyAboutTab from "./LobbyAboutTab";
import type { Cohost, LobbyData, LobbyTabsProps } from "./lobby.types";

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
  hideHostsTab = false,
  defaultTab = "hosts",
}: LobbyTabsProps & { hideHostsTab?: boolean; defaultTab?: "hosts" | "about" }) {
  // If the activeTab is not in the available tabs, set it to defaultTab
  React.useEffect(() => {
    if (hideHostsTab && activeTab === "hosts") {
      setActiveTab("about");
    }
  }, [hideHostsTab, activeTab, setActiveTab]);

  return (
    <div className="bg-white dark:bg-gray-800 flex-shrink-0 flex-1 flex flex-col overflow-hidden">
      <Tabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-full flex-1 flex flex-col overflow-hidden"
      >
        <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700">
          {!hideHostsTab && (
            <Tabs.Trigger
              value="hosts"
              className={`flex-1 py-2 md:py-3 text-sm md:text-base font-medium ${activeTab === "hosts" ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" : "text-gray-600 dark:text-gray-300"}`}
            >
              <Star size={16} className="inline mr-1 md:mr-2" />
              Hosts
            </Tabs.Trigger>
          )}
          <Tabs.Trigger
            value="about"
            className={`flex-1 py-2 md:py-3 text-sm md:text-base font-medium ${activeTab === "about" ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" : "text-gray-600 dark:text-gray-300"}`}
          >
            About
          </Tabs.Trigger>
        </Tabs.List>
        {/* Tabs content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!hideHostsTab && (
            <Tabs.Content value="hosts" className="flex-1 flex flex-col p-3 md:p-4 bg-blue-50 dark:bg-gray-800 overflow-auto">
              <LobbyHostsTab
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
            </Tabs.Content>
          )}
          <Tabs.Content value="about" className="flex-1 flex flex-col bg-blue-50 dark:bg-gray-800 p-3 md:p-4 overflow-auto">
            <LobbyAboutTab
              description={lobbyData.description ?? ""}
              schedule={lobbyData.schedule ?? ""}
            />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
