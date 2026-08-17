import React from "react";

const ITEMS = [
  { icon: "❧", text: "تركيبة 100% طبيعية" },
  { icon: "✦", text: "نتائج ملموسة خلال 30 يوماً" },
  { icon: "❧", text: "استشارة مجانية عبر واتساب" },
  { icon: "✦", text: "الدفع عند الاستلام" },
  { icon: "❧", text: "شحن سريع لجميع المناطق" },
];

export default function TopBar() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="top-bar" aria-hidden="true">
      <div className="mq">
        {doubled.map((item, i) => (
          <span key={i}>
            <i>{item.icon}</i> {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
