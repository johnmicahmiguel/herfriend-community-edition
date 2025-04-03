"use server";

import { RtcTokenBuilder, RtcRole } from "agora-token";

// Get Agora credentials from environment variables
const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || "";
const appCertificate = process.env.AGORA_APP_CERTIFICATE || "";

// Token expiration time in seconds (1 hour)
const expirationTimeInSeconds = 3600;

// Update type to use string uid
type TokenResponse = {
  token: string;
  uid: string;
};

export async function generateAgoraToken(
  channelName: string,
  uid: string,
  role: "publisher" | "subscriber" = "publisher", // Default to publisher for maximum permissions
): Promise<TokenResponse | { error: string }> {
  try {
    if (!channelName || !uid) {
      return { error: "Channel name and UID are required" };
    }

    if (!appId || !appCertificate) {
      return { error: "Agora credentials are not configured" };
    }

    console.log(
      `Generating token for channel: ${channelName}, uid: ${uid}, role: ${role}`,
    );

    // Use PUBLISHER role for all tokens - this gives maximum permissions
    // Client-side role management will restrict what users can actually do
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid, // Use string uid directly
      RtcRole.PUBLISHER, // Always use PUBLISHER for token creation
      expirationTimeInSeconds,
      expirationTimeInSeconds,
    );

    console.log("🚀 Agora - Token generated", {
      tokenLength: token.length,
      uid,
      channelName,
      role: "PUBLISHER", // Log what role we're using for token
    });

    return { token, uid };
  } catch (error) {
    console.error("Error generating Agora token:", error);
    return { error: "Failed to generate token" };
  }
}
