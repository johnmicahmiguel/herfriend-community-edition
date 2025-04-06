"use client";

import React from "react";

interface LobbyAboutTabProps {
  description: string;
  schedule: string;
}

export default function LobbyAboutTab({ description, schedule }: LobbyAboutTabProps) {
  return (
    <>
      <h3 className="text-sm md:text-base font-medium mb-2 text-unicef">About this Lobby</h3>
      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">{description}</p>
      
      <h3 className="text-sm md:text-base font-medium mb-2 text-unicef">Schedule</h3>
      <p className="text-xs md:text-sm text-gray-600">{schedule}</p>
    </>
  );
}
