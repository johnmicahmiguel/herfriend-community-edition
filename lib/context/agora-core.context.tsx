"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  AgoraRTCProvider,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  LocalUser,
  RemoteUser,
} from "agora-rtc-react";
import { useAgoraClient } from "./agora-client.context";

type UserRole = "host" | "co-host" | "listener";

type AgoraContextType = {
  isConnected: boolean;
  isJoined: boolean;
  joinChannel: (
    channelName: string,
    token?: string,
    role?: UserRole,
    userId?: string,
  ) => void;
  leaveChannel: () => void;
  toggleMic: () => void;
  micOn: boolean;
  remoteUsers: any[];
  localMicrophoneTrack: any;
  userRole: UserRole;
  requestBroadcastRole: () => Promise<void>;
  grantBroadcastRole: (uid: string) => Promise<void>;
  revokeBroadcastRole: (uid: string) => Promise<void>;
  stepDownFromBroadcast: () => Promise<void>;
};

const AgoraCoreContext = createContext<AgoraContextType>({
  isConnected: false,
  isJoined: false,
  joinChannel: () => {},
  leaveChannel: () => {},
  toggleMic: () => {},
  micOn: true,
  remoteUsers: [],
  localMicrophoneTrack: null,
  userRole: "listener",
  requestBroadcastRole: async () => {},
  grantBroadcastRole: async () => {},
  revokeBroadcastRole: async () => {},
  stepDownFromBroadcast: async () => {},
});

/* 
  This inner component is rendered inside AgoraRTCProvider.
  It is now safe to call hooks from agora-rtc-react because they can access the client from the provider.
*/
const AgoraCoreInner = ({ children }: { children: React.ReactNode }) => {
  // Local state for channel and role management
  const [isJoined, setIsJoined] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState<string | undefined>();
  const [uid, setUid] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("listener");

  // These hooks are now safely called inside the provider
  const isConnected = useIsConnected();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const remoteUsers = useRemoteUsers();
  const client = useAgoraClient();

  // Join channel when isJoined is true
  useJoin(
    {
      appid: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
      channel: channelName,
      token: token || null,
      uid: uid || undefined,
    },
    isJoined,
  );

  // Update client role when joined or role changes
  useEffect(() => {
    if (client && isJoined) {
      const role = userRole === "listener" ? "audience" : "host";
      console.log("🎭 Setting client role to:", role, {
        userRole,
        channelName,
        isConnected,
        micOn,
        tokenLength: token ? token.length : 0,
      });

      try {
        client.setClientRole(role);
      } catch (error) {
        console.error("Error setting client role:", error);
      }
    }
  }, [client, isJoined, userRole, channelName, isConnected, micOn, token]);

  // Publish microphone track if not a listener
  usePublish(userRole !== "listener" ? [localMicrophoneTrack] : []);

  // Define core functions
  const requestBroadcastRole = useCallback(async () => {
    if (!client || userRole !== "listener") return;
    console.log("🎤 Requesting to become co-host", {
      userId: client.uid,
      currentRole: userRole,
      channelName,
    });
    try {
      await client.setClientRole("host");
      setUserRole("co-host");
      setMicOn(true);
      // Explicitly enable the microphone track if it exists
      if (localMicrophoneTrack) {
        localMicrophoneTrack.setEnabled(true);
      }
      console.log("✅ Became co-host", { userId: client.uid, channelName });
    } catch (error) {
      console.error("❌ Failed to become co-host", {
        userId: client.uid,
        error,
      });
      throw error;
    }
  }, [client, userRole, channelName, localMicrophoneTrack]);

  const grantBroadcastRole = useCallback(
    async (uid: string) => {
      if (!client || userRole !== "host") return;
      console.log("👑 Granting broadcast role", {
        hostId: client.uid,
        targetUserId: uid,
        channelName,
      });
      // Implementation pending
    },
    [client, userRole, channelName],
  );

  const revokeBroadcastRole = useCallback(
    async (uid: string) => {
      if (!client || userRole !== "host") return;
      console.log("🚫 Revoking broadcast role", {
        hostId: client.uid,
        targetUserId: uid,
        channelName,
      });
      try {
        // Implementation pending
        console.log("✅ Revoked broadcast role", {
          hostId: client.uid,
          targetUserId: uid,
          channelName,
        });
      } catch (error) {
        console.error("❌ Failed to revoke broadcast role", {
          hostId: client.uid,
          targetUserId: uid,
          error,
        });
        throw error;
      }
    },
    [client, userRole, channelName],
  );

  const stepDownFromBroadcast = useCallback(async () => {
    if (!client || userRole === "listener") return;
    console.log("↩️ Stepping down from broadcast role", {
      userId: client.uid,
      currentRole: userRole,
      channelName,
    });
    try {
      //setMicOn(false);
      //await new Promise(resolve => setTimeout(resolve, 2000));
      //console.log("micOn", micOn);

      // First, disable the microphone track to turn off browser indicator
      if (localMicrophoneTrack) {
        console.log("🔇 Disabling microphone track");
        localMicrophoneTrack.setEnabled(false);
      }

      // Step 2: Directly unpublish the track using client API to ensure it's unpublished
      // This is more reliable than waiting for the usePublish hook to react to state changes
      if (localMicrophoneTrack) {
        console.log("📤 Directly unpublishing audio track");
        try {
          await client.unpublish(localMicrophoneTrack);
          // Don't stop or close the track - we want to reuse it
          // localMicrophoneTrack.stop();
          // localMicrophoneTrack.close();

          console.log("✅ Track unpublished");
        } catch (unpublishError) {
          console.error("Failed to unpublish track:", unpublishError);
          // Continue anyway - we'll try to set role
        }
      }

      // Step 3: Wait a moment to be safe
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 4: Change role
      console.log("🔄 Setting role to audience");
      await client.setClientRole("audience");

      // Step 5: Update state
      setUserRole("listener");
      setMicOn(false);
      // setMicOn(false);
      console.log("✅ Stepped down", {
        userId: client.uid,
        channelName,
        micOn,
      });
    } catch (error) {
      console.error("❌ Failed to step down", { userId: client.uid, error });
      throw error;
    } finally {
      console.log("micOn", micOn);
    }
  }, [client, userRole, channelName, localMicrophoneTrack]);

  // Memoize context value
  const value = useMemo(
    () => ({
      isConnected,
      isJoined,
      joinChannel: (
        channel: string,
        newToken?: string,
        role: UserRole = "listener",
        userId?: string,
      ) => {
        if (!channel || !newToken) {
          console.error("Cannot join: missing channel or token", {
            channel,
            tokenProvided: !!newToken,
          });
          return;
        }

        console.log("🎯 Joining channel", {
          channel,
          role,
          userId: userId || client?.uid,
          tokenLength: newToken ? newToken.length : 0,
        });

        if (userId) {
          setUid(userId);
        }

        setChannelName(channel);
        setToken(newToken);
        setUserRole(role);
        setIsJoined(true);

        try {
          client.setClientRole(role === "listener" ? "audience" : "host");
        } catch (error) {
          console.error("Error setting role on join:", error);
        }
      },
      leaveChannel: () => {
        console.log("👋 Leaving channel", {
          channelName,
          currentRole: userRole,
          userId: uid || client?.uid,
        });
        setIsJoined(false);
        setChannelName("");
        setToken(undefined);
        setUserRole("listener");
        setMicOn(false);
      },
      toggleMic: () => {
        if (userRole !== "listener") {
          const newMicState = !micOn;
          console.log("🎤 Toggling mic", {
            newState: newMicState ? "ON" : "OFF",
            userRole,
            channelName,
          });

          // Update React state for UI and hook synchronization
          setMicOn(newMicState);

          // Directly manipulate the track for immediate hardware feedback
          // This is needed because the useLocalMicrophoneTrack hook might respond asynchronously
          if (localMicrophoneTrack) {
            console.log(
              `${newMicState ? "🔊" : "🔇"} Directly ${newMicState ? "enabling" : "disabling"} microphone track`,
            );
            localMicrophoneTrack.setEnabled(newMicState);
          }
        }
      },
      micOn,
      remoteUsers,
      localMicrophoneTrack,
      userRole,
      requestBroadcastRole,
      grantBroadcastRole,
      revokeBroadcastRole,
      stepDownFromBroadcast,
    }),
    [
      isConnected,
      isJoined,
      micOn,
      remoteUsers,
      localMicrophoneTrack,
      userRole,
      requestBroadcastRole,
      grantBroadcastRole,
      revokeBroadcastRole,
      stepDownFromBroadcast,
      client,
      channelName,
      uid,
    ],
  );

  // Logging for debugging
  useEffect(() => {
    console.log("👥 Remote users changed", {
      channelName,
      remoteUsersCount: remoteUsers.length,
      remoteUsers: remoteUsers.map((user) => user.uid),
    });
  }, [remoteUsers, channelName]);

  useEffect(() => {
    console.log("🔌 Connection status changed", {
      isConnected,
      clientId: client?.uid || "not set",
      channelName: channelName || "not joined",
    });
  }, [isConnected, channelName, client]);

  return (
    <AgoraCoreContext.Provider value={value}>
      {children}
    </AgoraCoreContext.Provider>
  );
};

export const AgoraCoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const client = useAgoraClient();
  if (!client) return null;
  return (
    <AgoraRTCProvider client={client}>
      <AgoraCoreInner>{children}</AgoraCoreInner>
    </AgoraRTCProvider>
  );
};

export const useAgora = () => useContext(AgoraCoreContext);
export { LocalUser, RemoteUser };
