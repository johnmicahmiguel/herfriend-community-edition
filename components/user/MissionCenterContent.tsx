"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trophy, Star, Calendar, CheckCircle, ChevronsUp, Gift, Clock, Info, AlertCircle, Award, X } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import MissionCard from "./MissionCard";
import { Mission, MissionType, UserLevel } from "./MissionTypes";
import RewardDetails, { Reward, RewardType } from "./RewardDetails";

// Level rewards data
const LEVEL_REWARDS: Reward[] = [
  { level: 10, reward: "Bronze Avatar Frame", type: "frame", icon: "🖼️" },
  { level: 20, reward: "Social Butterfly Badge", type: "badge", icon: "🦋" },
  { level: 30, reward: "Silver Avatar Frame", type: "frame", icon: "🖼️" },
  { level: 40, reward: "Companion Pet", type: "pet", icon: "🐶" },
  { level: 50, reward: "Gold Avatar Frame", type: "frame", icon: "🖼️" },
  { level: 60, reward: "Custom Emotes Pack", type: "emotes", icon: "😎" },
  { level: 70, reward: "Platinum Avatar Frame", type: "frame", icon: "🖼️" },
  { level: 80, reward: "Rare Companion Pet", type: "pet", icon: "🐉" },
  { level: 90, reward: "Diamond Avatar Frame", type: "frame", icon: "🖼️" },
  { level: 100, reward: "Legendary Badge & Title", type: "badge", icon: "👑" },
];

interface MissionCenterContentProps {
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  onetimeMissions: Mission[];
  userLevel: UserLevel;
  className?: string;
}

export default function MissionCenterContent({
  dailyMissions,
  weeklyMissions,
  onetimeMissions,
  userLevel,
  className = "",
}: MissionCenterContentProps) {
  const [activeTab, setActiveTab] = useState<MissionType>("daily");
  const [rewardsDialogOpen, setRewardsDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [levelInfoOpen, setLevelInfoOpen] = useState(false);
  
  // Find next reward
  const nextReward = LEVEL_REWARDS.find(reward => reward.level > userLevel.level) || LEVEL_REWARDS[LEVEL_REWARDS.length - 1];
  const prevReward = [...LEVEL_REWARDS].reverse().find(reward => reward.level <= userLevel.level);
  
  // Handle clicking on a reward in the rewards gallery
  const handleRewardClick = (reward: Reward) => {
    setSelectedReward(reward);
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full overflow-hidden max-h-[90vh] flex flex-col ${className}`}>
      {/* Header - User Level */}
      <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                {userLevel.level}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white p-1 rounded-full">
                <ChevronsUp size={16} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold dark:text-gray-100">Level {userLevel.level}</h2>
                
                {/* Level Info Popover (on click) */}
                <Popover.Root open={levelInfoOpen} onOpenChange={setLevelInfoOpen}>
                  <Popover.Trigger asChild>
                    <button className="flex items-center justify-center h-6 px-2 text-xs font-medium bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300 rounded-full transition-colors">
                      <Info size={12} className="mr-1" />
                      View Rewards
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content 
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-80 z-50"
                      sideOffset={5}
                    >
                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">Level Progression</h3>
                        
                        {/* Current rewards */}
                        {prevReward && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                              <CheckCircle size={14} />
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">
                              Unlocked at Level {prevReward.level}: <span className="font-medium">{prevReward.reward}</span> {prevReward.icon}
                            </span>
                          </div>
                        )}
                        
                        {/* Next reward */}
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                            <AlertCircle size={14} />
                          </div>
                          <span className="text-gray-600 dark:text-gray-300">
                            Next reward at Level {nextReward.level}: <span className="font-medium">{nextReward.reward}</span> {nextReward.icon}
                          </span>
                        </div>
                        
                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        
                        {/* Level milestones */}
                        <div className="space-y-1">
                          <h4 className="font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase">LEVEL MILESTONES</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {LEVEL_REWARDS.map((reward) => (
                              <div 
                                key={reward.level} 
                                className={`text-xs p-1.5 rounded-md flex items-center gap-1.5 ${
                                  userLevel.level >= reward.level
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                <span className="flex-shrink-0">{reward.icon}</span>
                                <span className="truncate">Level {reward.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setLevelInfoOpen(false);
                            setRewardsDialogOpen(true);
                          }}
                          className="w-full py-2 mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-sm transition-colors"
                        >
                          View All Rewards
                        </button>
                      </div>
                      <Popover.Arrow className="fill-white dark:fill-gray-800" />
                      <Popover.Close className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <X size={16} />
                      </Popover.Close>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>
              
              <div className="flex flex-col mt-1 w-full">
                <div className="flex items-center w-full">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full mr-2">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${userLevel.progress}%` }}
                    ></div>
                  </div>
                  <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {userLevel.currentXP}/{userLevel.requiredXP} XP
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
            <Trophy className="text-blue-500" size={18} />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Mission Center</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root
        defaultValue="daily"
        className="flex-1 flex flex-col overflow-hidden"
        onValueChange={(value) => setActiveTab(value as MissionType)}
        value={activeTab}
      >
        <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700">
          <Tabs.Trigger
            value="daily"
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === "daily" 
                ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" 
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <Clock size={16} />
            Daily
          </Tabs.Trigger>
          <Tabs.Trigger
            value="weekly"
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === "weekly" 
                ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" 
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <Calendar size={16} />
            Weekly
          </Tabs.Trigger>
          <Tabs.Trigger
            value="onetime"
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === "onetime" 
                ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" 
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <Star size={16} />
            One-Time
          </Tabs.Trigger>
        </Tabs.List>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-800">
          <Tabs.Content value="daily" className="space-y-4 outline-none">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Resets in 12:34:56</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Completed: {dailyMissions.filter(m => m.completed).length}/{dailyMissions.length}
              </div>
            </div>
            
            {dailyMissions.map(mission => (
              <MissionCard key={mission.id} mission={mission} type="daily" />
            ))}
          </Tabs.Content>

          <Tabs.Content value="weekly" className="space-y-4 outline-none">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Resets in 3 days</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Completed: {weeklyMissions.filter(m => m.completed).length}/{weeklyMissions.length}
              </div>
            </div>
            
            {weeklyMissions.map(mission => (
              <MissionCard key={mission.id} mission={mission} type="weekly" />
            ))}
          </Tabs.Content>

          <Tabs.Content value="onetime" className="space-y-4 outline-none">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Achievement Missions</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Completed: {onetimeMissions.filter(m => m.completed).length}/{onetimeMissions.length}
              </div>
            </div>
            
            {onetimeMissions.map(mission => (
              <MissionCard key={mission.id} mission={mission} type="onetime" />
            ))}
          </Tabs.Content>
        </div>
      </Tabs.Root>
      
      {/* Rewards Dialog */}
      <Dialog.Root open={rewardsDialogOpen} onOpenChange={setRewardsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="text-amber-500" size={20} />
                <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Rewards Gallery
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {selectedReward ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => setSelectedReward(null)}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-sm"
                  >
                    ← Back to all rewards
                  </button>
                  
                  <RewardDetails 
                    reward={selectedReward} 
                    isUnlocked={userLevel.level >= selectedReward.level} 
                  />
                </div>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    These special rewards are unlocked as you level up by completing missions and gaining XP.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {LEVEL_REWARDS.map((reward) => {
                      const isUnlocked = userLevel.level >= reward.level;
                      
                      return (
                        <div 
                          key={reward.level}
                          onClick={() => handleRewardClick(reward)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                            isUnlocked
                              ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20' 
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isUnlocked ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              <span className="text-xl">{reward.icon}</span>
                            </div>
                            <div>
                              <h3 className={`font-medium ${
                                isUnlocked ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {reward.reward}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Level {reward.level} {isUnlocked ? '• Unlocked' : '• Locked'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium transition-colors">
                  Close
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
} 