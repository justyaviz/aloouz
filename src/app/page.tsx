/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { articles, brands, categories, perks, products } from "@/data/store";

const flashDeals = products.slice(0, 4);
const latestDeals = products.slice(4, 8);
const heroCategories = categories.slice(0, 7);

const promoPanels = [
  {
    eyebrow: "Aksiyalar",
    title: "iPhone va Samsung uchun 12 oygacha qulay to'lov",
    description: "Flagman modellarda eski narx, yangi narx va oylik to'lov birga ko'rsatiladi.",
    href: "/catalog?category=smartfonlar",
    background: "linear-gradient(180deg, #ffffff 0%, #eef6ff 100%)",
  },
  {
    eyebrow: "Tez yetkazish",
    title: "Bugun buyurtma, bugun jo'natish",
    description: "Toshkent bo'ylab tezkor delivery va pick-up oqimi e-commerce sahifasiga tayyor.",
    href: "/catalog?category=quloqchinlar",
    background: "linear-gradient(180deg, #fff7ef 0%, #ffffff 100%)",
  },
];

const serviceCards = [
  {
    title: "Muddatli to'lov",
    description: "Har kartochkada 12 oygacha bo'lib to'lash summasi ko'rinadi.",
  },
  {
    title: "Original va IMEI",
    description: "Telefonlar original va ro'yxatdan o'tkazilgan holatda ko'rsatiladi.",
  },
  {
    title: "Tezkor delivery",
    description: "Toshkent bo'ylab buyurtmalarni qisqa vaqt ichida yetkazish oqimi tayyor.",
  },
  {
    title: "Konsultatsiya",
    description: "Telegram, telefon va filial orqali tezkor maslahat berish uchun bloklar tayyor.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="pb-16">
        <section className="shell pt-6">
          <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="overflow-hidden rounded-[30px] border border-line bg-white shadow-[0_18px_45px_rgba(13,31,55,0.08)]">
              <div className="border-b border-line px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  Kategoriyalar
                </p>
              </div>

              <div className="divide-y divide-line/70">
                {heroCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/catalog?category=${category.slug}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#f7fbff]"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{category.name}</p>
                      <p className="mt-1 text-xs text-muted">{category.itemCount} ta mahsulot</p>
                    </div>
                    <span className="text-sm font-semibold text-accent">Ko'rish</span>
                  </Link>
                ))}

                <Link
                  href="/catalog"
                  className="flex items-center justify-between px-5 py-4 text-sm font-semibold text-accent transition hover:bg-[#f7fbff]"
                >
                  Barcha kategoriyalar
                  <span>Ochish</span>
                </Link>
              </div>
            </aside>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#1690F5_0%,#0D6EC9_100%)] p-8 text-white shadow-[0_28px_70px_rgba(22,144,245,0.22)] sm:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                    Smartfonlar bozori
                  </span>
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                    Texno hayotga ulanish!
                  </span>
                </div>

                <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
                  aloo uchun retail storefront endi MediaPark ritmiga yaqinlashdi.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
                  Chapda kategoriya paneli, markazda aksiya banneri, pastda esa shelf uslubidagi
                  mahsulot bloklari. Brend aloo bo'lib qoladi, ichki tuzilma esa yirik texno
                  market kabi ishlaydi.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/catalog?category=smartfonlar"
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-accent transition hover:bg-[#eef6ff]"
                  >
                    Smartfonlarni ko'rish
                  </Link>
                  <Link
                    href="/catalog?category=iphone"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    iPhone aksiyalarini ochish
                  </Link>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {[
                    { value: "354+", label: "telefon va gadjet pozitsiyalari" },
                    { value: "12 oy", label: "muddatli to'lov ko'rinishi" },
                    { value: "90 min", label: "tezkor delivery messaging" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-4"
                    >
                      <p className="font-display text-3xl font-semibold text-white">{item.value}</p>
                      <p className="mt-2 text-sm text-white/70">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {promoPanels.map((panel) => (
                  <Link
                    key={panel.title}
                    href={panel.href}
                    className="rounded-[28px] border border-line p-6 shadow-[0_18px_45px_rgba(13,31,55,0.08)] transition hover:-translate-y-1"
                    style={{ background: panel.background }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                      {panel.eyebrow}
                    </p>
                    <h2 className="mt-3 font-display text-2xl font-semibold leading-8 text-foreground">
                      {panel.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-muted">{panel.description}</p>
                    <p className="mt-5 text-sm font-semibold text-accent">Batafsil ko'rish</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="shell pt-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {serviceCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[24px] border border-line bg-white px-5 py-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
              >
                <p className="font-display text-2xl font-semibold text-foreground">{card.title}</p>
                <p className="mt-3 text-sm leading-7 text-muted">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="shell pt-12">
          <SectionHeading
            eyebrow="Tovarlar Kuni"
            title="Bugun ko'p ko'rilayotgan smartfon va gadjetlar"
            description="Mahsulot shelf'lari MediaParkga o'xshash retail oqimda joylashtirildi: oldin asosiy hitlar, keyin yangi kelganlar va brendlar."
            ctaLabel="Barcha mahsulotlar"
            ctaHref="/catalog"
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {flashDeals.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className="shell pt-12">
          <div className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
            <div className="rounded-[30px] border border-line bg-white p-6 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Ommabop kategoriyalar
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Ichki sahifa endi market uslubidagi merchandizing bilan ishlaydi.
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                Category panel, promo banner, aksiyalar shelf'i va xizmat bloklari aloo
                brendini saqlagan holda yirik texnika do'koni ritmida joylashtirildi.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Katalog chap tomonda tez ko'rinadi",
                  "Search va utility action'lar header ichida bir qatorda turadi",
                  "Kartochkalarda narx, eski narx va bo'lib to'lash aniq ko'rinadi",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] bg-[#f6faff] px-4 py-4 text-sm font-medium text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/catalog?category=${category.slug}`}
                  className="rounded-[26px] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)] transition hover:-translate-y-1"
                >
                  <div
                    className="h-24 rounded-[20px]"
                    style={{
                      background: `linear-gradient(135deg, ${category.toneFrom}, ${category.toneTo})`,
                    }}
                  />
                  <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
                  <p className="mt-4 text-sm font-semibold text-accent">
                    {category.itemCount} ta mahsulot
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="shell pt-12">
          <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="rounded-[30px] bg-[#0a1524] p-6 text-white shadow-[0_20px_50px_rgba(10,21,36,0.22)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Smartfon Aksiyalari
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">
                Narx sezilarli, taklif aniq, xarid qilish esa tez.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Retail ichki sahifada alohida aksiya bloklari bo'lishi kerak. Bu yerda
                iPhone, Android va audio shelf'lari alohida bo'lim sifatida ko'rsatiladi.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Eski narx va yangi narx bir qarashda ko'rinadi",
                  "IMEI va original label'lari kartochkada chiqadi",
                  "Muddatli to'lov summasi har mahsulotda saqlanadi",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-4 text-sm text-white/80"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/catalog?category=smartfonlar"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-[#eef6ff]"
              >
                Aksiyadagi mahsulotlar
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {latestDeals.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="shell pt-12">
          <SectionHeading
            eyebrow="Brendlar"
            title="Mashhur smartfon, audio va gadjet brendlarini alohida ajratdik"
            description="Retail ko'rinishda brend shelf'lari ham muhim. Katalog filtrlari bilan bosh sahifadagi brand grid bir yo'nalishda ishlaydi."
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

        <section className="shell pt-12">
          <SectionHeading
            eyebrow="Nega aynan aloo?"
            title="Servis bloklari ham endi retail-marketplace uslubida"
            description="MediaPark'ga o'xshash e-commerce tajribasi uchun yetkazish, to'lov, kafolat va maslahat argumentlari alohida bloklarda chiqadi."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="rounded-[24px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
              >
                <p className="font-display text-2xl font-semibold text-foreground">{perk.title}</p>
                <p className="mt-3 text-sm leading-7 text-muted">{perk.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="shell pt-12">
          <SectionHeading
            eyebrow="Kontent"
            title="Blog va promo copy ham savdo ritmiga mos turadi"
            description="Bosh sahifa faqat banner emas, balki qiziqish uyg'otadigan kontent kartalarini ham olib yuradi."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.title}
                className="rounded-[24px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  {article.tag}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                  {article.title}
                </h3>
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
