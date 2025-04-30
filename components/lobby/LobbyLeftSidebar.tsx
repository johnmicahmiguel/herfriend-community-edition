import React from "react";
import Image from "next/image";

export default function LobbyLeftSidebar({ lobbyData }: { lobbyData: any }) {
  return (
    <aside className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      {/* Host Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 mb-2">
          <Image src={lobbyData.hostAvatar} alt={lobbyData.hostName} width={80} height={80} className="object-cover" />
        </div>
        <h2 className="text-lg font-bold text-blue-600 dark:text-blue-300">{lobbyData.hostName}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Host</p>
        <p className="text-sm text-gray-700 dark:text-gray-200 text-center mb-2">{lobbyData.hostBio}</p>
        <div className="flex gap-2 mb-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Follow</button>
          <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">Share</button>
        </div>
        <button className="bg-yellow-400 text-white px-4 py-1 rounded-full text-xs font-semibold">Book</button>
      </div>
      {/* Co-hosts Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Co-hosts</h3>
        <div className="flex flex-col gap-3">
          {lobbyData.cohosts.map((cohost: any) => (
            <div key={cohost.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-300">
                <Image src={cohost.avatar} alt={cohost.name} width={32} height={32} className="object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{cohost.name}</span>
                  {cohost.online && <span className="w-2 h-2 bg-green-500 rounded-full inline-block" title="Online"></span>}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{cohost.specialty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Lobby Info */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">About</h3>
        <p className="text-xs text-gray-700 dark:text-gray-200 mb-2">{lobbyData.description}</p>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400">Schedule</h4>
        <p className="text-xs text-gray-700 dark:text-gray-200">{lobbyData.schedule}</p>
      </div>
    </aside>
  );
} 