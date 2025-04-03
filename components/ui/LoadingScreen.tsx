import React from "react";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      <div className="flex flex-col items-center">
        {/* UNICEF Logo */}
        <div className="w-48 h-24 relative mb-8">
          <Image
            src="/images/logo-horizontal.png"
            alt="Social App Logo"
            width={1024}
            height={1024}
            priority
            className="object-contain"
          />
        </div>

        {/* Improved loading spinner with proper animation and UNICEF blue color */}
        <div className="w-10 h-10 border-4 border-[#1CABE2]/30 border-t-[#1CABE2] rounded-full animate-spin mt-8"></div>
      </div>
    </div>
  );
}
