"use client";

import React, { useEffect, useRef } from "react";

export default function FallingLeaves() {
  const zoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fz = zoneRef.current;
    if (!fz || fz.dataset.seeded) return;

    for (let i = 0; i < 30; i++) {
      const el = document.createElement("span");
      const flower = i % 4 === 3;
      el.className = `faller${flower ? " flower" : ""}`;
      const sz = flower ? 12 + Math.random() * 8 : 14 + Math.random() * 14;
      el.style.width = `${sz}px`;
      el.style.height = `${sz}px`;
      el.style.left = `${2 + Math.random() * 94}%`;
      el.style.opacity = String(
        flower
          ? (0.35 + Math.random() * 0.25).toFixed(2)
          : (0.22 + Math.random() * 0.28).toFixed(2)
      );
      const dur = 12 + Math.random() * 11;
      el.style.animationDuration = `${dur}s`;
      el.style.animationDelay = `${-Math.random() * dur}s`;

      if (flower) {
        el.innerHTML =
          '<svg viewBox="0 0 24 24" width="100%" height="100%"><g fill="currentColor"><circle cx="12" cy="5" r="3.1"/><circle cx="18.7" cy="9.9" r="3.1"/><circle cx="16.1" cy="17.6" r="3.1"/><circle cx="7.9" cy="17.6" r="3.1"/><circle cx="5.3" cy="9.9" r="3.1"/></g><circle cx="12" cy="12" r="2.5" fill="#C6A15B"/></svg>';
      } else {
        el.innerHTML =
          '<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 2C6.5 7.5 4.5 11.5 6.3 16c1.5 3.8 5.7 6 5.7 6s4.2-2.2 5.7-6c1.8-4.5-.2-8.5-5.7-14z"/></svg>';
      }
      fz.appendChild(el);
    }
    fz.dataset.seeded = "true";
  }, []);

  return <div id="fallZone" ref={zoneRef} aria-hidden="true" />;
}
