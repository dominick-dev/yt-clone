"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const WatchContent = () => {
  const videoPrefix =
    "https://storage.googleapis.com/devd-yt-processed-videos/";
  const videoSrc = useSearchParams().get("v");

  return (
    <div>
      <h1>Watch Page</h1>
      <video controls src={videoPrefix + videoSrc} />
    </div>
  );
};

export default function Watch() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WatchContent />
    </Suspense>
  );
}
