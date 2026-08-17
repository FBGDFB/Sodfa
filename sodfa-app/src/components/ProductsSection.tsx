import React from "react";
import type { ProductItem } from "@/types/config";

interface ProductsSectionProps {
  products: ProductItem[];
  waLink: string;
}

export default function ProductsSection({ products, waLink }: ProductsSectionProps) {
  const handleOrder = (title: string) => {
    const msg = encodeURIComponent(`أريد طلب: ${title}`);
    window.open(`https://wa.me/${waLink}?text=${msg}`, "_blank");
  };

  return (
    <div id="products">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">تشكيلتنا</span>
          <h2>اختاري منتجك الطبيعي</h2>
          <p>كل منتج مختار بعناية باش تعتني بشعرك طبيعياً في كل مناسبة</p>
        </div>
        <div className="pd-grid">
          {products.map((p, i) => (
            <div key={i} className="pd-card rv" data-d={[0, 100, 200][i] || 0}>
              <div className="pd-img">
                <span className="pd-label">{p.label}</span>
                <img loading="lazy" src={p.img} alt={p.title} />
              </div>
              <div className="pd-body">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="pd-price">{p.price}</div>
                <button className="pd-btn" onClick={() => handleOrder(p.title)}>
                  اطلبي الآن
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
