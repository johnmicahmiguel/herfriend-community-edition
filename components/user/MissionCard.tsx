"use client";

import React from "react";
import { Trophy, Star, Gift, Medal, Zap, Clock, Calendar } from "lucide-react";
import { Mission, MissionType } from "./MissionTypes";

interface MissionCardProps {
  mission: Mission;
  type: MissionType;
}

export default function MissionCard({ mission, type }: MissionCardProps) {
  const progress = Math.min(100, Math.round((mission.progress / mission.total) * 100));
  
  // Get the icon based on mission type
  const getMissionTypeIcon = () => {
    switch (type) {
      case "daily":
        return <Clock className="text-blue-500" size={16} />;
      case "weekly":
        return <Calendar className="text-purple-500" size={16} />;
      case "onetime":
        return <Star className="text-yellow-500" size={16} />;
      default:
        return <Trophy className="text-blue-500" size={16} />;
    }
  };
  
  // Get the reward icon based on reward type
  const getRewardIcon = () => {
    switch (mission.reward.type) {
      case "xp":
        return <Zap className="text-yellow-500" size={16} />;
      case "coin":
        return <Trophy className="text-amber-500" size={16} />;
      case "item":
        return <Gift className="text-purple-500" size={16} />;
      default:
        return <Star className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${mission.completed ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-800">
            {getMissionTypeIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">{mission.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{mission.description}</p>
          </div>
        </div>
        
        <div className="flex items-center text-sm bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full gap-1">
          {getRewardIcon()}
          <span className="font-medium text-blue-700 dark:text-blue-300">
            {mission.reward.value} {mission.reward.type === "xp" ? "XP" : mission.reward.type === "coin" ? "Coins" : ""}
          </span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className={`${mission.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            Progress: {mission.progress}/{mission.total}
          </span>
          <span className={`${mission.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
          <div 
            className={`h-2 rounded-full ${mission.completed ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Claim button or completed label */}
      <div className="mt-3 flex justify-end">
        {mission.completed ? (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
            <Medal size={16} />
            Completed
          </div>
        ) : (
          mission.progress >= mission.total ? (
            <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-colors">
              Claim Reward
            </button>
          ) : null
        )}
      </div>
    </div>
  );
} 