"use client";

import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import LobbyCard from "./LobbyCard";
import { Lobby } from "@/types/lobby";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

interface LobbyGridProps {
  lobbies: Lobby[];
}

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

function LobbyGrid({ lobbies }: LobbyGridProps) {
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
            {lobbies.map((lobby) => (
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
