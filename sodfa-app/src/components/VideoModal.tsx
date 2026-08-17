"use client";

import React from "react";
import { CloseSVG } from "./icons";

interface VideoModalProps {
  videoUrl?: string;
  onClose: () => void;
}

export default function VideoModal({ videoUrl, onClose }: VideoModalProps) {
  const hasVideo = videoUrl && videoUrl.trim() !== "";

  return (
    <div className="modal open" id="videoModal" data-page="videoModal">
      <div className="ovl" onClick={onClose} />
      <div className="modal-box">
        <button className="m-close" onClick={onClose} aria-label="إغلاق">
          <CloseSVG />
        </button>
        <h3 id="vmTitle">
          {hasVideo ? "الفيديو التوضيحي" : "كيف تعمل تركيبة SODFA؟"}
        </h3>
        {hasVideo ? (
          <div id="videoHolder" style={{ marginTop: "1rem" }}>
            <video src={videoUrl} controls autoPlay playsInline />
          </div>
        ) : (
          <>
            <p id="vmSub" style={{ marginTop: ".5rem" }}>
              رحلة الزيت من البذرة إلى قطرة العناية اليومية — في أربع خطوات.
            </p>
            <div id="vmSteps">
              {[
                {
                  num: "١",
                  title: "الاستخلاص على البارد",
                  desc: "نستخلص الزيوت الأربعة دون حرارة للحفاظ على الفيتامينات والأحماض الدهنية كاملة.",
                },
                {
                  num: "٢",
                  title: "المزج بنسب مدروسة",
                  desc: "يمزج خبراء التركيب الزيوت الأربعة بتوازن دقيق يعزز امتصاص الفروة لكل عنصر.",
                },
                {
                  num: "٣",
                  title: "التعبئة في زجاج كهرماني",
                  desc: "نعبئ السيروم في زجاج داكن يحمي الزيوت من الأكسدة ويحفظ فعاليتها لفترة أطول.",
                },
                {
                  num: "٤",
                  title: "التغذية من الجذور",
                  desc: "مع كل استخدام، تتغلغل القطرة لتغذي البصيلة، فتقل الفراغات وتعود الكثافة واللمعان.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="step"
                  style={{
                    animationDelay: `${0.15 + i * 0.2}s`,
                  }}
                >
                  <div className="n">{step.num}</div>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
