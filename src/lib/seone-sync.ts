import { readFile } from "node:fs/promises";

import { Prisma } from "@prisma/client";

import type { ProductKind } from "@/data/store";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/storefront";

const SE_ONE_PROVIDER = "SE_ONE";
const SE_ONE_PROVIDER_LABEL = "SE-ONE filial narxlari";
const DEFAULT_SOURCE_URL = "https://my.se-one.uz/filial_finans/sotuvnarx2.php";
const DEFAULT_LOGIN_URL = "https://my.se-one.uz/logout.php";
const DEFAULT_LOGIN_ACTION_URL = "https://my.se-one.uz/login.php?key_one_loogin=succcess";
const DEFAULT_DETAIL_URL = "https://my.se-one.uz/filial_finans/load_sotuvnarx2.php";
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";
const DEFAULT_CONCURRENCY = 8;

type SyncErrorCode = "CONFIG" | "AUTH" | "PARSE" | "EMPTY" | "NETWORK";

type SeOneOffer = {
  externalId: string;
  productType: string;
  brand: string;
  model: string;
  title: string;
  branchName: string;
  stock: number;
  salePrice: number;
  cashPrice: number;
  installment6?: number;
  installment12?: number;
  installment24?: number;
  raw: Record<string, string>;
};

type SeOneCategoryConfig = {
  categorySlug: string;
  categoryName: string;
  kind: ProductKind;
  badge: string;
  heroLabel: string;
  delivery: string;
  toneFrom: string;
  toneTo: string;
};

type SeOneSession = {
  cookieHeader: string;
  sourceHtml: string;
};

type SeOneModelOption = {
  value: string;
  title: string;
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
  branchName?: string;
  branchStock?: number;
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
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isDayDeal: boolean;
  sortOrder: number;
  sourcePayload: {
    chosenBranch: Record<string, string>;
  };
};

export type SeOneSyncSummary = {
  importedProducts: number;
  skippedProducts: number;
  removedProducts: number;
  offersScanned: number;
  note?: string;
};

export class SeOneSyncError extends Error {
  code: SyncErrorCode;

  constructor(code: SyncErrorCode, message: string) {
    super(message);
    this.name = "SeOneSyncError";
    this.code = code;
  }
}

const phoneBrandHints = [
  "apple",
  "iphone",
  "samsung",
  "xiaomi",
  "redmi",
  "honor",
  "oppo",
  "realme",
  "vivo",
  "tecno",
  "infinix",
  "nokia",
  "poco",
  "google",
  "oneplus",
];

const branchKeywords = ["filial", "branch", "магазин", "склад"];
const stockKeywords = ["qoldiq", "остат", "nalich", "mavjud", "stock", "qty", "kol-vo", "кол"];
const salePriceKeywords = ["sotuv narx", "продаж", "sale price", "price"];
const cashPriceKeywords = ["naqd", "налич", "cash", "нал"];
const installment6Keywords = ["6 oy", "6 мес", "6m", "6 oyli"];
const installment12Keywords = ["12 oy", "12 мес", "12m", "12 oyli"];
const installment24Keywords = ["24 oy", "24 мес", "24m", "24 oyli"];
const typeKeywords = ["tovar turi", "товар тури", "тип товара", "категория", "tur"];
const brandKeywords = ["brand", "бренд", "tovar brendi"];
const modelKeywords = ["model", "модель", "tovar modeli", "товар модели", "товар модели"];
const titleKeywords = ["товар", "mahsulot", "name", "nomi"];

const loginMarkers = ["Autentifikatsiya", "login_r", "parol_r", "key_one_loogin=succcess"];

const categoryConfigs: SeOneCategoryConfig[] = [
  {
    categorySlug: "smartfonlar",
    categoryName: "Smartfonlar",
    kind: "phone",
    badge: "Sync",
    heroLabel: "Smartfon",
    delivery: "Qoldiq bor filialdan olib ketish va tezkor jo'natish mavjud",
    toneFrom: "#E9F4FF",
    toneTo: "#A8D6FF",
  },
];

const smartphoneCategoryConfig = categoryConfigs[0];
const smartphonePrefixPattern =
  /^(?:РЎРјР°СЂС‚С„РѕРЅ|РўРµР»РµС„РѕРЅ|Smartfon|Смартфон|Телефон)\s+/i;
const nonPhoneKeywords = [
  "watch",
  "smartwatch",
  "aqlli soat",
  "soat",
  "bracelet",
  "airpods",
  "quloqchin",
  "naushnik",
  "headphone",
  "earbud",
  "klaviatura",
  "keyboard",
  "kalonka",
  "kolonka",
  "speaker",
  "СЃРјР°СЂС‚ С‡Р°СЃ",
  "С‡Р°СЃ",
  "РЅР°СѓС€",
  "РєР»Р°РІРёР°С‚",
  "РєРѕР»РѕРЅРє",
];

function normalizeSpace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function stripPhonePrefix(value: string) {
  let cleaned = normalizeSpace(value.replace(/^\d+\s*-\s*/, ""));

  while (smartphonePrefixPattern.test(cleaned)) {
    cleaned = normalizeSpace(cleaned.replace(smartphonePrefixPattern, ""));
  }

  return cleaned;
}

function normalizeSmartphoneTitle(value: string) {
  return stripPhonePrefix(value);
}

function isSmartphoneTitle(value: string) {
  const haystack = normalizeKey(normalizeSmartphoneTitle(value));

  if (!haystack) {
    return false;
  }

  if (nonPhoneKeywords.some((keyword) => haystack.includes(normalizeKey(keyword)))) {
    return false;
  }

  return (
    haystack.includes("smartfon") ||
    haystack.includes("смартфон") ||
    haystack.includes("telefon") ||
    haystack.includes("телефон") ||
    haystack.includes("phone") ||
    haystack.includes("android") ||
    phoneBrandHints.some((hint) => haystack.includes(hint))
  );
}

function buildSmartphoneMetadata(rawTitle: string) {
  const title = normalizeSmartphoneTitle(rawTitle);
  const productType = isSmartphoneTitle(title) ? inferProductTypeFromTitle(title) || "Smartfon" : "";
  const brand = extractBrandFromTitle(title);
  const model = extractModelFromTitle(title, brand, productType);

  return {
    title,
    brand,
    model,
    productType,
  };
}

function classifySmartphoneCategory(offer: Pick<SeOneOffer, "productType" | "brand" | "model" | "title">) {
  return isSmartphoneTitle(`${offer.productType} ${offer.brand} ${offer.model} ${offer.title}`)
    ? smartphoneCategoryConfig
    : null;
}

function stripHtmlTags(value: string) {
  return normalizeSpace(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|tr|td|th)>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function toPlainText(value: string) {
  return normalizeSpace(decodeHtmlEntities(stripHtmlTags(value)));
}

function normalizeKey(value: string) {
  return toPlainText(value).toLowerCase().replace(/[^a-z0-9\u0400-\u04ff]+/g, " ").trim();
}

function parseInteger(value?: string) {
  if (!value) {
    return 0;
  }

  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}

function roundToNearestThousand(value?: number) {
  if (!value || !Number.isFinite(value)) {
    return undefined;
  }

  return Math.round(value / 1000) * 1000;
}

function pickField(record: Record<string, string>, keywords: string[]) {
  const entries = Object.entries(record);

  for (const [key, value] of entries) {
    const normalized = normalizeKey(key);
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return value;
    }
  }

  return "";
}

function extractTables(html: string) {
  return [...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map((match) => match[0]);
}

function extractRows(tableHtml: string) {
  return [...tableHtml.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map((match) => match[0]);
}

function extractCells(rowHtml: string) {
  return [...rowHtml.matchAll(/<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((match) =>
    toPlainText(match[2]),
  );
}

function scoreHeader(cells: string[]) {
  const haystack = cells.map((cell) => normalizeKey(cell)).join(" | ");
  let score = 0;

  if (branchKeywords.some((keyword) => haystack.includes(keyword))) {
    score += 3;
  }
  if (stockKeywords.some((keyword) => haystack.includes(keyword))) {
    score += 3;
  }
  if (salePriceKeywords.some((keyword) => haystack.includes(keyword))) {
    score += 2;
  }
  if (cashPriceKeywords.some((keyword) => haystack.includes(keyword))) {
    score += 3;
  }
  if (installment12Keywords.some((keyword) => haystack.includes(keyword))) {
    score += 2;
  }
  if (typeKeywords.some((keyword) => haystack.includes(keyword))) {
    score += 2;
  }
  if (brandKeywords.some((keyword) => haystack.includes(keyword))) {
    score += 2;
  }
  if (modelKeywords.some((keyword) => haystack.includes(keyword))) {
    score += 2;
  }

  return score;
}

function detectBestTable(html: string) {
  const tables = extractTables(html);
  let bestTable = "";
  let bestScore = 0;

  for (const table of tables) {
    const rows = extractRows(table);

    for (const row of rows.slice(0, 4)) {
      const cells = extractCells(row);
      const score = scoreHeader(cells);

      if (score > bestScore) {
        bestScore = score;
        bestTable = table;
      }
    }
  }

  return bestScore >= 6 ? bestTable : "";
}

function buildOfferRecord(headers: string[], cells: string[]) {
  const record: Record<string, string> = {};

  headers.forEach((header, index) => {
    record[header || `column_${index + 1}`] = cells[index] ?? "";
  });

  return record;
}

function classifyCategory(offer: Pick<SeOneOffer, "productType" | "brand" | "model" | "title">) {
  const haystack = normalizeKey(
    `${offer.productType} ${offer.brand} ${offer.model} ${offer.title}`,
  );

  if (haystack.includes("klaviatura") || haystack.includes("keyboard")) {
    return categoryConfigs.find((item) => item.categorySlug === "klaviaturalar") ?? null;
  }

  if (
    haystack.includes("kalonka") ||
    haystack.includes("speaker") ||
    haystack.includes("акуст") ||
    haystack.includes("колонк")
  ) {
    return categoryConfigs.find((item) => item.categorySlug === "kalonkalar") ?? null;
  }

  if (
    haystack.includes("watch") ||
    haystack.includes("smartwatch") ||
    haystack.includes("aqlli soat") ||
    haystack.includes("soat") ||
    haystack.includes("час")
  ) {
    return categoryConfigs.find((item) => item.categorySlug === "aqlli-soatlar") ?? null;
  }

  if (
    haystack.includes("airpods") ||
    haystack.includes("quloqchin") ||
    haystack.includes("earbud") ||
    haystack.includes("headphone") ||
    haystack.includes("науш")
  ) {
    return categoryConfigs.find((item) => item.categorySlug === "quloqchinlar") ?? null;
  }

  if (haystack.includes("iphone")) {
    return categoryConfigs.find((item) => item.categorySlug === "iphone") ?? null;
  }

  if (
    haystack.includes("smartfon") ||
    haystack.includes("telefon") ||
    haystack.includes("phone") ||
    haystack.includes("android") ||
    phoneBrandHints.some((hint) => haystack.includes(hint))
  ) {
    return categoryConfigs.find((item) => item.categorySlug === "smartfonlar") ?? null;
  }

  return null;
}

void classifyCategory;

function extractMemory(title: string) {
  const match = title.match(/(\d+\s*\/\s*\d+\s*(?:gb|tb))/i);
  return match ? match[1].replace(/\s+/g, "") : "";
}

function extractColor(title: string) {
  const match = title.match(
    /\b(black|white|blue|brown|green|gray|grey|silver|gold|pink|purple|midnight|starlight|space gray)\b/i,
  );

  return match ? match[1] : "";
}

function createHighlights(offer: SeOneOffer) {
  const highlights = [
    `${offer.branchName} filialida ${offer.stock} dona mavjud`,
    `${new Intl.NumberFormat("uz-UZ").format(offer.cashPrice).replace(/\u00A0/g, " ")} so'm naqd narx`,
  ];

  if (offer.installment12) {
    highlights.push(`12 oyga ${new Intl.NumberFormat("uz-UZ").format(offer.installment12).replace(/\u00A0/g, " ")} so'mdan`);
  }

  return highlights;
}

function createSpecs(offer: SeOneOffer) {
  const specs: Array<{ label: string; value: string }> = [
    { label: "Filial", value: offer.branchName },
    { label: "Qoldiq", value: `${offer.stock} dona` },
    { label: "Naqd narx", value: `${offer.cashPrice.toLocaleString("uz-UZ")} so'm` },
  ];

  const memory = extractMemory(offer.title);
  const color = extractColor(offer.title);

  if (memory) {
    specs.push({ label: "Xotira", value: memory.toUpperCase() });
  }

  if (color) {
    specs.push({ label: "Rang", value: color });
  }

  if (offer.installment6) {
    specs.push({ label: "6 oy", value: `${offer.installment6.toLocaleString("uz-UZ")} so'm` });
  }
  if (offer.installment12) {
    specs.push({ label: "12 oy", value: `${offer.installment12.toLocaleString("uz-UZ")} so'm` });
  }
  if (offer.installment24) {
    specs.push({ label: "24 oy", value: `${offer.installment24.toLocaleString("uz-UZ")} so'm` });
  }

  return specs;
}

function createProductPayload(offer: SeOneOffer, sortOrder: number): SyncPreparedProduct | null {
  const category = classifySmartphoneCategory(offer);

  if (!category) {
    return null;
  }

  const memory = extractMemory(offer.title);
  const color = extractColor(offer.title);
  const cleanTitle = normalizeSmartphoneTitle(offer.title);
  const slug = slugify(cleanTitle);

  return {
    externalId: offer.externalId,
    name: cleanTitle,
    slug,
    sku: `SEONE-${offer.externalId.toUpperCase().replace(/-/g, "_").slice(0, 40)}`,
    brand: normalizeSpace(offer.brand || cleanTitle.split(" ")[0] || "Aloo"),
    categorySlug: category.categorySlug,
    categoryName: category.categoryName,
    kind: category.kind,
    shortDescription: `${offer.branchName} filialida ${offer.stock} dona mavjud. Naqd narx va 6/12/24 oy muddatli to'lov bilan yangilanadigan sync mahsulot.`,
    description: `${cleanTitle} mahsuloti SE-ONE filial qoldig'i bo'yicha avtomatik sync qilinadi. Saytdagi narx naqd qiymat bo'lib, ustiga chizilgan narx esa sotuv narxidan olinadi.`,
    price: offer.cashPrice,
    compareAtPrice: offer.salePrice > offer.cashPrice ? offer.salePrice : undefined,
    monthlyPrice: offer.installment12 ?? Math.round(offer.cashPrice / 12),
    installment6: offer.installment6,
    installment12: offer.installment12,
    installment24: offer.installment24,
    stock: offer.stock,
    branchName: offer.branchName,
    branchStock: offer.stock,
    stockLabel: `${offer.branchName} filialida ${offer.stock} dona mavjud`,
    badge: category.badge,
    rating: 4.9,
    reviews: 0,
    heroLabel: memory ? memory.toUpperCase() : category.heroLabel,
    delivery: category.delivery,
    highlights: createHighlights(offer),
    colors: color ? [color] : [],
    specs: createSpecs(offer),
    toneFrom: category.toneFrom,
    toneTo: category.toneTo,
    isActive: true,
    isFeatured: sortOrder === 0,
    isNewArrival: sortOrder < 8,
    isDayDeal: sortOrder === 1,
    sortOrder,
    sourcePayload: {
      chosenBranch: offer.raw,
    },
  };
}

function chooseBestOffers(offers: SeOneOffer[]) {
  const grouped = new Map<string, SeOneOffer[]>();

  for (const offer of offers) {
    if (offer.stock <= 0) {
      continue;
    }

    const groupingKey = slugify(normalizeSmartphoneTitle(offer.title)) || offer.externalId;
    const bucket = grouped.get(groupingKey) ?? [];
    bucket.push(offer);
    grouped.set(groupingKey, bucket);
  }

  return [...grouped.values()]
    .map((group) =>
      group.sort((left, right) => {
        if (left.cashPrice !== right.cashPrice) {
          return left.cashPrice - right.cashPrice;
        }

        if (left.salePrice !== right.salePrice) {
          return left.salePrice - right.salePrice;
        }

        return right.stock - left.stock;
      })[0],
    )
    .sort((left, right) => left.cashPrice - right.cashPrice || left.title.localeCompare(right.title));
}

function parseOffersFromTable(tableHtml: string) {
  const rows = extractRows(tableHtml);
  const parsed: SeOneOffer[] = [];
  let headers: string[] = [];

  for (const row of rows) {
    const cells = extractCells(row);

    if (cells.length < 4) {
      continue;
    }

    if (!headers.length || scoreHeader(cells) >= 6) {
      headers = cells;
      continue;
    }

    if (headers.length !== cells.length) {
      continue;
    }

    const record = buildOfferRecord(headers, cells);
    const rawBrand = pickField(record, brandKeywords);
    const rawModel = pickField(record, modelKeywords);
    const rawTitle = pickField(record, titleKeywords) || normalizeSpace(`${rawBrand} ${rawModel}`);
    const metadata = buildSmartphoneMetadata(rawTitle);
    const productType = metadata.productType;
    const brand = metadata.brand || rawBrand;
    const model = metadata.model || rawModel;
    const title = metadata.title;
    const branchName = pickField(record, branchKeywords);
    const stock = parseInteger(pickField(record, stockKeywords));
    const salePrice = parseInteger(pickField(record, salePriceKeywords));
    const cashPrice = parseInteger(pickField(record, cashPriceKeywords));
    const installment6 = roundToNearestThousand(parseInteger(pickField(record, installment6Keywords)));
    const installment12 = roundToNearestThousand(parseInteger(pickField(record, installment12Keywords)));
    const installment24 = roundToNearestThousand(parseInteger(pickField(record, installment24Keywords)));

    if (!title || !branchName || stock <= 0 || cashPrice <= 0) {
      continue;
    }

    if (!classifySmartphoneCategory({ productType, brand, model, title })) {
      continue;
    }

    const externalId = slugify(`${productType} ${brand} ${model} ${title}`);

    parsed.push({
      externalId,
      productType,
      brand,
      model,
      title,
      branchName,
      stock,
      salePrice: salePrice || cashPrice,
      cashPrice,
      installment6: installment6 ?? undefined,
      installment12: installment12 ?? undefined,
      installment24: installment24 ?? undefined,
      raw: record,
    });
  }

  return parsed;
}

function extractOffersFromHtml(html: string) {
  const tableHtml = detectBestTable(html);

  if (!tableHtml) {
    throw new SeOneSyncError(
      "PARSE",
      "SE-ONE sahifasidan narx jadvali topilmadi. Login sessiya yoki HTML strukturasi tekshirilsin.",
    );
  }

  const offers = parseOffersFromTable(tableHtml);

  if (offers.length === 0) {
    throw new SeOneSyncError(
      "EMPTY",
      "SE-ONE jadvali ochildi, lekin qoldiqi bor mahsulotlar parse qilinmadi.",
    );
  }

  return offers;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractPhpSessionId(setCookieHeader: string | null) {
  if (!setCookieHeader) {
    return "";
  }

  return /PHPSESSID=([^;,]+)/i.exec(setCookieHeader)?.[1]?.trim() ?? "";
}

function hasLoginGate(html: string) {
  const normalized = normalizeKey(html);
  return loginMarkers.some((marker) => normalized.includes(normalizeKey(marker)));
}

function getFetchHeaders(cookieHeader?: string) {
  return {
    "user-agent": DEFAULT_USER_AGENT,
    ...(cookieHeader ? { cookie: cookieHeader } : {}),
  };
}

async function fetchSeOneText(
  url: string,
  init?: RequestInit & { expectAuth?: boolean },
) {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  }).catch((error) => {
    throw new SeOneSyncError("NETWORK", `SE-ONE sahifasiga ulanishda xato: ${String(error)}`);
  });

  const text = await response.text();

  if (!response.ok) {
    throw new SeOneSyncError(
      "NETWORK",
      `SE-ONE ${response.status} javob qaytardi: ${response.statusText || "network error"}`,
    );
  }

  if (init?.expectAuth && hasLoginGate(text)) {
    throw new SeOneSyncError("AUTH", "SE-ONE login ma'lumotlari yoki sessiyasi ishlamadi.");
  }

  return {
    response,
    text,
  };
}

async function fetchSourceHtmlWithCookie(cookieHeader: string) {
  const { text } = await fetchSeOneText(process.env.SEONE_SOURCE_URL?.trim() || DEFAULT_SOURCE_URL, {
    headers: getFetchHeaders(cookieHeader),
    expectAuth: true,
  });

  return text;
}

async function loginWithCredentials(): Promise<SeOneSession> {
  const username = process.env.SEONE_LOGIN?.trim();
  const password = process.env.SEONE_PASSWORD?.trim();

  if (!username || !password) {
    throw new SeOneSyncError(
      "CONFIG",
      "SE-ONE login/parol yoki session cookie sozlanmagan.",
    );
  }

  const bootstrap = await fetchSeOneText(DEFAULT_LOGIN_URL, {
    headers: getFetchHeaders(),
  });

  const initialSessionId = extractPhpSessionId(bootstrap.response.headers.get("set-cookie"));
  const initialCookieHeader = initialSessionId ? `PHPSESSID=${initialSessionId}` : "";

  const body = new URLSearchParams({
    login_r: username,
    parol_r: password,
  });

  const loginResponse = await fetch(DEFAULT_LOGIN_ACTION_URL, {
    method: "POST",
    redirect: "manual",
    headers: {
      ...getFetchHeaders(initialCookieHeader),
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://my.se-one.uz",
      referer: DEFAULT_LOGIN_URL,
    },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  }).catch((error) => {
    throw new SeOneSyncError("NETWORK", `SE-ONE login so'rovida xato: ${String(error)}`);
  });

  if (loginResponse.status >= 400) {
    throw new SeOneSyncError(
      "AUTH",
      `SE-ONE login ${loginResponse.status} javob qaytardi.`,
    );
  }

  const loginText = await loginResponse.text();

  if (hasLoginGate(loginText)) {
    throw new SeOneSyncError("AUTH", "SE-ONE login yoki parol noto'g'ri.");
  }

  const updatedSessionId =
    extractPhpSessionId(loginResponse.headers.get("set-cookie")) || initialSessionId;

  if (!updatedSessionId) {
    throw new SeOneSyncError("AUTH", "SE-ONE sessiya cookie olinmadi.");
  }

  const cookieHeader = `PHPSESSID=${updatedSessionId}`;
  const sourceHtml = await fetchSourceHtmlWithCookie(cookieHeader);

  return {
    cookieHeader,
    sourceHtml,
  };
}

async function loadSeOneSession(): Promise<SeOneSession> {
  const samplePath = process.env.SEONE_SAMPLE_HTML_PATH?.trim();

  if (samplePath) {
    return {
      cookieHeader: "",
      sourceHtml: await readFile(samplePath, "utf8"),
    };
  }

  const cookieHeader = process.env.SEONE_COOKIE_HEADER?.trim();
  const hasCredentials = Boolean(process.env.SEONE_LOGIN?.trim() && process.env.SEONE_PASSWORD?.trim());

  if (cookieHeader) {
    try {
      return {
        cookieHeader,
        sourceHtml: await fetchSourceHtmlWithCookie(cookieHeader),
      };
    } catch (error) {
      if (!(error instanceof SeOneSyncError) || error.code !== "AUTH" || !hasCredentials) {
        throw error;
      }
    }
  }

  if (hasCredentials) {
    return loginWithCredentials();
  }

  throw new SeOneSyncError(
    "CONFIG",
    "SE-ONE sync uchun ishlaydigan cookie yoki login/parol env kiritilishi kerak.",
  );
}

function parseModelOptionsFromHtml(html: string) {
  const selectMatch = html.match(/<select[^>]+id=["']model["'][^>]*>([\s\S]*?)<\/select>/i);

  if (!selectMatch) {
    return [];
  }

  const options = [...selectMatch[1].matchAll(/<option\b[^>]*value=["']?([^"'>\s]+)["']?[^>]*>([\s\S]*?)<\/option>/gi)]
    .map((match) => ({
      value: match[1].trim(),
      title: normalizeSmartphoneTitle(toPlainText(match[2])),
    }))
    .filter(
      (item) =>
        item.value &&
        item.title &&
        !normalizeKey(item.title).includes("modelni tanlang"),
    );

  const seen = new Set<string>();
  return options.filter((item) => {
    if (seen.has(item.value)) {
      return false;
    }

    seen.add(item.value);
    return true;
  });
}

function inferProductTypeFromTitle(title: string) {
  const haystack = normalizeKey(title);

  if (haystack.includes("watch") || haystack.includes("bracelet") || haystack.includes("soat")) {
    return "Watch";
  }

  if (
    haystack.includes("airpods") ||
    haystack.includes("quloqchin") ||
    haystack.includes("naushnik") ||
    haystack.includes("headphone") ||
    haystack.includes("науш")
  ) {
    return "Quloqchin";
  }

  if (haystack.includes("klaviatura") || haystack.includes("keyboard") || haystack.includes("клавиат")) {
    return "Klaviatura";
  }

  if (
    haystack.includes("kalonka") ||
    haystack.includes("kolonka") ||
    haystack.includes("speaker") ||
    haystack.includes("колонк")
  ) {
    return "Kalonka";
  }

  if (haystack.includes("iphone")) {
    return "iPhone";
  }

  if (
    haystack.includes("smartfon") ||
    haystack.includes("смартфон") ||
    haystack.includes("telefon") ||
    haystack.includes("телефон") ||
    haystack.includes("phone") ||
    phoneBrandHints.some((hint) => haystack.includes(hint))
  ) {
    return "Smartfon";
  }

  return "";
}

function extractBrandFromTitle(title: string) {
  let cleaned = normalizeSpace(title.replace(/^\d+\s*-\s*/, ""));

  cleaned = cleaned.replace(
    /^(Смартфон|Телефон|Watch|Наушник|Quloqchin|Klaviatura|Keyboard|Kalonka|Kolonka|Speaker)\s+/i,
    "",
  );

  return normalizeSpace(cleaned.split(/\s+/)[0] ?? "");
}

function extractModelFromTitle(title: string, brand: string, productType: string) {
  let cleaned = normalizeSpace(title.replace(/^\d+\s*-\s*/, ""));

  if (productType) {
    cleaned = cleaned.replace(new RegExp(`^${escapeRegExp(productType)}\\s+`, "i"), "");
  }

  cleaned = cleaned.replace(
    /^(Смартфон|Телефон|Watch|Наушник|Quloqchin|Klaviatura|Keyboard|Kalonka|Kolonka|Speaker)\s+/i,
    "",
  );

  if (brand) {
    cleaned = cleaned.replace(new RegExp(`^${escapeRegExp(brand)}\\s+`, "i"), "");
  }

  return normalizeSpace(cleaned);
}

function parseOffersFromDetailHtml(detailHtml: string, modelOption: SeOneModelOption) {
  if (hasLoginGate(detailHtml)) {
    throw new SeOneSyncError("AUTH", "SE-ONE detail sahifasi login oynasiga qaytdi.");
  }

  const tableHtml = detectBestTable(detailHtml);

  if (!tableHtml) {
    return [] as SeOneOffer[];
  }

  const headerTitleMatch = detailHtml.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
  const metadata = buildSmartphoneMetadata(toPlainText(headerTitleMatch?.[1] ?? modelOption.title));
  const title = metadata.title;
  const productType = metadata.productType;
  const brand = metadata.brand;
  const model = metadata.model;

  if (!classifySmartphoneCategory({ productType, brand, model, title })) {
    return [] as SeOneOffer[];
  }

  const rows = extractRows(tableHtml);
  const parsed: SeOneOffer[] = [];
  let headers: string[] = [];

  for (const row of rows) {
    const cells = extractCells(row);

    if (cells.length < 4) {
      continue;
    }

    if (!headers.length || scoreHeader(cells) >= 6) {
      headers = cells;
      continue;
    }

    if (headers.length !== cells.length) {
      continue;
    }

    const record = buildOfferRecord(headers, cells);
    const branchName = pickField(record, branchKeywords);
    const stock = parseInteger(pickField(record, stockKeywords));
    const salePrice = parseInteger(pickField(record, salePriceKeywords));
    const cashPrice = parseInteger(pickField(record, cashPriceKeywords));
    const installment6 = roundToNearestThousand(parseInteger(pickField(record, installment6Keywords)));
    const installment12 = roundToNearestThousand(parseInteger(pickField(record, installment12Keywords)));
    const installment24 = roundToNearestThousand(parseInteger(pickField(record, installment24Keywords)));

    if (!branchName || stock <= 0 || cashPrice <= 0) {
      continue;
    }

    parsed.push({
      externalId: `seone-model-${modelOption.value}`,
      productType,
      brand,
      model,
      title,
      branchName,
      stock,
      salePrice: salePrice || cashPrice,
      cashPrice,
      installment6: installment6 ?? undefined,
      installment12: installment12 ?? undefined,
      installment24: installment24 ?? undefined,
      raw: {
        modelId: modelOption.value,
        title,
        ...record,
      },
    });
  }

  return parsed;
}

async function fetchModelDetailHtml(cookieHeader: string, modelId: string) {
  const { text } = await fetchSeOneText(DEFAULT_DETAIL_URL, {
    method: "POST",
    headers: {
      ...getFetchHeaders(cookieHeader),
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      origin: "https://my.se-one.uz",
      referer: process.env.SEONE_SOURCE_URL?.trim() || DEFAULT_SOURCE_URL,
    },
    body: new URLSearchParams({
      model: modelId,
      key: "st2",
    }),
  });

  return text;
}

function parseConcurrency(value?: string) {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_CONCURRENCY;
  }

  return Math.max(1, Math.min(parsed, 16));
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      if (currentIndex >= items.length) {
        return;
      }

      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );

  return results;
}

async function collectLiveOffers() {
  const session = await loadSeOneSession();
  const modelOptions = parseModelOptionsFromHtml(session.sourceHtml);

  if (modelOptions.length === 0 || !session.cookieHeader) {
    return extractOffersFromHtml(session.sourceHtml);
  }

  const relevantModels = modelOptions.filter((option) => {
    const metadata = buildSmartphoneMetadata(option.title);

    return Boolean(
      classifySmartphoneCategory(metadata),
    );
  });

  if (relevantModels.length === 0) {
    throw new SeOneSyncError(
      "EMPTY",
      "SE-ONE model ro'yxatidan kerakli kategoriyadagi mahsulotlar topilmadi.",
    );
  }

  const concurrency = parseConcurrency(process.env.SEONE_CONCURRENCY?.trim());
  const resultSets = await mapWithConcurrency(relevantModels, concurrency, async (modelOption) => {
    const detailHtml = await fetchModelDetailHtml(session.cookieHeader, modelOption.value);
    return parseOffersFromDetailHtml(detailHtml, modelOption);
  });

  return resultSets.flat();
}

async function markSyncRunning() {
  await prisma.syncProviderState.upsert({
    where: { provider: SE_ONE_PROVIDER },
    update: {
      label: SE_ONE_PROVIDER_LABEL,
      status: "running",
      lastStartedAt: new Date(),
      lastError: null,
    },
    create: {
      provider: SE_ONE_PROVIDER,
      label: SE_ONE_PROVIDER_LABEL,
      status: "running",
      lastStartedAt: new Date(),
    },
  });
}

async function markSyncFinished(
  status: "success" | "failed",
  summary?: SeOneSyncSummary,
  errorMessage?: string,
) {
  await prisma.syncProviderState.upsert({
    where: { provider: SE_ONE_PROVIDER },
    update: {
      label: SE_ONE_PROVIDER_LABEL,
      status,
      lastFinishedAt: new Date(),
      lastSucceededAt: status === "success" ? new Date() : undefined,
      lastSummary: summary ?? undefined,
      lastError: errorMessage ?? null,
    },
    create: {
      provider: SE_ONE_PROVIDER,
      label: SE_ONE_PROVIDER_LABEL,
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
      description: `${categoryName} mahsulotlari SE-ONE qoldiq va narxlaridan sync qilinadi.`,
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

export async function syncSeOneCatalog(options?: { replaceCatalog?: boolean }) {
  await markSyncRunning();

  try {
    const offers = await collectLiveOffers();
    const bestOffers = chooseBestOffers(offers);
    const prepared = bestOffers
      .map((offer, index) => createProductPayload(offer, index))
      .filter((product): product is SyncPreparedProduct => product !== null);

    if (prepared.length === 0) {
      throw new SeOneSyncError(
        "EMPTY",
        "Qoldiqi bor, lekin kerakli kategoriyalarga tushadigan mahsulot topilmadi.",
      );
    }

    const keepIds = new Set<string>();
    let removedProducts = 0;

    await prisma.$transaction(async (tx) => {
      if (options?.replaceCatalog !== false) {
        const deleted = await tx.product.deleteMany({
          where: {
            sourceType: "MANUAL",
          },
        });

        removedProducts = deleted.count;
      }

      for (const product of prepared) {
        const category = await ensureCategoryRecord(tx, product.categorySlug, product.categoryName);
        const brand = await ensureBrandRecord(tx, product.brand);

        const existing = await tx.product.findFirst({
          where: {
            OR: [
              { sourceExternalId: product.externalId },
              { slug: product.slug },
            ],
          },
          select: {
            id: true,
          },
        });

        const saved = existing
          ? await tx.product.update({
              where: { id: existing.id },
              data: {
                name: product.name,
                slug: product.slug,
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
                branchName: product.branchName ?? null,
                branchStock: product.branchStock ?? null,
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
                sourceType: "SE_ONE_SYNC",
                sourceExternalId: product.externalId,
                sourceUpdatedAt: new Date(),
                sourcePayload: product.sourcePayload,
                isActive: true,
                isFeatured: product.isFeatured,
                isNewArrival: product.isNewArrival,
                isDayDeal: product.isDayDeal,
                sortOrder: product.sortOrder,
                categoryId: category.id,
                brandId: brand.id,
              },
              select: {
                id: true,
              },
            })
          : await tx.product.create({
              data: {
                name: product.name,
                slug: product.slug,
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
                branchName: product.branchName ?? null,
                branchStock: product.branchStock ?? null,
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
                sourceType: "SE_ONE_SYNC",
                sourceExternalId: product.externalId,
                sourceUpdatedAt: new Date(),
                sourcePayload: product.sourcePayload,
                isActive: true,
                isFeatured: product.isFeatured,
                isNewArrival: product.isNewArrival,
                isDayDeal: product.isDayDeal,
                sortOrder: product.sortOrder,
                categoryId: category.id,
                brandId: brand.id,
              },
              select: {
                id: true,
              },
            });

        keepIds.add(saved.id);
      }

      await tx.product.deleteMany({
        where: {
          sourceType: "SE_ONE_SYNC",
          id: {
            notIn: [...keepIds],
          },
        },
      });
    });

    const summary: SeOneSyncSummary = {
      importedProducts: prepared.length,
      skippedProducts: Math.max(0, bestOffers.length - prepared.length),
      removedProducts,
      offersScanned: offers.length,
      note: "Qoldiqi bor eng arzon filial tanlanib, naqd narx asosiy qiymat, sotuv narx ustiga chizilgan narx, 6/12/24 oy summalari esa 1000 so'mga yaxlitlandi.",
    };

    await markSyncFinished("success", summary);
    return summary;
  } catch (error) {
    const message =
      error instanceof SeOneSyncError
        ? error.message
        : `SE-ONE sync bajarilmadi: ${error instanceof Error ? error.message : String(error)}`;

    await markSyncFinished("failed", undefined, message);
    throw error;
  }
}
