/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatMonthly, formatSum } from "@/lib/format";
import { getStorefrontSnapshot } from "@/lib/storefront";

const categoryCaptions = [
  "iPhone va Android",
  "Apple ekotizimi",
  "Samsung va Xiaomi",
  "Fitness va ulanish",
  "AirPods va JBL",
  "Ish va o'qish uchun",
  "Fast charge aksessuarlari",
  "Har kunlik texno gadjetlar",
];

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
  const heroDiscount =
    heroProduct?.oldPrice && heroProduct.oldPrice > heroProduct.price
      ? Math.round(((heroProduct.oldPrice - heroProduct.price) / heroProduct.oldPrice) * 100)
      : 0;

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
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="relative overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_32%),linear-gradient(125deg,#0056B8_0%,#1690F5_48%,#083270_100%)] p-8 text-white shadow-[0_24px_60px_rgba(10,44,96,0.24)] sm:p-10">
              <div className="absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-foreground lg:flex">
                &lt;
              </div>
              <div className="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-foreground lg:flex">
                &gt;
              </div>

              <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]">
                      aloo
                    </span>
                    <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                      Smartfonlar bozori
                    </span>
                  </div>

                  <p className="mt-7 text-sm font-semibold uppercase tracking-[0.26em] text-white/70">
                    Texno hayotga ulanish!
                  </p>
                  <h1 className="mt-4 font-display text-6xl font-semibold tracking-tight sm:text-7xl">
                    -{heroDiscount}%
                  </h1>
                  <p className="mt-3 max-w-md text-xl font-medium leading-8 text-white/90">
                    {heroProduct.name} uchun chegirma, muddatli to'lov va tezkor yetkazish bir
                    joyda.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/product/${heroProduct.slug}`}
                      className="inline-flex items-center justify-center rounded-[18px] bg-white px-6 py-4 text-sm font-semibold text-accent transition hover:bg-[#eef6ff]"
                    >
                      Mahsulotni ko'rish
                    </Link>
                    <Link
                      href="/catalog?category=smartfonlar"
                      className="inline-flex items-center justify-center rounded-[18px] border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/16"
                    >
                      Barcha smartfonlar
                    </Link>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Bo'lib to'lash", value: formatMonthly(heroProduct.monthlyPrice) },
                      { label: "Yangi narx", value: formatSum(heroProduct.price) },
                      { label: "Yetkazish", value: "90 min" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[20px] border border-white/15 bg-white/10 px-4 py-4"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-white/65">
                          {item.label}
                        </p>
                        <p className="mt-2 text-base font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 lg:pl-8">
                  <ProductVisual
                    kind={heroProduct.kind}
                    label={heroProduct.heroLabel}
                    toneFrom="rgba(255,255,255,0.22)"
                    toneTo="rgba(255,255,255,0.05)"
                    imageUrl={heroProduct.imageUrl}
                    imageAlt={heroProduct.name}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((dot) => (
                  <span
                    key={dot}
                    className={`h-2.5 w-2.5 rounded-full ${
                      dot === 2 ? "bg-white" : "bg-white/35"
                    }`}
                  />
                ))}
              </div>
            </div>

            <aside className="rounded-[32px] border border-line bg-white p-6 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground">
                  Tovarlar kuni
                </h2>
                <div className="flex gap-1">
                  {["0", "6", "2", "9", "4", "1"].map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="inline-flex h-10 w-8 items-center justify-center rounded-[10px] bg-[#f3f7fb] text-sm font-semibold text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <ProductVisual
                  compact
                  kind={productOfDay.kind}
                  label={productOfDay.heroLabel}
                  toneFrom={productOfDay.toneFrom}
                  toneTo={productOfDay.toneTo}
                  imageUrl={productOfDay.imageUrl}
                  imageAlt={productOfDay.name}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
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
                className="mt-4 block text-lg font-medium leading-7 text-foreground"
              >
                {productOfDay.name}
              </Link>

              <div className="mt-4 inline-flex rounded-[12px] border border-accent px-3 py-2 text-sm font-semibold text-accent">
                {formatMonthly(productOfDay.monthlyPrice)}
              </div>

              {productOfDay.oldPrice ? (
                <p className="mt-4 text-base text-muted line-through">
                  {formatSum(productOfDay.oldPrice)}
                </p>
              ) : null}

              <div className="mt-1 flex items-end justify-between gap-4">
                <p className="text-4xl font-semibold tracking-tight text-foreground">
                  {formatSum(productOfDay.price)}
                </p>
                <Link
                  href={`/product/${productOfDay.slug}#purchase`}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-support text-xl font-semibold text-white transition hover:bg-[#e25a00]"
                >
                  +
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="shell pt-10">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground">
            Ommabop kategoriyalar
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categories.slice(0, 8).map((category, index) => (
              <Link
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="flex min-h-[120px] items-center justify-between gap-4 rounded-[24px] border border-line bg-[#f7f9fc] px-5 py-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_35px_rgba(13,31,55,0.08)]"
              >
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

        <section className="shell pt-10">
          <SectionHeading
            eyebrow="Yangiliklar"
            title="Yangi kelgan smartfon va gadjetlar"
            description="Admin paneldagi `Yangilik shelf'i` flag'i orqali bosh sahifadagi asosiy mahsulot kartalari boshqariladi."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {visibleNewItems.map((product) => (
              <ProductCard key={product.id ?? product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className="shell pt-10">
          <div className="grid gap-4 lg:grid-cols-3">
            {visiblePromoDeals.map((promo) => (
              <Link
                key={promo.id ?? promo.title}
                href={promo.ctaHref}
                className="rounded-[28px] border border-line p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] transition hover:-translate-y-1"
                style={{
                  background: `linear-gradient(180deg, ${promo.backgroundFrom} 0%, ${promo.backgroundTo} 100%)`,
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  {promo.eyebrow}
                </p>
                <h3 className="mt-4 font-display text-3xl font-semibold text-foreground">
                  {promo.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">{promo.description}</p>
                <p className="mt-5 text-sm font-semibold text-accent">{promo.ctaLabel}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="shell pt-10">
          <SectionHeading
            eyebrow="Hot Offers"
            title="Ko'p ko'rilayotgan boshqa takliflar"
            description="Bosh sahifa birinchi ekranidan keyin yana retail shelf davom etadi, shu bilan foydalanuvchi darhol mahsulotlarni ko'radi."
            ctaLabel="Katalogga o'tish"
            ctaHref="/catalog"
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {hotOffers.map((product) => (
              <ProductCard key={product.id ?? product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className="shell pt-10">
          <SectionHeading
            eyebrow="Brendlar"
            title="Mashhur nomlar alohida blokda"
            description="Apple, Samsung, Xiaomi va boshqa brendlar ham bosh sahifada ko'rinib turadi."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <div
                key={brand}
                className="rounded-[24px] border border-line bg-white px-6 py-8 text-center shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
              >
                <p className="font-display text-3xl font-semibold text-foreground">{brand}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="shell pt-10">
          <SectionHeading
            eyebrow="Blog"
            title="Savdo va maslahat kontenti"
            description="Yangiliklar bo'limidagi maqolalar bosh sahifada avtomatik chiqadi."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id ?? article.slug ?? article.title}
                className="rounded-[24px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
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
