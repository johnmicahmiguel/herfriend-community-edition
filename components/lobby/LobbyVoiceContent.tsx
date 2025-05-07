import React, { useState } from "react";
import HostAvatarCircle from "@/components/lobby/HostAvatarCircle";
import * as Popover from "@radix-ui/react-popover";
import { User, Gift, Users, ArrowRight, ArrowLeft, Plus } from "lucide-react";
import UserProfileModal from "@/components/user/UserProfileModal";
import BookingRequestForm from "@/components/messages/BookingRequestForm";
import * as Dialog from "@radix-ui/react-dialog";

interface SimpleHost {
  uid: string;
  name: string;
  avatar: string;
  services?: Array<{ title: string; price: string; description: string }>;
}

interface LobbyVoiceContentProps {
  host: SimpleHost;
  cohosts: SimpleHost[];
  speakingUser?: string;
}

// Helper function to chunk array
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function LobbyVoiceContent({ host, cohosts, speakingUser }: LobbyVoiceContentProps) {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [hostPopoverOpen, setHostPopoverOpen] = useState(false);

  console.log(host.avatar)

  // Profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  // Booking dialog state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingHost, setBookingHost] = useState<{
    id: string;
    name: string;
    avatar: string;
    services?: Array<{ title: string; price: string; description: string }>;
  } | null>(null);

  console.log("host", host);

  // --- Stage UI State (for demo) ---
  const [stageSpeakers] = useState([
    { id: 'host', name: host.name, avatar: host.avatar, role: 'Host' },
    ...cohosts.map(c => ({ id: c.uid, name: c.name, avatar: c.avatar, role: 'Cohost' }))
  ]);
  const isGuest = true; // TODO: Replace with real guest check
  const [stagePopoverOpen, setStagePopoverOpen] = useState(false);
  const hasRequested = false; // TODO: Replace with real request check

  // Charity goal state
  const [charityMinimized, setCharityMinimized] = useState(true); // Hidden by default

  // Handlers for popover actions
  const handleProfileClick = (uid: string) => {
    setProfileUserId(uid);
    setShowProfileModal(true);
  };
  const handleBookClick = (hostObj: any, isMainHost = false) => {
    setBookingHost({
      id: isMainHost ? 'host' : hostObj.id,
      name: isMainHost ? host.name : hostObj.name,
      avatar: isMainHost ? host.avatar : hostObj.avatar,
      services: isMainHost ? host.services : hostObj.services
    });
    setShowBookingForm(true);
  };
  const handleBookingRequest = (bookingData: any, note?: string) => {
    // Implement booking logic here
    setShowBookingForm(false);
  };

  // Always show 7 cohost slots
  const cohostsWithPlaceholders = [
    ...cohosts,
    ...Array(Math.max(0, 8 - cohosts.length)).fill(null)
  ];
  // Split into rows of 4
  const cohostRows = chunkArray(cohostsWithPlaceholders, 4);

  return (
    <div className="relative w-full aspect-video rounded-b-lg shadow-md overflow-hidden transition-all duration-300 border-b border-gray-200 dark:border-gray-700" style={{ minHeight: '400px' }}>
      {/* Background video with overlay */}
      <video
        className="absolute inset-0 z-0 w-full h-full object-cover"
        src="/videos/city.mp4"
        autoPlay
        loop
        muted
        playsInline
        // style={{ filter: 'blur(2px) brightness(0.6)' }}
      />
      {/* Main content with relative z-index */}
      <div className={`relative z-10 w-full h-full ${charityMinimized ? 'flex flex-col items-center justify-center' : 'flex flex-row items-stretch justify-center'}`}>
        {/* Host & Cohosts Area */}
        <div className={`flex flex-col items-center justify-center relative w-full h-full ${charityMinimized ? '' : 'flex-1'}`}>
          {/* Host Popover or Placeholder */}
          <div className="flex flex-col items-center justify-center mb-8">
            {host && host.name ? (
              <Popover.Root open={hostPopoverOpen} onOpenChange={setHostPopoverOpen}>
                <Popover.Trigger asChild>
                  <div className="cursor-pointer">
                    <HostAvatarCircle
                      avatar={host.avatar}
                      name={host.name}
                      role="Host"
                      size="lg"
                      speaking={speakingUser === host.name}
                      borderColor="border-pink-400"
                    />
                  </div>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 text-center border border-gray-200 dark:border-gray-700 w-56 z-50"
                    sideOffset={2}
                    align="center"
                    side="left"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-medium text-base dark:text-gray-100">{host.name}</span>
                      <div className="flex justify-center gap-2 mt-2">
                        <button
                          onClick={() => handleProfileClick(host.uid)}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                          title="View Profile"
                        >
                          <User size={16} />
                        </button>
                        <button
                          onClick={() => handleBookClick(host, true)}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800"
                        >
                          Book
                        </button>
                        <button
                          onClick={() => {}}
                          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                          title="Send Gift"
                        >
                          <Gift size={16} />
                        </button>
                      </div>
                    </div>
                    <Popover.Arrow className="fill-white dark:fill-gray-800" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full flex items-center justify-center border-2 border-blue-300 dark:border-blue-700 bg-blue-200 dark:bg-blue-900 transition-colors">
                  <Plus size={48} className="text-white" />
                </div>
              </div>
            )}
          </div>
          {/* Cohosts Popovers or Placeholders in dynamic rows */}
          <div className="flex flex-col gap-8">
            {cohostRows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex flex-row items-center gap-10 justify-start">
                {row.map((cohost, idx) =>
                  cohost ? (
                    <Popover.Root
                      key={cohost.uid}
                      open={openPopoverId === cohost.uid}
                      onOpenChange={(open) => setOpenPopoverId(open ? cohost.uid : null)}
                    >
                      <Popover.Trigger asChild>
                        <div className="cursor-pointer">
                          <HostAvatarCircle
                            avatar={cohost.avatar}
                            name={cohost.name}
                            role="Cohost"
                            online={true}
                            size="md"
                            speaking={speakingUser === cohost.name}
                          />
                        </div>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 text-center border border-gray-200 dark:border-gray-700 w-56 z-50"
                          sideOffset={2}
                          align="center"
                          side="left"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-medium text-base dark:text-gray-100">{cohost.name}</span>
                            <div className="flex justify-center gap-2 mt-2">
                              <button
                                onClick={() => handleProfileClick(cohost.uid)}
                                className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                                title="View Profile"
                              >
                                <User size={16} />
                              </button>
                              <button
                                onClick={() => handleBookClick(cohost)}
                                className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800"
                              >
                                Book
                              </button>
                              <button
                                onClick={() => {}}
                                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                                title="Send Gift"
                              >
                                <Gift size={16} />
                              </button>
                            </div>
                          </div>
                          <Popover.Arrow className="fill-white dark:fill-gray-800" />
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                  ) : (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-blue-700 dark:border-blue-700 bg-blue-900 dark:bg-blue-900 transition-colors">
                        <Plus size={36} className="text-white" />
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
          {/* --- Stage Popover Trigger (Guest Only) --- */}
          {isGuest && (
            <Popover.Root open={stagePopoverOpen} onOpenChange={setStagePopoverOpen}>
              <Popover.Trigger asChild>
                <button
                  className="absolute bottom-4 right-4 z-30 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 text-base font-semibold transition"
                  style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
                >
                  <Users size={20} /> Stage
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-5 z-50 flex flex-col gap-4"
                  sideOffset={16}
                  align="end"
                  side="top"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-2">
                      <Users className="text-blue-500" size={20} /> Stage
                    </h3>
                    <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Current Speakers</div>
                    <div className="flex flex-col gap-2 mb-4">
                      {stageSpeakers.map(speaker => (
                        <div key={speaker.id} className="flex items-center gap-3 p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                          <img src={speaker.avatar} alt={speaker.name} className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{speaker.name}</span>
                          <span className="text-xs text-blue-500 ml-auto">{speaker.role}</span>
                        </div>
                      ))}
                    </div>
                    {!hasRequested ? (
                      <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition">Request to Speak</button>
                    ) : (
                      <div className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-center">Request Sent</div>
                    )}
                  </div>
                  <Popover.Arrow className="fill-white dark:fill-gray-900" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}
          {/* Charity Goal Trigger Button (upper right, inside host/cohost area) */}
          {charityMinimized && (
            <button
              className="absolute top-4 right-4 z-20 bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-xl shadow flex items-center justify-center transition"
              onClick={() => setCharityMinimized(false)}
              title="Show Charity Goal"
              style={{ width: 36, height: 36 }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
        </div>
        {/* Right: Charity Goal/Checklist */}
        <div
          className={`w-80 max-w-xs flex flex-col items-center p-0 bg-white/90 dark:bg-gray-900/80 border-l border-gray-200 dark:border-gray-700 shadow-lg transition-transform duration-300 ease-in-out ${charityMinimized ? 'translate-x-full pointer-events-none opacity-0 absolute top-0 right-0 h-full' : 'translate-x-0 opacity-100 static'}`}
          style={{ zIndex: 30 }}
        >
          {/* Minimize button */}
          <div className="w-full flex items-center justify-between px-4 pt-4 pb-2 relative">
            <span className="text-lg font-bold text-pink-600 dark:text-pink-300">Charity Goal</span>
            <button className="absolute top-0 right-0 text-pink-600 dark:text-pink-300 hover:text-pink-800 dark:hover:text-pink-100 p-2" onClick={() => setCharityMinimized(true)} title="Minimize" style={{ width: 36, height: 36 }}>
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="w-full px-6 pb-4">
            {/* About the Charity */}
            <div className="mb-4 p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800">
              <h4 className="text-sm font-semibold text-pink-700 dark:text-pink-200 mb-1">About the Charity</h4>
              <p className="text-xs text-gray-700 dark:text-gray-200">Charity Name is dedicated to making a positive impact by providing food, education, and support to underprivileged children worldwide. Your contributions help us reach more lives and create lasting change.</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">The host and co-hosts are raising funds for <span className="font-semibold text-pink-600 dark:text-pink-300">Charity Name</span>!</p>
            {/* Checklist of milestones */}
            <ul className="space-y-3 w-full mb-6">
              <li className="flex items-center gap-2">
                <input type="checkbox" checked readOnly className="accent-pink-500 w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-200 text-sm">Announce the campaign</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" checked={true} readOnly className="accent-pink-500 w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-200 text-sm">Reach 25% of goal</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" checked={false} readOnly className="accent-pink-500 w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-200 text-sm">Reach 50% of goal</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" checked={false} readOnly className="accent-pink-500 w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-200 text-sm">Thank top donors live</span>
              </li>
            </ul>
            {/* Charity Progress Meter */}
            <div className="w-full mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">Raised</span>
                <span className="text-pink-600 dark:text-pink-300 font-semibold">$3,000 / $10,000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
                <div className="h-3 rounded-full bg-pink-500 transition-all duration-500" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
        {/* User Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowProfileModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" onClick={e => e.stopPropagation()}>
              <div className="flex flex-col items-center">
                <img src={profileUserId === host.uid ? host.avatar : (cohosts.find(h => h.uid === profileUserId)?.avatar || '')} alt="avatar" className="w-20 h-20 rounded-full mb-2" />
                <span className="font-bold text-lg mb-1">{profileUserId === host.uid ? host.name : (cohosts.find(h => h.uid === profileUserId)?.name || '')}</span>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => setShowProfileModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form Dialog */}
        <Dialog.Root open={showBookingForm} onOpenChange={setShowBookingForm}>
          {bookingHost && (
            <Dialog.Portal>
              <BookingRequestForm
                hostId={bookingHost.id}
                hostName={bookingHost.name}
                hostAvatar={bookingHost.avatar}
                services={bookingHost.services?.map(service => ({
                  title: service.title,
                  price: service.price,
                  description: service.description
                }))}
                onSubmit={handleBookingRequest}
                onCancel={() => setShowBookingForm(false)}
              />
            </Dialog.Portal>
          )}
        </Dialog.Root>
      </div>
    </div>
  );
} 