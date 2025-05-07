"use server";

import { searchUsers } from "@/lib/services/user.service";
import { adminDatabase } from "@/lib/firebase/admin";

function generateThreadId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join("_");
}

export async function searchUsersAction({
  currentUserUid,
  query,
  page = 1,
  limit = 10,
}: {
  currentUserUid: string;
  query: string;
  page?: number;
  limit?: number;
}) {
  return await searchUsers(currentUserUid, query, page, limit);
}

export async function sendPrivateMessageAction({
  senderUid,
  receiverUid,
  message,
  senderUsername,
  senderPhoto,
  receiverUsername,
  receiverPhoto,
}: {
  senderUid: string;
  receiverUid: string;
  message: string;
  senderUsername: string;
  senderPhoto: string;
  receiverUsername: string;
  receiverPhoto: string;
}) {
  try {
    const threadId = generateThreadId(senderUid, receiverUid);
    const timestamp = { ".sv": "timestamp" };
    // 1. Add message to the thread content
    const messageRef = adminDatabase.ref(`messages/content/${threadId}`).push();
    const messageData = {
      content: message,
      senderId: senderUid,
      senderUsername,
      timestamp,
      read: false,
    };
    await messageRef.set(messageData);
    // 2. Update or create thread metadata
    await adminDatabase.ref(`messages/threads/${threadId}`).set({
      participants: [senderUid, receiverUid],
      lastMessage: {
        content: message,
        timestamp,
        senderId: senderUid,
      },
      updatedAt: timestamp,
    });
    // 3. Update sender's thread list with no unread count
    await adminDatabase.ref(`messages/by-user/${senderUid}/threads/${threadId}`).set({
      otherUserUid: receiverUid,
      otherUserUsername: receiverUsername,
      otherUserPhoto: receiverPhoto,
      unreadCount: 0,
      lastMessage: message,
      lastTimestamp: timestamp,
      updatedAt: timestamp,
    });
    // 4. Update or increment receiver's unread count in their thread list
    const receiverThreadRef = adminDatabase.ref(`messages/by-user/${receiverUid}/threads/${threadId}`);
    const receiverThreadSnap = await receiverThreadRef.get();
    let unreadCount = 1;
    if (receiverThreadSnap.exists()) {
      const threadData = receiverThreadSnap.val();
      unreadCount = (threadData.unreadCount || 0) + 1;
    }
    await receiverThreadRef.set({
      otherUserUid: senderUid,
      otherUserUsername: senderUsername,
      otherUserPhoto: senderPhoto,
      unreadCount,
      lastMessage: message,
      lastTimestamp: timestamp,
      updatedAt: timestamp,
    });
    return { success: true, key: messageRef.key };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
} 