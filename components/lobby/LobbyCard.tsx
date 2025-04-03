"use client";

import React, { memo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LobbyCardProps } from "@/types/lobby";

function LobbyCard({ lobby, preventNavigation = false }: LobbyCardProps) {
  const { id, title, hostName, thumbnail, viewers, category, isLive } = lobby;
  const router = useRouter();

  // Handle card click with navigation control
  const handleCardClick = useCallback(() => {
    if (!preventNavigation) {
      router.push(`/lobby/${id}`);
    }
  }, [preventNavigation, router, id]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !preventNavigation) {
        e.preventDefault();
        router.push(`/lobby/${id}`);
      }
    },
    [preventNavigation, router, id],
  );

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      aria-label={`Go to ${title} lobby`}
      onKeyDown={handleKeyDown}
    >
      {/* Thumbnail with live indicator */}
      <div className="relative">
        <div className="aspect-video relative">
          <Image
            src={thumbnail}
            alt={`${title} thumbnail`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            draggable="false"
          />
        </div>

        {isLive && (
          <div className="absolute top-3 left-3 bg-unicef text-white text-sm px-3 py-1 rounded-full">
            LIVE
          </div>
        )}

        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
          {viewers} viewers
        </div>
      </div>

      {/* Lobby info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate text-lg">
          {title}
        </h3>
        <p className="text-base text-gray-600 mt-2">{hostName}</p>
        <p className="text-sm text-gray-500 mt-1">{category}</p>
      </div>
    </div>
  );
}

export default memo(LobbyCard);
