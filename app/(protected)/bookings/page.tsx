"use client";

import React from "react";
import BookingContent from "@/components/user/BookingContent";
import { Booking } from "@/components/user/BookingTypes";

// Sample data for demonstration
export const mockUpcomingBookings: Booking[] = [
  {
    id: "booking-1",
    serviceName: "1-on-1 Consultation",
    serviceType: "consultation",
    hostId: "host-1",
    hostName: "Jane Smith",
    hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000",
    price: "$99",
    status: "upcoming",
    date: "2023-05-15",
    time: "10:00 AM",
    duration: 60,
    location: "https://zoom.us/j/123456789",
    paymentId: "pay-123",
  },
  {
    id: "booking-2",
    serviceName: "Group Workshop",
    serviceType: "workshop",
    hostId: "host-2",
    hostName: "Alex Johnson",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000",
    price: "$49",
    status: "upcoming",
    date: "2023-05-20",
    time: "2:00 PM",
    duration: 90,
    location: "123 Workshop St, San Francisco, CA",
    paymentId: "pay-124",
  },
  {
    id: "booking-3",
    serviceName: "Career Coaching",
    serviceType: "coaching",
    hostId: "host-3",
    hostName: "Michelle Lee",
    hostAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000",
    price: "$149",
    status: "upcoming",
    date: "2023-05-25",
    time: "11:30 AM",
    duration: 120,
    location: "Google Meet",
    paymentId: "pay-125",
  },
];

export const mockPastBookings: Booking[] = [
  {
    id: "booking-4",
    serviceName: "Portfolio Review",
    serviceType: "review",
    hostId: "host-4",
    hostName: "David Williams",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000",
    price: "$79",
    status: "completed",
    date: "2023-04-10",
    time: "3:00 PM",
    duration: 45,
    location: "https://meet.google.com/abc-defg-hij",
    paymentId: "pay-126",
  },
  {
    id: "booking-5",
    serviceName: "Marketing Strategy Session",
    serviceType: "strategy",
    hostId: "host-5",
    hostName: "Sarah Chen",
    hostAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000",
    price: "$199",
    status: "completed",
    date: "2023-04-05",
    time: "1:00 PM",
    duration: 90,
    location: "https://zoom.us/j/987654321",
    paymentId: "pay-127",
  },
  {
    id: "booking-6",
    serviceName: "Website Audit",
    serviceType: "audit",
    hostId: "host-6",
    hostName: "James Wilson",
    hostAvatar: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1000",
    price: "$129",
    status: "cancelled",
    date: "2023-03-20",
    time: "10:00 AM",
    duration: 60,
    location: "Virtual Meeting",
    paymentId: "pay-128",
  },
];

// Helper function to check if there's an upcoming booking in the next 24 hours
export function getNextUpcomingBooking(): Booking | null {
  // In a real app, this would fetch from an API
  const upcomingBookings = [...mockUpcomingBookings];
  
  if (upcomingBookings.length === 0) {
    return null;
  }
  
  // Sort by date and time
  upcomingBookings.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Return the next upcoming booking
  return upcomingBookings[0];
}

// Helper function to check if there are any upcoming bookings
export function hasUpcomingBookings(): boolean {
  // In a real app, this would fetch from an API
  return mockUpcomingBookings.length > 0;
}

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