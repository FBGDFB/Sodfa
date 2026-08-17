import React from "react";
import type { FlashConfig } from "@/types/config";
import { StarSVG, WhatsAppIcon } from "./icons";

interface FlashSectionProps {
  flash: FlashConfig;
  waLink: string;
}

export default function FlashSection({ flash, waLink }: FlashSectionProps) {
  return (
    <div id="flash">
      <div className="wrap">
        <div className="fs-head rv">
          <h2>🔥 تخفيضات سريعة</h2>
          <div
            className="fs-timer"
            aria-label="الوقت المتبقي على انتهاء العرض"
          >
            <FlashCountdown hours={flash.hours} />
          </div>
          <a
            className="btn btn-main fs-all"
            href={waLink}
            target="_blank"
            rel="noopener"
          >
            عرض الكل
          </a>
        </div>
        <div className="fs-grid">
          {flash.products.map((p, i) => (
            <div key={i} className="fs-card rv" data-d={i * 120}>
              <div className="fs-img">
                <span className="fs-disc">{p.discount}</span>
                <img loading="lazy" src={p.img} alt={p.title} />
              </div>
              <div className="fs-body">
                <div>
                  <h3>{p.title}</h3>
                  <div className="fs-rate">
                    <b>{p.rating}</b> <StarSVG width={14} />{" "}
                    <span>({p.reviews} تقييم)</span>
                  </div>
                </div>
                <div>
                  <div className="fs-price">
                    <b>{p.price}</b>
                    {p.oldPrice && <s>{p.oldPrice}</s>}
                  </div>
                  <button className="fs-add">أضف إلى السلة</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlashCountdown({ hours }: { hours: number }) {
  return <CountdownInner targetMs={Date.now() + hours * 3600 * 1000} />;
}

function CountdownInner({ targetMs }: { targetMs: number }) {
  const [time, setTime] = React.useState({ d: "00", h: "00", m: "00", s: "00" });

  React.useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetMs - Date.now());
      const pad = (n: number) => (n < 10 ? "0" : "") + n;
      setTime({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  return (
    <>
      <div>
        <b>{time.d}</b>
        <small>أيام</small>
      </div>
      <i>:</i>
      <div>
        <b>{time.h}</b>
        <small>ساعات</small>
      </div>
      <i>:</i>
      <div>
        <b>{time.m}</b>
        <small>دقائق</small>
      </div>
      <i>:</i>
      <div>
        <b>{time.s}</b>
        <small>ثواني</small>
      </div>
    </>
  );
}
