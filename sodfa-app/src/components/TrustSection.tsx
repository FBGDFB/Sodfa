import React from "react";
import type { TrustItem } from "@/types/config";
import { ICONS } from "./icons";

export default function TrustSection({ trust }: { trust: TrustItem[] }) {
  return (
    <div className="dark-band">
      <div className="trust-grid">
        {trust.map((t, i) => (
          <div key={i} className="tb-item rv" data-d={i * 80}>
            <span className="tb-ic">
              {ICONS[t.icon] || ICONS.leaf}
            </span>
            <div>
              <b>{t.title}</b>
              <small>{t.desc}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
