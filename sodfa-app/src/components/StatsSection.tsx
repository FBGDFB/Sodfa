"use client";

import React, { useRef, useEffect } from "react";
import type { StatItem } from "@/types/config";

export default function StatsSection({ stats }: { stats: StatItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const span = entry.target as HTMLSpanElement;
          const target = parseInt(span.getAttribute("data-count") || "0", 10);
          const pre = span.getAttribute("data-pre") || "";
          const suf = span.getAttribute("data-suf") || "";
          let startTime: number | null = null;
          const dur = 1600;
          const step = (ts: number) => {
            if (!startTime) startTime = ts;
            const p = Math.min((ts - startTime) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            span.textContent =
              pre + Math.round(target * e).toLocaleString("en-US") + suf;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    el.querySelectorAll("[data-count]").forEach((span) =>
      observer.observe(span)
    );
    return () => observer.disconnect();
  }, []);

  return (
    <div className="dark-band" ref={ref}>
      <div className="wrap stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat rv" data-d={i * 80}>
            <div className="num">
              <span data-count={s.count} data-pre={s.pre || ""} data-suf={s.suf || ""}>
                0
              </span>
            </div>
            <div className="lbl">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
