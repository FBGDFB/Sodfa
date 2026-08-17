import React from "react";
import type { SiteConfig } from "@/types/config";
import { MapPinSVG, WhatsAppIcon } from "./icons";

export default function StoreSection({ site }: { site: SiteConfig }) {
  return (
    <div id="store" style={{ padding: "5.5rem 0" }}>
      <div className="dark-band store-band" id="storeBand">
        <div className="deco d1" />
        <div className="deco d2" />
        <div className="pat" />
        <div className="wrap store-grid">
          <div className="rv">
            <span className="store-badge">
              <i />📍 عندنا محل حقيقي
            </span>
            <h2>تفضّلي زورينا</h2>
            <p className="desc">
              أهلاً وسهلاً بكل وحدة بغات تزورنا 🌿 بابنا مفتوح ليك. بغيتي
              تشوفي المنتج بعينيك قبل ما تشري؟ مرحبا بك في صودفا — عنوان
              حقيقي وثقة كاملة.
            </p>
            <div className="cinfo">
              <span className="icb">
                <MapPinSVG />
              </span>
              <div>
                <b>العنوان</b>
                <span>{site.address}</span>
              </div>
            </div>
            <div className="cinfo">
              <span className="icb wa">
                <WhatsAppIcon size={20} />
              </span>
              <div>
                <b>الهاتف / واتساب</b>
                <a
                  className="gold"
                  href={`https://wa.me/${site.whatsappStore}`}
                  target="_blank"
                  rel="noopener"
                  dir="ltr"
                >
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="cinfo">
              <span className="icb">
                <ClockSVG />
              </span>
              <div>
                <b>أوقات العمل</b>
                <span>{site.hoursStore}</span>
              </div>
            </div>
            <div className="store-btns">
              <a
                className="btn btn-gold"
                href={site.mapsUrl}
                target="_blank"
                rel="noopener"
              >
                <MapPinSVG />
                احصلي على الاتجاهات
              </a>
              <button
                className="btn btn-ghost-light"
                onClick={() => {
                  const el = document.getElementById("contactModal");
                  el?.classList.add("open");
                  document.body.style.overflow = "hidden";
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                تواصلي معنا
              </button>
            </div>
          </div>
          <div className="map-wrap rv" data-d="150">
            <div className="map-glow" />
            <div className="map-frame">
              <iframe
                id="mapFrame"
                title="موقع صودفا"
                loading="lazy"
                allowFullScreen
                src={site.mapsEmbed}
              />
              <div className="map-tag">
                <span className="mt-r">
                  <span className="dot" />📍 الموقع الحقيقي
                </span>
                <b>{site.addressShort}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClockSVG() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
