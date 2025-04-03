"use client";

import PromotionalBanner from "@/components/ui/PromotionalBanner";
import LobbyGrid from "@/components/lobby/LobbyGrid";

export default function HomePage() {
  return (
    <>
      {/* Promotional banner carousel */}
      <PromotionalBanner />

      {/* Lobby grid */}
      <div className="p-4 md:p-6 w-full overflow-hidden">
        <h2 className="text-lg font-bold mb-4 text-unicef">Popular Lobbies</h2>
        <LobbyGrid />
      </div>
    </>
  );
}
