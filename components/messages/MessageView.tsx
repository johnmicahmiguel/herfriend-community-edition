"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MessageViewProps, MessageWithDate } from "@/types/messages";
import { ChevronLeft, Send, Calendar, ArrowRight, CheckCircle, Bell, XCircle, ChevronDown, X, Clock, DollarSign } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import BookingRequestForm from "./BookingRequestForm";
import { BookingMessage } from "./BookingMessageTypes";
import { useRouter } from "next/navigation";
import { database } from "@/lib/firebase/config";
import { ref, onValue, off, query, orderByKey, limitToLast } from "firebase/database";
import { sendPrivateMessageAction } from "@/app/actions/user.action";
import { useAuth } from "@/lib/context/auth.context";

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

// Inline Booking Form component
const InlineBookingForm: React.FC<{
  hostName: string;
  hostAvatar?: string;
  onSubmit: (bookingData: any, note?: string) => void;
  onCancel: () => void;
}> = ({ hostName, hostAvatar, onSubmit, onCancel }) => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [note, setNote] = useState("");

  // Generate date options for the next 14 days
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    };
  });

  // Generate time slots (every 30 minutes)
  const timeSlots = Array.from({ length: 24 }, (_, hour) => {
    return [
      { 
        value: `${hour.toString().padStart(2, '0')}:00`,
        label: `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
      },
      {
        value: `${hour.toString().padStart(2, '0')}:30`,
        label: `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`
      }
    ];
  }).flat();

  const handleSubmit = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    const formattedTime = timeSlots.find(t => t.value === selectedTime)?.label || selectedTime;
    
    const bookingData = {
      serviceName: selectedService === "consultation" ? "1-on-1 Consultation" : "Quick Help",
      serviceType: selectedService,
      date: selectedDate,
      time: formattedTime,
      duration: selectedService === "consultation" ? 60 : 30,
      price: selectedService === "consultation" ? "$99" : "$49",
    };
    
    onSubmit(bookingData, note);
  };

  const services = [
    {
      id: "consultation",
      title: "1-on-1 Consultation",
      price: "$99",
      description: "60 min personal consultation session"
    },
    {
      id: "quick-help",
      title: "Quick Help",
      price: "$49",
      description: "30 min focused problem-solving session"
    }
  ];

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-100 dark:border-blue-700 p-3 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Book with {hostName}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {/* Service Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Service
          </label>
          <div className="grid grid-cols-1 gap-2">
            {services.map(service => (
              <div 
                key={service.id}
                className={`border rounded-md p-2 cursor-pointer transition-colors ${
                  selectedService === service.id 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" 
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{service.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{service.description}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="date" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <select
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2"
            >
              <option value="">Select date</option>
              {dateOptions.map(date => (
                <option key={date.value} value={date.value}>{date.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="time" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2"
            >
              <option value="">Select time</option>
              {timeSlots.map(slot => (
                <option key={slot.value} value={slot.value}>{slot.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Add a note (optional)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What would you like to discuss?"
            className="w-full text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 resize-none"
            rows={2}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedService || !selectedDate || !selectedTime}
            className={`px-3 py-1.5 text-xs font-medium rounded-md ${
              !selectedService || !selectedDate || !selectedTime
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Send Request
          </button>
        </div>
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
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedThread) return;
    setLoading(true);
    const threadId = selectedThread.threadId;
    const messagesRef = query(ref(database, `messages/content/${threadId}`), orderByKey(), limitToLast(100));
    const handleValue = (snapshot: any) => {
      const data = snapshot.val() || {};
      const msgList: MessageWithDate[] = Object.entries(data).map(([id, m]: any) => ({
        id,
        content: m.content,
        senderId: m.senderId,
        senderName: m.senderUsername,
        timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
        read: m.read,
      })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setMessages(msgList);
      setLoading(false);
    };
    onValue(messagesRef, handleValue);
    return () => off(messagesRef, "value", handleValue);
  }, [selectedThread]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!selectedThread || !user) return;
    setSending(true);
    setError(null);
    try {
      const res = await sendPrivateMessageAction({
        senderUid: user.uid,
        receiverUid: selectedThread.otherUserUid,
        message: content,
        senderUsername: user.displayName || user.email || "User",
        senderPhoto: user.photoURL || "",
        receiverUsername: selectedThread.otherUserName,
        receiverPhoto: selectedThread.otherUserPhoto,
      });
      if (!res.success) setError(res.error || "Failed to send message");
    } catch (e: any) {
      setError(e.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Add booking-related state in the MessageView component
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);

  // Add mock booking message for demonstration
  const mockBookingMessages: BookingMessage[] = [
    {
      id: "bm1",
      type: "booking_request",
      booking: {
        id: "booking-demo-1",
        serviceName: "1-on-1 Consultation",
        serviceType: "consultation",
        hostId: "user2", // Same as the thread's otherUserUid
        hostName: "Alice", // Same as the thread's otherUserName
        hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000",
        price: "$99",
        status: "upcoming",
        date: "2023-05-15",
        time: "10:00 AM",
        duration: 60,
        location: "https://zoom.us/j/123456789",
        paymentId: "pay-123",
      },
      senderId: "user1", // Current user
      senderName: "Current User",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: true,
      status: "pending",
      note: "I'd like to discuss my project goals and timeline.",
    },
    {
      id: "bm2",
      type: "booking_confirmation",
      booking: {
        id: "booking-demo-1",
        serviceName: "1-on-1 Consultation",
        serviceType: "consultation",
        hostId: "user2",
        hostName: "Alice",
        hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000",
        price: "$99",
        status: "upcoming",
        date: "2023-05-15",
        time: "10:00 AM",
        duration: 60,
        location: "https://zoom.us/j/123456789",
        paymentId: "pay-123",
      },
      senderId: "user2", // From the host
      senderName: "Alice",
      timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
      read: true,
      note: "Looking forward to our session!",
    },
  ];

  // Add function to handle booking request submission
  const handleBookingRequest = (bookingData: any, note?: string) => {
    console.log("Creating booking request:", bookingData, note);
    // In a real implementation, this would:
    // 1. Save booking data to database
    // 2. Create a booking message in the chat
    // 3. Notify the host
    setShowBookingForm(false);
    
    // For demonstration, we could show a success message here
  };

  // Add function to handle booking acceptance
  const handleAcceptBooking = (bookingId: string) => {
    console.log("Accepting booking:", bookingId);
    setShowActionDropdown(false);
    // In a real implementation, this would update the booking status
  };

  // Add function to handle booking declination
  const handleDeclineBooking = (bookingId: string) => {
    console.log("Declining booking:", bookingId);
    setShowActionDropdown(false);
    // In a real implementation, this would update the booking status
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

  // Determine which type of booking to show based on the thread
  const isAliceThread = selectedThread.otherUserName === "Alice";
  const isBobThread = selectedThread.otherUserName === "Bob";

  return (
    <div className="flex flex-col h-full bg-blue-50 dark:bg-gray-900">
      {/* Header with user info */}
      <div className="flex items-center p-3 border-b border-blue-100 dark:border-gray-800 bg-blue-100 dark:bg-gray-800">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 mr-2 -ml-1 rounded-full hover:bg-blue-200 dark:hover:bg-gray-700"
              aria-label="Back to thread list"
            >
              <ChevronLeft size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            <Image
              src={selectedThread.otherUserPhoto || "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
              alt={`${selectedThread.otherUserName}'s profile picture`}
              width={32}
              height={32}
              className="rounded-full mr-3"
            />
            <div>
              <h2 className="font-medium text-gray-800 dark:text-gray-200">
                {selectedThread.otherUserName}
              </h2>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                <span>Online</span>
              </div>
            </div>
          </div>
          {/* Book Button restored, toggles booking form */}
          <button
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium"
          >
            <Calendar size={14} className="mr-1" />
            {showBookingForm ? 'Cancel' : 'Book'}
          </button>
        </div>
      </div>
      {/* Booking Form (restored, only visible when showBookingForm is true) */}
      {showBookingForm && (
        <div className="p-3 bg-blue-50 dark:bg-gray-900 border-b border-blue-100 dark:border-gray-800">
          <InlineBookingForm
            hostName={selectedThread.otherUserName}
            hostAvatar={selectedThread.otherUserPhoto}
            onSubmit={handleBookingRequest}
            onCancel={() => setShowBookingForm(false)}
          />
        </div>
      )}

      {/* Sticky Booking Section - Different for Alice and Bob */}
      <div className="sticky top-0 z-10 bg-blue-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-blue-100 dark:border-gray-800 p-3 space-y-2">
        {isAliceThread && (
          <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 p-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    Booking Confirmed
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    1-on-1 Consultation • 10:00 AM
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  window.open("https://zoom.us/j/123456789", "_blank");
                }}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
              >
                Join Now <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {isBobThread && (
          <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 p-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Calendar size={14} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    Booking Request
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Quick Help • 2:00 PM
                    </p>
                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowActionDropdown(!showActionDropdown)}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
                >
                  Actions <ChevronDown size={12} />
                </button>
                
                {showActionDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1 z-50">
                    <button 
                      onClick={() => handleAcceptBooking("booking-demo-2")}
                      className="w-full text-left px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleDeclineBooking("booking-demo-2")}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-500 dark:text-gray-400">Loading messages...</span>
          </div>
        ) : (
          messageGroups.map((group, idx) => (
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="px-3 pb-2 text-xs text-red-500">{error}</div>
      )}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default MessageView;
