// Define types for Agora
export type IAgoraRTCClient = any;
export type IAgoraRTCRemoteUser = any;
export type IMicrophoneAudioTrack = any;

// User identity interface
export interface UserIdentity {
  name: string;
  uid: string;
}

// Active channel state interface
export interface ActiveChannelState {
  channelName: string;
  isPublisher: boolean;
  joinState: boolean;
  userSlotIndex: number | null;
}

// Agora context interface
export interface AgoraContextType {
  // Client state
  client: IAgoraRTCClient | null;
  isClientInitialized: boolean;

  // Channel state
  activeChannel: ActiveChannelState | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  localAudioTrack: IMicrophoneAudioTrack | null;
  isMuted: boolean;
  isDeafened: boolean;
  connecting: boolean;

  // User identity
  userIdentity: UserIdentity | null;
  setUserIdentityAndStore: (name: string, uid: string) => boolean;

  // Channel actions
  joinChannel: (
    channelName: string,
    uid: string,
    isPublisher?: boolean,
  ) => Promise<void>;
  leaveChannel: () => Promise<void>;

  // Audio actions
  toggleMute: () => Promise<void>;
  toggleDeafen: () => Promise<void>;

  // Publisher/listener actions
  becomePublisher: () => Promise<void>;
  becomeListener: () => Promise<void>;

  // Co-host slot management
  setUserSlotIndex: (index: number | null) => void;

  // Audio troubleshooting
  refreshRemoteAudio: () => Promise<void>;

  setLocalAudioTrack: (track: any) => void;
}
