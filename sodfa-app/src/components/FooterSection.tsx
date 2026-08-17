"use client";

import React, { useRef, useEffect, useState } from "react";
import type { SiteConfig, LegalItem } from "@/types/config";
import { InstagramSVG, FacebookSVG, WhatsAppIcon, PhoneSVG, MapPinSVG } from "./icons";

interface FooterSectionProps {
  site: SiteConfig;
  legal: {
    privacy: LegalItem;
    terms: LegalItem;
    cookies: LegalItem;
  };
  onOpenContact: () => void;
  onOpenLegal: (key: string) => void;
  showToast: (msg: string) => void;
}

export default function FooterSection({
  site,
  legal,
  onOpenContact,
  onOpenLegal,
  showToast,
}: FooterSectionProps) {
  const [nlBtnText, setNlBtnText] = useState("اشتركي الآن");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    if (!input.value) return;
    setNlBtnText("✓ تم الاشتراك");
    showToast("تم اشتراكك في النشرة البريدية بنجاح 🌿");
    setTimeout(() => {
      setNlBtnText("اشتركي الآن");
      input.value = "";
    }, 3000);
  };

  return (
    <footer className="site-footer" data-page="footer">
      <div className="deco d1" />
      <div className="deco d2" />
      <div className="pat" />
      <div className="wrap">
        <div className="ft-grid">
          <div className="ft-col ft-brand rv">
            <a className="logo-ft" href="#home" aria-label="SODFA">
              <span className="ft-logo-c">
                <img
                  data-site-logo="footer"
                  src={site.footerLogo || "/assets/Image/FooterLogo.jpg"}
                  alt="SODFA"
                  aria-hidden="true"
                />
              </span>
              <span>
                <span className="nm">{site.brandName}</span>
                <span className="tg">{site.tagline}</span>
              </span>
            </a>
            <p>
              تركيبة طبيعية متكاملة من أربعة زيوت نادرة، صُنعت بعناية لتعيد
              لشعرك كثافته ولمعانه — من الجذور حتى الأطراف.
            </p>
            <div className="social-row" data-page="socialIcons">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
              >
                <InstagramSVG />
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
              >
                <FacebookSVG />
              </a>
            </div>
          </div>

          <div className="ft-col rv" data-d="80">
            <h4>روابط سريعة</h4>
            <ul className="ft-links">
              <li>
                <a href="#home">الرئيسية</a>
              </li>
              <li>
                <a href="#products">منتجاتنا</a>
              </li>
              <li>
                <a href="#order">كيفاش نخدمو</a>
              </li>
              <li>
                <a href="#about">قصتنا</a>
              </li>
              <li>
                <a href="#faq">الأسئلة الشائعة</a>
              </li>
              <li>
                <button onClick={onOpenContact}>تواصلي معنا</button>
              </li>
            </ul>
          </div>

          <div
            className="ft-col ft-contact rv"
            data-d="160"
            data-page="contact"
          >
            <h4>تواصلي معنا</h4>
            <ul>
              <li>
                <em>📱</em>
                <span>
                  واتساب:{" "}
                  <a
                    href={`https://wa.me/${site.whatsappStore}`}
                    target="_blank"
                    rel="noopener"
                    dir="ltr"
                  >
                    {site.phoneDisplay}
                  </a>
                </span>
              </li>
              <li>
                <em>📞</em>
                <span>
                  الهاتف:{" "}
                  <a href={`tel:${site.phoneTel}`} dir="ltr">
                    {site.phoneDisplay}
                  </a>
                </span>
              </li>
              <li>
                <em>📍</em>
                <span>
                  العنوان: <span className="addr">{site.address}</span>
                </span>
              </li>
            </ul>
            <button className="msg-btn" onClick={onOpenContact}>
              ✉ أو أرسلي رسالة مباشرة
            </button>
          </div>

          <div className="ft-col rv" data-d="240" data-page="newsletter">
            <h4>نشرة البريد</h4>
            <p className="nl-txt">
              اشتركي لتصلك أحدث العروض والمنتجات الجديدة
            </p>
            <form className="nl-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                required
              />
              <button type="submit" className="nl-btn">
                {nlBtnText}
              </button>
            </form>
            <div className="trust-badges">
              <span>
                <i />توصيل آمن
              </span>
              <span>
                <i />منتجات طبيعية
              </span>
              <span>
                <i />دعم على واتساب
              </span>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <p className="cpy">
            © 2026 <b>SODFA</b>. جميع الحقوق محفوظة{" "}
            <span style={{ display: "inline-block" }}>
              {" "}
              🇲🇦 صنع بحب في المغرب
            </span>
          </p>
          <div className="pay-wrap">
            <span>دفع آمن</span>
            <div className="pay-chips">
              <span>VISA</span>
              <span>MC</span>
              <span>COD</span>
            </div>
          </div>
          <div className="legal-links" data-page="legal">
            <button onClick={() => onOpenLegal("privacy")}>الخصوصية</button>
            <i />
            <button onClick={() => onOpenLegal("terms")}>الشروط</button>
            <i />
            <button onClick={() => onOpenLegal("cookies")}>الكوكيز</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
