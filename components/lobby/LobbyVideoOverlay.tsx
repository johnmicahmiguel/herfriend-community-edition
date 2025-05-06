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
        {/* Charity Goal Button */}
        <div className="relative">
          <button
            onClick={() => setShowGoalTooltip(!showGoalTooltip)}
            className="bg-pink-200 hover:bg-pink-300 dark:bg-pink-900 dark:hover:bg-pink-800 text-pink-700 dark:text-pink-300 p-2 rounded-full border border-pink-300 dark:border-pink-700 flex items-center justify-center shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          {/* Tooltip/Popover for Charity Goal */}
          <div className={`absolute right-0 mt-2 w-72 z-10 ${showGoalTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-pink-200 dark:border-pink-900 p-3">
              <button
                onClick={() => setShowGoalTooltip(false)}
                className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close goals popover"
              >
                <X size={16} />
              </button>
              <h4 className="text-sm font-medium text-pink-500 dark:text-pink-400 mb-2 pr-4">Charity Goal</h4>
              <div className="space-y-2">
                <div className="text-xs text-gray-700 dark:text-gray-200 mb-1">
                  Raising funds for <span className="font-semibold text-pink-600 dark:text-pink-300">Charity Name</span> to support children worldwide.
                </div>
                {/* Progress bar */}
                <div className="flex items-center">
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="ml-2 text-xs font-medium text-pink-500 dark:text-pink-400">$3,000 / $10,000</span>
                </div>
                {/* Checklist */}
                <ul className="space-y-1 mt-2">
                  <li className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked readOnly className="accent-pink-500 w-3 h-3 rounded" />
                    Announce the campaign
                  </li>
                  <li className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={true} readOnly className="accent-pink-500 w-3 h-3 rounded" />
                    Reach 25% of goal
                  </li>
                  <li className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={false} readOnly className="accent-pink-500 w-3 h-3 rounded" />
                    Reach 50% of goal
                  </li>
                  <li className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={false} readOnly className="accent-pink-500 w-3 h-3 rounded" />
                    Thank top donors live
                  </li>
                </ul>
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
                <p className="text-xs text-gray-800 dark:text-gray-200">🎉 We just hit 25% of our charity goal! Thank you to all our amazing donors for your support. Let's keep going!</p>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Posted 2 minutes ago</span>
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