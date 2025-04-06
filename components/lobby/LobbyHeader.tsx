"use client";

import React from "react";
import { Users, Gift } from "lucide-react";
import type { LobbyHeaderProps } from "./lobby.types";

export default function LobbyHeader({ title, category, viewers, gifts }: LobbyHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm p-3 md:p-4">
      <h1 className="text-xl md:text-2xl font-bold text-blue-500">{title}</h1>
      <div className="flex flex-wrap items-center mt-2 gap-y-2">
        <span className="bg-blue-500 text-white text-xs md:text-sm px-2 md:px-3 py-0.5 rounded-md mr-3 md:mr-4">{category}</span>
        <div className="flex items-center text-gray-600 dark:text-gray-300 text-xs md:text-sm mr-3 md:mr-4">
          <Users size={14} className="mr-1" />
          <span>{viewers} viewers</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300 text-xs md:text-sm">
          <Gift size={14} className="mr-1" />
          <span>{gifts} gifts</span>
        </div>
      </div>
    </div>
  );
}
