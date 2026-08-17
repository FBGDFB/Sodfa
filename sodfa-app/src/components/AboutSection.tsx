import React from "react";
import type { AboutConfig, FounderConfig } from "@/types/config";

interface AboutSectionProps {
  about: AboutConfig;
  founder: FounderConfig;
}

export default function AboutSection({ about, founder }: AboutSectionProps) {
  const founderLogo = founder.logo || "";

  return (
    <div id="about">
      <div className="wrap">
        <div className="about-card rv">
          <div className="about-img">
            <img
              loading="lazy"
              src={founderLogo}
              alt={founder.name ? `مؤسس — ${founder.name}` : "مؤسِّسة SODFA"}
            />
            <span className="about-badge">{about.badge}</span>
          </div>
          <div className="about-body">
            <span className="qmark">&rdquo;</span>
            <span className="eyebrow">{about.eyebrow}</span>
            <h2>{about.title}</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: (about.p1 || "").replace(
                  /كريمة/,
                  "<b>كريمة</b>"
                ),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: (about.p2 || "")
                  .replace(/الدفع عند الاستلام/, "<b>الدفع عند الاستلام</b>")
                  .replace(/إمكانية الإرجاع/, "<b>إمكانية الإرجاع</b>"),
              }}
            />
            <div className="about-sig">{founder.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
