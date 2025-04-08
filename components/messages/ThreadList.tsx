"use client";

import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ThreadListProps, MessageThreadWithDates } from "@/types/messages";

// Format date to relative time (e.g., "2 hours ago")
const formatRelativeTime = (date: Date | undefined): string => {
  // Handle potentially undefined date
  if (!date) return "";
  try {
     return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", date, error);
    return "Invalid date";
  }
};

// Thread list item component
const ThreadItem: React.FC<{
  thread: MessageThreadWithDates;
  isActive: boolean;
  onClick: () => void;
}> = ({ thread, isActive, onClick }) => {
  return (
    <div
      className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors ${
        isActive ? "bg-blue-100 dark:bg-gray-800" : ""
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      {/* User Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={thread.otherUserPhoto || "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
            alt={`${thread.otherUserName}'s avatar`}
            width={48}
            height={48}
            className="object-cover bg-gray-200"
          />
        </div>

        {/* Unread indicator */}
        {thread.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full ring-2 ring-white dark:ring-gray-800">
            {thread.unreadCount > 9 ? "9+" : thread.unreadCount}
          </div>
        )}
      </div>

      {/* Thread Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {thread.otherUserName || "Unknown User"}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formatRelativeTime(thread.updatedAt || thread.lastTimestamp)}
          </span>
        </div>

        <p
          className={`text-sm truncate ${thread.unreadCount > 0 ? "font-medium text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}`}
          title={thread.lastMessage || ""}
        >
          {thread.lastMessage || "Start a conversation"}
        </p>
      </div>
    </div>
  );
};

// Simplified ThreadListProps if isLoading is removed
interface SimplifiedThreadListProps {
  threads: MessageThreadWithDates[];
  selectedThreadId: string | null;
  onSelectThread: (thread: MessageThreadWithDates) => void;
}

const ThreadList: React.FC<SimplifiedThreadListProps> = ({
  threads,
  selectedThreadId,
  onSelectThread,
}) => {
  if (threads.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto bg-blue-50 dark:bg-gray-900">
          <div className="flex flex-col justify-center items-center h-full p-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
              No messages yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start a new conversation to see it here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-blue-100 dark:divide-gray-800">
          {threads.map((thread) => (
            <ThreadItem
              key={thread.threadId}
              thread={thread}
              isActive={thread.threadId === selectedThreadId}
              onClick={() => onSelectThread(thread)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreadList;
