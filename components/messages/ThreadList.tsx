"use client";

import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ThreadListProps, MessageThreadWithDates } from "@/types/messages";

// Format date to relative time (e.g., "2 hours ago")
const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

// Thread list item component
const ThreadItem: React.FC<{
  thread: MessageThreadWithDates;
  isActive: boolean;
  onClick: () => void;
}> = ({ thread, isActive, onClick }) => {
  return (
    <div
      className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
        isActive ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      {/* User Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={
              thread.otherUserPhoto ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80&sat=-100"
            }
            alt="User Avatar"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>

        {/* Unread indicator */}
        {thread.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-unicef text-white text-xs font-bold rounded-full">
            {thread.unreadCount > 9 ? "9+" : thread.unreadCount}
          </div>
        )}
      </div>

      {/* Thread Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium text-gray-900 truncate">
            {thread.otherUserName}
          </h3>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatRelativeTime(thread.lastTimestamp)}
          </span>
        </div>

        <p
          className={`text-sm truncate ${thread.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-600"}`}
        >
          {thread.lastMessage || "Start a conversation"}
        </p>
      </div>
    </div>
  );
};

const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  selectedThreadId,
  onSelectThread,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-unicef"></div>
          </div>
        </div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col justify-center items-center h-full p-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="text-base font-medium text-gray-700 mb-1">
              No messages yet
            </h3>
            <p className="text-sm text-gray-500">
              Start a new conversation by clicking the message icon above
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
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
