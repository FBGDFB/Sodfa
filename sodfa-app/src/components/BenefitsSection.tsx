"use client";

import React, { useRef, useEffect } from "react";
import type { BenefitItem } from "@/types/config";
import { BEN_ICONS } from "./icons";

export default function BenefitsSection({
  benefits,
  videoUrl,
}: {
  benefits: BenefitItem[];
  videoUrl?: string;
}) {
  const bandRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    const band = bandRef.current;
    if (!vid) return;

    const handleCanPlay = () => {
      vid.classList.add("ready");
      if (band) band.classList.add("video-on");
      vid.play().catch(() => {});
    };

    const handleError = () => {
      vid.style.display = "none";
    };

    vid.addEventListener("canplay", handleCanPlay);
    vid.addEventListener("error", handleError);

    return () => {
      vid.removeEventListener("canplay", handleCanPlay);
      vid.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <div id="benefits" style={{ padding: 0 }}>
      <div
        className="dark-band"
        ref={bandRef}
        id="benefitsBand"
      >
        {videoUrl && (
          <>
            <video
              ref={videoRef}
              className="bg-video"
              id="benefitsVideo"
              muted
              loop
              playsInline
              preload="auto"
              src={videoUrl}
            />
            <div className="bg-vid-overlay" />
          </>
        )}
        <div className="wrap inner">
          <div className="sec-head rv" style={{ marginBottom: "2.6rem" }}>
            <span className="eyebrow" style={{ color: "var(--accent-soft)" }}>
              مميزات السيروم
            </span>
            <h2>خمس فوائد أساسية تجمعها تركيبتنا الطبيعية المتكاملة</h2>
            <p>صُممت كل قطرة لتعمل على مستوى البصيلة، فتعالج السبب لا المظهر فقط.</p>
          </div>
          <div className="ben-grid" style={{ paddingTop: 0 }}>
            {benefits.map((b, i) => (
              <div
                key={i}
                className={`ben w${b.span} rv`}
                data-d={[0, 80, 160, 120, 200][i] || 0}
              >
                <span className="ghost">{String(i + 1).padStart(2, "0")}</span>
                <div className="ic">{BEN_ICONS[b.icon]}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
