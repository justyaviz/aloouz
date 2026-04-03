import type { ProductKind } from "@/data/store";

type ProductArtInput = {
  brand?: string | null;
  categorySlug?: string | null;
  kind: ProductKind;
  name?: string | null;
};

const brandArtworkMap: Record<string, string> = {
  apple: "/catalog-art/iphone-soft-pink.png",
  iphone: "/catalog-art/iphone-soft-pink.png",
  samsung: "/catalog-art/samsung-ocean.png",
  honor: "/catalog-art/honor-red.png",
  xiaomi: "/catalog-art/xiaomi-silver.png",
  redmi: "/catalog-art/xiaomi-silver.png",
  oppo: "/catalog-art/oppo-violet.png",
  tecno: "/catalog-art/samsung-ocean.png",
  infinix: "/catalog-art/samsung-ocean.png",
  realme: "/catalog-art/oppo-violet.png",
  vivo: "/catalog-art/oppo-violet.png",
};

const categoryArtworkMap: Record<string, string> = {
  iphone: "/catalog-art/iphone-soft-pink.png",
  android: "/catalog-art/samsung-ocean.png",
  smartfonlar: "/catalog-art/honor-red.png",
  "aqlli-soatlar": "/catalog-art/smartwatch-midnight.png",
  quloqchinlar: "/catalog-art/earbuds-white.png",
  planshetlar: "/catalog-art/tablet-sky.png",
  klaviaturalar: "/catalog-art/keyboard-cloud.png",
  kalonkalar: "/catalog-art/speaker-midnight.png",
};

const kindArtworkMap: Record<ProductKind, string> = {
  phone: "/catalog-art/samsung-ocean.png",
  watch: "/catalog-art/smartwatch-midnight.png",
  audio: "/catalog-art/earbuds-white.png",
  tablet: "/catalog-art/tablet-sky.png",
  keyboard: "/catalog-art/keyboard-cloud.png",
  speaker: "/catalog-art/speaker-midnight.png",
};

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

export function getProductArtwork({ brand, categorySlug, kind, name }: ProductArtInput) {
  const normalizedBrand = normalize(brand);
  const normalizedCategory = normalize(categorySlug);
  const normalizedName = normalize(name);

  if (normalizedBrand && brandArtworkMap[normalizedBrand]) {
    return brandArtworkMap[normalizedBrand];
  }

  const matchedBrand = Object.entries(brandArtworkMap).find(([key]) =>
    normalizedName.includes(key),
  )?.[1];

  if (matchedBrand) {
    return matchedBrand;
  }

  if (normalizedCategory && categoryArtworkMap[normalizedCategory]) {
    return categoryArtworkMap[normalizedCategory];
  }

  return kindArtworkMap[kind];
}

export function getCategoryArtwork(categorySlug: string) {
  return categoryArtworkMap[normalize(categorySlug)] ?? "/catalog-art/samsung-ocean.png";
}
