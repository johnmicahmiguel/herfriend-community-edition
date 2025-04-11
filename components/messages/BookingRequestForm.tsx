"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, X } from "lucide-react";
import { Booking } from "@/components/user/BookingTypes";
import * as Dialog from "@radix-ui/react-dialog";

interface BookingRequestFormProps {
  hostId: string;
  hostName: string;
  hostAvatar: string;
  services?: { title: string; price: string; description: string }[];
  onSubmit: (booking: Partial<Booking>, note?: string) => void;
  onCancel: () => void;
}

export default function BookingRequestForm({
  hostId,
  hostName,
  hostAvatar,
  services = [],
  onSubmit,
  onCancel
}: BookingRequestFormProps) {
  const [selectedService, setSelectedService] = useState(services[0]?.title || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [note, setNote] = useState("");
  
  // Generate time slot options (every 30 minutes)
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute of [0, 30]) {
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const period = hour < 12 ? "AM" : "PM";
        const formattedMinute = minute === 0 ? "00" : minute;
        slots.push(`${formattedHour}:${formattedMinute} ${period}`);
      }
    }
    return slots;
  };
  
  // Get duration from service description if possible
  const getDuration = (serviceTitle: string): number => {
    const service = services.find(s => s.title === serviceTitle);
    if (!service) return 60;
    
    // Try to extract duration from description (e.g., "60 min consultation")
    const durationMatch = service.description.match(/(\d+)\s*min/i);
    return durationMatch ? parseInt(durationMatch[1]) : 60;
  };
  
  // Generate the next 14 days as options
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      const formattedDate = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      dates.push({ value: formattedDate, label: displayDate });
    }
    
    return dates;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    const service = services.find(s => s.title === selectedService);
    
    const bookingData: Partial<Booking> = {
      serviceName: selectedService,
      serviceType: "service",
      hostId,
      hostName,
      hostAvatar,
      price: service?.price || "$0",
      status: "upcoming",
      date: selectedDate,
      time: selectedTime,
      duration: getDuration(selectedService),
    };
    
    onSubmit(bookingData, note);
  };

  return (
    <>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
      <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Book with {hostName}
          </Dialog.Title>
          <Dialog.Close asChild>
            <button 
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </Dialog.Close>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12">
              <Image
                src={hostAvatar}
                alt={hostName}
                width={48}
                height={48}
                className="rounded-full object-cover w-12 h-12"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-100">{hostName}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available for booking</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Service
                </label>
                {services.length > 0 ? (
                  <div className="space-y-2">
                    {services.map((service) => (
                      <div 
                        key={service.title}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedService === service.title
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                        }`}
                        onClick={() => setSelectedService(service.title)}
                      >
                        <div className="flex justify-between">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200">{service.title}</h5>
                          <span className="text-blue-600 dark:text-blue-400 font-medium">{service.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="">Select a service</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Coaching Session">Coaching Session</option>
                  </select>
                )}
              </div>
              
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full pl-10 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="">Select a date</option>
                    {getDateOptions().map((date) => (
                      <option key={date.value} value={date.value}>
                        {date.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clock size={16} className="text-gray-500" />
                  </div>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="w-full pl-10 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="">Select a time</option>
                    {getTimeSlots().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Add a note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add any specific details or questions..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none"
                  rows={3}
                ></textarea>
              </div>
              
              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Send Request
                </button>
              </div>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </>
  );
} 