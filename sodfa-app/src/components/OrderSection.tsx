import React from "react";
import type { OrderStep } from "@/types/config";

export default function OrderSection({ orderSteps }: { orderSteps: OrderStep[] }) {
  return (
    <div id="order">
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="sec-head rv">
          <span className="eyebrow">بكل بساطة</span>
          <h2>كيفاش تطلبي؟</h2>
          <p>من الاختيار حتى باب دارك، في 4 خطوات</p>
        </div>
        <div className="steps-row">
          {orderSteps.map((s, i) => (
            <div key={i} className="step-card rv" data-d={i * 100}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="mini">{s.mini}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
