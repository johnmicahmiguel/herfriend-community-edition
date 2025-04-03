"use client";

import { createContext, useContext, useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-react";

const AgoraClientContext = createContext<any>(null);

export const AgoraClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set the log level for debugging
      AgoraRTC.setLogLevel(4); // Set to most verbose for debugging

      try {
        const agoraClient = AgoraRTC.createClient({
          mode: "live", // CHANGE FROM "live" to "rtc" to match Python's COMMUNICATION mode
          codec: "vp8",
          role: "host", // Set default role to host for all users
        });

        // Add more detailed logging for connection events
        agoraClient.on("connection-state-change", (curState, prevState) => {
          console.log("📡 Connection state changed:", {
            from: prevState,
            to: curState,
          });
        });

        // Add more detailed event handling for user detection
        agoraClient.on("user-joined", (user) => {
          console.log("👤 User joined channel:", {
            uid: user.uid,
            userIdType: typeof user.uid,
            hasAudio: user.hasAudio,
            // Add timestamp for correlation with Python logs
            timestamp: new Date().toISOString(),
          });
        });

        agoraClient.on("user-published", async (user, mediaType) => {
          console.log("🎙️ Remote user published:", {
            uid: user.uid,
            userIdType: typeof user.uid,
            mediaType,
            hasAudio: user.hasAudio,
            audioTrack: !!user.audioTrack,
            // Add timestamp for correlation with Python logs
            timestamp: new Date().toISOString(),
          });

          if (mediaType === "audio") {
            try {
              console.log(
                "📞 Attempting to subscribe to audio from:",
                user.uid,
              );
              await agoraClient.subscribe(user, mediaType);
              console.log(
                "🔊 Successfully subscribed to audio from:",
                user.uid,
              );

              if (user.audioTrack) {
                console.log("▶️ Playing audio track from user:", user.uid);
                // Force maximum volume
                user.audioTrack.setVolume(100);
                user.audioTrack.play();
              } else {
                console.warn(
                  "⚠️ No audio track available after subscription for user:",
                  user.uid,
                );
              }
            } catch (error) {
              console.error("❌ Failed to subscribe to audio:", error);
            }
          }
        });

        agoraClient.on("user-unpublished", (user, mediaType) => {
          console.log("🔇 Remote user unpublished:", {
            uid: user.uid,
            mediaType,
          });
          if (mediaType === "audio" && user.audioTrack) {
            user.audioTrack.stop();
          }
        });

        agoraClient.on("user-left", (user) => {
          console.log("👋 User left:", { uid: user.uid });
        });

        agoraClient.on("exception", (event) => {
          console.error("⚠️ Agora exception:", event);
        });

        // For debugging audio levels
        agoraClient.enableAudioVolumeIndicator();
        agoraClient.on("volume-indicator", (volumes) => {
          volumes.forEach((volume) => {
            console.log("🔊 Audio volume:", {
              uid: volume.uid,
              level: volume.level,
            });
          });
        });

        // Add these event handlers
        agoraClient.on("stream-added", (evt: any) => {
          console.log("🌊 Stream added:", {
            uid: evt.stream.getId(),
            hasAudio: evt.stream.hasAudio(),
          });
        });

        agoraClient.on("stream-subscribed", (evt: any) => {
          console.log("✅ Stream subscribed:", { uid: evt.stream.getId() });
        });

        agoraClient.on("stream-removed", (evt: any) => {
          console.log("❌ Stream removed:", { uid: evt.stream.getId() });
        });

        console.log("🚀 Agora - Client initialized", {
          mode: "rtc", // Note the change from "live" to "rtc"
          codec: "vp8",
          version: AgoraRTC.VERSION || "unknown",
        });

        setClient(agoraClient);
      } catch (error) {
        console.error("Failed to initialize Agora client:", error);
      }
    }
  }, []);

  // Render nothing until the client is ready
  if (!client) return null;

  return (
    <AgoraClientContext.Provider value={client}>
      {children}
    </AgoraClientContext.Provider>
  );
};

export const useAgoraClient = () => useContext(AgoraClientContext);
