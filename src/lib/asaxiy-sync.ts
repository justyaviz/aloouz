import { Prisma } from "@prisma/client";
import { load } from "cheerio";
import { createHash } from "node:crypto";

import type { ProductKind } from "@/data/store";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/storefront";

const ASAXIY_PROVIDER = "ASAXIY";
const ASAXIY_PROVIDER_LABEL = "Asaxiy smartfon katalogi";
const BASE_URL = "https://asaxiy.uz";
const DEFAULT_SOURCE_URL =
  "https://asaxiy.uz/uz/product/telefony-i-gadzhety/telefony/smartfony";
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";

type SyncErrorCode = "CONFIG" | "NETWORK" | "PARSE" | "EMPTY";

type AsaxiyListingProduct = {
  externalId: string;
  name: string;
  brand: string;
  detailPath: string;
  imageUrl?: string;
  galleryImages: string[];
  price: number;
  compareAtPrice?: number;
  monthlyPrice: number;
  reviews: number;
  sortOrder: number;
};

type SyncPreparedProduct = {
  externalId: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  kind: ProductKind;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  monthlyPrice: number;
  installment6?: number;
  installment12?: number;
  installment24?: number;
  stock: number;
  stockLabel?: string;
  badge: string;
  rating: number;
  reviews: number;
  heroLabel: string;
  delivery: string;
  highlights: string[];
  colors: string[];
  specs: Array<{ label: string; value: string }>;
  toneFrom: string;
  toneTo: string;
  imageUrl?: string;
  galleryImages: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isDayDeal: boolean;
  sortOrder: number;
  sourcePayload: {
    detailPath: string;
    galleryImages: string[];
  };
};

export type AsaxiySyncSummary = {
  importedProducts: number;
  skippedProducts: number;
  removedProducts: number;
  offersScanned: number;
  note?: string;
};

export class AsaxiySyncError extends Error {
  code: SyncErrorCode;

  constructor(code: SyncErrorCode, message: string) {
    super(message);
    this.name = "AsaxiySyncError";
    this.code = code;
  }
}

const brandPaletteMap: Record<string, { toneFrom: string; toneTo: string }> = {
  apple: { toneFrom: "#F3F4FF", toneTo: "#D7DEFF" },
  samsung: { toneFrom: "#EEF5FF", toneTo: "#BDD6FF" },
  honor: { toneFrom: "#EEF7FF", toneTo: "#B7D8FF" },
  xiaomi: { toneFrom: "#FFF1E6", toneTo: "#FFD1A8" },
  redmi: { toneFrom: "#FFF1E6", toneTo: "#FFD1A8" },
  oppo: { toneFrom: "#EEFCEF", toneTo: "#BEE7C1" },
  vivo: { toneFrom: "#EFF7FF", toneTo: "#C8DCFF" },
  huawei: { toneFrom: "#FFF0F0", toneTo: "#FFD2D2" },
};

const colorHints = [
  "Titanium Black",
  "Titanium Gray",
  "Titanium Blue",
  "Titanium White",
  "Deep Blue",
  "Space Black",
  "Midnight Black",
  "Velvet Grey",
  "Silver Shadow",
  "Ice Blue",
  "Blue",
  "Black",
  "White",
  "Silver",
  "Gray",
  "Grey",
  "Gold",
  "Green",
  "Purple",
  "Pink",
  "Red",
  "Navy",
  "Olive",
  "Lavender",
  "Graphite",
  "Yellow",
  "Orange",
  "Brown",
  "Cream",
];

function cleanText(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value).replace(/\u00a0/g, " ");
}

function parseMoney(value?: string | null) {
  if (!value) {
    return 0;
  }

  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}

function roundToNearestThousand(value: number) {
  return Math.round(value / 1000) * 1000;
}

function absoluteUrl(value?: string | null) {
  if (!value) {
    return undefined;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  return `${BASE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function normalizeProductName(value: string) {
  return cleanText(
    value
      .replace(/\bsmartfoni\b/giu, "")
      .replace(/\bsmartfon\b/giu, "")
      .replace(/\bсмартфон\b/giu, ""),
  );
}

function inferBrand(value: string) {
  const brands = [
    "Apple",
    "Samsung",
    "Honor",
    "Xiaomi",
    "Redmi",
    "Huawei",
    "Vivo",
    "OPPO",
    "Tecno",
    "Infinix",
    "Nokia",
    "Google",
    "OnePlus",
    "Realme",
    "POCO",
  ];
  const haystack = value.toLowerCase();
  const matched = brands.find((brand) => haystack.startsWith(brand.toLowerCase()));

  if (matched) {
    return matched;
  }

  return cleanText(value.split(" ")[0] || "Smartfon");
}

function extractMemory(value: string) {
  const match = value.match(/\b\d+\s*\/\s*\d+\s*(?:GB|ГБ)\b/i);
  return match ? cleanText(match[0].toUpperCase().replace("ГБ", "GB")) : undefined;
}

function extractColor(value: string) {
  const match = colorHints.find((hint) => value.toLowerCase().includes(hint.toLowerCase()));
  return match ? match : undefined;
}

function buildSpecs(product: AsaxiyListingProduct) {
  const specs: Array<{ label: string; value: string }> = [
    { label: "Manba", value: "Asaxiy live katalogi" },
    { label: "Muddatli to'lov", value: `${formatNumber(product.monthlyPrice)} so'm x 12 oy` },
    { label: "Narx", value: `${formatNumber(product.price)} so'm` },
  ];

  const memory = extractMemory(product.name);
  const color = extractColor(product.name);

  if (memory) {
    specs.push({ label: "Xotira", value: memory });
  }

  if (color) {
    specs.push({ label: "Rang", value: color });
  }

  return specs;
}

function buildHighlights(product: AsaxiyListingProduct) {
  const highlights = [
    `${formatNumber(product.monthlyPrice)} so'mdan 12 oy muddatli to'lov`,
    "Asosiy rasm va gallery live katalogdan avtomatik olindi",
    "Narx o'zgarsa sync orqali storefront ham yangilanadi",
  ];

  const memory = extractMemory(product.name);
  if (memory) {
    highlights.unshift(`Xotira konfiguratsiyasi: ${memory}`);
  }

  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    highlights.unshift(
      `Aksiya farqi: ${formatNumber(product.compareAtPrice - product.price)} so'm`,
    );
  }

  return highlights.slice(0, 4);
}

function getPalette(brand: string) {
  return brandPaletteMap[brand.toLowerCase()] ?? { toneFrom: "#E9F4FF", toneTo: "#A8D6FF" };
}

function buildExternalSku(externalId: string) {
  const hash = createHash("sha1").update(externalId).digest("hex").slice(0, 12).toUpperCase();
  return `ASX-${hash}`;
}

function buildProductPayload(product: AsaxiyListingProduct): SyncPreparedProduct {
  const cleanName = normalizeProductName(product.name);
  const slug = slugify(cleanName);
  const color = extractColor(cleanName);
  const palette = getPalette(product.brand);

  return {
    externalId: product.externalId,
    name: cleanName,
    slug,
    sku: buildExternalSku(product.externalId),
    brand: product.brand,
    categorySlug: "smartfonlar",
    categoryName: "Smartfonlar",
    kind: "phone",
    shortDescription: `${cleanName} live katalogdan avtomatik sync qilinadi. 12 oy muddatli to'lov va aksiya narxlari bilan ko'rsatiladi.`,
    description: `${cleanName} modeli live katalogdan rasmlar, narx va bo'lib to'lash qiymatlari bilan olib kirildi. Buyurtma berishdan oldin operator yakuniy tasdiq beradi.`,
    price: product.price,
    compareAtPrice:
      product.compareAtPrice && product.compareAtPrice > product.price
        ? product.compareAtPrice
        : undefined,
    monthlyPrice: product.monthlyPrice,
    installment6: roundToNearestThousand(product.price / 6),
    installment12: product.monthlyPrice,
    installment24: roundToNearestThousand(product.price / 24),
    stock: 10,
    stockLabel: "Buyurtma uchun mavjud",
    badge:
      product.compareAtPrice && product.compareAtPrice > product.price ? "Aksiya" : "Top tanlov",
    rating: product.reviews > 0 ? 4.8 : 4.7,
    reviews: product.reviews,
    heroLabel: "Original",
    delivery: "Buyurtmadan so'ng operator tasdiqlaydi va yetkazib berish vaqtini belgilaydi",
    highlights: buildHighlights(product),
    colors: color ? [color] : [],
    specs: buildSpecs(product),
    toneFrom: palette.toneFrom,
    toneTo: palette.toneTo,
    imageUrl: product.imageUrl,
    galleryImages: product.galleryImages,
    isActive: true,
    isFeatured: product.sortOrder < 3,
    isNewArrival: product.sortOrder < 16,
    isDayDeal: product.sortOrder === 0,
    sortOrder: product.sortOrder,
    sourcePayload: {
      detailPath: product.detailPath,
      galleryImages: product.galleryImages,
    },
  };
}

async function fetchHtml(url: string) {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        "user-agent": DEFAULT_USER_AGENT,
        "accept-language": "uz,en;q=0.9,ru;q=0.8",
      },
      cache: "no-store",
    });
  } catch (error) {
    throw new AsaxiySyncError("NETWORK", `Asaxiy sahifasiga ulanishda xato: ${String(error)}`);
  }

  if (!response.ok) {
    throw new AsaxiySyncError(
      "NETWORK",
      `Asaxiy ${response.status} javob qaytardi: ${response.statusText || "network error"}`,
    );
  }

  const text = await response.text();

  if (!text.trim()) {
    throw new AsaxiySyncError("PARSE", "Asaxiy sahifasi bo'sh HTML qaytardi.");
  }

  return text;
}

function parseListingPage(html: string, pageNumber: number) {
  const $ = load(html);
  const products: AsaxiyListingProduct[] = [];
  const seen = new Set<string>();
  const pageOffsets = (pageNumber - 1) * 24;

  $(".product__item").each((index, element) => {
    const card = $(element);
    const detailPath = card.find('a[href^="/uz/product/smartfon-"]').first().attr("href");

    if (!detailPath || seen.has(detailPath)) {
      return;
    }

    const rawName = cleanText(card.find(".product__item__info-title").first().text());
    const price = parseMoney(card.find(".product__item-price").first().text());

    if (!rawName || !price) {
      return;
    }

    seen.add(detailPath);

    const galleryImages = Array.from(
      new Set(
        card
          .find(".product__item-img img")
          .map((_, image) =>
            absoluteUrl($(image).attr("data-src") || $(image).attr("src") || undefined),
          )
          .get()
          .filter((item): item is string => Boolean(item)),
      ),
    );

    const imageUrl = galleryImages[0];
    const compareAtPrice = parseMoney(card.find(".product__item-old--price").first().text()) || undefined;
    const monthlyPrice =
      parseMoney(card.find(".installment__price").first().text()) ||
      roundToNearestThousand(price / 12);
    const reviewsMatch = cleanText(card.find(".product__item-info--comments").first().text()).match(/\d+/);

    products.push({
      externalId: detailPath.split("/").filter(Boolean).pop() || `${pageNumber}-${index}`,
      name: rawName,
      brand: inferBrand(rawName),
      detailPath,
      imageUrl,
      galleryImages,
      price,
      compareAtPrice,
      monthlyPrice,
      reviews: reviewsMatch ? Number.parseInt(reviewsMatch[0], 10) : 0,
      sortOrder: pageOffsets + index,
    });
  });

  const pageValues = $(".pagination .page-link[data-page]")
    .map((_, element) => {
      const raw = $(element).attr("data-page");
      const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
      return Number.isFinite(parsed) ? parsed + 1 : 1;
    })
    .get();

  const totalPages = Math.max(1, ...pageValues);

  return {
    products,
    totalPages,
  };
}

async function collectAllProducts() {
  const sourceUrl = process.env.ASAXIY_SOURCE_URL?.trim() || DEFAULT_SOURCE_URL;
  const firstHtml = await fetchHtml(sourceUrl);
  const firstPage = parseListingPage(firstHtml, 1);

  if (firstPage.products.length === 0) {
    throw new AsaxiySyncError(
      "EMPTY",
      "Asaxiy smartfon kategoriyasidan bitta ham mahsulot topilmadi.",
    );
  }

  const allProducts = [...firstPage.products];
  const seen = new Set(firstPage.products.map((product) => product.externalId));
  const totalPages = firstPage.totalPages;

  for (let page = 2; page <= totalPages; page += 1) {
    const pageHtml = await fetchHtml(`${sourceUrl}/page=${page}`);
    const parsedPage = parseListingPage(pageHtml, page);

    for (const product of parsedPage.products) {
      if (seen.has(product.externalId)) {
        continue;
      }

      seen.add(product.externalId);
      allProducts.push(product);
    }
  }

  return allProducts.sort((left, right) => left.sortOrder - right.sortOrder);
}

async function markSyncRunning() {
  await prisma.syncProviderState.upsert({
    where: { provider: ASAXIY_PROVIDER },
    update: {
      label: ASAXIY_PROVIDER_LABEL,
      status: "running",
      lastStartedAt: new Date(),
      lastError: null,
    },
    create: {
      provider: ASAXIY_PROVIDER,
      label: ASAXIY_PROVIDER_LABEL,
      status: "running",
      lastStartedAt: new Date(),
    },
  });
}

async function markSyncFinished(
  status: "success" | "failed",
  summary?: AsaxiySyncSummary,
  errorMessage?: string,
) {
  await prisma.syncProviderState.upsert({
    where: { provider: ASAXIY_PROVIDER },
    update: {
      label: ASAXIY_PROVIDER_LABEL,
      status,
      lastFinishedAt: new Date(),
      lastSucceededAt: status === "success" ? new Date() : undefined,
      lastSummary: summary ?? undefined,
      lastError: errorMessage ?? null,
    },
    create: {
      provider: ASAXIY_PROVIDER,
      label: ASAXIY_PROVIDER_LABEL,
      status,
      lastFinishedAt: new Date(),
      lastSucceededAt: status === "success" ? new Date() : null,
      lastSummary: summary,
      lastError: errorMessage ?? null,
    },
  });
}

async function ensureCategoryRecord(
  client: Prisma.TransactionClient | typeof prisma,
  categorySlug: string,
  categoryName: string,
) {
  return client.category.upsert({
    where: { slug: categorySlug },
    update: {
      name: categoryName,
    },
    create: {
      slug: categorySlug,
      name: categoryName,
      description: `${categoryName} live katalogdan avtomatik sync qilinadi.`,
    },
  });
}

async function ensureBrandRecord(client: Prisma.TransactionClient | typeof prisma, brandName: string) {
  return client.brand.upsert({
    where: { slug: slugify(brandName) },
    update: {
      name: brandName,
    },
    create: {
      slug: slugify(brandName),
      name: brandName,
    },
  });
}

async function syncProductGallery(
  client: Prisma.TransactionClient | typeof prisma,
  productId: string,
  productName: string,
  galleryImages: string[],
) {
  await client.productImage.deleteMany({
    where: { productId },
  });

  if (galleryImages.length === 0) {
    return;
  }

  await client.productImage.createMany({
    data: galleryImages.map((url, index) => ({
      productId,
      url,
      alt: `${productName} rasmi ${index + 1}`,
      sortOrder: index,
    })),
  });
}

async function resolveProductSlug(
  client: Prisma.TransactionClient | typeof prisma,
  desiredSlug: string,
  externalId: string,
  existingProductId?: string,
) {
  const slugSuffix = externalId.toLowerCase().replace(/[^a-z0-9]/g, "").slice(-8) || "asaxiy";
  let candidate = desiredSlug;
  let attempt = 0;

  while (attempt < 10) {
    const existing = await client.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === existingProductId) {
      return candidate;
    }

    attempt += 1;
    candidate = `${desiredSlug}-${slugSuffix}${attempt > 1 ? `-${attempt}` : ""}`;
  }

  return `${desiredSlug}-${Date.now()}`;
}

function buildProductWriteData(
  product: SyncPreparedProduct,
  categoryId: string,
  brandId: string,
  slug: string,
) {
  return {
    name: product.name,
    slug,
    sku: product.sku,
    shortDescription: product.shortDescription,
    description: product.description,
    kind: product.kind,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    monthlyPrice: product.monthlyPrice,
    installment6: product.installment6 ?? null,
    installment12: product.installment12 ?? product.monthlyPrice,
    installment24: product.installment24 ?? null,
    stock: product.stock,
    stockLabel: product.stockLabel ?? null,
    badge: product.badge,
    rating: product.rating,
    reviews: product.reviews,
    heroLabel: product.heroLabel,
    delivery: product.delivery,
    highlights: product.highlights,
    colors: product.colors,
    specs: product.specs,
    toneFrom: product.toneFrom,
    toneTo: product.toneTo,
    imageUrl: product.imageUrl ?? null,
    sourceType: "ASAXIY_SYNC" as const,
    sourceExternalId: product.externalId,
    sourceUpdatedAt: new Date(),
    sourcePayload: product.sourcePayload,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isDayDeal: product.isDayDeal,
    sortOrder: product.sortOrder,
    categoryId,
    brandId,
  };
}

async function savePreparedProduct(
  client: Prisma.TransactionClient | typeof prisma,
  product: SyncPreparedProduct,
  categoryId: string,
  brandId: string,
) {
  const existingByExternal = await client.product.findUnique({
    where: { sourceExternalId: product.externalId },
    select: { id: true, slug: true },
  });

  if (existingByExternal) {
    const resolvedSlug = await resolveProductSlug(
      client,
      product.slug,
      product.externalId,
      existingByExternal.id,
    );

    return client.product.update({
      where: { id: existingByExternal.id },
      data: buildProductWriteData(product, categoryId, brandId, resolvedSlug),
      select: { id: true },
    });
  }

  const existingBySlug = await client.product.findUnique({
    where: { slug: product.slug },
    select: { id: true, sourceExternalId: true },
  });

  if (existingBySlug && existingBySlug.sourceExternalId !== product.externalId) {
    const resolvedSlug = await resolveProductSlug(client, product.slug, product.externalId);

    return client.product.create({
      data: buildProductWriteData(product, categoryId, brandId, resolvedSlug),
      select: { id: true },
    });
  }

  if (existingBySlug) {
    return client.product.update({
      where: { id: existingBySlug.id },
      data: buildProductWriteData(product, categoryId, brandId, product.slug),
      select: { id: true },
    });
  }

  return client.product.create({
    data: buildProductWriteData(product, categoryId, brandId, product.slug),
    select: { id: true },
  });
}

export async function syncAsaxiyCatalog(options?: { replaceCatalog?: boolean }) {
  await markSyncRunning();

  try {
    const scannedProducts = await collectAllProducts();
    const prepared = scannedProducts.map(buildProductPayload);

    if (prepared.length === 0) {
      throw new AsaxiySyncError(
        "EMPTY",
        "Asaxiy smartfon kategoriyasida import qilinadigan mahsulot qolmadi.",
      );
    }

    const keepIds = new Set<string>();
    let removedProducts = 0;
    const categoryCache = new Map<string, string>();
    const brandCache = new Map<string, string>();

    if (options?.replaceCatalog !== false) {
      const deleted = await prisma.product.deleteMany({
        where: {
          sourceType: {
            in: ["MANUAL", "SE_ONE_SYNC"],
          },
        },
      });

      removedProducts += deleted.count;
    }

    for (const product of prepared) {
      let categoryId = categoryCache.get(product.categorySlug);

      if (!categoryId) {
        const category = await ensureCategoryRecord(prisma, product.categorySlug, product.categoryName);
        categoryId = category.id;
        categoryCache.set(product.categorySlug, category.id);
      }

      let brandId = brandCache.get(product.brand);

      if (!brandId) {
        const brand = await ensureBrandRecord(prisma, product.brand);
        brandId = brand.id;
        brandCache.set(product.brand, brand.id);
      }

      const saved = await savePreparedProduct(prisma, product, categoryId, brandId);

      await syncProductGallery(prisma, saved.id, product.name, product.galleryImages);
      keepIds.add(saved.id);
    }

    if (keepIds.size > 0) {
      const stale = await prisma.product.deleteMany({
        where: {
          sourceType: "ASAXIY_SYNC",
          id: {
            notIn: [...keepIds],
          },
        },
      });

      removedProducts += stale.count;
    }

    const summary: AsaxiySyncSummary = {
      importedProducts: prepared.length,
      skippedProducts: 0,
      removedProducts,
      offersScanned: scannedProducts.length,
      note: "Asaxiy smartfon listing sahifalaridan barcha mahsulotlar rasmlari va narxlari bilan sync qilindi.",
    };

    await markSyncFinished("success", summary);
    return summary;
  } catch (error) {
    const message =
      error instanceof AsaxiySyncError
        ? error.message
        : `Asaxiy sync bajarilmadi: ${error instanceof Error ? error.message : String(error)}`;

    await markSyncFinished("failed", undefined, message);
    throw error;
  }
}
