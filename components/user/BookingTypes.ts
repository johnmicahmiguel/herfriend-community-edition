export type BookingStatus = "upcoming" | "completed" | "cancelled";

export interface Booking {
  id: string;
  serviceName: string;
  serviceType: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  price: string;
  status: BookingStatus;
  date: string; // ISO date string
  time: string;
  duration: number; // in minutes
  notes?: string;
  location?: string; // This could be a virtual meeting link or a physical address
  paymentId?: string;
}

export type BookingTabType = "upcoming" | "past"; 