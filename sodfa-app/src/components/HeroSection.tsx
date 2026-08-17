"use client";

import React, { useRef, useEffect, useState } from "react";
import type { HeroConfig, SiteConfig } from "@/types/config";
import { WhatsAppIcon } from "./icons";

interface HeroSectionProps {
  hero: HeroConfig;
  site: SiteConfig;
}

export default function HeroSection({ hero, site }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(true);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const tilt = tiltRef.current;
    if (!section || !tilt) return;
    if (
      !window.matchMedia("(hover:hover) and (pointer:fine)").matches
    )
      return;

    const handleMouse = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
      tilt.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    };

    const handleLeave = () => {
      tilt.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    section.addEventListener("mousemove", handleMouse);
    section.addEventListener("mouseleave", handleLeave);
    return () => {
      section.removeEventListener("mousemove", handleMouse);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const waLink = `https://wa.me/${site.whatsappMain}?text=${encodeURIComponent(site.whatsappMessage)}`;

  const handleScrollDown = () => {
    const sections = document.querySelectorAll("[data-section]");
    for (const el of sections) {
      if (el.id !== "hero") {
        el.scrollIntoView({ behavior: "smooth" });
        break;
      }
    }
  };

  return (
    <section id="home" className="hero" ref={sectionRef}>
      <div className="blob b1" />
      <div className="blob b2" />
      <svg
        className="leaf-bg"
        style={{ top: -40, left: -60, width: 340 }}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M50 95C50 45 20 30 8 10c30 8 42 25 42 45 0-20 12-37 42-45C80 30 50 45 50 95Z" />
      </svg>
      <svg
        className="leaf-bg"
        style={{
          bottom: -70,
          right: -50,
          width: 420,
          transform: "rotate(160deg)",
        }}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M50 95C50 45 20 30 8 10c30 8 42 25 42 45 0-20 12-37 42-45C80 30 50 45 50 95Z" />
      </svg>

      <div className="wrap hero-grid">
        <div>
          <span
            className={`badge-pill rv${revealed ? " in" : ""}`}
            data-d="0"
          >
            <i />
            <span>{hero.badge}</span>
          </span>
          <h1
            className={`rv${revealed ? " in" : ""}`}
            data-d="80"
            dangerouslySetInnerHTML={{
              __html: `${hero.h1a} <span class="grad">${hero.hl}</span> ${hero.h1b}`,
            }}
          />
          <p
            className={`lead rv${revealed ? " in" : ""}`}
            data-d="160"
            dangerouslySetInnerHTML={{ __html: hero.lead }}
          />
          <div
            className={`hero-cta rv${revealed ? " in" : ""}`}
            data-d="240"
          >
            <a
              className="btn btn-main"
              href={waLink}
              target="_blank"
              rel="noopener"
            >
              <WhatsAppIcon size={18} />
              اطلب عبر الواتساب
            </a>
            <a className="btn btn-line" href="#cases">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  d="M10 9l5 3-5 3V9z"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              شاهد النتائج
            </a>
          </div>
          <div
            className={`trust rv${revealed ? " in" : ""}`}
            data-d="320"
          >
            <div className="avatars">
              <b>ن</b>
              <b>أ</b>
              <b>س</b>
              <b>+8K</b>
            </div>
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: ".5rem" }}
              >
                <span className="stars" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4 5.8 21l1.6-7L2 9.3l7.1-.7z" />
                    </svg>
                  ))}
                </span>
                <span className="rate">{hero.rate}</span>
              </div>
              <small>{hero.trustNote}</small>
            </div>
          </div>
        </div>

        <div
          className={`hero-vis rv${revealed ? " in" : ""}`}
          data-d="150"
        >
          <div className="hero-tilt" ref={tiltRef}>
            <div className="arch">
              <div className="halo" />
              <img
                src={hero.img}
                alt="سيروم SODFA الطبيعي للشعر"
              />
            </div>
            <div className="chip c1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 21C12 13 7 10 5 5c5 2 7 5 7 9 0-4 2-7 7-9-2 5-7 8-7 16z" />
              </svg>
              4 زيوت نادرة
            </div>
            <div className="chip c2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 21s-7-4.6-7-10a7 7 0 0 1 14 0c0 5.4-7 10-7 10z" />
              </svg>
              نتائج خلال 30 يوم
            </div>
            <div className="chip c3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              بدون بارابين أو سلفات
            </div>
            <div className="spin-badge">
              <svg className="ring" viewBox="0 0 120 120">
                <image
                  href="/assets/Image/BRAND.png"
                  width="104"
                  height="104"
                  x="8"
                  y="8"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scrollwrap">
        <div
          className="scroll-ind"
          data-page="scrollIndicator"
          aria-hidden="true"
        />
        <button
          className="scroll-down"
          onClick={handleScrollDown}
          aria-label="انزل للأسفل"
          data-page="scrollDown"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
