"use client";

import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import LobbyCard from "./LobbyCard";
import { Lobby } from "@/types/lobby";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

// Dummy data for lobbies
const DUMMY_LOBBIES: Lobby[] = [
  {
    id: "VIDEO_LOBBY",
    title: "Social Experience with Nature",
    hostName: "Nature",
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1000",
    viewers: 1245,
    category: "Education",
    isLive: true,
  },
  {
    id: "VOICE_LOBBY",
    title: "Clean Water Initiative",
    hostName: "WASH Program",
    thumbnail:
      "https://images.unsplash.com/photo-1538300342682-cf57afb97285?q=80&w=1000",
    viewers: 3782,
    category: "Health",
    isLive: true,
  },
  {
    id: "3",
    title: "Children's Rights Workshop",
    hostName: "Rights Advocate",
    thumbnail:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000",
    viewers: 856,
    category: "Rights",
    isLive: true,
  },
  {
    id: "4",
    title: "Emergency Response Update",
    hostName: "Humanitarian Aid",
    thumbnail:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1000",
    viewers: 1024,
    category: "Emergency",
    isLive: false,
  },
  {
    id: "5",
    title: "Vaccination Campaign Live",
    hostName: "Health Team",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000",
    viewers: 678,
    category: "Health",
    isLive: true,
  },
  {
    id: "6",
    title: "Youth Climate Action",
    hostName: "Climate Change",
    thumbnail:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000",
    viewers: 2145,
    category: "Environment",
    isLive: false,
  },
  {
    id: "7",
    title: "Girls in Tech Program",
    hostName: "Girls Empowerment",
    thumbnail:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000",
    viewers: 932,
    category: "Education",
    isLive: true,
  },
  {
    id: "8",
    title: "Nutrition for Growth",
    hostName: "Nutrition Team",
    thumbnail:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1000",
    viewers: 1532,
    category: "Health",
    isLive: true,
  },
];

// Memoized navigation button component
const NavigationButton = memo(
  ({
    direction,
    onClick,
    disabled,
  }: {
    direction: "left" | "right";
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button
      onClick={() => onClick()}
      className={`absolute ${direction === "left" ? "left-0" : "right-0"} top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-md hover:bg-blue-500 hover:text-white dark:text-gray-200 ${
        disabled ? "opacity-0" : "opacity-100"
      }`}
      aria-label={`Scroll ${direction}`}
      disabled={disabled}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-6 w-6" />
      ) : (
        <ChevronRight className="h-6 w-6" />
      )}
    </button>
  ),
);

NavigationButton.displayName = "NavigationButton";

function LobbyGrid() {
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const dragThreshold = 5; // Minimum pixels to consider as a drag

  // Check if we need to show navigation arrows
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollViewportRef.current) return;

    const container = scrollViewportRef.current;
    const scrollAmount = 360; // Approximately one card width + gap

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollViewportRef.current) return;

    const container = scrollViewportRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10,
    );
  }, []);

  // Mouse down event handler
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollViewportRef.current) return;

    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - scrollViewportRef.current.offsetLeft);
    setScrollLeft(scrollViewportRef.current.scrollLeft);
  }, []);

  // Mouse leave event handler
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse up event handler
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse move event handler
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !scrollViewportRef.current) return;

      e.preventDefault();
      const x = e.pageX - scrollViewportRef.current.offsetLeft;
      const walk = x - startX;

      // If the user has moved more than the threshold, consider it a drag
      if (!hasMoved && Math.abs(walk) > dragThreshold) {
        setHasMoved(true);
      }

      // Apply the scroll with the original multiplier for better UX
      scrollViewportRef.current.scrollLeft = scrollLeft - walk * 2;
    },
    [isDragging, startX, scrollLeft, hasMoved, dragThreshold],
  );

  // Initialize scroll state and add global event listeners
  useEffect(() => {
    if (scrollViewportRef.current) {
      handleScroll();

      const viewport = scrollViewportRef.current;

      // Touch event handlers for mobile
      const handleTouchStart = (e: TouchEvent) => {
        if (!viewport) return;

        setIsDragging(true);
        setHasMoved(false);
        setStartX(e.touches[0].pageX - viewport.offsetLeft);
        setScrollLeft(viewport.scrollLeft);
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || !viewport) return;

        const x = e.touches[0].pageX - viewport.offsetLeft;
        const walk = x - startX;

        // If the user has moved more than the threshold, consider it a drag
        if (Math.abs(walk) > dragThreshold) {
          e.preventDefault();

          if (!hasMoved) {
            setHasMoved(true);
          }

          // Apply the scroll with the original multiplier for better UX
          viewport.scrollLeft = scrollLeft - walk * 2;
        }
      };

      const handleTouchEnd = () => {
        setIsDragging(false);
      };

      // Add event listeners with { passive: false } to allow preventDefault
      viewport.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      viewport.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      viewport.addEventListener("touchend", handleTouchEnd, { passive: true });

      // Global mouse up handler
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      window.addEventListener("mouseup", handleGlobalMouseUp);

      // Cleanup
      return () => {
        viewport.removeEventListener("touchstart", handleTouchStart);
        viewport.removeEventListener("touchmove", handleTouchMove);
        viewport.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, hasMoved, startX, scrollLeft, dragThreshold, handleScroll]);

  return (
    <div
      className="relative w-full max-w-full overflow-hidden dark:bg-gray-900"
      ref={scrollAreaRef}
    >
      {/* Left navigation arrow */}
      {showLeftArrow && (
        <NavigationButton
          direction="left"
          onClick={() => scroll("left")}
          disabled={false}
        />
      )}

      {/* Scrollable container using Radix UI ScrollArea */}
      <ScrollArea.Root
        className="w-full overflow-hidden touch-none"
        type="scroll"
        scrollHideDelay={400}
      >
        <ScrollArea.Viewport
          className={`w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"} no-scrollbar dark:bg-gray-900`}
          ref={scrollViewportRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-4 py-4 px-2">
            {DUMMY_LOBBIES.map((lobby) => (
              <div key={lobby.id} className="flex-shrink-0 w-[336px]">
                <LobbyCard lobby={lobby} preventNavigation={hasMoved} />
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
      </ScrollArea.Root>

      {/* Right navigation arrow */}
      {showRightArrow && (
        <NavigationButton
          direction="right"
          onClick={() => scroll("right")}
          disabled={false}
        />
      )}
    </div>
  );
}

export default memo(LobbyGrid);
