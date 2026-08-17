"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { SodfaConfig } from "@/types/config";

import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import FallingLeaves from "@/components/FallingLeaves";
import FloatingButtons from "@/components/FloatingButtons";
import Toast from "@/components/Toast";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import TrustSection from "@/components/TrustSection";
import FlashSection from "@/components/FlashSection";
import OilsSection from "@/components/OilsSection";
import BenefitsSection from "@/components/BenefitsSection";
import VideoSection from "@/components/VideoSection";
import CasesSection from "@/components/CasesSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import OrderSection from "@/components/OrderSection";
import CtaSection from "@/components/CtaSection";
import StoreSection from "@/components/StoreSection";
import FooterSection from "@/components/FooterSection";
import ContactModal from "@/components/ContactModal";
import VideoModal from "@/components/VideoModal";
import LegalModal from "@/components/LegalModal";

export default function Home() {
  const [config, setConfig] = useState<SodfaConfig | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const openContact = useCallback(() => {
    setContactOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeContact = useCallback(() => {
    setContactOpen(false);
    document.body.style.overflow = "";
  }, []);

  const openVideo = useCallback(() => {
    setVideoOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeVideo = useCallback(() => {
    setVideoOpen(false);
    document.body.style.overflow = "";
  }, []);

  const openLegal = useCallback((key: string) => {
    setLegalOpen(key);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLegal = useCallback(() => {
    setLegalOpen(null);
    document.body.style.overflow = "";
  }, []);

  // Load config
  useEffect(() => {
    fetch("/assets/json/config.json")
      .then((res) => {
        if (!res.ok) throw new Error("config");
        return res.json();
      })
      .then((cfg: SodfaConfig) => {
        setConfig(cfg);
      })
      .catch((err) => {
        console.error("Failed to load config:", err);
      });
  }, []);

  // Scroll handlers
  useEffect(() => {
    const handleScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        max > 0 ? (window.scrollY / max) * 100 : 0
      );
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeVideo();
        closeContact();
        closeLegal();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeVideo, closeContact, closeLegal]);

  if (!config) {
    return (
      <div style={{ padding: "6rem 1rem", textAlign: "center", fontWeight: 800 }}>
        <div className="preloader done" />
      </div>
    );
  }

  const waLink = `https://wa.me/${config.site.whatsappMain}?text=${encodeURIComponent(config.site.whatsappMessage)}`;
  const enabledSections = config.sections.filter((s) => s.enabled);

  const renderSection = (id: string) => {
    switch (id) {
      case "hero":
        return <HeroSection hero={config.hero} site={config.site} />;
      case "stats":
        return (
          <section data-section="stats" id="stats" className="band-wrap">
            <StatsSection stats={config.stats} />
          </section>
        );
      case "trust":
        return (
          <section data-section="trust" id="trust" className="band-wrap">
            <TrustSection trust={config.trust} />
          </section>
        );
      case "flash":
        return (
          <section data-section="flash" id="flash">
            <FlashSection flash={config.flash} waLink={waLink} />
          </section>
        );
      case "oils":
        return (
          <section data-section="oils" id="oils">
            <OilsSection oils={config.oils} />
          </section>
        );
      case "benefits":
        return (
          <section data-section="benefits" id="benefits" style={{ padding: 0 }}>
            <BenefitsSection
              benefits={config.benefits}
              videoUrl={config.site.benefitsVideoUrl}
            />
          </section>
        );
      case "video":
        return (
          <section data-section="video" id="video">
            <VideoSection
              video={config.video}
              videoUrl={config.site.videoUrl}
              onOpenVideoModal={openVideo}
            />
          </section>
        );
      case "cases":
        return (
          <section data-section="cases" id="cases">
            <CasesSection cases={config.cases} />
          </section>
        );
      case "about":
        return (
          <section data-section="about" id="about">
            <AboutSection about={config.about} founder={config.founder} />
          </section>
        );
      case "products":
        return (
          <section data-section="products" id="products">
            <ProductsSection
              products={config.products}
              waLink={config.site.whatsappMain}
            />
          </section>
        );
      case "reviews":
        return (
          <section data-section="reviews" id="reviews">
            <ReviewsSection testimonials={config.testimonials} />
          </section>
        );
      case "faq":
        return (
          <section data-section="faq" id="faq">
            <FaqSection faq={config.faq} />
          </section>
        );
      case "order":
        return (
          <section data-section="order" id="order">
            <OrderSection orderSteps={config.orderSteps} />
          </section>
        );
      case "cta":
        return (
          <section data-section="cta" id="cta">
            <CtaSection pricing={config.pricing} waLink={waLink} />
          </section>
        );
      case "store":
        return (
          <section data-section="store" id="store">
            <StoreSection site={config.site} />
          </section>
        );
      case "footer":
        return (
          <FooterSection
            site={config.site}
            legal={config.legal}
            onOpenContact={openContact}
            onOpenLegal={openLegal}
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  const legalItem = legalOpen
    ? config.legal[legalOpen as keyof typeof config.legal]
    : null;

  return (
    <>
      <Preloader />
      <ScrollProgress progress={scrollProgress} />
      <TopBar />
      <Navbar site={config.site} />
      <FallingLeaves />

      <main id="app">
        {enabledSections.map((s) => (
          <React.Fragment key={s.id}>{renderSection(s.id)}</React.Fragment>
        ))}
      </main>

      <FloatingButtons waLink={waLink} showScrollTop={showScrollTop} />

      {/* Modals */}
      {contactOpen && (
        <ContactModal
          site={config.site}
          onClose={closeContact}
          showToast={showToast}
        />
      )}
      {videoOpen && (
        <VideoModal videoUrl={config.site.videoUrl} onClose={closeVideo} />
      )}
      {legalOpen && legalItem && (
        <LegalModal item={legalItem} onClose={closeLegal} />
      )}

      <Toast message={toastMsg} />
    </>
  );
}
