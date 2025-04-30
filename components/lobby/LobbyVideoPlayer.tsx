import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function LobbyVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoRef.current);
        return () => {
          hls.destroy();
        };
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = hlsUrl;
      }
    }
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black flex items-center justify-center rounded-b-lg shadow-md overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls
        playsInline
        muted
      />
    </div>
  );
} 