import { prisma } from "@/lib/prisma";
import { resolveProductImageUrl } from "@/lib/product-images";
import {
  articles as fallbackArticles,
  brands as fallbackBrands,
  categories as fallbackCategories,
  products as fallbackProducts,
  promoDeals as fallbackPromoDeals,
  type Article,
  type Category,
  type Product,
  type PromoDeal,
  type ProductKind,
  type SyncProviderState,
} from "@/data/store";

type ProductSpec = Product["specs"][number];
type SyncSummary = NonNullable<SyncProviderState["lastSummary"]>;

export type StorefrontSnapshot = {
  products: Product[];
  categories: Category[];
  brands: string[];
  articles: Article[];
  promoDeals: PromoDeal[];
};

export type ProductCommentView = {
  id: string;
  authorName: string;
  phone?: string;
  body: string;
  createdAt: string;
};

export type AdminDashboardData = StorefrontSnapshot & {
  databaseEnabled: boolean;
  syncState: SyncProviderState | null;
};

function formatUzDate(date: Date) {
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .replace(/\u00A0/g, " ");
}

function formatUzDateTime(date: Date) {
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(date)
    .replace(/\u00A0/g, " ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0400-\u04ff\u0100-\u017f\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getCategoryOptions() {
  return fallbackCategories;
}

export function getCategoryPalette(categorySlug: string) {
  const category = fallbackCategories.find((item) => item.slug === categorySlug);

  return (
    category ?? {
      slug: categorySlug,
      name: categorySlug,
      description: "",
      itemCount: 0,
      toneFrom: "#EAF4FF",
      toneTo: "#A8D6FF",
    }
  );
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    id: product.id ?? product.slug,
    sku: product.sku ?? `ALOO-${product.slug.toUpperCase().replace(/-/g, "_")}`,
    description: product.description ?? product.shortDescription,
    imageUrl: product.imageUrl ?? undefined,
    installment12: product.installment12 ?? product.monthlyPrice,
    monthlyPrice: product.monthlyPrice ?? product.installment12 ?? product.price,
    sourceType: product.sourceType ?? "manual",
    isActive: product.isActive ?? true,
    isFeatured: product.isFeatured ?? false,
    isNewArrival: product.isNewArrival ?? false,
    isDayDeal: product.isDayDeal ?? false,
    sortOrder: product.sortOrder ?? 0,
  };
}

function normalizeArticle(article: Article): Article {
  return {
    ...article,
    id: article.id ?? article.slug ?? slugify(article.title),
    slug: article.slug ?? slugify(article.title),
    summary:
      article.summary ??
      "aloo uchun yangiliklar, promo takliflar va smartfon tanlash bo'yicha foydali maslahatlar.",
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    isPublished: article.isPublished ?? true,
    sortOrder: article.sortOrder ?? 0,
  };
}

function normalizePromoDeal(deal: PromoDeal): PromoDeal {
  return {
    ...deal,
    id: deal.id ?? slugify(deal.title),
    isActive: deal.isActive ?? true,
    sortOrder: deal.sortOrder ?? 0,
  };
}

function buildFallbackSnapshot(): StorefrontSnapshot {
  const products = fallbackProducts.map(normalizeProduct);
  const categories = fallbackCategories.map((category) => ({
    ...category,
    itemCount: products.filter((product) => product.categorySlug === category.slug).length,
  }));
  const brands = [...new Set(products.map((product) => product.brand))];
  const articles = fallbackArticles.map(normalizeArticle);
  const promoDeals = fallbackPromoDeals.map(normalizePromoDeal);

  return {
    products,
    categories,
    brands: brands.length > 0 ? brands : fallbackBrands,
    articles,
    promoDeals,
  };
}

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function parseSpecs(value: unknown): ProductSpec[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const label = typeof record.label === "string" ? record.label.trim() : "";
      const specValue = typeof record.value === "string" ? record.value.trim() : "";

      if (!label || !specValue) {
        return null;
      }

      return {
        label,
        value: specValue,
      };
    })
    .filter((item): item is ProductSpec => item !== null);
}

async function seedDatabaseIfEmpty() {
  if (!hasDatabaseUrl()) {
    return;
  }

  const [articleCount, promoCount] = await Promise.all([
    prisma.article.count(),
    prisma.promoDeal.count(),
  ]);

  const fallback = buildFallbackSnapshot();

  for (const category of fallback.categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });
  }

  for (const brand of fallback.brands) {
    const brandSlug = slugify(brand);

    await prisma.brand.upsert({
      where: { slug: brandSlug },
      update: {
        name: brand,
      },
      create: {
        name: brand,
        slug: brandSlug,
      },
    });
  }

  if (articleCount === 0) {
    for (const article of fallback.articles) {
      await prisma.article.upsert({
        where: { slug: article.slug! },
        update: {
          title: article.title,
          tag: article.tag,
          summary: article.summary!,
          publishedAt: new Date(article.publishedAt!),
          isPublished: article.isPublished,
          sortOrder: article.sortOrder ?? 0,
        },
        create: {
          title: article.title,
          slug: article.slug!,
          tag: article.tag,
          summary: article.summary!,
          publishedAt: new Date(article.publishedAt!),
          isPublished: article.isPublished,
          sortOrder: article.sortOrder ?? 0,
        },
      });
    }
  }

  if (promoCount === 0) {
    for (const deal of fallback.promoDeals) {
      await prisma.promoDeal.create({
        data: {
          eyebrow: deal.eyebrow,
          title: deal.title,
          description: deal.description,
          ctaLabel: deal.ctaLabel,
          ctaHref: deal.ctaHref,
          backgroundFrom: deal.backgroundFrom,
          backgroundTo: deal.backgroundTo,
          isActive: deal.isActive,
          sortOrder: deal.sortOrder ?? 0,
        },
      });
    }
  }
}

function mapProductRecord(
  product: {
    id: string;
    slug: string;
    sku: string;
    name: string;
    shortDescription: string;
    description: string | null;
    kind: string;
    price: number;
    compareAtPrice: number | null;
    monthlyPrice: number;
    installment6: number | null;
    installment12: number | null;
    installment24: number | null;
    stock: number;
    branchName: string | null;
    branchStock: number | null;
    stockLabel: string | null;
    badge: string;
    rating: number;
    reviews: number;
    heroLabel: string;
    delivery: string;
    highlights: unknown;
    colors: unknown;
    specs: unknown;
    toneFrom: string;
    toneTo: string;
    imageAssetId: string | null;
    imageUrl: string | null;
    sourceType: "MANUAL" | "SE_ONE_SYNC";
    sourceExternalId: string | null;
    sourceUpdatedAt: Date | null;
    isActive: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
    isDayDeal: boolean;
    sortOrder: number;
    brand: { name: string };
    category: { name: string; slug: string };
  },
): Product {
  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    brand: product.brand.name,
    category: product.category.name,
    categorySlug: product.category.slug,
    price: product.price,
    oldPrice: product.compareAtPrice ?? undefined,
    monthlyPrice: product.monthlyPrice,
    installment6: product.installment6 ?? undefined,
    installment12: product.installment12 ?? product.monthlyPrice,
    installment24: product.installment24 ?? undefined,
    badge: product.badge,
    rating: product.rating,
    reviews: product.reviews,
    stock: product.stock,
    branchName: product.branchName ?? undefined,
    branchStock: product.branchStock ?? undefined,
    stockLabel: product.stockLabel ?? undefined,
    kind: product.kind as ProductKind,
    shortDescription: product.shortDescription,
    description: product.description ?? undefined,
    heroLabel: product.heroLabel,
    delivery: product.delivery,
    highlights: parseStringArray(product.highlights),
    colors: parseStringArray(product.colors),
    specs: parseSpecs(product.specs),
    toneFrom: product.toneFrom,
    toneTo: product.toneTo,
    imageUrl: resolveProductImageUrl(product.imageAssetId, product.imageUrl),
    sourceType: product.sourceType === "SE_ONE_SYNC" ? "se_one_sync" : "manual",
    sourceExternalId: product.sourceExternalId ?? undefined,
    sourceUpdatedAt: product.sourceUpdatedAt?.toISOString(),
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isDayDeal: product.isDayDeal,
    sortOrder: product.sortOrder,
  };
}

function mapArticleRecord(article: {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  publishedAt: Date;
  isPublished: boolean;
  sortOrder: number;
}): Article {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    tag: article.tag,
    summary: article.summary,
    date: formatUzDate(article.publishedAt),
    publishedAt: article.publishedAt.toISOString(),
    isPublished: article.isPublished,
    sortOrder: article.sortOrder,
  };
}

function mapPromoRecord(deal: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundFrom: string;
  backgroundTo: string;
  isActive: boolean;
  sortOrder: number;
}): PromoDeal {
  return {
    id: deal.id,
    eyebrow: deal.eyebrow,
    title: deal.title,
    description: deal.description,
    ctaLabel: deal.ctaLabel,
    ctaHref: deal.ctaHref,
    backgroundFrom: deal.backgroundFrom,
    backgroundTo: deal.backgroundTo,
    isActive: deal.isActive,
    sortOrder: deal.sortOrder,
  };
}

function mapSyncProviderState(
  state:
    | {
        provider: string;
        label: string;
        status: string;
        lastStartedAt: Date | null;
        lastFinishedAt: Date | null;
        lastSucceededAt: Date | null;
        lastError: string | null;
        lastSummary: unknown;
      }
    | null,
): SyncProviderState | null {
  if (!state) {
    return null;
  }

  const summaryRecord =
    state.lastSummary && typeof state.lastSummary === "object"
      ? (state.lastSummary as Record<string, unknown>)
      : null;

  const summary: SyncSummary | undefined = summaryRecord
    ? {
        importedProducts:
          typeof summaryRecord.importedProducts === "number"
            ? summaryRecord.importedProducts
            : undefined,
        skippedProducts:
          typeof summaryRecord.skippedProducts === "number"
            ? summaryRecord.skippedProducts
            : undefined,
        removedProducts:
          typeof summaryRecord.removedProducts === "number"
            ? summaryRecord.removedProducts
            : undefined,
        offersScanned:
          typeof summaryRecord.offersScanned === "number"
            ? summaryRecord.offersScanned
            : undefined,
        note: typeof summaryRecord.note === "string" ? summaryRecord.note : undefined,
      }
    : undefined;

  return {
    provider: state.provider,
    label: state.label,
    status: state.status,
    lastStartedAt: state.lastStartedAt ? formatUzDateTime(state.lastStartedAt) : undefined,
    lastFinishedAt: state.lastFinishedAt ? formatUzDateTime(state.lastFinishedAt) : undefined,
    lastSucceededAt: state.lastSucceededAt ? formatUzDateTime(state.lastSucceededAt) : undefined,
    lastError: state.lastError ?? undefined,
    lastSummary: summary,
  };
}

export async function getStorefrontSnapshot(): Promise<StorefrontSnapshot> {
  if (!hasDatabaseUrl()) {
    return buildFallbackSnapshot();
  }

  try {
    await seedDatabaseIfEmpty();

    const [dbProducts, dbArticles, dbPromoDeals] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          brand: true,
          category: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.article.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
      }),
      prisma.promoDeal.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
    ]);

    const products = dbProducts.map(mapProductRecord);
    const categories = fallbackCategories.map((category) => ({
      ...category,
      itemCount: products.filter((product) => product.categorySlug === category.slug).length,
    }));
    const brands = [...new Set(products.map((product) => product.brand))];
    const articles = dbArticles.map(mapArticleRecord);
    const promoDeals = dbPromoDeals.map(mapPromoRecord);

    return {
      products,
      categories,
      brands,
      articles,
      promoDeals,
    };
  } catch (error) {
    console.error("Storefront data fallback activated", error);
    return buildFallbackSnapshot();
  }
}

export async function getStorefrontProduct(slug: string) {
  const snapshot = await getStorefrontSnapshot();
  return snapshot.products.find((product) => product.slug === slug);
}

export async function getStorefrontProductComments(
  productId: string,
): Promise<ProductCommentView[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  const comments = await prisma.productComment.findMany({
    where: {
      productId,
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments.map((comment) => ({
    id: comment.id,
    authorName: comment.authorName,
    phone: comment.phone ?? undefined,
    body: comment.body,
    createdAt: formatUzDate(comment.createdAt),
  }));
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  if (!hasDatabaseUrl()) {
    return {
      databaseEnabled: false,
      syncState: null,
      ...buildFallbackSnapshot(),
    };
  }

  try {
    await seedDatabaseIfEmpty();

    const [dbProducts, dbArticles, dbPromoDeals, syncStateRecord] = await Promise.all([
      prisma.product.findMany({
        include: {
          brand: true,
          category: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.article.findMany({
        orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
      }),
      prisma.promoDeal.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.syncProviderState.findUnique({
        where: { provider: "SE_ONE" },
      }),
    ]);

    const products = dbProducts.map(mapProductRecord);
    const categories = fallbackCategories.map((category) => ({
      ...category,
      itemCount: products.filter((product) => product.categorySlug === category.slug).length,
    }));
    const brands = [...new Set(products.map((product) => product.brand))];
    const articles = dbArticles.map(mapArticleRecord);
    const promoDeals = dbPromoDeals.map(mapPromoRecord);

    return {
      databaseEnabled: true,
      syncState: mapSyncProviderState(syncStateRecord),
      products,
      categories,
      brands,
      articles,
      promoDeals,
    };
  } catch (error) {
    console.error("Admin dashboard fallback activated", error);

    return {
      databaseEnabled: false,
      syncState: null,
      ...buildFallbackSnapshot(),
    };
  }
}
