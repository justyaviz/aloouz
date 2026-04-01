export type ProductKind =
  | "phone"
  | "tablet"
  | "watch"
  | "audio";

export type Category = {
  slug: string;
  name: string;
  description: string;
  itemCount: number;
  toneFrom: string;
  toneTo: string;
};

export type Product = {
  id?: string;
  slug: string;
  sku?: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  monthlyPrice: number;
  badge: string;
  rating: number;
  reviews: number;
  stock: number;
  kind: ProductKind;
  shortDescription: string;
  description?: string;
  heroLabel: string;
  delivery: string;
  highlights: string[];
  colors: string[];
  specs: Array<{ label: string; value: string }>;
  toneFrom: string;
  toneTo: string;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isDayDeal?: boolean;
  sortOrder?: number;
};

export type Article = {
  id?: string;
  slug?: string;
  title: string;
  date: string;
  tag: string;
  summary?: string;
  publishedAt?: string;
  isPublished?: boolean;
  sortOrder?: number;
};

export type PromoDeal = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundFrom: string;
  backgroundTo: string;
  isActive?: boolean;
  sortOrder?: number;
};

export const categories: Category[] = [
  {
    slug: "smartfonlar",
    name: "Smartfonlar",
    description: "Apple, Samsung, Xiaomi, HONOR va OPPO hit modellar",
    itemCount: 354,
    toneFrom: "#E9F4FF",
    toneTo: "#A8D6FF",
  },
  {
    slug: "iphone",
    name: "iPhone",
    description: "Premium Apple ekotizimi va flagman tanlovlar",
    itemCount: 92,
    toneFrom: "#F0F6FF",
    toneTo: "#C6DCF9",
  },
  {
    slug: "android",
    name: "Android",
    description: "Samsung, Xiaomi, HONOR va OPPO smartfonlari",
    itemCount: 188,
    toneFrom: "#E9F0FF",
    toneTo: "#B3C7FF",
  },
  {
    slug: "aqlli-soatlar",
    name: "Aqlli soatlar",
    description: "Apple Watch va kundalik salomatlik gadjetlari",
    itemCount: 73,
    toneFrom: "#EEF5FF",
    toneTo: "#C7E0FF",
  },
  {
    slug: "quloqchinlar",
    name: "Quloqchinlar",
    description: "AirPods, JBL va simsiz audio yechimlari",
    itemCount: 81,
    toneFrom: "#ECFAFF",
    toneTo: "#B7ECFF",
  },
  {
    slug: "planshetlar",
    name: "Planshetlar",
    description: "Ish, o'qish va entertainment uchun planshetlar",
    itemCount: 39,
    toneFrom: "#EEF3FF",
    toneTo: "#D3DEFF",
  },
  {
    slug: "zaryadlash",
    name: "Zaryadlash",
    description: "Adapter, powerbank va fast charge aksessuarlari",
    itemCount: 65,
    toneFrom: "#FFF3E8",
    toneTo: "#FFD7B4",
  },
  {
    slug: "gadjetlar",
    name: "Gadjetlar",
    description: "Har kunlik texno hayotni qulay qiladigan qurilmalar",
    itemCount: 57,
    toneFrom: "#F1F7FF",
    toneTo: "#B9D7FF",
  },
];

export const products: Product[] = [
  {
    slug: "iphone-16-pro-max-256-desert",
    name: "Apple iPhone 16 Pro Max 256 GB Desert Titanium",
    brand: "Apple",
    category: "iPhone",
    categorySlug: "iphone",
    price: 18999000,
    oldPrice: 20299000,
    monthlyPrice: 1999000,
    badge: "Premium hit",
    rating: 4.9,
    reviews: 138,
    stock: 12,
    kind: "phone",
    isFeatured: true,
    isNewArrival: true,
    sortOrder: 1,
    shortDescription:
      "Titan korpus, Pro kamera va kuchli avtonomlik bilan aloo vitrinasidagi eng talabgir flagmanlardan biri.",
    heroLabel: "IMEI + 12 oy",
    delivery: "Toshkent bo'ylab 90 daqiqada yetkazib beramiz",
    highlights: [
      "48 MP Fusion kamera va 5x telephoto",
      "A18 Pro bilan silliq ishlash",
      "USB-C va Apple Intelligence tayyor",
    ],
    colors: ["Desert Titanium", "Black Titanium", "Natural Titanium"],
    specs: [
      { label: "Displey", value: "6.9 dyuym LTPO OLED" },
      { label: "Chip", value: "A18 Pro" },
      { label: "Xotira", value: "256 GB" },
      { label: "Batareya", value: "4676 mA/soat" },
      { label: "Kamera", value: "48 + 12 + 12 MP" },
      { label: "Himoya", value: "IP68" },
    ],
    toneFrom: "#DCEAF9",
    toneTo: "#9DB4CC",
  },
  {
    slug: "samsung-galaxy-s24-ultra-256-black",
    name: "Samsung Galaxy S24 Ultra 12/256 Titanium Black",
    brand: "Samsung",
    category: "Android",
    categorySlug: "android",
    price: 14999000,
    oldPrice: 15999000,
    monthlyPrice: 1599000,
    badge: "Flagman",
    rating: 4.8,
    reviews: 102,
    stock: 9,
    kind: "phone",
    isNewArrival: true,
    sortOrder: 2,
    shortDescription:
      "Kuchli zoom, S Pen va premium korpus bilan texno hayotga ulanishni tezlatadigan Android flagman.",
    heroLabel: "200 MP + S Pen",
    delivery: "Bugun pick-up, 90 daqiqalik delivery mavjud",
    highlights: [
      "Titan korpus va Gorilla Armor",
      "200 MP kamera va Galaxy AI",
      "S Pen bilan produktivlik",
    ],
    colors: ["Titanium Black", "Titanium Gray", "Titanium Violet"],
    specs: [
      { label: "Displey", value: "6.8 dyuym Dynamic AMOLED 2X" },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
      { label: "Xotira", value: "12/256 GB" },
      { label: "Kamera", value: "200 + 50 + 12 + 10 MP" },
      { label: "Batareya", value: "5000 mA/soat" },
      { label: "Qalam", value: "S Pen" },
    ],
    toneFrom: "#E4EDFF",
    toneTo: "#9CB0D9",
  },
  {
    slug: "xiaomi-14t-pro-512-gray",
    name: "Xiaomi 14T Pro 12/512 Titan Gray",
    brand: "Xiaomi",
    category: "Android",
    categorySlug: "android",
    price: 8999000,
    oldPrice: 9599000,
    monthlyPrice: 949000,
    badge: "Kamera hit",
    rating: 4.8,
    reviews: 76,
    stock: 18,
    kind: "phone",
    isNewArrival: true,
    sortOrder: 3,
    shortDescription:
      "Leica ruhi, kuchli quvvat va yuqori xotira bilan narx va imkoniyat balansi kuchli model.",
    heroLabel: "Leica vibes",
    delivery: "Toshkent ichida tezkor olib borish xizmati",
    highlights: [
      "Leica style kameralar",
      "120W HyperCharge",
      "12/512 GB konfiguratsiya",
    ],
    colors: ["Titan Gray", "Blue", "Black"],
    specs: [
      { label: "Displey", value: "6.67 dyuym AMOLED 144 Hz" },
      { label: "Chip", value: "MediaTek Dimensity 9300+" },
      { label: "Xotira", value: "12/512 GB" },
      { label: "Kamera", value: "50 + 50 + 12 MP" },
      { label: "Batareya", value: "5000 mA/soat" },
      { label: "Zaryad", value: "120W" },
    ],
    toneFrom: "#E6F6FF",
    toneTo: "#8CC8F8",
  },
  {
    slug: "honor-400-lite-256-grey",
    name: "HONOR 400 Lite 5G 8/256 Velvet Grey",
    brand: "HONOR",
    category: "Smartfonlar",
    categorySlug: "smartfonlar",
    price: 3679000,
    oldPrice: 3999000,
    monthlyPrice: 389000,
    badge: "Yoshlar tanlovi",
    rating: 4.7,
    reviews: 69,
    stock: 24,
    kind: "phone",
    isDayDeal: true,
    isNewArrival: true,
    sortOrder: 4,
    shortDescription:
      "Kamera, dizayn va qulay narxni birlashtirgan zamonaviy 5G model.",
    heroLabel: "5G + 256 GB",
    delivery: "Bugun buyurtma, bugun jo'natish",
    highlights: [
      "Yupqa korpus va yengil tutim",
      "Selfie uchun yorqin frontal kamera",
      "Talab yuqori bo'lgan 256 GB versiya",
    ],
    colors: ["Velvet Grey", "Aqua Blue", "Midnight Black"],
    specs: [
      { label: "Displey", value: "6.7 dyuym AMOLED" },
      { label: "Tarmoq", value: "5G" },
      { label: "Xotira", value: "8/256 GB" },
      { label: "Batareya", value: "4500 mA/soat" },
      { label: "Kamera", value: "108 + 5 MP" },
      { label: "Zaryad", value: "35W" },
    ],
    toneFrom: "#F2F5FF",
    toneTo: "#BCC7E8",
  },
  {
    slug: "oppo-reno-13f-256-gray",
    name: "OPPO Reno 13F 8/256 Graphite Gray",
    brand: "OPPO",
    category: "Smartfonlar",
    categorySlug: "smartfonlar",
    price: 4799000,
    oldPrice: 5199000,
    monthlyPrice: 509000,
    badge: "Muddatli to'lov",
    rating: 4.7,
    reviews: 53,
    stock: 20,
    kind: "phone",
    sortOrder: 5,
    shortDescription:
      "Kundalik foydalanishda tez, dizayni premium va narxi o'z o'rnida turgan balansli smartfon.",
    heroLabel: "Reno vibes",
    delivery: "90 daqiqa ichida courier chiqadi",
    highlights: [
      "Yorqin AMOLED ekran",
      "AI retush va kamera qulayliklari",
      "Muddatli to'lov uchun ko'p so'raladigan model",
    ],
    colors: ["Graphite Gray", "Lavender", "Ocean Blue"],
    specs: [
      { label: "Displey", value: "6.67 dyuym AMOLED 120 Hz" },
      { label: "Xotira", value: "8/256 GB" },
      { label: "Batareya", value: "5000 mA/soat" },
      { label: "Kamera", value: "50 + 8 + 2 MP" },
      { label: "Zaryad", value: "45W SUPERVOOC" },
      { label: "Himoya", value: "IP64" },
    ],
    toneFrom: "#EAF1FF",
    toneTo: "#9FB6E8",
  },
  {
    slug: "apple-watch-series-10-46-midnight",
    name: "Apple Watch Series 10 46mm Midnight",
    brand: "Apple",
    category: "Aqlli soatlar",
    categorySlug: "aqlli-soatlar",
    price: 5999000,
    monthlyPrice: 629000,
    badge: "Lifestyle",
    rating: 4.9,
    reviews: 58,
    stock: 14,
    kind: "watch",
    sortOrder: 6,
    shortDescription:
      "Sog'liq, trening va bildirishnomalarni bir soatda yig'adigan Apple ekotizimining kuchli qurilmasi.",
    heroLabel: "Health + Fitness",
    delivery: "Bugun pick-up, ertaga delivery",
    highlights: [
      "Always-On Retina ekran",
      "Uyqu va yurak monitoringi",
      "iPhone bilan silliq integratsiya",
    ],
    colors: ["Midnight", "Starlight", "Rose Gold"],
    specs: [
      { label: "Korpus", value: "46 mm alyuminiy" },
      { label: "Ekran", value: "Always-On Retina" },
      { label: "Sensorlar", value: "ECG, HR, SpO2" },
      { label: "Suv himoyasi", value: "50 m" },
      { label: "Ulanish", value: "GPS" },
      { label: "Batareya", value: "18 soat" },
    ],
    toneFrom: "#E7F1FF",
    toneTo: "#A4C8F4",
  },
  {
    slug: "airpods-pro-2-usb-c",
    name: "Apple AirPods Pro 2 USB-C",
    brand: "Apple",
    category: "Quloqchinlar",
    categorySlug: "quloqchinlar",
    price: 3499000,
    oldPrice: 3799000,
    monthlyPrice: 369000,
    badge: "Top audio",
    rating: 4.9,
    reviews: 85,
    stock: 17,
    kind: "audio",
    sortOrder: 7,
    shortDescription:
      "ANC, spatial audio va Apple qurilmalari bilan bir zumda ulanish uchun ideal premium quloqchin.",
    heroLabel: "ANC + USB-C",
    delivery: "Kechgacha buyurtma bersangiz bugun jo'natamiz",
    highlights: [
      "Adaptive Audio va ANC",
      "USB-C case",
      "Find My qo'llovi",
    ],
    colors: ["White"],
    specs: [
      { label: "Audio", value: "Adaptive Audio + ANC" },
      { label: "Chip", value: "H2" },
      { label: "Case", value: "USB-C MagSafe" },
      { label: "Batareya", value: "30 soatgacha case bilan" },
      { label: "Suv himoyasi", value: "IP54" },
      { label: "Ulanish", value: "Bluetooth 5.3" },
    ],
    toneFrom: "#F4F8FF",
    toneTo: "#D9E6FF",
  },
  {
    slug: "jbl-tune-flex-ghost",
    name: "JBL Tune Flex Ghost Edition",
    brand: "JBL",
    category: "Quloqchinlar",
    categorySlug: "quloqchinlar",
    price: 1299000,
    oldPrice: 1499000,
    monthlyPrice: 139000,
    badge: "Everyday audio",
    rating: 4.7,
    reviews: 43,
    stock: 25,
    kind: "audio",
    sortOrder: 8,
    shortDescription:
      "Simsiz tinglash, shaffof dizayn va kundalik yurishda qulay o'rinli audio tanlov.",
    heroLabel: "Ghost design",
    delivery: "Toshkent bo'ylab 1 kunda",
    highlights: [
      "JBL Pure Bass",
      "Shaffof korpus estetika",
      "App orqali sozlamalar",
    ],
    colors: ["Ghost Black", "Ghost White"],
    specs: [
      { label: "Audio", value: "JBL Pure Bass" },
      { label: "Batareya", value: "32 soatgacha" },
      { label: "Shovqinni boshqarish", value: "Ambient Aware" },
      { label: "Ulanish", value: "Bluetooth 5.2" },
      { label: "Mikrofon", value: "4 ta mic" },
      { label: "Himoya", value: "IPX4" },
    ],
    toneFrom: "#EEF5FF",
    toneTo: "#B8CCE8",
  },
  {
    slug: "ipad-air-11-m2-128-space-gray",
    name: "Apple iPad Air 11 M2 128 GB Space Gray",
    brand: "Apple",
    category: "Planshetlar",
    categorySlug: "planshetlar",
    price: 10999000,
    oldPrice: 11699000,
    monthlyPrice: 1169000,
    badge: "Creative pick",
    rating: 4.8,
    reviews: 27,
    stock: 8,
    kind: "tablet",
    sortOrder: 9,
    shortDescription:
      "O'qish, ish va kontent iste'moli uchun yengil, kuchli va Apple Pencil'ga tayyor planshet.",
    heroLabel: "M2 power",
    delivery: "Pick-up yoki ertangi delivery",
    highlights: [
      "M2 chip bilan tez ishlash",
      "11 dyuym Liquid Retina ekran",
      "Apple Pencil Pro qo'llovi",
    ],
    colors: ["Space Gray", "Blue", "Purple"],
    specs: [
      { label: "Displey", value: "11 dyuym Liquid Retina" },
      { label: "Chip", value: "Apple M2" },
      { label: "Xotira", value: "128 GB" },
      { label: "Kamera", value: "12 MP" },
      { label: "Ulanish", value: "Wi-Fi 6E" },
      { label: "Port", value: "USB-C" },
    ],
    toneFrom: "#EEF3FF",
    toneTo: "#A8BCDD",
  },
];

export const perks = [
  {
    title: "Original va IMEI tekshiruvli",
    description:
      "aloo vitrinasidagi smartfonlar original komplektatsiya va ishonchli kelib chiqish bilan ko'rsatiladi.",
  },
  {
    title: "12 oygacha muddatli to'lov",
    description:
      "Brendbookdagi asosiy savdo yo'nalishiga mos ravishda bo'lib to'lash summasi har kartada ko'rinadi.",
  },
  {
    title: "90 daqiqalik tezkor delivery",
    description:
      "Toshkent bo'ylab buyurtmalarni tez yetkazish va do'kondan olib ketish oqimi uchun foundation tayyor.",
  },
  {
    title: "Maslahat + muloqot",
    description:
      "aloo g'oyasidagi aloqa, servis va maslahat ruhini header, CTA va product detail bloklarida ushladik.",
  },
];

export const articles: Article[] = [
  {
    slug: "yangi-iphone-bilan-hayot-boshqacha",
    title: "Yangi iPhone bilan hayot boshqacha",
    date: "31 mart, 2026",
    tag: "iPhone",
    summary: "Yangi avlod iPhone xarid qilishda kamera, xotira va muddatli to'lov bo'yicha nimalarga qarash kerakligi haqida qisqa yo'riqnoma.",
    publishedAt: "2026-03-31",
    sortOrder: 1,
  },
  {
    slug: "aloo-bilan-sevimli-telefoning-qolingda",
    title: "aloo bilan sevimli telefoning qo'lingda",
    date: "30 mart, 2026",
    tag: "Campaign",
    summary: "aloo brendining savdo va servis ohangini tushuntiradigan promo material va xarid ssenariylari.",
    publishedAt: "2026-03-30",
    sortOrder: 2,
  },
  {
    slug: "muddatli-tolovga-telefon-tanlash-uchun-5-maslahat",
    title: "Muddatli to'lovga telefon tanlash uchun 5 maslahat",
    date: "29 mart, 2026",
    tag: "Guide",
    summary: "Oylik to'lov, dastlabki badal va real ehtiyoj asosida to'g'ri model tanlash uchun qisqa qo'llanma.",
    publishedAt: "2026-03-29",
    sortOrder: 3,
  },
];

export const promoDeals: PromoDeal[] = [
  {
    eyebrow: "Muddatli to'lov",
    title: "Flagman smartfonlar uchun 12 oygacha qulay taklif",
    description:
      "Aksiya, eski narx va yangi narxni bir ekranda ko'rsatadigan promo blok admin panel orqali boshqariladi.",
    ctaLabel: "Aksiyani ko'rish",
    ctaHref: "/catalog?category=smartfonlar",
    backgroundFrom: "#EEF6FF",
    backgroundTo: "#FFFFFF",
    isActive: true,
    sortOrder: 1,
  },
  {
    eyebrow: "Tezkor yetkazish",
    title: "Bugun buyurtma, bugun jo'natish",
    description:
      "Toshkent bo'ylab tezkor delivery va pick-up oqimini alohida promo kartalar orqali boshqarish mumkin.",
    ctaLabel: "Katalogga o'tish",
    ctaHref: "/catalog",
    backgroundFrom: "#FFF3E8",
    backgroundTo: "#FFFFFF",
    isActive: true,
    sortOrder: 2,
  },
  {
    eyebrow: "Original qurilmalar",
    title: "IMEI tekshiruvli smartfon va gadjetlar",
    description:
      "Trust messaging, service argumentlari va sotuv CTA'larini home page promo qatorida ko'rsatish uchun.",
    ctaLabel: "Mahsulotlarni ko'rish",
    ctaHref: "/catalog?category=iphone",
    backgroundFrom: "#F3F8FF",
    backgroundTo: "#FFFFFF",
    isActive: true,
    sortOrder: 3,
  },
];

export const brands = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "HONOR",
  "OPPO",
  "JBL",
  "Anker",
  "Baseus",
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
