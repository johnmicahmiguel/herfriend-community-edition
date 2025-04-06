// Mission types
export type MissionType = "daily" | "weekly" | "onetime";

// Mission interface
export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: {
    type: "xp" | "coin" | "item";
    value: number | string;
    icon?: string;
  };
  progress: number;
  total: number;
  completed: boolean;
}

// User level interface
export interface UserLevel {
  level: number;
  currentXP: number;
  requiredXP: number;
  progress: number; // percentage 0-100
} 