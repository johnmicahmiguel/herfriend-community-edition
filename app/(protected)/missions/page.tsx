"use client";

import MissionCenterContent from "@/components/user/MissionCenterContent";

// Import the Mission type from our component
import type { Mission } from "@/components/user/MissionTypes";

// Mock data for missions
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
  {
    id: "d3",
    title: "Follow a Host",
    description: "Follow any host you like",
    reward: {
      type: "coin" as const,
      value: 20,
    },
    progress: 0,
    total: 1,
    completed: false,
  },
  {
    id: "d4",
    title: "Rate a Lobby",
    description: "Rate your experience in any lobby",
    reward: {
      type: "xp" as const,
      value: 25,
    },
    progress: 0,
    total: 1,
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
  {
    id: "w3",
    title: "Complete All Daily Missions for 3 Days",
    description: "Stay consistent with your daily missions",
    reward: {
      type: "xp" as const,
      value: 300,
    },
    progress: 1,
    total: 3,
    completed: false,
  },
  {
    id: "w4",
    title: "Book a Private Session",
    description: "Book a private session with any host",
    reward: {
      type: "item" as const,
      value: "Premium Badge",
    },
    progress: 0,
    total: 1,
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
    id: "o2",
    title: "Host Your First Lobby",
    description: "Create and host your first public lobby",
    reward: {
      type: "coin" as const,
      value: 500,
    },
    progress: 0,
    total: 1,
    completed: false,
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
  {
    id: "o4",
    title: "Refer 5 Friends",
    description: "Invite friends to join the platform",
    reward: {
      type: "coin" as const,
      value: 1000,
    },
    progress: 2,
    total: 5,
    completed: false,
  },
  {
    id: "o5",
    title: "Complete 100 Daily Missions",
    description: "Show your dedication by completing daily missions",
    reward: {
      type: "item" as const,
      value: "Veteran Badge",
    },
    progress: 12,
    total: 100,
    completed: false,
  },
];

// Mock user level data
const mockUserLevel = {
  level: 3,
  currentXP: 742,
  requiredXP: 1000,
  progress: 74.2, // percentage 0-100
};

export default function MissionCenterPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center">
      <MissionCenterContent 
        dailyMissions={mockDailyMissions}
        weeklyMissions={mockWeeklyMissions}
        onetimeMissions={mockOnetimeMissions}
        userLevel={mockUserLevel}
        className="max-w-4xl"
      />
    </div>
  );
} 