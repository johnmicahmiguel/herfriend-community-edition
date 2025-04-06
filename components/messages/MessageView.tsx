"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MessageViewProps, MessageWithDate } from "@/types/messages";
import { ChevronLeft, Send } from "lucide-react";
import {
  threadMessagesRef,
  getThreadMessagesQuery,
  generateThreadId,
} from "@/lib/firebase/database";
import { onValue, off } from "firebase/database";
import * as ScrollArea from "@radix-ui/react-scroll-area";

// Message input component
const MessageInput: React.FC<{
  onSendMessage: (message: string) => Promise<void>;
}> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="px-3 py-3 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 py-2 px-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className={`p-2 rounded-full ${
            message.trim() && !isSending
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// Message bubble component
const MessageBubble: React.FC<{
  message: MessageWithDate;
  isCurrentUser: boolean;
}> = ({ message, isCurrentUser }) => {
  // Format timestamp to HH:MM AM/PM
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
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <div
          className={`text-xs mt-1 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}
        >
          {formattedTime}
          {isCurrentUser && (
            <span className="ml-1">{message.read ? "• Read" : "• Sent"}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Date separator component
const DateSeparator: React.FC<{ date: Date }> = ({ date }) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  }).format(date);

  return (
    <div className="flex justify-center my-3">
      <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
        {formattedDate}
      </div>
    </div>
  );
};

const MessageView: React.FC<MessageViewProps> = ({
  selectedThread,
  currentUserId,
  currentUserName,
  currentUserPhoto,
  onSendMessage,
  onBack,
}) => {
  const [messages, setMessages] = useState<MessageWithDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of the messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get messages for the selected thread
  useEffect(() => {
    if (!selectedThread) return;

    setIsLoading(true);
    const threadId = generateThreadId(
      currentUserId,
      selectedThread.otherUserUid,
    );
    const messagesQuery = getThreadMessagesQuery(threadId);

    const handleMessagesUpdate = (snapshot: any) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const messagesList: MessageWithDate[] = [];

        // Convert Firebase data to our message format
        Object.entries(messagesData).forEach(([id, data]: [string, any]) => {
          messagesList.push({
            id,
            content: data.content,
            senderId: data.senderId,
            senderName: data.senderName,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            read: data.read || false,
          });
        });

        // Sort messages by timestamp
        messagesList.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
        );

        setMessages(messagesList);
      } else {
        setMessages([]);
      }

      setIsLoading(false);

      // Scroll to bottom when messages update
      setTimeout(scrollToBottom, 100);
    };

    onValue(messagesQuery, handleMessagesUpdate);

    // Clean up listener
    return () => {
      off(messagesQuery);
    };
  }, [selectedThread, currentUserId]);

  // Helper to group messages by date
  const groupMessagesByDate = (messages: MessageWithDate[]) => {
    const groups: { date: Date; messages: MessageWithDate[] }[] = [];

    let currentDate: Date | null = null;
    let currentGroup: MessageWithDate[] = [];

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp);
      messageDate.setHours(0, 0, 0, 0);

      if (!currentDate || currentDate.getTime() !== messageDate.getTime()) {
        if (currentGroup.length > 0 && currentDate) {
          groups.push({ date: currentDate, messages: currentGroup });
        }

        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0 && currentDate) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!selectedThread) return;
    await onSendMessage(content);
  };

  if (!selectedThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <p className="text-gray-600">
            Select a conversation to view messages
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with user info */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <button
          onClick={onBack}
          className="mr-2 p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <Image
              src={selectedThread.otherUserPhoto}
              alt="User Avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {selectedThread.otherUserName}
            </h3>
          </div>
        </div>
      </div>

      {/* Message list */}
      <ScrollArea.Root className="flex-grow overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full">
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : messageGroups.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-40 text-center">
                <p className="text-gray-500 mb-2">No messages yet</p>
                <p className="text-sm text-gray-400">
                  Start the conversation by sending a message
                </p>
              </div>
            ) : (
              messageGroups.map((group, groupIndex) => (
                <div key={group.date.toISOString()}>
                  <DateSeparator date={group.date} />
                  {group.messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isCurrentUser={message.senderId === currentUserId}
                    />
                  ))}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-[160ms] ease-out hover:bg-black/10 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Message input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default MessageView;
