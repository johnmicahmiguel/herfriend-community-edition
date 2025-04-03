import {
  getDatabase,
  ref,
  set,
  onValue,
  off,
  push,
  serverTimestamp,
  query,
  orderByKey,
  limitToLast,
  get,
  update,
  remove,
  orderByChild,
  equalTo,
} from "firebase/database";
import { app } from "./config";

const db = getDatabase(app);

// Chat functions
export const lobbyChatRef = (lobbyId: string) =>
  ref(db, `lobbies/${lobbyId}/messages`);

export const getChatsQuery = (lobbyId: string, limit = 50) =>
  query(lobbyChatRef(lobbyId), orderByKey(), limitToLast(limit));

export const sendChatMessage = async (
  lobbyId: string,
  message: string,
  user: {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
  },
) => {
  const chatRef = lobbyChatRef(lobbyId);
  const newMessageRef = push(chatRef);

  await set(newMessageRef, {
    body: message,
    from: {
      uid: user.uid,
      bio: "Lobby Host", // This could be made configurable if needed
      badge: "",
      birthday: "",
      border: "",
      coverPhoto: "",
      dateJoined: serverTimestamp(),
      gender: "",
      pinnedMessage: "",
      profilePic:
        user.photoURL ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80&sat=-100",
      refId: "",
      role: "h",
      status: "active",
      title: "",
      username: user.displayName || "Anonymous",
    },
    messageType: "chat",
    timestamp: serverTimestamp(),
  });

  return newMessageRef.key;
};

// Private Messaging Functions

/**
 * Generate a consistent thread ID for two users
 * This ensures the same thread is used regardless of who initiates the conversation
 */
export const generateThreadId = (uid1: string, uid2: string): string => {
  // Sort the UIDs to ensure consistency
  const sortedUids = [uid1, uid2].sort();
  return `${sortedUids[0]}_${sortedUids[1]}`;
};

/**
 * Get reference to a user's threads
 */
export const userThreadsRef = (userId: string) =>
  ref(db, `messages/by-user/${userId}/threads`);

/**
 * Get reference to a specific thread's content
 */
export const threadMessagesRef = (threadId: string) =>
  ref(db, `messages/content/${threadId}`);

/**
 * Get reference to thread metadata
 */
export const threadRef = (threadId: string) =>
  ref(db, `messages/threads/${threadId}`);

/**
 * Get a query for the most recent messages in a thread
 */
export const getThreadMessagesQuery = (threadId: string, limit = 30) =>
  query(threadMessagesRef(threadId), orderByKey(), limitToLast(limit));

/**
 * Get the total unread count for a user across all threads
 */
export const getUserUnreadCountRef = (userId: string) =>
  ref(db, `messages/unread-counts/${userId}`);

/**
 * Send a private message between two users
 */
export const sendPrivateMessage = async (
  senderUid: string,
  receiverUid: string,
  message: string,
  senderUsername: string,
  senderPhoto: string,
  receiverUsername: string,
  receiverPhoto: string,
) => {
  try {
    const threadId = generateThreadId(senderUid, receiverUid);
    const timestamp = serverTimestamp();

    // 1. Add message to the thread content
    const messageRef = push(threadMessagesRef(threadId));
    const messageData = {
      content: message,
      senderId: senderUid,
      senderUsername,
      timestamp,
      read: false,
    };

    await set(messageRef, messageData);

    // 2. Update or create thread metadata
    await set(threadRef(threadId), {
      participants: [senderUid, receiverUid],
      lastMessage: {
        content: message,
        timestamp,
        senderId: senderUid,
      },
      updatedAt: timestamp,
    });

    // 3. Update sender's thread list with no unread count
    await set(ref(db, `messages/by-user/${senderUid}/threads/${threadId}`), {
      otherUserUid: receiverUid,
      otherUserUsername: senderUsername,
      otherUserPhoto: senderPhoto,
      unreadCount: 0,
      lastMessage: message,
      lastTimestamp: timestamp,
      updatedAt: timestamp,
    });

    // 4. Update or increment receiver's unread count in their thread list
    const receiverThreadRef = ref(
      db,
      `messages/by-user/${receiverUid}/threads/${threadId}`,
    );
    const snapshot = await get(receiverThreadRef);

    if (snapshot.exists()) {
      // Thread exists, update it and increment unread count
      const threadData = snapshot.val();
      const unreadCount = (threadData.unreadCount || 0) + 1;

      await update(receiverThreadRef, {
        otherUserUid: senderUid,
        otherUserUsername: senderUsername,
        otherUserPhoto: senderPhoto,
        unreadCount,
        lastMessage: message,
        lastTimestamp: timestamp,
        updatedAt: timestamp,
      });

      // Update the total unread count for the receiver
      const unreadCountRef = getUserUnreadCountRef(receiverUid);
      const unreadSnapshot = await get(unreadCountRef);
      const currentTotalUnread = unreadSnapshot.exists()
        ? unreadSnapshot.val()
        : 0;

      await set(unreadCountRef, currentTotalUnread + 1);
    } else {
      // First message in thread for receiver
      await set(receiverThreadRef, {
        otherUserUid: senderUid,
        otherUserUsername: senderUsername,
        otherUserPhoto: senderPhoto,
        unreadCount: 1,
        lastMessage: message,
        lastTimestamp: timestamp,
        updatedAt: timestamp,
      });

      // Set or increment the total unread count for the receiver
      const unreadCountRef = getUserUnreadCountRef(receiverUid);
      const unreadSnapshot = await get(unreadCountRef);
      const currentTotalUnread = unreadSnapshot.exists()
        ? unreadSnapshot.val()
        : 0;

      await set(unreadCountRef, currentTotalUnread + 1);
    }

    return messageRef.key;
  } catch (error) {
    console.error("Error sending private message:", error);
    throw error;
  }
};

/**
 * Mark all messages in a thread as read
 */
export const markThreadAsRead = async (
  currentUserUid: string,
  otherUserUid: string,
) => {
  try {
    const threadId = generateThreadId(currentUserUid, otherUserUid);

    // 1. Get the current thread data for the user
    const userThreadRef = ref(
      db,
      `messages/by-user/${currentUserUid}/threads/${threadId}`,
    );
    const snapshot = await get(userThreadRef);

    if (snapshot.exists()) {
      const threadData = snapshot.val();
      const unreadCount = threadData.unreadCount || 0;

      if (unreadCount > 0) {
        // 2. Update the user's thread to show zero unread messages
        await update(userThreadRef, { unreadCount: 0 });

        // 3. Update the total unread count for the user
        const unreadCountRef = getUserUnreadCountRef(currentUserUid);
        const unreadSnapshot = await get(unreadCountRef);

        if (unreadSnapshot.exists()) {
          const currentTotalUnread = unreadSnapshot.val();
          // Ensure we don't go below zero
          const newTotal = Math.max(0, currentTotalUnread - unreadCount);
          await set(unreadCountRef, newTotal);
        }

        // 4. Mark all messages as read in the thread
        // Get all unread messages from other user
        const messagesRef = threadMessagesRef(threadId);
        const unreadMessagesQuery = query(
          messagesRef,
          orderByChild("senderId"),
          equalTo(otherUserUid),
        );

        const messagesSnapshot = await get(unreadMessagesQuery);

        if (messagesSnapshot.exists()) {
          const updates: Record<string, any> = {};

          messagesSnapshot.forEach((childSnapshot) => {
            const messageData = childSnapshot.val();
            if (messageData.read === false) {
              updates[`${childSnapshot.key}/read`] = true;
            }
          });

          if (Object.keys(updates).length > 0) {
            await update(messagesRef, updates);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error marking thread as read:", error);
    throw error;
  }
};

/**
 * Delete a message thread
 */
export const deleteThread = async (
  currentUserUid: string,
  otherUserUid: string,
) => {
  try {
    const threadId = generateThreadId(currentUserUid, otherUserUid);

    // Only remove the thread from the user's list, not the actual messages
    // This preserves the conversation for the other user
    const userThreadRef = ref(
      db,
      `messages/by-user/${currentUserUid}/threads/${threadId}`,
    );
    await remove(userThreadRef);

    // Update unread count if needed
    const userThreadSnapshot = await get(userThreadRef);
    if (userThreadSnapshot.exists()) {
      const threadData = userThreadSnapshot.val();
      const unreadCount = threadData.unreadCount || 0;

      if (unreadCount > 0) {
        // Update the total unread count
        const unreadCountRef = getUserUnreadCountRef(currentUserUid);
        const unreadSnapshot = await get(unreadCountRef);

        if (unreadSnapshot.exists()) {
          const currentTotalUnread = unreadSnapshot.val();
          const newTotal = Math.max(0, currentTotalUnread - unreadCount);
          await set(unreadCountRef, newTotal);
        }
      }
    }
  } catch (error) {
    console.error("Error deleting thread:", error);
    throw error;
  }
};
