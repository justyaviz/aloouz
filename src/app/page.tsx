/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { CountdownTimer } from "@/components/countdown-timer";
import { HeroCarousel } from "@/components/hero-carousel";
import { ArrowRightIcon, LocationIcon, TrendUpIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Product } from "@/data/store";
import { formatMonthly, formatSum } from "@/lib/format";
import { getCategoryArtwork } from "@/lib/product-art";
import { getStorefrontSnapshot } from "@/lib/storefront";

export const dynamic = "force-dynamic";

const categoryCaptions = [
  "Apple ekotizimi",
  "Premium kamera",
  "Android flagmanlar",
  "Fitness va aloqa",
  "Audio qurilmalar",
  "Ish va o'qish",
  "Setup va gaming",
  "Uy uchun audio",
];

const brandShowcase = [
  {
    brand: "Apple",
    accent: "linear-gradient(145deg,#fff4fb 0%,#f4f8ff 100%)",
    eyebrow: "Premium lineup",
    description: "iPhone modellari, Apple aksessuarlari va sof vizual til bir joyda.",
  },
  {
    brand: "Samsung",
    accent: "linear-gradient(145deg,#eef5ff 0%,#f7fbff 100%)",
    eyebrow: "Galaxy tanlovi",
    description: "Galaxy A va S seriyalari uchun balanslangan narx, xotira va kamera tanlovi.",
  },
  {
    brand: "HONOR",
    accent: "linear-gradient(145deg,#fff3ed 0%,#fffaf7 100%)",
    eyebrow: "Trend modeli",
    description: "HONOR liniyasidagi faol modellarni bir ko'rishda topish osonlashdi.",
  },
];

const internalCopyPatterns = [
  /admin panel/i,
  /foundation/i,
  /home page/i,
  /promo blok/i,
  /boshqarish mumkin/i,
  /trust messaging/i,
  /service argument/i,
  /ko'rsatadigan promo blok/i,
];

function sanitizePublicCopy(value: string | undefined, fallback: string) {
  const copy = value?.trim();

  if (!copy) {
    return fallback;
  }

  if (internalCopyPatterns.some((pattern) => pattern.test(copy))) {
    return fallback;
  }

  return copy;
}

function pickCategoryImage(_products: Product[], categorySlug: string, heroImage?: string) {
  return getCategoryArtwork(categorySlug) ?? heroImage;
}

export default async function Home() {
  const { articles, brands, categories, products, promoDeals } = await getStorefrontSnapshot();

  const heroProduct =
    products.find((product) => product.isFeatured) ??
    products.find((product) => product.isActive) ??
    products[0];

  const productOfDay =
    products.find((product) => product.isDayDeal) ??
    products.find((product) => product.slug !== heroProduct?.slug) ??
    products[0];

  if (!heroProduct || !productOfDay) {
    return (
      <>
        <SiteHeader />
        <main className="shell py-24">
          <div className="rounded-[32px] border border-line bg-white p-12 text-center shadow-[0_18px_40px_rgba(13,31,55,0.08)]">
            <p className="font-display text-4xl font-semibold tracking-tight text-foreground">
              Mahsulotlar hali tayyor emas
            </p>
            <p className="mt-4 text-base leading-8 text-muted">
              Yaqin orada yangi smartfonlar, aksiyalar va katalog shu yerda ko'rsatiladi.
            </p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const visiblePromoDeals = promoDeals.slice(0, 3);
  const visibleNewItems = products
    .filter((product) => product.isNewArrival)
    .slice(0, 8);
  const curatedNewItems = visibleNewItems.length > 0 ? visibleNewItems : products.slice(0, 8);
  const featureArticle = articles[0];
  const sideArticles = articles.slice(1, 4);
  const spotlightProducts = products
    .filter((product) => product.slug !== heroProduct.slug && product.slug !== productOfDay.slug)
    .slice(0, 4);

  const heroSlides = products.slice(0, 3).map((product, index) => {
    const relatedPromo = visiblePromoDeals[index] ?? visiblePromoDeals[0];
    const heroDiscount =
      product.oldPrice && product.oldPrice > product.price
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    return {
      id: product.slug,
      brand: product.brand,
      categorySlug: product.categorySlug,
      eyebrow: relatedPromo?.eyebrow ?? "Texno hayotga ulanish",
      title:
        index === 0 && heroDiscount > 0
          ? `${product.name} uchun -${heroDiscount}% gacha`
          : product.name,
      description: sanitizePublicCopy(
        relatedPromo?.description,
        `${product.name} uchun qulay narx, muddatli to'lov va original qurilma kafolati bir joyda.`,
      ),
      primaryHref: `/product/${product.slug}`,
      primaryLabel: "Mahsulotni ko'rish",
      secondaryHref: "/catalog",
      secondaryLabel: "Katalogga o'tish",
      accentLabel: heroDiscount > 0 ? `-${heroDiscount}% aksiya` : product.badge,
      price: product.price,
      monthlyPrice: product.installment12 ?? product.monthlyPrice,
      badge: index === 0 ? "smartfonlar bozori" : product.badge,
      kind: product.kind,
      heroLabel: product.heroLabel,
      imageUrl: product.imageUrl,
      imageAlt: product.name,
      toneFrom: product.toneFrom,
      toneTo: product.toneTo,
    };
  });

  const branchMap = new Map<
    string,
    { name: string; products: number; cheapest: number; brands: Set<string> }
  >();

  for (const product of products) {
    if (!product.branchName) {
      continue;
    }

    const current = branchMap.get(product.branchName) ?? {
      name: product.branchName,
      products: 0,
      cheapest: product.price,
      brands: new Set<string>(),
    };

    current.products += 1;
    current.cheapest = Math.min(current.cheapest, product.price);
    current.brands.add(product.brand);
    branchMap.set(product.branchName, current);
  }

  const branchCards =
    Array.from(branchMap.values())
      .sort((left, right) => right.products - left.products)
      .slice(0, 3)
      .map((branch) => ({
        name: branch.name,
        products: branch.products,
        cheapest: branch.cheapest,
        brands: Array.from(branch.brands).slice(0, 3).join(", "),
      })) || [];

  const categoryIllustrations = Object.fromEntries(
    categories.slice(0, 8).map((category) => [
      category.slug,
      pickCategoryImage(products, category.slug, heroProduct.imageUrl),
    ]),
  ) as Record<string, string | undefined>;

  const brandHighlights = brandShowcase
    .map((item) => {
      const product = products.find((candidate) =>
        candidate.brand.toLowerCase().includes(item.brand.toLowerCase()),
      );

      if (!product) {
        return null;
      }

      return { ...item, product };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const serviceStats = [
    {
      id: "delivery",
      label: "Tez yetkazish",
      value: "90 daqiqa",
      description: "Toshkent bo'ylab tanlangan modellarni tez yetkazish oqimi.",
    },
    {
      id: "installment",
      label: "Muddatli to'lov",
      value: "12 oy",
      description: "Asosiy narx va 12 oylik to'lov bir xil blokda ko'rsatiladi.",
    },
    {
      id: "about",
      label: "Original qurilmalar",
      value: "IMEI",
      description: "Faqat original, real stock va filial bo'yicha mavjud modellar.",
    },
  ];

  return (
    <>
      <SiteHeader />

      <main className="page-enter pb-20">
        <section className="shell pt-5 sm:pt-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px] xl:items-stretch">
            <HeroCarousel slides={heroSlides} />

            <aside className="reveal-up reveal-up-delay-1 rounded-[30px] border border-line bg-white p-5 shadow-[0_22px_48px_rgba(13,31,55,0.08)] xl:h-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                    Kun mahsulotlari
                  </p>
                  <h2 className="mt-2 font-display text-[1.6rem] font-semibold tracking-[-0.04em] text-foreground">
                    Kun taklifi
                  </h2>
                </div>
                <CountdownTimer compact className="shrink-0" />
              </div>

              <div className="mt-4 rounded-[24px] border border-[#e5edf6] bg-[linear-gradient(180deg,#f5faff_0%,#ffffff_100%)] p-3">
                <ProductVisual
                  size="deal"
                  kind={productOfDay.kind}
                  label={productOfDay.heroLabel}
                  toneFrom={productOfDay.toneFrom}
                  toneTo={productOfDay.toneTo}
                  imageUrl={productOfDay.imageUrl}
                  imageAlt={productOfDay.name}
                  productName={productOfDay.name}
                  brand={productOfDay.brand}
                  categorySlug={productOfDay.categorySlug}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {productOfDay.oldPrice ? (
                  <span className="rounded-full bg-[#ffec66] px-3 py-1 text-xs font-semibold text-foreground">
                    -{Math.max(
                      1,
                      Math.round(
                        ((productOfDay.oldPrice - productOfDay.price) / productOfDay.oldPrice) *
                          100,
                      ),
                    )}
                    %
                  </span>
                ) : null}
                <span className="rounded-full bg-[#fff1ea] px-3 py-1 text-xs font-semibold text-support">
                  Chegirma
                </span>
              </div>

              <Link
                href={`/product/${productOfDay.slug}`}
                className="mt-3 block line-clamp-2 font-display text-[1.1rem] font-semibold leading-7 tracking-tight text-foreground transition hover:text-accent"
              >
                {productOfDay.name}
              </Link>

              <div className="mt-4 inline-flex rounded-full border border-accent/18 bg-[#f5f9ff] px-4 py-2 text-sm font-semibold text-accent">
                {formatMonthly(productOfDay.installment12 ?? productOfDay.monthlyPrice)}
              </div>

              {productOfDay.oldPrice ? (
                <p className="mt-4 text-sm text-muted line-through">
                  {formatSum(productOfDay.oldPrice)}
                </p>
              ) : null}

              <div className="mt-1 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[1.8rem] font-semibold tracking-tight text-foreground">
                    {formatSum(productOfDay.price)}
                  </p>
                  <p className="mt-1 text-[12px] text-muted">
                    {productOfDay.stockLabel ||
                      productOfDay.branchName ||
                      `${productOfDay.stock} dona mavjud`}
                  </p>
                </div>
                <AddToCartButton productSlug={productOfDay.slug} mode="icon" />
              </div>
            </aside>
          </div>
        </section>

        <section className="shell reveal-up reveal-up-delay-1 pt-5">
          <div className="grid gap-3 rounded-[30px] border border-line bg-white p-4 shadow-[0_16px_34px_rgba(13,31,55,0.06)] lg:grid-cols-3 lg:p-5">
            {serviceStats.map((item) => (
              <article
                key={item.id}
                id={item.id}
                className="rounded-[22px] border border-[#e8eef5] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-[1.7rem] font-semibold tracking-[-0.04em] text-foreground">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="shell reveal-up reveal-up-delay-1 pt-10">
          <SectionHeading
            eyebrow="Ommabop kategoriyalar"
            title="Siz qidiradigan bo'limlar shu yerda"
            description="Har bir bo'lim katta vizual, toza fon va kamroq matn bilan qayta yig'ildi."
            ctaLabel="Katalog"
            ctaHref="/catalog"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {categories.slice(0, 8).map((category, index) => (
              <Link
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="group relative overflow-hidden rounded-[28px] border border-[#dfe7f1] bg-white px-5 py-5 shadow-[0_14px_32px_rgba(13,31,55,0.05)] transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(13,31,55,0.08)]"
              >
                <div
                  className="absolute -right-8 -top-4 h-24 w-24 opacity-[0.07]"
                  style={{
                    backgroundImage: "url('/brand/aloo-mark-dark.png')",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                  }}
                />
                <div className="relative z-10 min-h-[120px] pr-20">
                  <p className="text-lg font-semibold tracking-tight text-foreground">
                    {category.name}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {categoryCaptions[index] ?? category.description}
                  </p>
                </div>
                <div className="pointer-events-none absolute bottom-3 right-3 h-[108px] w-[120px]">
                  <div
                    className="absolute inset-4 rounded-full blur-2xl opacity-80"
                    style={{
                      background: `radial-gradient(circle, ${category.toneTo} 0%, transparent 72%)`,
                    }}
                  />
                  {categoryIllustrations[category.slug] ? (
                    <div
                      className="relative h-full w-full bg-contain bg-bottom bg-no-repeat transition duration-300 group-hover:scale-105"
                      style={{
                        backgroundImage: `url('${categoryIllustrations[category.slug]}')`,
                      }}
                    />
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="new-arrivals" className="shell reveal-up reveal-up-delay-2 pt-10">
          <SectionHeading
            eyebrow="Yangi kelganlar"
            title="Kattaroq rasm va aniqroq narx bilan mahsulot kartalari"
            description="Kartalar qisqartirildi, rasmlar kattalashtirildi va xarid oqimi tezroq ko'rinadigan bo'ldi."
            ctaLabel="Barcha smartfonlar"
            ctaHref="/catalog?category=smartfonlar"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {curatedNewItems.slice(0, 4).map((product) => (
              <ProductCard key={product.id ?? product.slug} product={product} />
            ))}
          </div>
        </section>

        {brandHighlights.length > 0 ? (
          <section id="about" className="shell reveal-up reveal-up-delay-2 pt-10">
            <SectionHeading
              eyebrow="Brend tanlovi"
              title="Har bir asosiy brend uchun alohida vitrina"
              description="Uzum, Yandex va Asaxiy uslubiga yaqinroq marketplace ritmi uchun brendlar alohida oq kartalarda berildi."
            />

            <div className="grid gap-4 xl:grid-cols-3">
              {brandHighlights.map((item) => (
                <Link
                  key={item.brand}
                  href={`/catalog?brand=${encodeURIComponent(item.brand)}`}
                  className="group overflow-hidden rounded-[30px] border border-line bg-white shadow-[0_18px_40px_rgba(13,31,55,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(13,31,55,0.1)]"
                >
                  <div className="border-b border-line px-6 pb-5 pt-6" style={{ background: item.accent }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                      {item.eyebrow}
                    </p>
                    <div className="mt-3 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-display text-[2rem] font-semibold tracking-[-0.05em] text-foreground">
                          {item.brand}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
                      </div>
                      <span className="rounded-full border border-accent/12 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                        {item.product.heroLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <ProductVisual
                      size="compact"
                      kind={item.product.kind}
                      label={item.product.heroLabel}
                      toneFrom={item.product.toneFrom}
                      toneTo={item.product.toneTo}
                      imageUrl={item.product.imageUrl}
                      imageAlt={item.product.name}
                      productName={item.product.name}
                      brand={item.product.brand}
                      categorySlug={item.product.categorySlug}
                    />

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-display text-[1.05rem] font-semibold leading-6 tracking-tight text-foreground transition group-hover:text-accent">
                          {item.product.name}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {formatSum(item.product.price)}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                        Ko'rish
                        <ArrowRightIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="shell reveal-up reveal-up-delay-3 pt-10">
          <SectionHeading
            eyebrow="Trenddagi modellar"
            title="Ko'p ko'rilayotgan smartfonlar"
            description="Ommabop modellar uchun narx, oyma-oy to'lov va mavjud filial bir qatorda ko'rsatiladi."
            ctaLabel="Katalog"
            ctaHref="/catalog"
          />

          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="overflow-hidden rounded-[32px] border border-line bg-white p-6 shadow-[0_18px_42px_rgba(13,31,55,0.06)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-accent">
                Smart tanlov
              </p>
              <h2 className="mt-4 max-w-lg font-display text-[2.35rem] font-semibold tracking-[-0.05em] text-foreground">
                Xaridni tezlashtiradigan marketplace oqimi
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-8 text-muted">
                Qidiruv, kategoriya, mahsulot kartasi va savat bir xil market ritmida ishlashi uchun bosh sahifa soddalashtirildi.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-line bg-[#f8fbff] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Mahsulot</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{products.length}+</p>
                </div>
                <div className="rounded-[22px] border border-line bg-[#fff8f4] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Brend</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{brands.length}+</p>
                </div>
                <div className="rounded-[22px] border border-line bg-[#f6fbf6] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Yetkazish</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">90 min</p>
                </div>
              </div>
            </article>

            <div className="space-y-3">
              {spotlightProducts.map((product, index) => (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  className="flex items-center justify-between gap-4 rounded-[26px] border border-line bg-white px-5 py-5 shadow-[0_14px_34px_rgba(13,31,55,0.05)] transition hover:-translate-y-0.5 hover:border-accent/25"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                      0{index + 1}
                    </p>
                    <p className="mt-2 line-clamp-1 font-display text-[1.12rem] font-semibold tracking-tight text-foreground">
                      {product.name}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      12 oy: {formatMonthly(product.installment12 ?? product.monthlyPrice)}
                    </p>
                  </div>
                  <span className="shrink-0 text-base font-semibold text-accent">
                    {formatSum(product.price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="shell reveal-up reveal-up-delay-3 pt-10">
          <SectionHeading
            eyebrow="alooBlog"
            title="Blog bo'limi ham storefront bilan bir xil uslubga o'tdi"
            description="Yangiliklar va maslahatlar alohida, lekin sayt bilan bir xil premium visual tizimda ko'rsatiladi."
            ctaLabel="alooBlog"
            ctaHref="/blog"
          />

          <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
            <article className="overflow-hidden rounded-[32px] border border-line bg-white p-8 shadow-[0_18px_42px_rgba(13,31,55,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                {featureArticle?.tag ?? "Editorial"}
              </p>
              <h2 className="mt-4 max-w-[520px] font-display text-[2.5rem] font-semibold tracking-[-0.05em] text-foreground">
                {featureArticle?.title ?? "2026-yil uchun eng yaxshi smartfon tanlovi"}
              </h2>
              <p className="mt-4 max-w-[520px] text-sm leading-8 text-muted">
                {featureArticle?.summary ??
                  "Smartfon tanlash, aksiyalar va xarid bo'yicha foydali kontent alooBlog ichida yig'iladi."}
              </p>
              <Link
                href="/blog"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-support px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e45d07]"
              >
                O'qishni boshlash
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </article>

            <div className="grid gap-4">
              {sideArticles.map((article, index) => (
                <article
                  key={article.slug ?? article.title}
                  className="rounded-[26px] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                        {article.tag}
                      </p>
                      <h3 className="mt-3 font-display text-[1.5rem] font-semibold tracking-tight text-foreground">
                        {article.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#f4f8ff] px-3 py-1 text-[11px] font-semibold text-accent">
                      0{index + 2}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{article.summary}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted">
                    <span>{article.date}</span>
                    <Link href="/blog" className="font-semibold text-accent">
                      O'qish
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="stores" className="shell reveal-up reveal-up-delay-3 pt-10">
          <SectionHeading
            eyebrow="Filiallar"
            title="Qaysi filialda borligi ham aniq ko'rinadi"
            description="Sync kelgach stock va narx bo'yicha foydali filial kartalari shu bo'limda ko'rsatiladi."
          />

          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4 md:grid-cols-3">
              {(branchCards.length > 0
                ? branchCards
                : [
                    {
                      name: "Toshkent markaz",
                      products: products.length,
                      cheapest: Math.min(...products.map((product) => product.price)),
                      brands: brands.slice(0, 3).join(", "),
                    },
                  ]
              ).map((branch) => (
                <article
                  key={branch.name}
                  className="rounded-[28px] border border-line bg-white p-6 shadow-[0_14px_32px_rgba(13,31,55,0.05)]"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#eef5ff] text-accent">
                    <LocationIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.55rem] font-semibold tracking-tight text-foreground">
                    {branch.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {branch.products} ta model mavjud. Narxlar {formatSum(branch.cheapest)} dan boshlanadi.
                  </p>
                  <p className="mt-3 text-sm font-medium text-foreground">{branch.brands}</p>
                </article>
              ))}
            </div>

            <article className="rounded-[32px] bg-[linear-gradient(180deg,#ffffff_0%,#eef6ff_100%)] p-7 shadow-[0_16px_38px_rgba(13,31,55,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                    Qo'llab-quvvatlash
                  </p>
                  <h2 className="mt-3 font-display text-[2rem] font-semibold tracking-[-0.05em] text-foreground">
                    Xarid bo'yicha yordam kerakmi?
                  </h2>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-accent shadow-[0_10px_24px_rgba(13,31,55,0.06)]">
                  <TrendUpIcon className="h-5 w-5" />
                </span>
              </div>

              <p className="mt-4 text-sm leading-8 text-muted">
                Call-markaz, ijtimoiy tarmoqlar va alooBlog orqali foydalanuvchini bitta visual oqimda olib boradigan platforma tayyorlandi.
              </p>

              <div className="mt-6 grid gap-3">
                <a
                  href="tel:+998781220800"
                  className="rounded-[22px] border border-line bg-white px-5 py-4 text-sm font-semibold text-foreground shadow-[0_10px_24px_rgba(13,31,55,0.05)] transition hover:border-accent/25 hover:text-accent"
                >
                  Call markaz: +998 78 122 08 00
                </a>
                <Link
                  href="/catalog"
                  className="rounded-[22px] border border-line bg-white px-5 py-4 text-sm font-semibold text-foreground shadow-[0_10px_24px_rgba(13,31,55,0.05)] transition hover:border-accent/25 hover:text-accent"
                >
                  Katalogni ko'rish
                </Link>
                <Link
                  href="/profile"
                  className="rounded-[22px] border border-line bg-white px-5 py-4 text-sm font-semibold text-foreground shadow-[0_10px_24px_rgba(13,31,55,0.05)] transition hover:border-accent/25 hover:text-accent"
                >
                  Shaxsiy kabinet
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
