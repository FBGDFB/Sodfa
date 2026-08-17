"use client";

import React from "react";
import type { PricingConfig } from "@/types/config";
import { WhatsAppIcon } from "./icons";

interface CtaSectionProps {
  pricing: PricingConfig;
  waLink: string;
}

export default function CtaSection({ pricing, waLink }: CtaSectionProps) {
  const [time, setTime] = React.useState({ h: "00", m: "00", s: "00" });

  React.useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const pad = (n: number) => (n < 10 ? "0" : "") + n;
      setTime({
        h: pad(Math.floor(diff / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="cta" style={{ paddingTop: "2rem" }}>
      <div className="wrap">
        <div className="cta-card rv">
          <div className="cta-txt">
            <span className="eyebrow">تحدث مع خبيرنا للطلب</span>
            <h2>
              احصل على التركيبة الطبيعية المتكاملة واستمتع بشعر قوي، لامع،
              وصحي
            </h2>
            <p>
              تواصل معنا الآن عبر واتساب للحصول على استشارة مجانية كاملة،
              وسيرافقك خبيرنا خطوة بخطوة حتى تحقيق النتائج.
            </p>
            <ul className="cta-list">
              <li>
                <CheckBullet /> استشارة مجانية
              </li>
              <li>
                <CheckBullet /> الدفع عند الاستلام
              </li>
              <li>
                <CheckBullet /> شحن سريع وآمن
              </li>
              <li>
                <CheckBullet /> ضمان الرضا
              </li>
            </ul>
          </div>
          <div className="cta-side">
            <span className="off">✦ عرض اليوم الخاص ✦</span>
            <div
              className="cd"
              aria-label="الوقت المتبقي على انتهاء العرض"
            >
              <div>
                <b>{time.h}</b>
                <small>ساعة</small>
              </div>
              <div>
                <b>{time.m}</b>
                <small>دقيقة</small>
              </div>
              <div>
                <b>{time.s}</b>
                <small>ثانية</small>
              </div>
            </div>
            <div className="cta-price" aria-label="عرض السعر">
              <span className="cta-price-label">{pricing.label}</span>
              <div className="cta-price-row">
                <span className="cta-price-cur-num">{pricing.current}</span>
                <span className="cta-price-cur-unit">
                  {pricing.currency}
                </span>
                <span className="cta-price-sep">عوض</span>
                <span className="cta-price-old-num">{pricing.old}</span>
                <span className="cta-price-old-unit">
                  {pricing.currency}
                </span>
              </div>
            </div>
            <a
              className="btn btn-wa"
              href={waLink}
              target="_blank"
              rel="noopener"
            >
              <WhatsAppIcon size={20} />
              اطلب الآن عبر الواتساب
            </a>
            <small className="note">
              رد فوري خلال دقائق • خدمة 7 أيام في الأسبوع
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckBullet() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
