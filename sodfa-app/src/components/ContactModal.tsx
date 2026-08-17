"use client";

import React, { useState, useRef } from "react";
import type { SiteConfig } from "@/types/config";
import {
  CloseSVG,
  PhoneSVG,
  MailSVG,
  MapPinSVG,
  ClockSVG,
  WhatsAppIcon,
  InstagramSVG,
  FacebookSVG,
  SendSVG,
} from "./icons";

interface ContactModalProps {
  site: SiteConfig;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export default function ContactModal({
  site,
  onClose,
  showToast,
}: ContactModalProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSent(true);
      showToast("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
      form.reset();
      setTimeout(() => {
        setSent(false);
        setSending(false);
        onClose();
      }, 1800);
    }, 900);
  };

  const waLink = `https://wa.me/${site.whatsappStore}`;

  return (
    <div className="modal open" id="contactModal" data-page="contactModal">
      <div className="ovl" onClick={onClose} />
      <div className="modal-box cm-box">
        <button className="m-close" onClick={onClose} aria-label="إغلاق">
          <CloseSVG />
        </button>
        <div className="cm-form">
          <h3>أرسلي لنا رسالة</h3>
          <p>املئي النموذج وسنرد عليك في أقرب وقت ممكن</p>
          <form id="cForm" ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="f-row">
              <div className="f-field">
                <label htmlFor="cfName">الاسم الكامل</label>
                <input
                  type="text"
                  id="cfName"
                  name="name"
                  placeholder="أدخلي اسمك الكامل"
                  required
                />
              </div>
              <div className="f-field">
                <label htmlFor="cfPhone">رقم الهاتف</label>
                <input
                  type="tel"
                  id="cfPhone"
                  name="phone"
                  placeholder="+212 6XX XXX XXX"
                  required
                />
              </div>
            </div>
            <div className="f-field">
              <label htmlFor="cfEmail">البريد الإلكتروني</label>
              <input
                type="email"
                id="cfEmail"
                name="email"
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="f-field">
              <label htmlFor="cfMsg">الرسالة</label>
              <textarea
                id="cfMsg"
                name="message"
                rows={4}
                placeholder="اكتبي رسالتك هنا..."
                required
              />
            </div>
            <button
              type="submit"
              className={`btn btn-send${sent ? " sent" : ""}`}
              disabled={sending}
            >
              {sent ? (
                "✓ تم إرسال رسالتك بنجاح"
              ) : sending ? (
                "جارٍ الإرسال..."
              ) : (
                <>
                  <SendSVG />
                  إرسال الرسالة
                </>
              )}
            </button>
          </form>
        </div>
        <div className="cm-side">
          <div className="pat" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3>معلومات التواصل</h3>
            <div className="cinfo">
              <span className="icb">
                <PhoneSVG />
              </span>
              <div>
                <b>الهاتف</b>
                <a
                  className="gold"
                  href={`tel:${site.phoneTel}`}
                  dir="ltr"
                >
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="cinfo">
              <span className="icb">
                <MailSVG />
              </span>
              <div>
                <b>البريد الإلكتروني</b>
                <a
                  className="gold"
                  href={`mailto:${site.email}`}
                  dir="ltr"
                >
                  {site.email}
                </a>
              </div>
            </div>
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
              <span className="icb">
                <ClockSVG />
              </span>
              <div>
                <b>ساعات العمل</b>
                <span>{site.hoursContact}</span>
              </div>
            </div>
            <h4>تابعينا على</h4>
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
              {site.tiktok && (
                <a
                  href={site.tiktok}
                  target="_blank"
                  rel="noopener"
                  aria-label="TikTok"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.6 3c.4 2 1.7 3.4 3.9 3.6v2.9c-1.5 0-2.8-.4-3.9-1.2v5.6c0 3.9-2.7 6.1-5.7 6.1-3.2 0-5.9-2.3-5.9-5.7 0-3.6 3.1-6 6.5-5.6v3c-1.7-.4-3.4.6-3.4 2.5 0 1.6 1.2 2.8 2.8 2.8 1.6 0 2.8-1.1 2.8-3V3h2.9z" />
                  </svg>
                </a>
              )}
            </div>
            <a
              className="btn btn-wa"
              href={waLink}
              target="_blank"
              rel="noopener"
              style={{ marginTop: "1.5rem", width: "100%", padding: ".95rem" }}
            >
              <WhatsAppIcon size={19} />
              تواصلي معنا عبر واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
