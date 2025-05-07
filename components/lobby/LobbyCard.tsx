"use client";

import React, { memo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LobbyCardProps } from "@/types/lobby";
import { Mic, Video } from "lucide-react";

function LobbyCard({ lobby, preventNavigation = false }: LobbyCardProps) {
  const { id, title, description, thumbnail, viewerCount, category, isLive, categories } = lobby;
  const router = useRouter();

  const handleCardClick = useCallback(() => {
    if (!preventNavigation) {
      router.push(`/lobby/${id}`);
    }
  }, [preventNavigation, router, id]);

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
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer h-96 flex flex-col"
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
          {/* Lobby type icon (top right) */}
          {lobby.type === "VOICE_LOBBY" && (
            <div className="absolute top-3 right-3 bg-blue-100 text-blue-600 p-1.5 rounded-full shadow">
              <Mic size={18} />
            </div>
          )}
          {lobby.type === "VIDEO_LOBBY" && (
            <div className="absolute top-3 right-3 bg-green-100 text-green-600 p-1.5 rounded-full shadow">
              <Video size={18} />
            </div>
          )}
        </div>

        {isLive && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
            LIVE
          </div>
        )}

        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
          {viewerCount} viewers
        </div>
      </div>

      {/* Lobby info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate text-lg">
          {title}
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-300 mt-2">{description}</p>
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((cat: string) => (
              <span key={cat} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(LobbyCard);
