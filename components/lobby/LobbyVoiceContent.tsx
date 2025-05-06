import React, { useState } from "react";
import HostAvatarCircle from "@/components/lobby/HostAvatarCircle";
import * as Popover from "@radix-ui/react-popover";
import { User, Gift } from "lucide-react";
import UserProfileModal from "@/components/user/UserProfileModal";
import BookingRequestForm from "@/components/messages/BookingRequestForm";
import * as Dialog from "@radix-ui/react-dialog";

interface Cohost {
  id: string;
  name: string;
  avatar: string;
  specialty?: string;
  online: boolean;
  bio?: string;
  services?: { title: string; price: string; description: string }[];
  followers?: number;
  following?: number;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  posts?: {
    id: string;
    image: string;
    caption: string;
    likes: number;
    comments: number;
    timestamp: string;
  }[];
}

interface LobbyVoiceContentProps {
  host: {
    id?: string;
    name: string;
    avatar: string;
    bio?: string;
    specialty?: string;
    services?: { title: string; price: string; description: string }[];
    followers?: number;
    following?: number;
    socialMedia?: {
      instagram?: string;
      twitter?: string;
      tiktok?: string;
    };
    posts?: {
      id: string;
      image: string;
      caption: string;
      likes: number;
      comments: number;
      timestamp: string;
    }[];
  };
  cohosts: Cohost[];
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

  // Handlers for popover actions
  const handleProfileClick = (id: string | undefined) => {
    setProfileUserId(id || 'host');
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

  // Split cohosts into rows of 4
  const cohostRows = chunkArray(cohosts, 4);

  return (
    <div className="relative w-full aspect-video bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 flex flex-row items-stretch justify-center rounded-b-lg shadow-md overflow-hidden">
      {/* Left: Host & Cohosts */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Host Popover */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Popover.Root open={hostPopoverOpen} onOpenChange={setHostPopoverOpen}>
            <Popover.Trigger asChild>
              <div className="cursor-pointer">
                <HostAvatarCircle
                  avatar={"https://randomuser.me/api/portraits/women/44.jpg"}
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
                  {host.specialty && <span className="text-xs text-gray-500 dark:text-gray-400">{host.specialty}</span>}
                  {host.bio && <span className="text-xs text-gray-600 dark:text-gray-300 mb-1">{host.bio}</span>}
                  <div className="flex justify-center gap-2 mt-2">
                    <button
                      onClick={() => handleProfileClick(host.id)}
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
        </div>
        {/* Cohosts Popovers in dynamic rows */}
        <div className="flex flex-col gap-8">
          {cohostRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-row items-center gap-10 justify-start">
              {row.map((cohost) => (
                <Popover.Root
                  key={cohost.id}
                  open={openPopoverId === cohost.id}
                  onOpenChange={(open) => setOpenPopoverId(open ? cohost.id : null)}
                >
                  <Popover.Trigger asChild>
                    <div className="cursor-pointer">
                      <HostAvatarCircle
                        avatar={cohost.avatar}
                        name={cohost.name}
                        role="Cohost"
                        online={cohost.online}
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
                        {cohost.specialty && <span className="text-xs text-gray-500 dark:text-gray-400">{cohost.specialty}</span>}
                        {cohost.bio && <span className="text-xs text-gray-600 dark:text-gray-300 mb-1">{cohost.bio}</span>}
                        <div className="flex justify-center gap-2 mt-2">
                          <button
                            onClick={() => handleProfileClick(cohost.id)}
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
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Right: Charity Goal/Checklist */}
      <div className="w-80 max-w-xs flex flex-col justify-between items-center p-6 bg-white/90 dark:bg-gray-900/80 border-l border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="w-full">
          {/* About the Charity */}
          <div className="mb-4 p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800">
            <h4 className="text-sm font-semibold text-pink-700 dark:text-pink-200 mb-1">About the Charity</h4>
            <p className="text-xs text-gray-700 dark:text-gray-200">Charity Name is dedicated to making a positive impact by providing food, education, and support to underprivileged children worldwide. Your contributions help us reach more lives and create lasting change.</p>
          </div>
          <h3 className="text-lg font-bold text-pink-600 dark:text-pink-300 mb-2">Charity Goal</h3>
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
        </div>
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
      {/* User Profile Modal */}
      {showProfileModal && (
        profileUserId === 'host' ? (
          <UserProfileModal
            user={{
              id: 'host',
              name: host.name,
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              bio: host.bio,
              online: true,
              followers: host.followers || 0,
              following: host.following || 0,
              socialMedia: host.socialMedia,
              posts: host.posts,
              services: host.services
            }}
            onClose={() => setShowProfileModal(false)}
            open={showProfileModal}
          />
        ) : (
          <UserProfileModal
            user={cohosts.find(h => h.id === profileUserId)!}
            onClose={() => setShowProfileModal(false)}
            open={showProfileModal}
          />
        )
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
  );
} 