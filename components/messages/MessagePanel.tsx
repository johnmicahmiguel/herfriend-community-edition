"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { MessagePanelProps } from "@/types/messages";
import { useAuth } from "@/lib/context/auth.context";
import ThreadList from "./ThreadList";
import MessageView from "./MessageView";
import MessageSearch from "./MessageSearch";
import { LoginModal } from "../auth/LoginModal";
import {
  userThreadsRef,
  sendPrivateMessage,
  generateThreadId,
  markThreadAsRead,
} from "@/lib/firebase/database";
import { onValue, off } from "firebase/database";
import { MessageThreadWithDates } from "@/types/messages";

const MessagePanel: React.FC<MessagePanelProps> = ({ open, onClose }) => {
  const [threads, setThreads] = useState<MessageThreadWithDates[]>([]);
  const [selectedThread, setSelectedThread] =
    useState<MessageThreadWithDates | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAnonymous } = useAuth();

  // Listen for thread updates when user is logged in and panel is open
  useEffect(() => {
    if (!user || isAnonymous || !open) return;

    setIsLoading(true);

    // Listen for updates to user's message threads
    const threadsRef = userThreadsRef(user.uid);

    const handleThreadsUpdate = (snapshot: any) => {
      if (snapshot.exists()) {
        const threadsData = snapshot.val();

        // Convert to array and sort by updatedAt timestamp (descending)
        const processedThreads = Object.entries(threadsData)
          .map(([threadId, thread]: [string, any]) => {
            // Parse timestamps to Date objects
            const lastTimestamp = thread.lastTimestamp
              ? new Date(thread.lastTimestamp)
              : new Date();

            const updatedAt = thread.updatedAt
              ? new Date(thread.updatedAt)
              : new Date();

            return {
              threadId, // Add threadId to the object
              ...thread,
              lastTimestamp,
              updatedAt,
            };
          })
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        setThreads(processedThreads);
      } else {
        setThreads([]);
      }

      setIsLoading(false);
    };

    onValue(threadsRef, handleThreadsUpdate);

    // Clean up listener
    return () => {
      off(threadsRef);
    };
  }, [user, isAnonymous, open]);

  // Handle thread selection
  const handleSelectThread = async (thread: MessageThreadWithDates) => {
    setSelectedThread(thread);

    // Mark as read when selecting
    if (user && !isAnonymous && thread.unreadCount > 0) {
      try {
        await markThreadAsRead(user.uid, thread.otherUserUid);
      } catch (error) {
        console.error("Error marking thread as read:", error);
      }
    }
  };

  // Handle sending a message in the selected thread
  const handleSendMessage = async (message: string) => {
    if (!user || isAnonymous || !selectedThread) return;

    try {
      await sendPrivateMessage(
        user.uid,
        selectedThread.otherUserUid,
        message,
        user.displayName || "User",
        user.photoURL ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80&sat=-100",
        selectedThread.otherUserName,
        selectedThread.otherUserPhoto,
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle selecting a user from search
  const handleSelectUser = async (selectedUser: {
    uid: string;
    name: string;
    email: string;
    profilePic: string;
  }) => {
    if (!user || isAnonymous) return;

    // Check if thread already exists with this user
    const threadId = generateThreadId(user.uid, selectedUser.uid);
    const existingThread = threads.find(
      (t) => t.threadId === threadId || t.otherUserUid === selectedUser.uid,
    );

    if (existingThread) {
      // Thread exists, just select it
      setSelectedThread(existingThread);
    } else {
      // Create new thread object
      const newThread: MessageThreadWithDates = {
        otherUserUid: selectedUser.uid,
        otherUserName: selectedUser.name || selectedUser.email,
        otherUserPhoto: selectedUser.profilePic,
        unreadCount: 0,
        lastMessage: "",
        lastTimestamp: new Date(),
        updatedAt: new Date(),
        threadId: threadId,
      };

      setSelectedThread(newThread);
    }

    // Close search
    setShowSearch(false);
  };

  // Reset states when panel closes
  useEffect(() => {
    if (!open) {
      setSelectedThread(null);
      setShowSearch(false);
    }
  }, [open]);

  // Show login modal for anonymous users
  useEffect(() => {
    if (open && (!user || isAnonymous)) {
      setLoginModalOpen(true);
    }
  }, [open, user, isAnonymous]);

  // On successful login, close the login modal
  useEffect(() => {
    if (user && !isAnonymous) {
      setLoginModalOpen(false);
    }
  }, [user, isAnonymous]);

  // If not logged in or anonymous, show the login modal
  if (!user || isAnonymous) {
    return (
      <>
        {open && (
          <div
            className={`fixed inset-y-0 right-0 z-[90] w-full sm:w-96 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-blue-500">Messages</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please sign in to access your messages
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      </>
    );
  }

  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 z-[90] w-full sm:w-96 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-blue-500 dark:text-blue-400">
              {selectedThread ? "Message" : "Messages"}
            </h2>
            <div className="flex items-center space-x-2">
              {!selectedThread && !showSearch && (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <line x1="12" y1="11" x2="12" y2="11"></line>
                    <line x1="8" y1="11" x2="8" y2="11"></line>
                    <line x1="16" y1="11" x2="16" y2="11"></line>
                  </svg>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {showSearch ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <button
                      onClick={() => setShowSearch(false)}
                      className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      New Message
                    </h3>
                  </div>
                  <div className="mt-3">
                    <MessageSearch onSelectUser={handleSelectUser} />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Search for users to message
                  </p>
                </div>
              </div>
            ) : selectedThread ? (
              <MessageView
                selectedThread={selectedThread}
                currentUserId={user.uid}
                currentUserName={user.displayName || "User"}
                currentUserPhoto={
                  user.photoURL ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80&sat=-100"
                }
                onSendMessage={handleSendMessage}
                onBack={() => setSelectedThread(null)}
              />
            ) : (
              <ThreadList
                threads={threads}
                selectedThreadId={null}
                onSelectThread={handleSelectThread}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagePanel;
