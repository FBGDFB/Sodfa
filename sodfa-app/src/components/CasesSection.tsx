"use client";

import React, { useRef, useEffect, useState } from "react";
import type { CaseItem } from "@/types/config";
import { StarSVG, DragSVG } from "./icons";

export default function CasesSection({ cases }: { cases: CaseItem[] }) {
  return (
    <div id="cases">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">نتائج حقيقية قبل وبعد</span>
          <h2>شاهدوا التحول المذهل بعد شهرين من الاستخدام المنتظم</h2>
          <p>اسحب المؤشر يميناً ويساراً لمقارنة النتائج بنفسك.</p>
        </div>
        <div className="case-grid">
          {cases.map((cs, i) => (
            <CaseCard key={i} cs={cs} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CaseCard({ cs, index }: { cs: CaseItem; index: number }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [used, setUsed] = useState(false);

  useEffect(() => {
    const sl = sliderRef.current;
    if (!sl) return;

    let dragging = false;

    const setFromX = (x: number) => {
      const r = sl.getBoundingClientRect();
      const p = ((x - r.left) / r.width) * 100;
      const clamped = Math.max(6, Math.min(94, p));
      sl.style.setProperty("--pos", `${clamped}%`);
      setUsed(true);
    };

    const handleDown = (e: PointerEvent) => {
      dragging = true;
      sl.setPointerCapture(e.pointerId);
      setFromX(e.clientX);
    };

    const handleMove = (e: PointerEvent) => {
      if (dragging) setFromX(e.clientX);
    };

    const handleUp = () => {
      dragging = false;
    };

    sl.addEventListener("pointerdown", handleDown);
    sl.addEventListener("pointermove", handleMove);
    sl.addEventListener("pointerup", handleUp);
    sl.addEventListener("pointercancel", handleUp);

    const knob = sl.querySelector(".knob") as HTMLElement | null;
    const handleKey = (e: KeyboardEvent) => {
      const cur =
        parseFloat(getComputedStyle(sl).getPropertyValue("--pos")) || 50;
      if (e.key === "ArrowLeft") {
        sl.style.setProperty("--pos", `${Math.max(6, cur - 4)}%`);
        e.preventDefault();
        setUsed(true);
      }
      if (e.key === "ArrowRight") {
        sl.style.setProperty("--pos", `${Math.min(94, cur + 4)}%`);
        e.preventDefault();
        setUsed(true);
      }
    };

    if (knob) knob.addEventListener("keydown", handleKey);

    return () => {
      sl.removeEventListener("pointerdown", handleDown);
      sl.removeEventListener("pointermove", handleMove);
      sl.removeEventListener("pointerup", handleUp);
      sl.removeEventListener("pointercancel", handleUp);
      if (knob) knob.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <article className="case rv" data-d={index * 120}>
      <div
        className={`ba${used ? " used" : ""}`}
        ref={sliderRef}
        style={{ "--pos": "50%" } as React.CSSProperties}
      >
        <img
          className="after"
          src={cs.after}
          alt={cs.afterAlt || "بعد الاستخدام"}
        />
        <img
          className="before"
          src={cs.before}
          alt={cs.beforeAlt || "قبل الاستخدام"}
        />
        <span className="tag b">{cs.beforeTag}</span>
        <span className="tag a">{cs.afterTag}</span>
        <div className="handle">
          <div className="knob" tabIndex={0} aria-label="اسحب للمقارنة">
            <DragSVG />
          </div>
        </div>
        {!used && (
          <span className="hint">
            <DragSVG />
            اسحب للمقارنة
          </span>
        )}
      </div>
      <div className="case-body">
        <div className="who">
          <h3>{cs.name}</h3>
          <span>{cs.period}</span>
        </div>
        <blockquote>&ldquo;{cs.quote}&rdquo;</blockquote>
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <StarSVG key={i} width={15} />
          ))}
        </div>
      </div>
    </article>
  );
}
