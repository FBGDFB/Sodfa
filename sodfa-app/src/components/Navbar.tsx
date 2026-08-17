"use client";

import React, { useState, useEffect } from "react";
import type { SiteConfig } from "@/types/config";
import { WhatsAppIcon } from "./icons";

const NAV_LINKS = [
  { href: "#flash", label: "العروض" },
  { href: "#oils", label: "المكونات" },
  { href: "#products", label: "منتجاتنا" },
  { href: "#cases", label: "النتائج" },
  { href: "#about", label: "قصتنا" },
  { href: "#reviews", label: "آراء الزبونات" },
  { href: "#order", label: "طريقة الطلب" },
  { href: "#store", label: "المتجر" },
];

const MOBILE_LINKS = [
  { href: "#home", label: "الرئيسية" },
  { href: "#flash", label: "العروض" },
  { href: "#oils", label: "المكونات" },
  { href: "#products", label: "منتجاتنا" },
  { href: "#cases", label: "النتائج" },
  { href: "#about", label: "قصتنا" },
  { href: "#reviews", label: "آراء الزبونات" },
  { href: "#order", label: "طريقة الطلب" },
  { href: "#store", label: "المتجر" },
  { href: "#faq", label: "الأسئلة الشائعة" },
];

export default function Navbar({ site }: { site: SiteConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waLink = `https://wa.me/${site.whatsappMain}?text=${encodeURIComponent(site.whatsappMessage)}`;

  const closeMenu = () => setMenuOpen(false);

  const handleOpenContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("contactModal");
    el?.classList.add("open");
    document.body.style.overflow = "hidden";
    closeMenu();
  };

  return (
    <nav id="nav" className={scrolled ? "scrolled" : ""}>
      <div className="wrap nav-in">
        <a className="logo has-logo" href="#home" aria-label="SODFA">
          <img src={site.NavbarLogo} alt="SODFA" aria-hidden="true" />
        </a>
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <button className="nav-plain" onClick={handleOpenContact}>
            تواصلي معنا
          </button>
        </div>
        <a
          className="btn btn-main nav-cta"
          href={waLink}
          target="_blank"
          rel="noopener"
        >
          <WhatsAppIcon size={17} />
          تواصل واتساب
        </a>
        <button
          className={`burger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="القائمة"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`m-menu${menuOpen ? " open" : ""}`}>
        {MOBILE_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <button onClick={handleOpenContact}>تواصلي معنا ✉</button>
        <a
          className="btn btn-wa"
          href={waLink}
          target="_blank"
          rel="noopener"
          onClick={closeMenu}
        >
          اطلبي عبر الواتساب
        </a>
      </div>
    </nav>
  );
}
