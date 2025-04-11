"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Video, XCircle, CheckCircle, MessageCircle } from "lucide-react";
import { Booking, BookingStatus } from "./BookingTypes";

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  // Function to get status badge color
  const getStatusColor = () => {
    switch (booking.status) {
      case "upcoming":
        return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
      case "completed":
        return "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
    }
  };

  // Function to get status icon
  const getStatusIcon = () => {
    switch (booking.status) {
      case "upcoming":
        return <Clock size={14} />;
      case "completed":
        return <CheckCircle size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  // Format date from ISO to readable format
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Determine if the booking is virtual or in-person
  const isVirtual = booking.location?.includes('http') || booking.location?.includes('zoom') || booking.location?.includes('meet');

  return (
    <div className={`p-4 rounded-lg border ${
      booking.status === "upcoming" 
        ? "border-blue-200 dark:border-blue-700" 
        : booking.status === "completed" 
          ? "border-green-200 dark:border-green-700" 
          : "border-red-200 dark:border-red-700"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={booking.hostAvatar}
              alt={booking.hostName}
              width={40}
              height={40}
              className="rounded-full object-cover w-10 h-10"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">{booking.serviceName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">with {booking.hostName}</p>
          </div>
        </div>
        
        <div className={`flex items-center text-xs px-2 py-1 rounded-full border gap-1 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="font-medium">
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">{formatDate(booking.date)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">{booking.time} ({booking.duration} min)</span>
        </div>
        
        {booking.location && (
          <div className="flex items-center gap-2 text-sm">
            {isVirtual ? (
              <Video size={16} className="text-gray-500 dark:text-gray-400" />
            ) : (
              <MapPin size={16} className="text-gray-500 dark:text-gray-400" />
            )}
            <span className="text-gray-700 dark:text-gray-300">
              {isVirtual ? 'Virtual Meeting' : booking.location}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="font-medium text-blue-600 dark:text-blue-400">{booking.price}</span>
        
        <div className="flex gap-2">
          {booking.status === "upcoming" && (
            <>
              <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-colors">
                Join
              </button>
              <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium rounded-full transition-colors">
                Reschedule
              </button>
            </>
          )}
          
          {booking.status === "completed" && (
            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-colors">
              <MessageCircle size={14} />
              Send Message
            </button>
          )}
          
          {booking.status === "cancelled" && (
            <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-colors">
              Book Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 