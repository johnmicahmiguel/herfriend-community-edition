"use client";

import React from "react";
import BookingContent from "@/components/user/BookingContent";
import { mockUpcomingBookings, mockPastBookings } from "./mockBookings";

export default function BookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <BookingContent
        upcomingBookings={mockUpcomingBookings}
        pastBookings={mockPastBookings}
      />
    </div>
  );
} 