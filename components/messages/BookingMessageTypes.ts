import { Booking } from "@/components/user/BookingTypes";

// Booking message types
export type BookingMessageType = 
  | "booking_request" 
  | "booking_confirmation" 
  | "booking_cancellation" 
  | "booking_reminder";

// Interface for booking messages in chat
export interface BookingMessage {
  id: string;
  type: BookingMessageType;
  booking: Booking;
  senderId: string;
  senderName: string;
  timestamp: Date;
  read: boolean;
  status?: "pending" | "accepted" | "declined";
  note?: string;
}

// Booking request props for the UI component
export interface BookingRequestProps {
  bookingMessage: BookingMessage;
  isCurrentUser: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
}

// Booking notification props for the UI component
export interface BookingNotificationProps {
  bookingMessage: BookingMessage;
  isCurrentUser: boolean;
  onViewDetails?: () => void;
} 