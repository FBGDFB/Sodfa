export interface SiteConfig {
  brandName: string;
  logo: string;
  NavbarLogo: string;
  footerLogo: string;
  tagline: string;
  whatsappMain: string;
  whatsappMessage: string;
  whatsappStore: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: string;
  addressShort: string;
  mapsUrl: string;
  mapsEmbed: string;
  hoursStore: string;
  hoursContact: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  videoUrl: string;
  benefitsVideoUrl: string;
}

export interface PricingConfig {
  label: string;
  current: number;
  old: number;
  currency: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string;
  siteUrl: string;
  ogImage: string;
  ogType: string;
  ogLocale: string;
  twitterCard: string;
}

export interface SectionConfig {
  id: string;
  file: string;
  enabled: boolean;
}

export interface PageSettingConfig {
  id: string;
  name: string;
  enabled: boolean;
}

export interface ButtonSettingConfig {
  id: string;
  name: string;
  position: "left" | "right";
  enabled: boolean;
}

export interface HeroConfig {
  badge: string;
  h1a: string;
  hl: string;
  h1b: string;
  lead: string;
  rate: string;
  trustNote: string;
  img: string;
}

export interface StatItem {
  count: number;
  pre: string;
  suf: string;
  label: string;
}

export interface TrustItem {
  icon: string;
  title: string;
  desc: string;
}

export interface FlashProduct {
  img: string;
  title: string;
  discount: string;
  rating: string;
  reviews: number;
  price: string;
  oldPrice?: string;
}

export interface FlashConfig {
  hours: number;
  products: FlashProduct[];
}

export interface OilItem {
  num: string;
  img: string;
  name: string;
  latin: string;
  points: string[];
  tag: string;
}

export interface BenefitItem {
  icon: string;
  title: string;
  desc: string;
  span: number;
}

export interface VideoConfig {
  eyebrow: string;
  title: string;
  desc: string;
  caption: string;
  poster: string;
}

export interface CaseItem {
  before: string;
  after: string;
  beforeTag: string;
  afterTag: string;
  beforeAlt: string;
  afterAlt: string;
  name: string;
  period: string;
  quote: string;
}

export interface FounderConfig {
  name: string;
  logo: string;
}

export interface AboutConfig {
  badge: string;
  eyebrow: string;
  title: string;
  p1: string;
  p2: string;
}

export interface ProductItem {
  img: string;
  label: string;
  title: string;
  desc: string;
  price: string;
}

export interface Testimonial {
  stars?: number;
  rating?: number;
  text: string;
  initial: string;
  name: string;
  city: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface OrderStep {
  num: string;
  title: string;
  desc: string;
  mini: string;
}

export interface LegalItem {
  title: string;
  body: string;
}

export interface SodfaConfig {
  site: SiteConfig;
  pricing: PricingConfig;
  seo: SEOConfig;
  sections: SectionConfig[];
  pageSettings: PageSettingConfig[];
  buttonsSettings: ButtonSettingConfig[];
  hero: HeroConfig;
  stats: StatItem[];
  trust: TrustItem[];
  flash: FlashConfig;
  oils: OilItem[];
  benefits: BenefitItem[];
  video: VideoConfig;
  cases: CaseItem[];
  founder: FounderConfig;
  about: AboutConfig;
  products: ProductItem[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  orderSteps: OrderStep[];
  legal: {
    privacy: LegalItem;
    terms: LegalItem;
    cookies: LegalItem;
  };
}
