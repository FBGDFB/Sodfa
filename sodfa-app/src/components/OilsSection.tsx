"use client";

import React, { useState, useRef } from "react";
import type { OilItem } from "@/types/config";
import { CheckSVG, ChevronDownSVG } from "./icons";

const COLLAPSED_COUNT = 4;
const ANIM_MS = 780;

export default function OilsSection({ oils }: { oils: OilItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const first = oils.slice(0, COLLAPSED_COUNT);
  const rest = oils.slice(COLLAPSED_COUNT);
  const hasExtra = rest.length > 0;

  const toggleOils = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div id="oils">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">المكونات الطبيعية</span>
          <h2>تركيبة غنية من 16 زيتاً طبيعياً لشعر أكثر صحة</h2>
          <p>
            تجمع التشكيلة بين 16 زيتاً طبيعياً مختاراً بعناية، تعمل معاً
            لتغذية الشعر وترطيب فروة الرأس والعناية به من الجذور حتى الأطراف.
          </p>
        </div>

        <div className="oils-grid">
          {first.map((o, i) => (
            <OilCard key={o.num} oil={o} delay={i * 100} />
          ))}
        </div>

        {hasExtra && (
          <>
            <div
              className={`oils-more${expanded ? " open" : ""}`}
              data-more
              aria-hidden={!expanded}
              ref={moreRef}
            >
              <div className="oils-more-in">
                <div className="oils-grid oils-grid--more">
                  {rest.map((o, i) => (
                    <OilCard key={o.num} oil={o} delay={Math.min(i * 55, 660)} extra />
                  ))}
                </div>
              </div>
            </div>

            <div className="oils-cta">
              <button
                type="button"
                className="oils-toggle"
                aria-expanded={expanded}
                aria-controls="oilsMore"
                onClick={toggleOils}
              >
                <span className="ot-label">
                  {expanded ? "إخفاء الزيوت" : "إظهار المزيد من الزيوت"}
                </span>
                <span className="ot-arrow" aria-hidden="true">
                  <ChevronDownSVG />
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OilCard({
  oil,
  delay,
  extra = false,
}: {
  oil: OilItem;
  delay: number;
  extra?: boolean;
}) {
  return (
    <article
      className={`oil-card${extra ? "" : " rv"}`}
      {...(extra ? { style: { "--d": `${delay}ms` } as React.CSSProperties } : { "data-d": delay })}
    >
      <div className="oil-img">
        <span className="oil-num">{oil.num}</span>
        <img loading="lazy" src={oil.img} alt={oil.name} />
      </div>
      <div className="oil-body">
        <h3>
          {oil.name} <small>{oil.latin}</small>
        </h3>
        <ul>
          {oil.points.map((pt, j) => (
            <li key={j}>
              <CheckSVG />
              {pt}
            </li>
          ))}
        </ul>
        <span className="oil-tag">{oil.tag}</span>
      </div>
    </article>
  );
}
