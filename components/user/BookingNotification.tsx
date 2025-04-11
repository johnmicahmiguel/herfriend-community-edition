"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, X, Bell } from "lucide-react";
import { Booking } from "./BookingTypes";
import * as Popover from "@radix-ui/react-popover";

interface BookingNotificationProps {
  booking: Booking;
  visible: boolean;
  onDismiss: () => void;
}

export default function BookingNotification({ booking, visible, onDismiss }: BookingNotificationProps) {
  const router = useRouter();
  
  if (!visible) return null;
  
  // Format date to be more readable
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  // Calculate how much time is left until the booking
  const getTimeUntilBooking = (): string => {
    const now = new Date();
    const bookingDate = new Date(`${booking.date} ${booking.time}`);
    const diffMs = bookingDate.getTime() - now.getTime();
    
    // If booking is in the past
    if (diffMs < 0) return "Now";
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      return `${Math.floor(diffHours / 24)}d ${diffHours % 24}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  };
  
  return (
    <Popover.Root defaultOpen={false}>
      <Popover.Trigger asChild>
        <button 
          className="bg-blue-500 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow relative animate-pulse" 
          aria-label="Upcoming booking alert"
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-72 p-3 z-50"
          sideOffset={5}
          align="end"
        >
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                Upcoming booking in 15 minutes
              </span>
              <button 
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src={booking.hostAvatar}
                  alt={booking.hostName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">{booking.serviceName}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">with {booking.hostName}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-2 mb-3">
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mb-1">
                <Calendar size={14} className="mr-1.5 text-gray-500 dark:text-gray-400" />
                <span>{formatDate(booking.date)}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                <Clock size={14} className="mr-1.5 text-gray-500 dark:text-gray-400" />
                <span>{booking.time} • {booking.duration} min</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => router.push("/bookings")}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View details
              </button>
              <button 
                onClick={() => {
                  // This would open the link to join the meeting
                  window.open(booking.location, "_blank");
                }}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-full transition-colors"
              >
                Join now
              </button>
            </div>
          </div>
          <Popover.Arrow className="fill-white dark:fill-gray-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
} 