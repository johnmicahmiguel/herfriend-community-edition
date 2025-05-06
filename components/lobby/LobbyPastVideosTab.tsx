import React from "react";
import { Lock, Play, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Slider from "@radix-ui/react-slider";
import * as Tooltip from "@radix-ui/react-tooltip";

const pastVideos = [
  {
    id: 1,
    title: "Wildlife Adventure - Episode 1",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    duration: "45:12",
  },
  {
    id: 2,
    title: "Mountain Trekking Highlights",
    thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    duration: "38:27",
  },
  {
    id: 3,
    title: "River Rafting Recap",
    thumbnail: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    duration: "52:10",
  },
  {
    id: 4,
    title: "Desert Survival Guide",
    thumbnail: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    duration: "41:05",
  },
];

export default function LobbyPastVideosTab() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState<typeof pastVideos[number] | null>(null);
  const [showCharityInfo, setShowCharityInfo] = React.useState(false);
  const [unlockedVideoIds, setUnlockedVideoIds] = React.useState<number[]>([]);
  const [playModalOpen, setPlayModalOpen] = React.useState(false);
  const [playingVideo, setPlayingVideo] = React.useState<typeof pastVideos[number] | null>(null);

  // Configurable values (could come from props or API)
  const minPrice = 50; // Creator sets this
  const maxPrice = minPrice * 4;
  const defaultPrice = minPrice * 2;
  const triplePrice = minPrice * 3;
  const creatorSplit = 0.5; // 50-50 split up to triple

  // State for slider value (price)
  const [price, setPrice] = React.useState(defaultPrice);

  // Calculate creator and charity shares
  let creatorAmount = minPrice;
  let charityAmount = price - minPrice;
  if (price <= triplePrice) {
    creatorAmount = Math.max(minPrice, price * creatorSplit);
    charityAmount = price - creatorAmount;
  } else {
    creatorAmount = triplePrice * creatorSplit;
    charityAmount = price - creatorAmount;
  }

  // Slider handler
  const handlePriceSlider = (value: number[]) => {
    setPrice(value[0]);
  };

  const handleUnlockClick = (video: typeof pastVideos[number]) => {
    setSelectedVideo(video);
    setDialogOpen(true);
  };

  // Handle unlock confirmation
  const handleConfirmUnlock = () => {
    if (selectedVideo) {
      setUnlockedVideoIds((prev) => [...prev, selectedVideo.id]);
      setDialogOpen(false);
    }
  };

  // Handle clicking unlocked video to play
  const handlePlayClick = (video: typeof pastVideos[number]) => {
    setPlayingVideo(video);
    setPlayModalOpen(true);
  };

  // Mood feedback for slider
  function getSliderMood(price: number) {
    const range = maxPrice - minPrice;
    if (price <= minPrice + range * 0.15) {
      return { face: '😢', message: 'Oh no! Charity is on a diet... Slide right to feed some hope!' };
    } else if (price >= maxPrice - range * 0.15) {
      return { face: '🥳', message: "Legend! You just unlocked max generosity mode! 🎉" };
    } else if (price >= triplePrice) {
      return { face: '😃', message: 'Charity jackpot! You\'re making the world brighter.' };
    } else if (price >= defaultPrice) {
      return { face: '😊', message: 'Nice! Sharing is caring, and you\'re nailing it.' };
    } else {
      return { face: '😐', message: 'Every bit helps! But a little nudge right wouldn\'t hurt 😉' };
    }
  }
  const { face, message: moodMessage } = getSliderMood(price);

  // Helper for mood-based color
  function getMoodColor(face: string) {
    if (face === '😢') return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
    if (face === '😐') return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200';
    if (face === '😊' || face === '😃') return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
    if (face === '🥳') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900';
    return '';
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h3 className="text-sm md:text-base font-medium mb-4 text-blue-500">Past Videos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {pastVideos.map((video) => {
          const unlocked = unlockedVideoIds.includes(video.id);
          return (
            <div key={video.id} className="relative rounded-lg overflow-hidden shadow bg-white dark:bg-gray-900 group">
              {unlocked ? (
                <div className="relative w-full h-40 bg-black cursor-pointer" onClick={() => handlePlayClick(video)}>
                  <video
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    className="w-full h-40 object-cover"
                    poster={video.thumbnail}
                    controls={false}
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-60 transition">
                    <Play className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center">
                    <Lock className="w-10 h-10 text-blue-400 mb-2 drop-shadow" />
                    <span className="text-blue-100 font-semibold text-lg mb-1">Locked</span>
                    <span className="text-blue-200 text-xs mb-3">Unlock to watch this video</span>
                    <button
                      className="relative border border-blue-400 text-blue-400 font-bold py-1.5 px-4 rounded-full flex items-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/50
                        hover:bg-blue-500/10 hover:shadow-lg hover:scale-105
                        before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-blue-400/20 before:to-blue-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:z-[-1]"
                      onClick={() => handleUnlockClick(video)}
                    >
                      <Play className="w-4 h-4 text-blue-400" /> Unlock for ${price}
                    </button>
                  </div>
                </>
              )}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                {video.duration}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-gray-500 dark:text-gray-300 text-sm text-center max-w-md">
        Past videos are premium content. Pay to unlock and enjoy exclusive replays from previous events!
      </p>

      {/* Unlock Modal */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[96vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-auto overflow-x-hidden p-8">
            <Tooltip.Provider>
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-bold text-blue-500 dark:text-blue-300">
                  Unlock Video
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 rounded-full p-1">
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>
              <div className="mb-6">
                <div className="text-gray-700 dark:text-gray-200 mb-2">
                  <span className="font-semibold">You're paying:</span> <span className="text-blue-500 font-bold">${price}</span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 mb-4">
                  <span className="font-semibold">Creator gets:</span> <span className="text-blue-400 font-bold">${creatorAmount}</span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 mb-4">
                  <span className="font-semibold">Charity gets:</span> <span className="text-green-600 dark:text-green-400 font-bold">${charityAmount}</span>
                </div>
                <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  This creator is verified and has pledged to share proceeds to charity.
                </div>
                <div
                  key={moodMessage}
                  className={
                    `text-center mb-4 text-base font-medium rounded-lg px-4 py-3 max-w-xl mx-auto whitespace-pre-line break-words overflow-x-hidden ` +
                    getMoodColor(face) + ' ' +
                    (face === '😢' ? 'animate-shake ' :
                     face === '😐' ? 'animate-fade-in ' :
                     face === '😊' || face === '😃' ? 'animate-pop ' :
                     face === '🥳' ? 'animate-party ' : '')
                  }
                  aria-live="polite"
                  style={{ minWidth: 0, wordBreak: 'break-word' }}
                >
                  {moodMessage}
                </div>
                <div className="relative w-full">
                  {/* Value labels on ends */}
                  <div className="flex justify-between text-xs mb-1 text-gray-400">
                    <span>Minimum (${minPrice})</span>
                    <span>Maximum (${maxPrice})</span>
                  </div>
                  <div className="relative w-full h-10 flex items-center">
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-8 group"
                      min={minPrice}
                      max={maxPrice}
                      step={1}
                      value={[price]}
                      onValueChange={handlePriceSlider}
                      aria-label="Price"
                    >
                      {/* Track with split color */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 rounded-full overflow-hidden pointer-events-none">
                        <div
                          className="absolute left-0 top-0 h-2 transition-all duration-300"
                          style={{
                            width: `${((price - minPrice) / (maxPrice - minPrice)) * 100}%`,
                            background: 'linear-gradient(90deg, #3b82f6 0%, #22d3ee 100%)',
                            borderTopLeftRadius: '9999px',
                            borderBottomLeftRadius: '9999px',
                            borderTopRightRadius: price === maxPrice ? '9999px' : '0',
                            borderBottomRightRadius: price === maxPrice ? '9999px' : '0',
                          }}
                        />
                        <div
                          className="absolute right-0 top-0 h-2 transition-all duration-300"
                          style={{
                            width: `${((maxPrice - price) / (maxPrice - minPrice)) * 100}%`,
                            background: 'linear-gradient(90deg, #22d3ee 0%, #22c55e 100%)',
                            left: `${((price - minPrice) / (maxPrice - minPrice)) * 100}%`,
                            borderTopRightRadius: '9999px',
                            borderBottomRightRadius: '9999px',
                            borderTopLeftRadius: price === minPrice ? '9999px' : '0',
                            borderBottomLeftRadius: price === minPrice ? '9999px' : '0',
                          }}
                        />
                      </div>
                      <Slider.Track className="w-full h-2 bg-transparent relative rounded-full" />
                      {/* Thumb with tooltip */}
                      <Slider.Thumb asChild>
                        <div className="relative z-10">
                          {/* Floating tooltip above thumb */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 -top-8 bg-blue-600 text-white text-xs px-3 py-1 rounded-lg shadow-lg transition-all duration-200 animate-fade-in"
                            style={{
                              opacity: 1,
                              pointerEvents: 'none',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            You pay: ${price} <br />
                            Creator: ${creatorAmount} | Charity: ${charityAmount}
                          </div>
                          <div
                            className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-900 border-2 border-blue-400 shadow-lg rounded-full transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                            style={{ boxShadow: '0 0 0 4px #3b82f655' }}
                          >
                            <span
                              className="text-xl"
                              role="img"
                              aria-label="mood"
                            >
                              {face}
                            </span>
                          </div>
                        </div>
                      </Slider.Thumb>
                    </Slider.Root>
                  </div>
                  {/* Why support charity link */}
                  <div className="flex justify-end mt-2">
                    <Tooltip.Root open={showCharityInfo} onOpenChange={setShowCharityInfo}>
                      <Tooltip.Trigger asChild>
                        <button
                          className="text-xs text-blue-400 hover:underline focus:outline-none"
                          onClick={() => setShowCharityInfo(true)}
                          type="button"
                        >
                          Why support charity?
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content side="top" align="end" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-3 rounded-lg shadow-lg max-w-xs text-xs">
                        Supporting charity helps make a real-world impact. Your contribution goes directly to causes that matter. Even a small percentage can make a big difference!
                        <Tooltip.Arrow className="fill-current text-white dark:text-gray-800" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </div>
                </div>
              </div>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors mt-2" onClick={handleConfirmUnlock}>
                Confirm & Unlock
              </button>
            </Tooltip.Provider>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Play Video Modal */}
      <Dialog.Root open={playModalOpen} onOpenChange={setPlayModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[96vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-black rounded-lg shadow-lg z-50 overflow-auto overflow-x-hidden p-0 flex flex-col items-center justify-center">
            {/* Visually hidden title for accessibility */}
            <Dialog.Title className="sr-only">
              Playing video: {playingVideo?.title || "Past Video"}
            </Dialog.Title>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <video
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                controls
                autoPlay
                className="w-full max-h-[70vh] bg-black"
                poster={playingVideo?.thumbnail}
              />
              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80">
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
} 