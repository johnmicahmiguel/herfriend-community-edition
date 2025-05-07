"use server";

import { adminDatabase } from "@/lib/firebase/admin";

export async function sendLobbyChatMessage({
  lobbyId,
  message,
  user,
}: {
  lobbyId: string;
  message: string;
  user: {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
    badge?: string;
    level?: number;
  };
}) {
  try {
    const chatRef = adminDatabase.ref(`lobbies/${lobbyId}/messages`);
    const newMessageRef = chatRef.push();
    await newMessageRef.set({
      body: message,
      from: {
        uid: user.uid,
        badge: user.badge || "",
        profilePic:
          user.photoURL ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80&sat=-100",
        username: user.displayName || "Anonymous",
        level: user.level || 1,
      },
      messageType: "chat",
      timestamp: { ".sv": "timestamp" },
    });
    return { success: true, key: newMessageRef.key };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
} 