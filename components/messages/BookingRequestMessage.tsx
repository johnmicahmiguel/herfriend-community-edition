"use client";

import React from "react";
import Image from "next/image";
import { Calendar, DollarSign, Clock } from "lucide-react";
import { BookingRequestProps } from "./BookingMessageTypes";

const BookingRequestMessage: React.FC<BookingRequestProps> = ({
  bookingMessage,
  isCurrentUser,
  onAccept,
  onDecline,
}) => {
  // Format date for display
  const bookingDate = new Date(bookingMessage.booking.date);
  const formattedDate = bookingDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Determine status badge
  const getStatusBadge = () => {
    switch (bookingMessage.status) {
      case "accepted":
        return (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            Accepted
          </span>
        );
      case "declined":
        return (
          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
            Declined
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
            Pending
          </span>
        );
    }
  };

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } my-4`}
    >
      <div
        className={`max-w-[90%] p-3 rounded-lg ${
          isCurrentUser
            ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-gray-800 dark:text-gray-200"
            : "bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-800 text-gray-800 dark:text-gray-200"
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 items-center mb-1">
              {getStatusBadge()}
            </div>
            
            <div className="flex items-center">
              <Image
                src={bookingMessage.booking.hostAvatar || "https://via.placeholder.com/40"}
                alt={bookingMessage.booking.hostName}
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
              <h4 className="font-medium text-sm">
                {bookingMessage.booking.serviceName}
              </h4>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={14} className="mr-1" />
            <span>{formattedDate} • {bookingMessage.booking.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} className="mr-1" />
            <span>{bookingMessage.booking.duration} minutes</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <DollarSign size={14} className="mr-1" />
            <span>{bookingMessage.booking.price}</span>
          </div>
        </div>
        
        {bookingMessage.note && (
          <div className="mb-3 px-2 py-1.5 bg-blue-50 dark:bg-gray-700 rounded border-l-2 border-blue-300 dark:border-blue-600 text-sm">
            {bookingMessage.note}
          </div>
        )}
        
        {bookingMessage.status === "pending" && !isCurrentUser && (
          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => onDecline && onDecline()}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Decline
            </button>
            <button 
              onClick={() => onAccept && onAccept()}
              className="px-3 py-1 bg-blue-500 rounded text-xs font-medium text-white hover:bg-blue-600"
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingRequestMessage; 