import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SODFA — استعيدي كثافة شعرك بتركيبة 100% طبيعية",
  description:
    "سيروم SODFA الطبيعي بأربعة زيوت نادرة لعلاج تساقط الشعر وتغذية البصيلات. نتائج ملموسة خلال شهر. الدفع عند الاستلام وتوصيل سريع لجميع المناطق.",
  keywords:
    "سيروم الشعر, زيت أركان, تساقط الشعر, عناية طبيعية بالشعر, SODFA, صودفا, زيت الحبة السوداء",
  authors: [{ name: "SODFA" }],
  robots: "index, follow",
  openGraph: {
    title: "SODFA — استعيدي كثافة شعرك بتركيبة 100% طبيعية",
    description:
      "سيروم SODFA الطبيعي بأربعة زيوت نادرة لعلاج تساقط الشعر وتغذية البصيلات. نتائج ملموسة خلال شهر.",
    url: "https://www.sodfa.com",
    type: "website",
    locale: "ar_MA",
    images: [
      {
        url: "/assets/Image/1786724734a9be.png",
        width: 1200,
        height: 630,
        alt: "SODFA - سيروم الشعر الطبيعي",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SODFA — استعيدي كثافة شعرك بتركيبة 100% طبيعية",
    description:
      "سيروم SODFA الطبيعي بأربعة زيوت نادرة لعلاج تساقط الشعر وتغذية البصيلات.",
    images: ["/assets/Image/1786724734a9be.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://www.sodfa.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
