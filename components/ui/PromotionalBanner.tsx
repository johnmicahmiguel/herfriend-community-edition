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
  const mobileScrollRef = React.useRef<HTMLDivElement>(null);

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

  // Scroll mobile banner to currentIndex
  useEffect(() => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const slideWidth = container.clientWidth;
    container.scrollTo({
      left: slideWidth * currentIndex,
      behavior: "smooth",
    });
  }, [currentIndex]);

  return (
    <div className="w-full overflow-hidden relative">
      {/* Mobile swipeable banner */}
      <div className="md:hidden relative">
        <div
          ref={mobileScrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth aspect-[4/3]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {BANNER_ITEMS.map((banner) => (
            <div
              key={banner.id}
              className="flex-shrink-0 w-full snap-center flex flex-col bg-gradient-to-r from-blue-800 to-blue-600"
            >
              <Link href={banner.link} target={banner.target} className="flex flex-col w-full h-full">
                <div className="relative flex-1 flex flex-col justify-center px-4 py-4 z-10">
                  <h3 className="text-white text-lg font-bold">
                    {banner.title}
                  </h3>
                  <p className="text-white/90 mt-1 mb-3 text-xs">
                    {banner.description}
                  </p>
                  <button className="bg-unicef text-white font-semibold py-1.5 px-4 rounded-full text-xs w-auto self-start">
                    Check it out
                  </button>
                </div>
                <div className="relative flex-1">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover object-center"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Dots indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {BANNER_ITEMS.map((_, idx) => (
            <div
              key={idx}
              className="w-2 h-2 rounded-full bg-white/50"
            />
          ))}
        </div>
      </div>

      {/* Desktop fixed carousel */}
      <div className="hidden md:block relative aspect-[4/1] w-full overflow-hidden group">
        {BANNER_ITEMS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
              index === currentIndex
                ? "z-10 translate-x-0 opacity-100"
                : "z-0 translate-x-full opacity-0"
            }`}
            style={{
              transitionProperty: "transform, opacity",
            }}
          >
            <Link href={banner.link} target={banner.target} className="block w-full h-full">
              <div className="relative w-full h-full flex flex-row bg-gradient-to-r from-blue-800 to-blue-600">
                <div className="relative flex-1 flex flex-col justify-center px-8 z-10">
                  <h3 className="text-white text-2xl font-bold">
                    {banner.title}
                  </h3>
                  <p className="text-white/90 mt-1 mb-3 text-sm">
                    {banner.description}
                  </p>
<button className="bg-unicef text-white font-semibold py-1.5 px-5 rounded-full text-sm w-auto self-start">
  Check it out
</button>
                </div>
                <div className="relative flex-1">
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

        {/* Dots */}
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
    </div>
  );
}
