import React from "react";

interface HostAvatarCircleProps {
  avatar: string;
  name: string;
  role: "Host" | "Cohost";
  online?: boolean;
  size?: "lg" | "md" | "sm";
  speaking?: boolean;
  borderColor?: string;
}

const sizeMap = {
  lg: "w-28 h-28 text-lg",
  md: "w-20 h-20 text-base",
  sm: "w-12 h-12 text-sm",
};

export default function HostAvatarCircle({
  avatar,
  name,
  role,
  online = false,
  size = "md",
  speaking = false,
  borderColor,
}: HostAvatarCircleProps) {
  // Border and grayscale logic for cohosts
  let borderClass = borderColor || "";
  let grayscaleClass = "";
  if (!borderColor) {
    if (role === "Host") {
      borderClass = "border-amber-400";
    } else {
      if (online) {
        borderClass = "border-blue-500";
      } else {
        borderClass = "border-gray-300 dark:border-gray-600";
        grayscaleClass = "grayscale opacity-75";
      }
    }
  }
  // Speaking ring logic
  const ringClass = speaking ? (role === "Host" ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800" : "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800") : "";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeMap[size]}`}>
        <img
          src={avatar}
          alt={name}
          className={`rounded-full border-4 ${borderClass} shadow w-full h-full object-cover ${grayscaleClass} ${ringClass}`}
        />
        {/* Online indicator for cohost */}
        {role === "Cohost" && online && (
          <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
        )}
      </div>
      <span className="font-bold text-gray-800 dark:text-gray-100 text-center truncate max-w-[90px]">{name}</span>
      <span className={`text-xs ${role === "Host" ? "text-amber-500" : "text-gray-400"}`}>{role}</span>
    </div>
  );
} 