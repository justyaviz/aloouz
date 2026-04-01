/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { CountdownTimer } from "@/components/countdown-timer";
import { HeroCarousel } from "@/components/hero-carousel";
import {
  ArrowRightIcon,
  LocationIcon,
  TrendUpIcon,
} from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatMonthly, formatSum } from "@/lib/format";
import { getStorefrontSnapshot } from "@/lib/storefront";

export const dynamic = "force-dynamic";

const categoryCaptions = [
  "Apple ekotizimi",
  "Premium kameralar",
  "Samsung va Xiaomi",
  "Fitness va ulanish",
  "Audio va call",
  "Ish va o'qish",
  "Klaviatura va setup",
  "Simsiz karnaylar",
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
        <main className="shell py-20">
          <div className="rounded-[28px] border border-line bg-white p-10 text-center shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
            <p className="font-display text-3xl font-semibold text-foreground">
              Mahsulotlar hali tayyor emas
            </p>
            <p className="mt-4 text-base text-muted">
              Yaqin orada yangi smartfonlar va aksiyalar shu sahifada ko'rsatiladi.
            </p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const visiblePromoDeals = promoDeals.slice(0, 3);
  const newItems = products.filter((product) => product.isNewArrival).slice(0, 4);
  const visibleNewItems = newItems.length > 0 ? newItems : products.slice(0, 4);
  const spotlightProducts = products
    .filter((product) => product.slug !== heroProduct.slug && product.slug !== productOfDay.slug)
    .slice(0, 4);
  const installmentProducts = products
    .filter(
      (product) =>
        product.slug !== heroProduct.slug &&
        product.slug !== productOfDay.slug &&
        (product.installment24 || product.installment12),
    )
    .slice(0, 4);

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
        sanitizePublicCopy(
          relatedPromo?.description,
          `${product.name} uchun qulay narx, muddatli to'lov va tezkor yetkazib berish bir joyda.`,
        ),
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

  const featureArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

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

  return (
    <>
      <SiteHeader />

      <main className="page-enter pb-16">
        <section className="shell pt-4 sm:pt-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_286px] xl:items-stretch">
            <HeroCarousel slides={heroSlides} />

            <aside className="reveal-up reveal-up-delay-1 rounded-[26px] border border-line bg-white p-4 shadow-[0_16px_38px_rgba(13,31,55,0.08)] sm:rounded-[30px] sm:p-5 xl:h-full xl:max-h-[318px] xl:overflow-hidden xl:p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground sm:text-xs sm:uppercase sm:tracking-[0.24em] sm:text-accent">
                    Kun mahsulotlari
                  </p>
                  <h2 className="mt-1 font-display text-[1.2rem] font-semibold tracking-tight text-foreground sm:mt-2 sm:text-[1.55rem] xl:text-[1rem]">
                    Kun taklifi
                  </h2>
                </div>
                <CountdownTimer compact className="shrink-0 sm:hidden" />
              </div>

              <CountdownTimer className="mt-3 hidden sm:block xl:hidden" />
              <CountdownTimer compact className="mt-2 hidden xl:block" />

              <div
                className="mt-3 rounded-[20px] border border-line p-3 sm:rounded-[22px] sm:p-3.5 xl:mt-2 xl:p-2.5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(244,249,255,1) 0%, rgba(255,255,255,1) 100%)",
                }}
              >
                <ProductVisual
                  size="deal"
                  kind={productOfDay.kind}
                  label={productOfDay.heroLabel}
                  toneFrom={productOfDay.toneFrom}
                  toneTo={productOfDay.toneTo}
                  imageUrl={productOfDay.imageUrl}
                  imageAlt={productOfDay.name}
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
                <span className="rounded-full bg-support px-3 py-1 text-xs font-semibold text-white">
                  Chegirma
                </span>
              </div>

              <Link
                href={`/product/${productOfDay.slug}`}
                className="line-clamp-2 mt-3.5 block text-[15px] font-semibold leading-6 text-foreground sm:text-base sm:leading-7 xl:mt-2.5 xl:text-[0.95rem] xl:leading-6"
              >
                {productOfDay.name}
              </Link>

              <div className="mt-3 inline-flex rounded-[12px] border border-accent px-3 py-1.5 text-sm font-semibold text-accent xl:mt-2 xl:text-[13px]">
                {formatMonthly(productOfDay.installment12 ?? productOfDay.monthlyPrice)}
              </div>

              {productOfDay.oldPrice ? (
                <p className="mt-3 text-sm text-muted line-through xl:mt-2 xl:text-[13px]">
                  {formatSum(productOfDay.oldPrice)}
                </p>
              ) : null}

              <div className="mt-1 flex items-end justify-between gap-4 xl:mt-0.5">
                <div>
                  <p className="text-[1.55rem] font-semibold tracking-tight text-foreground xl:text-[1rem]">
                    {formatSum(productOfDay.price)}
                  </p>
                  <p className="mt-1 text-[12px] text-muted xl:hidden">
                    {productOfDay.stockLabel ||
                      productOfDay.branchName ||
                      `${productOfDay.stock} dona`}
                  </p>
                </div>
                <AddToCartButton productSlug={productOfDay.slug} mode="icon" />
              </div>
            </aside>
          </div>
        </section>

        <section className="shell reveal-up reveal-up-delay-1 pt-9">
          <SectionHeading
            eyebrow="Ommabop kategoriyalar"
            title="Bir klikda kerakli bo'limga o'ting"
            description="Kategoriyalar ixcham va oson ko'rinadigan kartalarga ajratildi."
            ctaLabel="Barcha katalog"
            ctaHref="/catalog"
          />

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {categories.slice(0, 8).map((category, index) => (
              <Link
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="relative flex min-h-[92px] items-center justify-between gap-3 overflow-hidden rounded-[22px] border border-line bg-[#f7f9fc] px-4 py-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_35px_rgba(13,31,55,0.08)] sm:min-h-[110px] sm:gap-4 sm:rounded-[24px] sm:px-5 sm:py-5"
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
                  <p className="text-base font-semibold leading-6 text-foreground sm:text-lg sm:leading-7">
                    {category.name}
                  </p>
                  <p className="mt-1 text-[12px] text-muted sm:text-sm">
                    {categoryCaptions[index] ?? category.description}
                  </p>
                </div>
                <div
                  className="h-12 w-14 shrink-0 rounded-[16px] sm:h-16 sm:w-20 sm:rounded-[18px]"
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
            title="Yangi kelgan smartfonlar va tez sotilayotgan modellar"
            description="Birinchi ekran ostida foydalanuvchi darhol jonli mahsulot shelf'ini ko'rishi uchun kartalarni ixchamlashtirdik va vizual ritmni tozaladik."
            ctaLabel="Katalogga o'tish"
            ctaHref="/catalog"
          />

          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:overflow-visible xl:grid-cols-4">
            {visibleNewItems.map((product) => (
              <div
                key={product.id ?? product.slug}
                className="min-w-[280px] snap-start md:min-w-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <section id="editorial" className="shell reveal-up reveal-up-delay-2 pt-9">
          <SectionHeading
            eyebrow="alooBlog"
            title="Yangilik, maslahat va sotuv g'oyalarini bir joyga yig'dik"
            description="Faqat mahsulot emas, balki tanlash bo'yicha foydali kontent ham shu sahifada ko'rinadi."
            ctaLabel="Barcha maqolalar"
            ctaHref="/blog"
          />

          <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
            <article className="relative overflow-hidden rounded-[32px] border border-line bg-[linear-gradient(145deg,#11305b_0%,#177ddc_56%,#dfefff_100%)] p-6 text-white shadow-[0_18px_42px_rgba(10,44,96,0.14)] sm:p-8">
              <div
                className="absolute -right-10 bottom-0 h-44 w-44 opacity-[0.14]"
                style={{
                  backgroundImage: "url('/brand/aloo-mark-light.png')",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                }}
              />
              <div className="relative max-w-[480px]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  {featureArticle?.tag ?? "Editorial"}
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-[2.8rem]">
                  {featureArticle?.title ?? "2026-yil uchun eng yaxshi smartfon tanlovi"}
                </h2>
                <p className="mt-4 text-base leading-8 text-white/82">
                  {featureArticle?.summary ??
                    "Aksiyalar, premium modellar va xarid ssenariylari bo'yicha foydali kontent saytning o'zida chiqadi."}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Ko'rilgan", value: "1.2k+" },
                    { label: "Maqola", value: `${articles.length}+` },
                    { label: "Kategoriya", value: "Guide" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-white/15 bg-white/10 px-4 py-4"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-white/64">
                        {item.label}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/blog"
                  className="mt-8 inline-flex items-center gap-2 rounded-[18px] bg-white px-5 py-3 text-sm font-semibold text-accent transition hover:bg-[#eef6ff]"
                >
                  alooBlogga o'tish
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </article>

            <div className="grid gap-4">
              {sideArticles.map((article, index) => (
                <article
                  key={article.slug ?? article.title}
                  className="rounded-[26px] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                        {article.tag}
                      </p>
                      <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
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

        <section id="installment" className="shell reveal-up reveal-up-delay-3 pt-9">
          <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
            <article className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#10203a_0%,#153763_100%)] p-6 text-white shadow-[0_18px_40px_rgba(10,21,36,0.18)] sm:p-8">
              <div
                className="absolute right-0 top-0 h-40 w-40 opacity-[0.12]"
                style={{
                  backgroundImage: "url('/brand/aloo-mark-light.png')",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                }}
              />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                  Muddatli to'lov
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white">
                  Muddatli to'lov ma'lumotlari har mahsulotda ko'rinadi
                </h2>
                <p className="mt-4 text-base leading-8 text-white/72">
                  6, 12 va 24 oy bo'lib to'lash summalari mahsulot kartalarida bir xil ko'rinishda
                  chiqadi. Bu foydalanuvchi birinchi ko'rishda narxni tushunishini tezlashtiradi.
                </p>

                <div className="mt-7 grid gap-3">
                  {[
                    "Eski narx va yangi narx bir xil formatda ko'rsatiladi",
                    "Katalog, detail va kun mahsuloti blokida bir xil ko'rinish saqlanadi",
                    "SE-ONE sync narxi yangilansa storefront ham mos ravishda yangilanadi",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-7 text-white/82"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:overflow-visible md:grid-cols-2">
              {installmentProducts.map((product) => (
                <div key={product.slug} className="min-w-[280px] snap-start md:min-w-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="shell reveal-up reveal-up-delay-3 pt-9">
          <SectionHeading
            eyebrow="Promo bloklar"
            title="Asosiy takliflar va foydali bo'limlar"
            description="Asosiy banner ixchamlashtirildi, muhim takliflar esa alohida bloklarga joylandi."
          />

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
                    {sanitizePublicCopy(
                      promo.description,
                      "Qulay narx, tezkor yetkazish va original qurilmalar bir joyda jamlandi.",
                    )}
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

        <section id="stores" className="shell reveal-up reveal-up-delay-3 pt-9">
          <SectionHeading
            eyebrow="Do'konlar"
            title="Filiallar kesimida ham ishonch uyg'otadigan blok"
            description="Sync'dan kelgan mahsulotlar qaysi filialda borligi shu bo'limda ko'rsatiladi."
          />

          <div className="grid gap-4 lg:grid-cols-3">
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
                className="rounded-[28px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#fff2ec] text-support">
                    <LocationIcon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-[11px] font-semibold text-accent">
                    {branch.products} ta model
                  </span>
                </div>
                <h3 className="mt-4 font-display text-3xl font-semibold text-foreground">
                  {branch.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Eng qulay narxlardan biri {formatSum(branch.cheapest)} dan boshlanadi. Asosiy
                  brendlar: {branch.brands}.
                </p>
                <Link
                  href="/catalog"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent"
                >
                  Mahsulotlarni ko'rish
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="shell reveal-up reveal-up-delay-3 pt-9">
          <div className="grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
            <article className="rounded-[32px] bg-[linear-gradient(180deg,#ffffff_0%,#eef6ff_100%)] p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Biz haqimizda
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground">
                aloo smartfon xaridi uchun qulay va sodda platformaga aylanmoqda
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                Bosh sahifa, qidiruv, kirish, savat, taqqoslash va alooBlog bo'limlari bir
                oqimda ishlashi uchun bir tizimga yig'ildi.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Mahsulot", value: `${products.length}+` },
                  { label: "Brend", value: `${brands.length}+` },
                  { label: "Maqola", value: `${articles.length}+` },
                ].map((item) => (
                  <div key={item.label} className="rounded-[22px] bg-white px-4 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[32px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                    Trenddagi modellar
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground">
                    Ko'p ko'rilayotgan smartfonlar
                  </h2>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f4f8ff] text-accent">
                  <TrendUpIcon className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {spotlightProducts.map((product, index) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    className="flex items-center justify-between gap-4 rounded-[22px] border border-line bg-[#fbfdff] px-4 py-4 transition hover:border-accent/25 hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        0{index + 1}
                      </p>
                      <p className="mt-1 line-clamp-1 text-base font-semibold text-foreground">
                        {product.name}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        12 oy: {formatMonthly(product.installment12 ?? product.monthlyPrice)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-accent">
                      {formatSum(product.price)}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {brands.slice(0, 6).map((brand) => (
                  <Link
                    key={brand}
                    href={`/catalog?brand=${encodeURIComponent(brand)}`}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent/30 hover:text-accent"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
