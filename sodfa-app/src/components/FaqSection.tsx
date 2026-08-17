"use client";

import React, { useState } from "react";
import type { FaqItem } from "@/types/config";
import { PlusSVG } from "./icons";

export default function FaqSection({ faq }: { faq: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div id="faq">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">الأسئلة الشائعة</span>
          <h2>كل ما تحتاج معرفته قبل الطلب</h2>
        </div>
        <div className="faq-list">
          {faq.map((f, i) => (
            <FaqItem
              key={i}
              item={f}
              index={i}
              isOpen={openIndex === i}
              onToggle={() =>
                setOpenIndex(openIndex === i ? null : i)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const answerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className={`faq-item rv${isOpen ? " open" : ""}`}
      data-d={index * 60}
    >
      <button className="faq-q" onClick={onToggle}>
        {item.q}
        <span style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .35s" }}>
          <PlusSVG />
        </span>
      </button>
      <div
        className="faq-a"
        ref={answerRef}
        style={{
          maxHeight: isOpen ? answerRef.current?.scrollHeight : 0,
          overflow: "hidden",
          transition: "max-height .45s cubic-bezier(.2, .7, .2, 1)",
        }}
      >
        <p>{item.a}</p>
      </div>
    </div>
  );
}
