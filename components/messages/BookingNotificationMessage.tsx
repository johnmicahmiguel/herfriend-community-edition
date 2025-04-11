"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Bell, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { BookingNotificationProps } from "./BookingMessageTypes";

export default function BookingNotificationMessage({
  bookingMessage,
  isCurrentUser,
  onViewDetails
}: BookingNotificationProps) {
  const { booking, timestamp, type } = bookingMessage;
  const router = useRouter();
  
  // Format dates
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(timestamp);
  
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  // Get time until booking
  const getTimeUntilBooking = (): string => {
    const now = new Date();
    const bookingDate = new Date(`${booking.date} ${booking.time}`);
    const diffMs = bookingDate.getTime() - now.getTime();
    
    // If booking is in the past
    if (diffMs < 0) return "now";
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `in ${diffHours}h ${diffMinutes}m`;
    } else {
      return `in ${diffMinutes}m`;
    }
  };

  // Get title and icon based on notification type
  const getNotificationContent = () => {
    switch (type) {
      case "booking_confirmation":
        return {
          title: "Booking Confirmed",
          icon: <CheckCircle size={16} className="text-green-500 dark:text-green-400" />,
          color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        };
      case "booking_cancellation":
        return {
          title: "Booking Cancelled",
          icon: <XCircle size={16} className="text-red-500 dark:text-red-400" />,
          color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        };
      case "booking_reminder":
        return {
          title: `Booking Reminder (${getTimeUntilBooking()})`,
          icon: <Bell size={16} className="text-blue-500 dark:text-blue-400" />,
          color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        };
      default:
        return {
          title: "Booking Update",
          icon: <AlertCircle size={16} className="text-gray-500 dark:text-gray-400" />,
          color: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        };
    }
  };

  const { title, icon, color } = getNotificationContent();

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[85%] p-3 rounded-lg border ${color}`}
      >
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {title}
          </h4>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={booking.hostAvatar}
              alt={booking.hostName}
              width={40}
              height={40}
              className="rounded-full object-cover w-10 h-10"
            />
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
              {booking.serviceName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              with {booking.hostName}
            </p>
          </div>
        </div>
        
        <div className="bg-white/60 dark:bg-gray-800/60 rounded p-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
            <Calendar size={14} className="text-gray-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Clock size={14} className="text-gray-500" />
            <span>{booking.time} • {booking.duration} min</span>
          </div>
        </div>
        
        {bookingMessage.note && (
          <div className="text-xs text-gray-600 dark:text-gray-300 italic mb-3 border-l-2 border-gray-300 dark:border-gray-600 pl-2">
            "{bookingMessage.note}"
          </div>
        )}
        
        {/* Actions based on type */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {formattedTime}
          </div>
          
          <div className="flex gap-2">
            {type === "booking_confirmation" && (
              <button
                onClick={() => router.push("/bookings")}
                className="px-3 py-1 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                View Details
              </button>
            )}
            
            {type === "booking_reminder" && (
              <button
                onClick={() => {
                  // Open meeting link if available
                  if (booking.location?.includes('http')) {
                    window.open(booking.location, "_blank");
                  } else {
                    router.push("/bookings");
                  }
                }}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-colors"
              >
                Join Now
              </button>
            )}
            
            {type === "booking_cancellation" && (
              <button
                onClick={() => router.push("/bookings")}
                className="px-3 py-1 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Book Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 