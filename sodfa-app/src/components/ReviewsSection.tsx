"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import type { Testimonial } from "@/types/config";
import { LocationSVG, StarRating } from "./icons";

const AUTOPLAY_MS = 4000;
const ANIM_MS = 600;

function getVisibleCount() {
  if (typeof window === "undefined") return 3;
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 640) return 2;
  return 1;
}

export default function ReviewsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const [visible, setVisible] = useState(getVisibleCount);
  const animating = useRef(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const total = testimonials.length;

  const cardWidth = useCallback(() => {
    const vp = viewportRef.current;
    return vp ? vp.clientWidth / visible : 0;
  }, [visible]);

  const translateFor = useCallback(
    (p: number) => {
      const cw = cardWidth();
      const offset = (p + visible) * cw;
      return `translate3d(${offset}px, 0, 0)`;
    },
    [visible, cardWidth]
  );

  const buildSlides = useCallback(() => {
    const slides: React.ReactNode[] = [];
    const v = visible;

    // Clone prefix
    for (let q = -v; q < 0; q++) {
      const idx = ((q % total) + total) % total;
      const t = testimonials[idx];
      slides.push(
        <TestimonialCard key={`pre-${q}`} t={t} cardId={`pre-${q}`} />
      );
    }

    // Originals
    testimonials.forEach((t, i) => {
      slides.push(
        <TestimonialCard key={`orig-${i}`} t={t} cardId={`orig-${i}`} />
      );
    });

    // Clone suffix
    for (let q = total; q < total + v; q++) {
      const idx = ((q % total) + total) % total;
      const t = testimonials[idx];
      slides.push(
        <TestimonialCard key={`suf-${q}`} t={t} cardId={`suf-${q}`} />
      );
    }

    return slides;
  }, [visible, total, testimonials]);

  const moveBy = useCallback(
    (delta: number) => {
      if (animating.current) return;

      setPos((prev) => {
        let next = prev;
        // Infinite wrap
        if (delta > 0 && prev === total) {
          next = 0;
          // Jump
          const track = trackRef.current;
          if (track) {
            track.classList.add("noanim");
            track.style.transform = translateFor(0);
            void track.offsetWidth;
            track.classList.remove("noanim");
          }
        } else if (delta < 0 && prev === 0) {
          next = total;
          const track = trackRef.current;
          if (track) {
            track.classList.add("noanim");
            track.style.transform = translateFor(total);
            void track.offsetWidth;
            track.classList.remove("noanim");
          }
        }

        next += delta;
        if (next < 0 || next > total) return prev;

        animating.current = true;
        setTimeout(() => {
          animating.current = false;
        }, ANIM_MS + 50);

        return next;
      });
    },
    [total, translateFor]
  );

  const startAutoplay = useCallback(() => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    if (total < 2) return;
    autoplayTimer.current = setInterval(() => {
      moveBy(1);
    }, AUTOPLAY_MS);
  }, [total, moveBy]);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = translateFor(pos);
  }, [pos, translateFor]);

  // Start autoplay
  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const newVisible = getVisibleCount();
      setVisible(newVisible);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pause on hover
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    vp.addEventListener("mouseenter", stopAutoplay);
    vp.addEventListener("mouseleave", startAutoplay);
    return () => {
      vp.removeEventListener("mouseenter", stopAutoplay);
      vp.removeEventListener("mouseleave", startAutoplay);
    };
  }, [stopAutoplay, startAutoplay]);

  // Pause when hidden
  useEffect(() => {
    const handleVis = () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    };
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, [stopAutoplay, startAutoplay]);

  const onPrev = () => {
    if (animating.current) return;
    moveBy(-1);
    stopAutoplay();
    startAutoplay();
  };

  const onNext = () => {
    if (animating.current) return;
    moveBy(1);
    stopAutoplay();
    startAutoplay();
  };

  return (
    <div id="reviews">
      <div className="wrap">
        <div className="tst-head rv">
          <div className="sec-head">
            <span className="eyebrow">آراء زبوناتنا</span>
            <h2>ثقتهنّ شرفنا</h2>
            <p style={{ marginTop: ".2rem" }}>
              تجارب حقيقية من عميلاتنا في مختلف المدن
            </p>
          </div>
          <div className="tst-nav">
            <button
              className="tst-btn"
              onClick={onPrev}
              aria-label="السابق"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="tst-btn solid"
              onClick={onNext}
              aria-label="التالي"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div
          className="tst-viewport rv"
          data-d="120"
          ref={viewportRef}
          id="tstViewport"
        >
          <div
            className="tst-track"
            ref={trackRef}
            id="tstTrack"
          >
            {buildSlides()}
          </div>
        </div>
        <p className="tst-count rv" data-d="200">
          ⭐ أكثر من <b>2,500</b> عميلة سعيدة — وهذه مجرد عيّنة من آرائهنّ
        </p>
      </div>
    </div>
  );
}

function TestimonialCard({ t, cardId }: { t: Testimonial; cardId: string }) {
  const rating =
    typeof t.rating !== "undefined" && t.rating !== null
      ? t.rating
      : typeof t.stars !== "undefined"
        ? t.stars
        : 0;

  return (
    <div className="tst-slide">
      <div className="tst-card">
        <span className="quote" aria-hidden="true">
          &rdquo;
        </span>
        <div className="tst-stars">
          <StarRating rating={rating} id={cardId} />
        </div>
        <p>{t.text}</p>
        <div className="tst-who">
          <span className="av">{t.initial || (t.name ? t.name.charAt(0) : "")}</span>
          <div>
            <b className="nm">{t.name}</b>
            {t.city && (
              <span className="loc">
                <LocationSVG />
                {t.city}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
