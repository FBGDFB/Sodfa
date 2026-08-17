"use client";

import React from "react";
import type { LegalItem } from "@/types/config";
import { CloseSVG } from "./icons";

interface LegalModalProps {
  item: LegalItem;
  onClose: () => void;
}

export default function LegalModal({ item, onClose }: LegalModalProps) {
  return (
    <div className="modal open" id="legalModal" data-page="legalModal">
      <div className="ovl" onClick={onClose} />
      <div className="modal-box legal-box">
        <button className="m-close" onClick={onClose} aria-label="إغلاق">
          <CloseSVG />
        </button>
        <h3>{item.title}</h3>
        <span className="lg-date">آخر تحديث: غشت 2026</span>
        <div
          className="lg-body"
          dangerouslySetInnerHTML={{ __html: item.body }}
        />
      </div>
    </div>
  );
}
