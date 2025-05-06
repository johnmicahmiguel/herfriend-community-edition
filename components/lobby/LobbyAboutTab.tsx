"use client";

import React from "react";
import type { LobbyAboutTabProps } from "./lobby.types";
import HostAvatarCircle from "./HostAvatarCircle";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { Calendar } from "lucide-react";

export default function LobbyAboutTab({ description, schedule }: LobbyAboutTabProps) {
  // Hardcoded data for Jane Smith
  const avatar = "https://randomuser.me/api/portraits/women/44.jpg";
  const name = "Jane Smith";
  const socials = {
    instagram: "https://instagram.com/jane.smith",
    twitter: "https://twitter.com/janesmith_nature",
  };
  const about =
    description ||
    `Hi! I'm Jane Smith, a passionate explorer and creator of social experiments with nature. My mission is to connect people with the outdoors, foster curiosity, and inspire positive change through immersive, interactive experiences. Join me as we discover the wonders of the natural world together!`;

  // Example static schedule (Mon, Wed, Fri 4-6pm)
  const defaultSchedule = [
    { day: "Mon", time: "4:00 - 6:00 PM" },
    { day: "Wed", time: "4:00 - 6:00 PM" },
    { day: "Fri", time: "4:00 - 6:00 PM" },
  ];

  // If schedule prop is a string, show as a single slot; else use default
  let scheduleSlots: { day: string; time: string }[] = defaultSchedule;
  if (schedule) {
    // Try to parse schedule as JSON array, else treat as a single slot
    try {
      const parsed = JSON.parse(schedule);
      if (Array.isArray(parsed) && parsed[0]?.day && parsed[0]?.time) {
        scheduleSlots = parsed;
      } else {
        scheduleSlots = [
          { day: "Session", time: schedule },
        ];
      }
    } catch {
      scheduleSlots = [
        { day: "Session", time: schedule },
      ];
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
      {/* Avatar and Socials */}
      <div className="flex flex-col items-center gap-3 min-w-[120px]">
        <HostAvatarCircle avatar={avatar} name={name} role="Host" online size="lg" borderColor="border-pink-400" />
        <div className="flex gap-3 mt-2">
          <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500">
            <FaInstagram size={22} />
          </a>
          <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500">
            <FaTwitter size={22} />
          </a>
        </div>
      </div>

      {/* About and Schedule */}
      <div className="flex-1 w-full">
        <h3 className="text-sm md:text-base font-medium mb-2 text-blue-500">About Jane Smith</h3>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">{about}</p>

        {/* What You'll Learn Section */}
        <h3 className="text-sm md:text-base font-medium mb-2 text-green-600 dark:text-green-400 mt-4">What You'll Learn</h3>
        <div className="mb-4">
          <ul className="list-disc list-inside text-xs md:text-sm text-gray-700 dark:text-gray-200 space-y-1">
            <li>How to connect with nature in new, meaningful ways</li>
            <li>Participate in live social experiments and group challenges</li>
            <li>Discover practical tips for mindfulness and outdoor exploration</li>
            <li>Engage with a supportive, curious community</li>
            <li>Learn to observe, reflect, and share your experiences</li>
          </ul>
        </div>

        <h3 className="text-sm md:text-base font-medium mb-2 text-blue-500">Schedule</h3>
        {/* Fancy calendar-like schedule */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-2 flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-blue-400" />
              <span className="font-semibold text-blue-700 dark:text-blue-200 text-sm">Live Sessions</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {scheduleSlots.map((slot) => (
                <div key={slot.day + slot.time} className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-md shadow p-2 min-w-[80px]">
                  <span className="font-bold text-blue-500 text-xs mb-1">{slot.day}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-200">{slot.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">All times are in your local timezone.</p>
      </div>
    </div>
  );
}
