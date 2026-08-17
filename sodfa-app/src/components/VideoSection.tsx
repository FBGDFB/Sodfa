"use client";

import React, { useRef, useEffect } from "react";
import type { VideoConfig } from "@/types/config";
import { PlaySVG } from "./icons";

interface VideoSectionProps {
  video: VideoConfig;
  videoUrl?: string;
  onOpenVideoModal: () => void;
}

export default function VideoSection({
  video,
  onOpenVideoModal,
}: VideoSectionProps) {
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleClick = () => onOpenVideoModal();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpenVideoModal();
      }
    };

    player.addEventListener("click", handleClick);
    player.addEventListener("keydown", handleKey);

    return () => {
      player.removeEventListener("click", handleClick);
      player.removeEventListener("keydown", handleKey);
    };
  }, [onOpenVideoModal]);

  return (
    <div id="video">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">{video.eyebrow}</span>
          <h2>{video.title}</h2>
          <p>{video.desc}</p>
        </div>
        <div
          className="player rv"
          ref={playerRef}
          role="button"
          tabIndex={0}
          aria-label="تشغيل الفيديو التوضيحي"
          id="player"
        >
          <img
            loading="lazy"
            src={video.poster}
            alt="الفيديو التوضيحي لتركيبة SODFA"
          />
          <div className="play-wrap">
            <div className="play-btn">
              <PlaySVG />
            </div>
          </div>
          <div className="play-cap">{video.caption}</div>
        </div>
      </div>
    </div>
  );
}
