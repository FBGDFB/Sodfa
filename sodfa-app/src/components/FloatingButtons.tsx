"use client";

import React from "react";
import { WhatsAppIcon, ArrowUpSVG } from "./icons";

interface FloatingButtonsProps {
  waLink: string;
  showScrollTop: boolean;
}

export default function FloatingButtons({
  waLink,
  showScrollTop,
}: FloatingButtonsProps) {
  return (
    <>
      <a
        className="fbtn fab"
        data-btn="waFab"
        href={waLink}
        target="_blank"
        rel="noopener"
        aria-label="تواصل عبر واتساب"
        style={{ right: 22, bottom: 22 }}
      >
        <WhatsAppIcon size={28} />
      </a>
      <button
        className={`fbtn top-btn${showScrollTop ? " show" : ""}`}
        data-btn="scrollTop"
        aria-label="العودة للأعلى"
        style={{ left: 22, bottom: 22 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUpSVG />
      </button>
    </>
  );
}
