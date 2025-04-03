"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BannerItem } from "@/types/banner";

const BANNER_ITEMS: BannerItem[] = [
  {
    id: "1",
    title: "Support Child Education",
    description:
      "Help provide quality education to children in need around the world",
    image:
      "https://www.unicef.org/sites/default/files/styles/media_banner/public/UNI513813-HP.JPG.webp?itok=k-1arbgk",
    link: "https://www.unicef.org",
    target: "_blank",
  },
  {
    id: "2",
    title: "Join Our Community",
    description:
      "Connect with others who are passionate about making a difference",
    image:
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?q=80&w=1000",
    link: "https://www.unicef.org",
    target: "_blank",
  },
  {
    id: "3",
    title: "Emergency Relief Fund",
    description:
      "Support children and families affected by humanitarian crises",
    image:
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000",
    link: "https://www.unicef.org",
    target: "_blank",
  },
];

export default function PromotionalBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [isAnimating, setIsAnimating] = useState(false);

  const goToPrevious = () => {
    if (isAnimating) return;
    setDirection("left");
    setIsAnimating(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? BANNER_ITEMS.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setDirection("right");
    setIsAnimating(true);
    const isLastSlide = currentIndex === BANNER_ITEMS.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    if (isAnimating || slideIndex === currentIndex) return;
    setDirection(slideIndex > currentIndex ? "right" : "left");
    setIsAnimating(true);
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Match this with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  return (
    <div className="w-full overflow-hidden relative group">
      <div className="relative aspect-[4/1] w-full">
        {BANNER_ITEMS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
              index === currentIndex
                ? "z-10 translate-x-0"
                : direction === "right" &&
                    !isAnimating &&
                    index === (currentIndex + 1) % BANNER_ITEMS.length
                  ? "z-0 translate-x-full"
                  : direction === "left" &&
                      !isAnimating &&
                      index ===
                        (currentIndex - 1 + BANNER_ITEMS.length) %
                          BANNER_ITEMS.length
                    ? "z-0 -translate-x-full"
                    : direction === "right" &&
                        isAnimating &&
                        index ===
                          (currentIndex - 1 + BANNER_ITEMS.length) %
                            BANNER_ITEMS.length
                      ? "z-0 -translate-x-full"
                      : direction === "left" &&
                          isAnimating &&
                          index === (currentIndex + 1) % BANNER_ITEMS.length
                        ? "z-0 translate-x-full"
                        : "z-0 translate-x-full"
            }`}
            style={{
              transitionProperty: "transform",
              opacity: index === currentIndex ? 1 : 0,
              transition:
                "transform 500ms ease-in-out, opacity 300ms ease-in-out",
            }}
          >
            <Link href={banner.link} target={banner.target} className="block">
              <div className="relative aspect-[4/1] w-full bg-gradient-to-r from-blue-800 to-blue-600">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-1/2 px-8">
                  <h3 className="text-white text-2xl font-bold">
                    {banner.title}
                  </h3>
                  <p className="text-white/90 mt-1 mb-3 text-sm">
                    {banner.description}
                  </p>
                  <button className="bg-unicef text-white font-semibold py-1.5 px-5 rounded-full text-sm">
                    Check it out
                  </button>
                </div>
                <div className="absolute right-0 h-full w-1/2">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    sizes="50vw"
                    priority
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <div
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"
        onClick={(e) => {
          e.preventDefault();
          goToPrevious();
        }}
      >
        <ChevronLeft size={20} />
      </div>

      {/* Right Arrow */}
      <div
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"
        onClick={(e) => {
          e.preventDefault();
          goToNext();
        }}
      >
        <ChevronRight size={20} />
      </div>

      {/* Dots for carousel navigation */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {BANNER_ITEMS.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={(e) => {
              e.preventDefault();
              goToSlide(slideIndex);
            }}
            className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
              slideIndex === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
