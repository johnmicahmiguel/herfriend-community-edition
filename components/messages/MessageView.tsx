"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MessageViewProps, MessageWithDate } from "@/types/messages";
import { ChevronLeft, Send } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

// --- Placeholder Data ---
const placeholderMessages: MessageWithDate[] = [
  {
    id: "m1",
    content: "Hey Alice! How's it going?",
    senderId: "user1",
    senderName: "Current User",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    read: true,
  },
  {
    id: "m2",
    content: "Hi! Pretty good, just working on the project.",
    senderId: "user2",
    senderName: "Alice",
    timestamp: new Date(Date.now() - 7140000), // 1 min later
    read: true,
  },
  {
    id: "m3",
    content: "Cool, need any help?",
    senderId: "user1",
    senderName: "Current User",
    timestamp: new Date(Date.now() - 7080000), // 1 min later
    read: true,
  },
  {
    id: "m4",
    content: "Maybe later, thanks!",
    senderId: "user2",
    senderName: "Alice",
    timestamp: new Date(Date.now() - 7020000), // 1 min later
    read: true,
  },
  {
    id: "m5",
    content: "Okay, let me know.",
    senderId: "user1",
    senderName: "Current User",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    read: false, // Example of unread
  },
];
// --- End Placeholder Data ---

// Message input component (Simplified)
const MessageInput: React.FC<{
  onSendMessage: (message: string) => void; // Simplified prop type
}> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  // Removed isSending state

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
    // Removed try/catch/finally and setIsSending logic
  };

  return (
    <div className="px-3 py-3 border-t border-blue-100 dark:border-gray-800">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 py-2 px-3 bg-blue-100 dark:bg-gray-700 rounded-full text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:placeholder-gray-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()} // Simplified disabled condition
          className={`p-2 rounded-full ${
            message.trim()
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500"
          }`}
          aria-label="Send message" // Added aria-label
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// Message bubble component (Unchanged)
const MessageBubble: React.FC<{
  message: MessageWithDate;
  isCurrentUser: boolean;
}> = ({ message, isCurrentUser }) => {
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(message.timestamp);

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-[80%] px-3 py-2 rounded-lg ${
          isCurrentUser
            ? "bg-blue-500 text-white rounded-tr-none"
            : "bg-blue-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <div
          className={`text-xs mt-1 ${
            isCurrentUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {formattedTime}
          {/* Simplified read status display - assuming 'read' exists on message */}
          {isCurrentUser && message.read !== undefined && (
            <span className="ml-1">{message.read ? "• Read" : "• Sent"}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Date separator component (Unchanged, but might be used differently)
const DateSeparator: React.FC<{ date: Date }> = ({ date }) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  }).format(date);

  return (
    <div className="flex justify-center my-3">
      <div className="bg-blue-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
        {formattedDate}
      </div>
    </div>
  );
};

// --- Simplified MessageView ---
const MessageView: React.FC<MessageViewProps> = ({
  selectedThread,
  currentUserId,
  // currentUserName and currentUserPhoto might not be needed if derived from thread/messages
  onSendMessage,
  onBack,
}) => {
  // Removed state: messages, isLoading
  // Removed ref: messagesEndRef
  // Removed function: scrollToBottom
  // Removed useEffect for fetching messages
  // Removed function: groupMessagesByDate

  // Messages are now expected to be passed in or derived, using placeholder for now
  const messages = placeholderMessages;

  // Simplified send handler (just calls the prop)
  const handleSendMessage = (content: string) => {
    if (!selectedThread) return; // Basic guard
    console.log("UI: Triggering send message with content:", content);
    // Call the prop passed down from the parent
    onSendMessage(content);
  };

  if (!selectedThread) {
    // This part can remain, it's UI logic for when no thread is selected
    return (
      <div className="flex-1 flex items-center justify-center bg-blue-50 dark:bg-gray-900">
        <div className="text-center p-4">
          <p className="text-gray-600 dark:text-gray-400">
            Select a conversation to view messages
          </p>
        </div>
      </div>
    );
  }

  // Basic date grouping logic (can be refined or moved)
  const messageGroups: { date: Date; messages: MessageWithDate[] }[] = [];
  let currentDate: Date | null = null;

  messages.forEach((message, index) => {
    const messageDate = new Date(message.timestamp);
    messageDate.setHours(0, 0, 0, 0);

    const previousMessage = index > 0 ? messages[index - 1] : null;
    let showDateSeparator = false;

    if (!previousMessage) {
      showDateSeparator = true; // Show for the very first message
    } else {
      const previousMessageDate = new Date(previousMessage.timestamp);
      previousMessageDate.setHours(0, 0, 0, 0);
      if (messageDate.getTime() !== previousMessageDate.getTime()) {
        showDateSeparator = true; // Show if day changes
      }
    }

    if (showDateSeparator) {
      messageGroups.push({ date: messageDate, messages: [message] });
      currentDate = messageDate;
    } else if (messageGroups.length > 0) {
      // Add to the last group
      messageGroups[messageGroups.length - 1].messages.push(message);
    } else {
       // Fallback: should not happen if messages array is not empty
       messageGroups.push({ date: messageDate, messages: [message] });
    }

  });


  return (
    <div className="flex flex-col h-full bg-blue-50 dark:bg-gray-900">
      {/* Header with user info */}
      <div className="flex items-center p-3 border-b border-blue-100 dark:border-gray-800 bg-blue-100 dark:bg-gray-800">
        <button
          onClick={onBack} // Use the passed-in onBack handler
          className="p-2 mr-2 -ml-1 rounded-full hover:bg-blue-200 dark:hover:bg-gray-700"
          aria-label="Back to thread list" // Added aria-label
        >
          <ChevronLeft size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        <Image
          src={selectedThread.otherUserPhoto || "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} // Default avatar fallback
          alt={`${selectedThread.otherUserName}'s profile picture`}
          width={32}
          height={32}
          className="rounded-full mr-3"
        />
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {selectedThread.otherUserName}
        </span>
      </div>

      {/* Messages Area */}
      <ScrollArea.Root className="flex-1 overflow-y-auto bg-blue-50 dark:bg-gray-900">
        <ScrollArea.Viewport className="h-full w-full rounded">
          <div className="p-4 space-y-2">
            {/* Render message groups with date separators */}
            {messageGroups.map((group, groupIndex) => (
              <React.Fragment key={group.date.toISOString()}>
                <DateSeparator date={group.date} />
                {group.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={message.senderId === currentUserId}
                  />
                ))}
              </React.Fragment>
            ))}
            {/* Removed loading indicator */}
            {/* Removed messagesEndRef div */}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>

      {/* Message Input Area */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default MessageView;
