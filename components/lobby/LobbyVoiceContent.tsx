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
    <div className="flex flex-row items-center justify-center h-96 gap-12 bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 w-full">
      {/* Host Popover */}
      <div className="flex flex-col items-center justify-center">
        <Popover.Root open={hostPopoverOpen} onOpenChange={setHostPopoverOpen}>
          <Popover.Trigger asChild>
            <div className="cursor-pointer">
              <HostAvatarCircle
                avatar={host.avatar}
                name={host.name}
                role="Host"
                size="lg"
                speaking={speakingUser === host.name}
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
      <div className="flex flex-col gap-4">
        {cohostRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex flex-row items-center gap-6 justify-start">
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

      {/* User Profile Modal */}
      {showProfileModal && (
        profileUserId === 'host' ? (
          <UserProfileModal
            user={{
              id: 'host',
              name: host.name,
              avatar: host.avatar,
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