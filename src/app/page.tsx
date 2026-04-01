/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { CountdownTimer } from "@/components/countdown-timer";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductVisual } from "@/components/product-visual";
import { formatMonthly, formatSum } from "@/lib/format";
import { getStorefrontSnapshot } from "@/lib/storefront";

export const dynamic = "force-dynamic";

const categoryCaptions = [
  "iPhone va Android",
  "Apple ekotizimi",
  "Samsung va Xiaomi",
  "Fitness va ulanish",
  "AirPods va JBL",
  "Ish va o'qish uchun",
  "Simsiz va mexanik",
  "Bluetooth audio",
];

function parseHexColor(value: string) {
  const hex = value.trim().replace("#", "");

  if (hex.length !== 6 || /[^0-9a-f]/i.test(hex)) {
    return null;
  }

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function isDarkColor(value: string) {
  const rgb = parseHexColor(value);

  if (!rgb) {
    return false;
  }

  const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  return luminance < 150;
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

  const newItems = products.filter((product) => product.isNewArrival).slice(0, 4);
  const visibleNewItems = newItems.length > 0 ? newItems : products.slice(0, 4);
  const hotOffers = products
    .filter((product) => product.slug !== heroProduct?.slug && product.slug !== productOfDay?.slug)
    .slice(0, 4);

  const visiblePromoDeals = promoDeals.slice(0, 3);
  const heroSlides = products.slice(0, 3).map((product, index) => {
    const relatedPromo = visiblePromoDeals[index] ?? visiblePromoDeals[0];
    const heroDiscount =
      product.oldPrice && product.oldPrice > product.price
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    return {
      id: product.slug,
      eyebrow: relatedPromo?.eyebrow ?? "Texno hayotga ulanish!",
      title:
        index === 0 && heroDiscount > 0
          ? `${product.name} uchun -${heroDiscount}% gacha`
          : product.name,
      description:
        relatedPromo?.description ??
        `${product.name} uchun qulay narx, muddatli to'lov va tezkor yetkazish bir joyda.`,
      primaryHref: `/product/${product.slug}`,
      primaryLabel: "Mahsulotni ko'rish",
      secondaryHref: relatedPromo?.ctaHref ?? "/catalog?category=smartfonlar",
      secondaryLabel: relatedPromo?.ctaLabel ?? "Barcha smartfonlar",
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

  if (!heroProduct || !productOfDay) {
    return (
      <>
        <SiteHeader />
        <main className="shell py-20">
          <div className="rounded-[28px] border border-line bg-white p-10 text-center shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
            <p className="font-display text-3xl font-semibold text-foreground">
              Mahsulotlar hali tayyor emas
            </p>
            <p className="mt-4 text-base text-muted">
              Admin paneldan yangi mahsulotlar qo'shilgach storefront shu yerda chiqadi.
            </p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />

      <main className="pb-16">
        <section className="shell pt-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_332px]">
            <HeroCarousel slides={heroSlides} />

            <aside className="reveal-up reveal-up-delay-1 rounded-[32px] border border-line bg-white p-5 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                  Tovarlar kuni
                </h2>
              </div>

              <CountdownTimer className="mt-4" />

              <div
                className="mt-4 rounded-[24px] border border-line p-4"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(244,249,255,1) 0%, rgba(255,255,255,1) 100%)",
                }}
              >
                <div
                  className="h-40 rounded-[22px]"
                  style={{
                    backgroundImage: "url('/brand/aloo-mark-light.png')",
                    backgroundPosition: "right -12px bottom -10px",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "88px",
                  }}
                >
                  <ProductVisual
                    size="compact"
                    kind={productOfDay.kind}
                    label={productOfDay.heroLabel}
                    toneFrom={productOfDay.toneFrom}
                    toneTo={productOfDay.toneTo}
                    imageUrl={productOfDay.imageUrl}
                    imageAlt={productOfDay.name}
                  />
                </div>
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
                <span className="rounded-full bg-support px-3 py-1 text-xs font-semibold text-white">
                  Chegirma
                </span>
              </div>

              <Link
                href={`/product/${productOfDay.slug}`}
                className="line-clamp-2 mt-4 block text-lg font-medium leading-7 text-foreground"
              >
                {productOfDay.name}
              </Link>

              <div className="mt-4 inline-flex rounded-[12px] border border-accent px-3 py-2 text-sm font-semibold text-accent">
                {formatMonthly(productOfDay.installment12 ?? productOfDay.monthlyPrice)}
              </div>

              {productOfDay.oldPrice ? (
                <p className="mt-4 text-base text-muted line-through">
                  {formatSum(productOfDay.oldPrice)}
                </p>
              ) : null}

              <div className="mt-1 flex items-end justify-between gap-4">
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {formatSum(productOfDay.price)}
                </p>
                <AddToCartButton productSlug={productOfDay.slug} mode="icon" />
              </div>
            </aside>
          </div>
        </section>

        <section className="shell reveal-up reveal-up-delay-1 pt-9">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground">
            Ommabop kategoriyalar
          </h2>

          <div className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:overflow-visible xl:grid-cols-4">
            {categories.slice(0, 8).map((category, index) => (
              <Link
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="relative flex min-h-[120px] min-w-[250px] snap-start items-center justify-between gap-4 overflow-hidden rounded-[24px] border border-line bg-[#f7f9fc] px-5 py-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_35px_rgba(13,31,55,0.08)] sm:min-w-0"
              >
                <div
                  className="absolute -right-6 -top-3 h-20 w-20 opacity-[0.08]"
                  style={{
                    backgroundImage: "url('/brand/aloo-mark-dark.png')",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                  }}
                />
                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-7 text-foreground">{category.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {categoryCaptions[index] ?? category.description}
                  </p>
                </div>
                <div
                  className="h-16 w-20 shrink-0 rounded-[18px]"
                  style={{
                    background: `linear-gradient(135deg, ${category.toneFrom}, ${category.toneTo})`,
                  }}
                />
              </Link>
            ))}
          </div>
        </section>

        <section id="new-arrivals" className="shell reveal-up reveal-up-delay-2 pt-9">
          <SectionHeading
            eyebrow="Yangiliklar"
            title="Yangi kelgan smartfon va gadjetlar"
            description="Admin paneldagi `Yangilik shelf'i` flag'i orqali bosh sahifadagi asosiy mahsulot kartalari boshqariladi."
          />

          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:overflow-visible xl:grid-cols-4">
            {visibleNewItems.map((product) => (
              <div key={product.id ?? product.slug} className="min-w-[280px] snap-start md:min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <section id="promos" className="shell reveal-up reveal-up-delay-2 pt-9">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:grid-cols-3">
            {visiblePromoDeals.map((promo) => {
              const hasDarkTone =
                isDarkColor(promo.backgroundFrom) || isDarkColor(promo.backgroundTo);

              return (
                <Link
                  key={promo.id ?? promo.title}
                  href={promo.ctaHref}
                  className="min-w-[282px] snap-start rounded-[28px] border border-line p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] transition hover:-translate-y-1 lg:min-w-0"
                  style={{
                    background: `linear-gradient(180deg, ${promo.backgroundFrom} 0%, ${promo.backgroundTo} 100%)`,
                  }}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.24em] ${
                      hasDarkTone ? "text-white/72" : "text-accent"
                    }`}
                  >
                    {promo.eyebrow}
                  </p>
                  <h3
                    className={`mt-4 font-display text-3xl font-semibold ${
                      hasDarkTone ? "text-white" : "text-foreground"
                    }`}
                  >
                    {promo.title}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-7 ${
                      hasDarkTone ? "text-white/76" : "text-muted"
                    }`}
                  >
                    {promo.description}
                  </p>
                  <p
                    className={`mt-5 text-sm font-semibold ${
                      hasDarkTone ? "text-white" : "text-accent"
                    }`}
                  >
                    {promo.ctaLabel}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="shell reveal-up reveal-up-delay-3 pt-9">
          <SectionHeading
            eyebrow="Hot Offers"
            title="Ko'p ko'rilayotgan boshqa takliflar"
            description="Bosh sahifa birinchi ekranidan keyin yana retail shelf davom etadi, shu bilan foydalanuvchi darhol mahsulotlarni ko'radi."
            ctaLabel="Katalogga o'tish"
            ctaHref="/catalog"
          />

          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:overflow-visible xl:grid-cols-4">
            {hotOffers.map((product) => (
              <div key={product.id ?? product.slug} className="min-w-[280px] snap-start md:min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <section className="shell reveal-up reveal-up-delay-3 pt-9">
          <SectionHeading
            eyebrow="Brendlar"
            title="Mashhur nomlar alohida blokda"
            description="Apple, Samsung, Xiaomi va boshqa brendlar ham bosh sahifada ko'rinib turadi."
          />

          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:overflow-visible lg:grid-cols-4">
            {brands.map((brand) => (
              <div
                key={brand}
                className="min-w-[210px] snap-start rounded-[24px] border border-line bg-white px-6 py-8 text-center shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:min-w-0"
              >
                <p className="font-display text-3xl font-semibold text-foreground">{brand}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="blog" className="shell reveal-up reveal-up-delay-3 pt-9">
          <SectionHeading
            eyebrow="Blog"
            title="Savdo va maslahat kontenti"
            description="Yangiliklar bo'limidagi maqolalar bosh sahifada avtomatik chiqadi."
          />

          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id ?? article.slug ?? article.title}
                className="min-w-[280px] snap-start rounded-[24px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] lg:min-w-0"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  {article.tag}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                  {article.title}
                </h3>
                {article.summary ? (
                  <p className="mt-3 text-sm leading-7 text-muted">{article.summary}</p>
                ) : null}
                <p className="mt-4 text-sm text-muted">{article.date}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
