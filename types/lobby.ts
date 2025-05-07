import { LobbyType, User } from "@prisma/client";
import { ReactNode } from "react";

export interface Lobby {
  id: string;
  title?: string;
  description?: string;
  hostName: string;
  thumbnail: string;
  viewerCount: number;
  category?: string;
  isLive: boolean;
  categories: string[];
  type: LobbyType;
}

export interface LobbyViewProps {
  lobby: {
    id: string;
    name: string;
    host: {
      id: string;
      name: string;
      image: string | null;
    };
    coHosts: {
      id: string;
      user: {
        id: string;
        name: string;
        image: string | null;
      };
    }[];
  };
  initialTab?: string;
  userData: User | null;
  autoJoinVoiceChannel?: boolean;
}

export interface LobbyPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Firebase chat message structure
export interface FirebaseChatMessage {
  content: string;
  createdAt: number;
  uid: string;
  displayName: string;
  photoURL: string;
}

export interface LobbyCardProps {
  lobby: Lobby;
  preventNavigation?: boolean;
}

export interface LobbyChatProps {
  lobbyId: string;
}

export interface LobbyInfo {
  id: string;
  name: string;
  hostName?: string;
  thumbnail?: string;
  wasConnected?: boolean; // Track if user was connected to this lobby
}

// Lobby state shared between components
export interface LobbyState {
  userData: User | null;
  lastActive?: number;
  voiceChannelJoined?: boolean;
  // Add any other shared state properties here
}

export interface LobbyStateContextType {
  lobbyStates: Record<string, LobbyState>;
  setLobbyState: (lobbyId: string, state: Partial<LobbyState>) => void;
  getLobbyState: (lobbyId: string) => LobbyState | null;
}

// Wrapper component for a specific lobby
export interface LobbyStateWrapperProps {
  lobbyId: string;
  children: (
    state: LobbyState | null,
    setState: (state: Partial<LobbyState>) => void,
  ) => ReactNode;
}

export interface LobbyStatusBarProps {
  viewerCount?: number;
}
