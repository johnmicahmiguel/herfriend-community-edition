"use client";

import React from "react";
import Image from "next/image";
import { Star, Award, Shield, Medal, Crown, Gift, Lock } from "lucide-react";

// Reward types
export type RewardType = "frame" | "badge" | "pet" | "emotes" | "title";

// Reward interface
export interface Reward {
  level: number;
  reward: string;
  type: RewardType;
  icon: string;
  description?: string;
  imagePath?: string;
}

interface RewardDetailsProps {
  reward: Reward;
  isUnlocked: boolean;
}

// Color mapping based on level tiers
const getLevelColor = (level: number) => {
  if (level < 20) return "bg-amber-500 dark:bg-amber-600"; // Bronze
  if (level < 40) return "bg-gray-400 dark:bg-gray-500"; // Silver
  if (level < 60) return "bg-yellow-400 dark:bg-yellow-500"; // Gold
  if (level < 80) return "bg-cyan-400 dark:bg-cyan-500"; // Platinum
  if (level < 100) return "bg-blue-500 dark:bg-blue-600"; // Diamond
  return "bg-purple-600 dark:bg-purple-700"; // Legendary (100+)
};

const getRewardIcon = (type: RewardType, size = 24) => {
  switch (type) {
    case "frame":
      return <Shield size={size} className="text-blue-500 dark:text-blue-400" />;
    case "badge":
      return <Medal size={size} className="text-amber-500 dark:text-amber-400" />;
    case "pet":
      return <Star size={size} className="text-purple-500 dark:text-purple-400" />;
    case "emotes":
      return <Gift size={size} className="text-green-500 dark:text-green-400" />;
    case "title":
      return <Crown size={size} className="text-yellow-500 dark:text-yellow-400" />;
    default:
      return <Award size={size} className="text-blue-500 dark:text-blue-400" />;
  }
};

// Helper to generate placeholder image URLs
const getPlaceholderImage = (type: RewardType, reward: string) => {
  switch(type) {
    case "frame":
      return "/images/rewards/frames/placeholder.png";
    case "badge":
      return "/images/rewards/badges/placeholder.png";
    case "pet":
      return "/images/rewards/pets/placeholder.png";
    case "emotes":
      return "/images/rewards/emotes/placeholder.png";
    default:
      return "/images/rewards/placeholder.png";
  }
};

// Mock descriptions for rewards
const getRewardDescription = (reward: Reward) => {
  const descriptions: Record<number, string> = {
    10: "A sleek bronze frame to showcase your dedication to the community.",
    20: "Show your social skills with this exclusive butterfly badge.",
    30: "Elevate your profile with this polished silver frame.",
    40: "An adorable companion that follows you around the app.",
    50: "Stand out with this premium gold frame for your avatar.",
    60: "Express yourself with exclusive animated emotes only for top users.",
    70: "The prestigious platinum frame reserved for dedicated members.",
    80: "A rare mystical companion that showcases your veteran status.",
    90: "The coveted diamond frame that marks true platform mastery.",
    100: "The ultimate recognition - a legendary title and badge combination that commands respect."
  };
  
  return descriptions[reward.level] || `A special ${reward.type} unlocked at level ${reward.level}.`;
};

export default function RewardDetails({ reward, isUnlocked }: RewardDetailsProps) {
  // Add a description if not provided
  const description = reward.description || getRewardDescription(reward);
  
  // Placeholder image if not provided
  const imageSrc = reward.imagePath || getPlaceholderImage(reward.type, reward.reward);
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden border ${
      isUnlocked 
        ? "border-green-200 dark:border-green-800" 
        : "border-gray-200 dark:border-gray-700"
    }`}>
      {/* Level header */}
      <div className={`${getLevelColor(reward.level)} px-4 py-2 text-white flex justify-between items-center`}>
        <div className="flex items-center gap-2">
          {getRewardIcon(reward.type)}
          <h3 className="font-bold">Level {reward.level} Reward</h3>
        </div>
        <div className="text-2xl">{reward.icon}</div>
      </div>
      
      <div className="p-4">
        {/* Reward image */}
        <div className="relative w-full h-40 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {isUnlocked ? (
              <Image 
                src={imageSrc} 
                alt={reward.reward}
                fill
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center bg-black/20 dark:bg-black/40">
                <div className="bg-black/50 dark:bg-black/70 rounded-full p-3">
                  <Lock size={32} className="text-white" />
                </div>
                <p className="mt-2 text-center text-white text-sm font-medium px-6">
                  Unlock at level {reward.level}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Reward details */}
        <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{reward.reward}</h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{description}</p>
        
        {/* Status */}
        <div className={`mt-4 py-2 px-3 rounded-full inline-flex items-center gap-2 text-sm font-medium ${
          isUnlocked 
            ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        }`}>
          {isUnlocked ? (
            <>
              <Award size={16} className="text-green-600 dark:text-green-400" />
              Unlocked
            </>
          ) : (
            <>
              <Lock size={16} className="text-gray-500 dark:text-gray-400" />
              Locked
            </>
          )}
        </div>
      </div>
    </div>
  );
} 