"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { MessagePanelProps } from "@/types/messages";
import ThreadList from "./ThreadList";
import MessageView from "./MessageView";
import MessageSearch from "./MessageSearch";
import { LoginModal } from "../auth/LoginModal";
import { MessageThreadWithDates } from "@/types/messages";
import { useAuth } from "@/lib/context/auth.context";
import { database } from "@/lib/firebase/config";
import { ref, onValue, off } from "firebase/database";

const MessagePanel: React.FC<MessagePanelProps> = ({ open, onClose }) => {
  const [selectedThread, setSelectedThread] =
    useState<MessageThreadWithDates | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { user, isAnonymous, loading } = useAuth();
  const [threads, setThreads] = useState<MessageThreadWithDates[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open && 
        panelRef.current && 
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') {
        onClose();
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!user?.uid) return;
    const threadsRef = ref(database, `messages/by-user/${user.uid}/threads`);
    const handleValue = (snapshot: any) => {
      const data = snapshot.val() || {};
      const threadList: MessageThreadWithDates[] = Object.entries(data).map(([threadId, t]: any) => ({
        threadId,
        otherUserUid: t.otherUserUid,
        otherUserName: t.otherUserUsername,
        otherUserPhoto: t.otherUserPhoto,
        lastMessage: t.lastMessage,
        lastTimestamp: t.lastTimestamp ? new Date(t.lastTimestamp) : new Date(),
        updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
        unreadCount: t.unreadCount || 0,
      }));
      setThreads(threadList.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    };
    onValue(threadsRef, handleValue);
    return () => off(threadsRef, "value", handleValue);
  }, [user?.uid]);

  const handleSelectThread = (thread: MessageThreadWithDates) => {
    console.log("Selected thread:", thread.threadId);
    setSelectedThread(thread);
    setShowSearch(false);
  };

  const handleSendMessage = async (message: string) => {
    console.log("Sending message:", message, "to thread:", selectedThread?.threadId);
  };

  const handleSelectUser = (selectedUser: {
    uid: string;
    name: string;
    email: string;
    profilePic: string;
  }) => {
    console.log("Selected user for new message:", selectedUser.name);
    const newThread: MessageThreadWithDates = {
      threadId: `temp_${selectedUser.uid}`,
      otherUserUid: selectedUser.uid,
      otherUserName: selectedUser.name || selectedUser.email,
      otherUserPhoto: selectedUser.profilePic,
      lastMessage: "",
      lastTimestamp: new Date(),
      updatedAt: new Date(),
      unreadCount: 0,
    };
    setSelectedThread(newThread);
    setShowSearch(false);
  };

  return (
    <>
      <div
        ref={panelRef}
        className={`fixed inset-y-0 right-0 z-[90] w-full sm:w-96 bg-blue-50 dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-blue-100 dark:border-gray-800 bg-blue-100 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {showSearch ? "New Message" : selectedThread ? "Message" : "Messages"}
            </h2>
            <div className="flex items-center space-x-2">
              {!selectedThread && !showSearch && (
                <button
                  onClick={() => {
                    setShowSearch(true);
                    setSelectedThread(null);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-gray-700"
                  aria-label="Start new message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
              )}
              {(selectedThread || showSearch) && (
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSelectedThread(null);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-gray-700"
                  aria-label="Back to threads list"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-blue-200 dark:hover:bg-gray-700"
                aria-label="Close messages panel"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="h-[1px] w-full bg-blue-200 dark:bg-blue-400/20"></div>
          
          <div className="flex-1 overflow-hidden bg-blue-50 dark:bg-gray-900">
            {showSearch ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-blue-100 dark:border-gray-800">
                  <MessageSearch onSelectUser={handleSelectUser} />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Search results will appear here...
                  </p>
                </div>
              </div>
            ) : selectedThread ? (
              <MessageView
                selectedThread={selectedThread}
                currentUserId={user?.uid || ""}
                currentUserName={user?.displayName || user?.email || "User"}
                currentUserPhoto={user?.photoURL || ""}
                onSendMessage={handleSendMessage}
                onBack={() => setSelectedThread(null)}
              />
            ) : (
              <ThreadList
                threads={threads}
                selectedThreadId={selectedThread ? selectedThread : null}
                onSelectThread={handleSelectThread}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagePanel;
