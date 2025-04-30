import React from "react";
import { X } from "lucide-react";

interface LobbyVideoOverlayProps {
  hostAvatar: string;
  hostName: string;
  viewers: number;
  title: string;
  category: string;
  showGoalTooltip: boolean;
  setShowGoalTooltip: (show: boolean) => void;
  showPinnedTooltip: boolean;
  setShowPinnedTooltip: (show: boolean) => void;
}

const LobbyVideoOverlay: React.FC<LobbyVideoOverlayProps> = ({
  hostAvatar,
  hostName,
  viewers,
  title,
  category,
  showGoalTooltip,
  setShowGoalTooltip,
  showPinnedTooltip,
  setShowPinnedTooltip,
}) => {
  return (
    <>
      {/* Host Info Overlay (top-left) */}
      <div className="absolute top-3 left-3 flex items-start gap-3 z-10">
        <img src={hostAvatar} alt={hostName} className="w-10 h-10 rounded-full border-2 border-white shadow object-cover" />
        <div className="flex flex-col gap-1">
          <span className="text-base md:text-lg font-semibold text-white drop-shadow">{hostName}</span>
          <span className="text-sm md:text-base font-medium text-white drop-shadow max-w-[320px] truncate">{title}</span>
          <span className="text-xs md:text-sm text-gray-200 mt-0.5 flex items-center gap-1">
            Playing <span className="font-semibold text-white">{category}</span> for {viewers.toLocaleString()} viewers
          </span>
        </div>
      </div>
      {/* App-themed Overlay (top-right) */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-20">
        {/* Lobby Goals Button */}
        <div className="relative">
          <button
            onClick={() => setShowGoalTooltip(!showGoalTooltip)}
            className="bg-blue-200 hover:bg-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 p-2 rounded-full border border-blue-300 dark:border-blue-700 flex items-center justify-center shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          {/* Tooltip/Popover for Lobby Goals */}
          <div className={`absolute right-0 mt-2 w-64 z-10 ${showGoalTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-200 dark:border-blue-900 p-3">
              <button
                onClick={() => setShowGoalTooltip(false)}
                className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close goals popover"
              >
                <X size={16} />
              </button>
              <h4 className="text-sm font-medium text-blue-500 dark:text-blue-400 mb-2 pr-4">Lobby Goals</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="ml-2 text-xs font-medium text-blue-500 dark:text-blue-400">65%</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">Help us reach our goal of 10,000 participants!</p>
                <div className="flex items-center justify-between text-xs dark:text-gray-400">
                  <span>6,500 joined</span>
                  <span>10,000 goal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Pinned Announcement Button */}
        <div className="relative">
          <button
            onClick={() => setShowPinnedTooltip(!showPinnedTooltip)}
            className="bg-amber-200 hover:bg-amber-300 dark:bg-amber-900 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-300 p-2 rounded-full border border-amber-300 dark:border-amber-700 flex items-center justify-center shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* Tooltip/Popover for Pinned Announcement */}
          <div className={`absolute right-0 mt-2 w-64 z-10 ${showPinnedTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-amber-900 p-3">
              <button
                onClick={() => setShowPinnedTooltip(false)}
                className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close pinned message popover"
              >
                <X size={16} />
              </button>
              <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 pr-4">Pinned Announcement</h4>
              <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-gray-800 dark:text-gray-200">🎉 Special guest joining next Monday! Wildlife photographer James Wilson will share his latest expedition photos.</p>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Posted 2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LobbyVideoOverlay; 