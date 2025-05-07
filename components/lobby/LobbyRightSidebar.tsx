import React, { useState } from "react";
import Image from "next/image";
import LobbyChat from "./LobbyChat";
import LobbyLeaderboard from "./LobbyLeaderboard";
import { Users, Award } from "lucide-react";

const SLIDES = ["gifters", "earners"];

export default function LobbyRightSidebar({ topUsers, lobbyId }: { topUsers: any, lobbyId: string }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [slide, setSlide] = useState(0); // 0: gifters, 1: earners
  const [activeView, setActiveView] = useState<'chat' | 'recent' | 'mission'>('chat');

  const handlePrev = () => setSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  const handleNext = () => setSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));

  return (
    <aside className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-0 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-500 dark:bg-gray-900 border-b border-blue-600 dark:border-gray-700">
        <div className="flex-1 flex justify-center">
          <span className="text-white font-bold tracking-wide text-base">STREAM CHAT</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`p-1 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 text-blue-700 dark:text-gray-200 ${activeView === 'recent' ? 'bg-blue-100 dark:bg-gray-700' : ''}`}
            onClick={() => setActiveView('recent')}
            title="View recent joiners"
          >
            <Users size={20} />
          </button>
          <button
            className={`p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 ${activeView === 'mission' ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}`}
            onClick={() => setActiveView('mission')}
            title="Mission Center"
          >
            <Award size={20} />
          </button>
          <button
            className={`p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 ${activeView === 'chat' ? 'bg-blue-200 dark:bg-blue-900/30' : ''}`}
            onClick={() => setActiveView('chat')}
            title="Show Chat"
          >
            <span className="font-bold text-base">💬</span>
          </button>
        </div>
      </div>
      {/* Slideshow Panel */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-blue-100 dark:border-gray-700 bg-blue-50 dark:bg-gray-900">
        <button onClick={handlePrev} className="text-blue-700 dark:text-white px-2 py-1 text-lg font-bold hover:bg-blue-100 dark:hover:bg-white/10 rounded transition">
          &#60;
        </button>
        <div className="flex-1 flex flex-col items-center min-w-0">
          {slide === 0 && (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-6 w-full justify-center">
                {/* 1st */}
                {topUsers.gifters[0] && (
                  <div className="flex flex-col items-center">
                    <span className="text-yellow-400 text-xl">🥇</span>
                    <span className="font-bold truncate max-w-[90px] text-blue-900 dark:text-white">{topUsers.gifters[0].name}</span>
                    <span className="flex items-center gap-1 font-semibold text-pink-500 dark:text-pink-400"><span role="img" aria-label="gift">🎁</span>{topUsers.gifters[0].amount}</span>
                  </div>
                )}
                {/* 2nd */}
                {topUsers.gifters[1] && (
                  <div className="flex flex-col items-center">
                    <span className="text-gray-300 text-xl">🥈</span>
                    <span className="font-bold truncate max-w-[90px] text-blue-900 dark:text-white">{topUsers.gifters[1].name}</span>
                    <span className="flex items-center gap-1 font-semibold text-red-500 dark:text-red-400"><span role="img" aria-label="gift">🎁</span>{topUsers.gifters[1].amount}</span>
                  </div>
                )}
                {/* 3rd */}
                {topUsers.gifters[2] && (
                  <div className="flex flex-col items-center">
                    <span className="text-yellow-700 text-xl">🥉</span>
                    <span className="font-bold truncate max-w-[90px] text-blue-900 dark:text-white">{topUsers.gifters[2].name}</span>
                    <span className="flex items-center gap-1 font-semibold text-blue-500 dark:text-blue-300"><span role="img" aria-label="gift">🎁</span>{topUsers.gifters[2].amount}</span>
                  </div>
                )}
              </div>
              <div className="text-xs mt-1 text-blue-700 dark:text-blue-200">Top Gifters</div>
            </div>
          )}
          {slide === 1 && (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-6 w-full justify-center">
                {/* 1st */}
                {topUsers.earners[0] && (
                  <div className="flex flex-col items-center">
                    <span className="text-yellow-400 text-xl">🥇</span>
                    <span className="font-bold truncate max-w-[90px] text-blue-900 dark:text-white">{topUsers.earners[0].name}</span>
                    <span className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400"><span role="img" aria-label="gift">💰</span>{topUsers.earners[0].amount}</span>
                  </div>
                )}
                {/* 2nd */}
                {topUsers.earners[1] && (
                  <div className="flex flex-col items-center">
                    <span className="text-gray-300 text-xl">🥈</span>
                    <span className="font-bold truncate max-w-[90px] text-blue-900 dark:text-white">{topUsers.earners[1].name}</span>
                    <span className="flex items-center gap-1 font-semibold text-green-400 dark:text-green-300"><span role="img" aria-label="gift">💰</span>{topUsers.earners[1].amount}</span>
                  </div>
                )}
                {/* 3rd */}
                {topUsers.earners[2] && (
                  <div className="flex flex-col items-center">
                    <span className="text-yellow-700 text-xl">🥉</span>
                    <span className="font-bold truncate max-w-[90px] text-blue-900 dark:text-white">{topUsers.earners[2].name}</span>
                    <span className="flex items-center gap-1 font-semibold text-blue-500 dark:text-blue-300"><span role="img" aria-label="gift">💰</span>{topUsers.earners[2].amount}</span>
                  </div>
                )}
              </div>
              <div className="text-xs mt-1 text-blue-700 dark:text-blue-200">Top Earners</div>
            </div>
          )}
        </div>
        <button onClick={handleNext} className="text-blue-700 dark:text-white px-2 py-1 text-lg font-bold hover:bg-blue-100 dark:hover:bg-white/10 rounded transition">
          &#62;
        </button>
      </div>
      {/* Main Content Toggle */}
      <div className="flex-1 flex flex-col min-h-0 bg-blue-50 dark:bg-gray-800">
        {activeView === 'chat' && <LobbyChat lobbyId={lobbyId} />}
        {activeView === 'recent' && (
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-lg font-bold mb-4 text-blue-700 dark:text-gray-100">Recently Joined</h3>
            <div className="space-y-3">
              {topUsers.recentJoined && topUsers.recentJoined.length > 0 ? (
                topUsers.recentJoined.map((user: any) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full object-cover" />
                    <span className="font-medium text-blue-900 dark:text-gray-100">{user.name}</span>
                    <span className="ml-auto text-xs text-blue-400 dark:text-gray-500">{user.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-blue-400 text-sm">No recent joiners.</div>
              )}
            </div>
          </div>
        )}
        {activeView === 'mission' && (
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-lg font-bold mb-4 text-blue-700 dark:text-gray-100">Mission Center</h3>
            <div className="text-blue-600 dark:text-gray-300">Mission Center content goes here.</div>
          </div>
        )}
      </div>
      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => setShowLeaderboard(false)}
            >
              ×
            </button>
            <LobbyLeaderboard />
          </div>
        </div>
      )}
    </aside>
  );
} 