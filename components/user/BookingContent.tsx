"use client";

import React, { useState } from "react";
import { Calendar, Clock, Filter, Search, AlertCircle, Star } from "lucide-react";
import Image from "next/image";
import * as Tabs from "@radix-ui/react-tabs";
import * as Tooltip from "@radix-ui/react-tooltip";
import BookingCard from "./BookingCard";
import { Booking, BookingTabType } from "./BookingTypes";

interface BookingContentProps {
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  className?: string;
}

export default function BookingContent({
  upcomingBookings,
  pastBookings,
  className = "",
}: BookingContentProps) {
  const [activeTab, setActiveTab] = useState<BookingTabType>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Find the current/next booking (the closest upcoming one)
  const currentBooking = upcomingBookings.length > 0 
    ? [...upcomingBookings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    : null;
  
  // Filter bookings based on search query
  const filteredUpcomingBookings = upcomingBookings.filter(booking => 
    booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.hostName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPastBookings = pastBookings.filter(booking => 
    booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.hostName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date from ISO to readable format
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full overflow-hidden max-h-[90vh] flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
              <Calendar size={20} />
            </div>
            
            <div>
              <h2 className="text-xl font-bold dark:text-gray-100">My Bookings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage all your upcoming and past appointments
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
                    <AlertCircle size={20} />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm max-w-xs z-50"
                    sideOffset={5}
                  >
                    You can reschedule or cancel an upcoming booking up to 24 hours before the appointment.
                    <Tooltip.Arrow className="fill-gray-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
      </div>

      {/* Current Booking Section */}
      {currentBooking && (
        <div className="p-4 mb-2 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <h3 className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
            <Star size={16} className="mr-2 text-yellow-500" />
            YOUR NEXT APPOINTMENT
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={currentBooking.hostAvatar}
                  alt={currentBooking.hostName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-100">{currentBooking.serviceName}</h4>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Clock size={14} className="mr-1" />
                  <span>{formatDate(currentBooking.date)} • {currentBooking.time}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-colors">
                Join
              </button>
              <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium rounded-full transition-colors">
                Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by service or host name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          
          <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root
        defaultValue="upcoming"
        className="flex-1 flex flex-col overflow-hidden"
        onValueChange={(value) => setActiveTab(value as BookingTabType)}
        value={activeTab}
      >
        <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700">
          <Tabs.Trigger
            value="upcoming"
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === "upcoming" 
                ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" 
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <Clock size={16} />
            Upcoming
            {filteredUpcomingBookings.length > 0 && (
              <span className="ml-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                {filteredUpcomingBookings.length}
              </span>
            )}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="past"
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === "past" 
                ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" 
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <Calendar size={16} />
            Past
            {filteredPastBookings.length > 0 && (
              <span className="ml-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                {filteredPastBookings.length}
              </span>
            )}
          </Tabs.Trigger>
        </Tabs.List>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-800">
          <Tabs.Content value="upcoming" className="space-y-4 outline-none">
            {filteredUpcomingBookings.length > 0 ? (
              filteredUpcomingBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 mb-4">
                  <Calendar size={28} />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No upcoming bookings</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {searchQuery 
                    ? "No bookings match your search criteria. Try a different search term."
                    : "You don't have any upcoming bookings. Browse services to book an appointment."}
                </p>
                {!searchQuery && (
                  <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors">
                    Browse Services
                  </button>
                )}
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="past" className="space-y-4 outline-none">
            {filteredPastBookings.length > 0 ? (
              filteredPastBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar size={28} />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No past bookings</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {searchQuery 
                    ? "No bookings match your search criteria. Try a different search term."
                    : "Your booking history will appear here once you've had appointments."}
                </p>
              </div>
            )}
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
} 