export interface LobbyAboutTabProps {
  description: string;
  schedule: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  avatar: string;
  time: string;
}

export interface LobbyChatProps {
  chatMessages: ChatMessage[];
}

export interface LobbyHeaderProps {
  title: string;
  category: string;
  viewers: number;
  gifts: number;
}

export interface TopUser {
  id: string;
  name: string;
  avatar: string;
  amount?: string;
  time?: string;
}

export interface TopUsers {
  gifters: TopUser[];
  earners: TopUser[];
  recentJoined: TopUser[];
}

export interface LobbySidebarProps {
  topUsers: TopUsers;
  isMobile?: boolean;
  onClose?: () => void;
}

export interface Cohost {
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

export interface LobbyData {
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
  description?: string;
  schedule?: string;
}

export interface LobbyHostsTabProps {
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  profileUserId: string | null;
  setProfileUserId: (id: string | null) => void;
  lobbyData: LobbyData;
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
}

export interface LobbyTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lobbyData: LobbyData;
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
