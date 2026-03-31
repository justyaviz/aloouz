/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { articles, brands, categories, perks, products } from "@/data/store";

const flashDeals = products.slice(0, 4);
const freshDrops = products.slice(4, 8);

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="pb-20">
        <section className="shell pt-8">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-[38px] bg-[#050B14] p-8 text-white shadow-[0_40px_120px_rgba(5,11,20,0.3)] sm:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                  Smartfonlar bozori
                </span>
                <span className="rounded-full bg-[#1690F5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                  Texno hayotga ulanish!
                </span>
              </div>

              <h1 className="mt-8 max-w-3xl font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                aloo bilan sevimli telefoning qo'lingda.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                Brendbookdagi pozitsioningga mos ravishda sayt endi mobil telefonlar,
                gadjetlar, quloqchinlar va aqlli soatlar uchun yig'ilmoqda. Asosiy urg'u
                original mahsulot, muddatli to'lov va tezkor delivery oqimida.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center rounded-full bg-[#1690F5] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0F6ECE]"
                >
                  Smartfonlarni ko'rish
                </Link>
                <Link
                  href="/product/iphone-16-pro-max-256-desert"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/6 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  iPhone hitini ochish
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { value: "354+", label: "smartfon va gadjet pozitsiyalari" },
                  { value: "12 oy", label: "muddatli to'lovni ko'rsatadigan kartochkalar" },
                  { value: "90 min", label: "Toshkent bo'ylab tezkor delivery messaging" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                    <p className="font-display text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm leading-6 text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="glass-card rounded-[34px] p-6">
                <ProductVisual
                  kind="phone"
                  label="Orzu qilgan telefon"
                  toneFrom="#EAF5FF"
                  toneTo="#1690F5"
                />
                <div className="mt-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                    Brend messaging
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">
                    Yangi iPhone bilan hayot boshqacha. Aloo bilan esa xarid qilish osonroq.
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="soft-card rounded-[30px] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                    Brendbook ranglari
                  </p>
                  <p className="mt-3 text-lg font-semibold text-foreground">
                    #1690F5, qora va oq kombinatsiyasida toza va texnologik ko'rinish
                  </p>
                </div>
                <div className="soft-card rounded-[30px] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                    Savdo yo'nalishi
                  </p>
                  <p className="mt-3 text-lg font-semibold text-foreground">
                    Telefon, gadjet va muddatli to'lov CTA'lari birinchi qatorda
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="shell pt-16">
          <SectionHeading
            eyebrow="Yo'nalishlar"
            title="Telefon va gadjet assortimentini segmentlar bo'yicha ajratdik"
            description="Aloo brendbookidagi smartfon va gadjet fokusiga mos ravishda asosiy shelf'larni telefon, iPhone, Android va aksessuar oqimlariga bo'ldik."
            ctaLabel="To'liq katalog"
            ctaHref="/catalog"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="soft-card group rounded-[30px] p-6 transition hover:-translate-y-1"
              >
                <div
                  className="h-28 rounded-[24px]"
                  style={{
                    background: `linear-gradient(135deg, ${category.toneFrom}, ${category.toneTo})`,
                  }}
                />
                <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
                <p className="mt-4 text-sm font-semibold text-accent">
                  {category.itemCount} ta pozitsiya
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="shell pt-16">
          <SectionHeading
            eyebrow="Muddatli To'lov"
            title="Asosiy mahsulot kartalarida narx, eski narx va oylik to'lov yonma-yon turadi"
            description="Bu Aloo reklamalaridagi 'Orzu qilgan telefon endi muddatli to'lovda' xabarini storefront ichiga ko'chiradi."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {flashDeals.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className="shell pt-16">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="glass-card rounded-[38px] p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                Nima yangilandi
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold tracking-tight text-foreground">
                Sayt endi generic texnika do'koni emas, balki `aloo` uchun telefon va gadjet storefronti.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted">
                Brandbook asosida ranglar, slogan, positioning va mahsulot segmentlari
                alohida yo'naltirildi. Aloo g'oyasidagi aloqa va xizmat ruhi header,
                product detail va footer bloklarida aks ettirildi.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Logo assetlar to'g'ridan-to'g'ri yuborilgan zip ichidan olindi",
                  "Asosiy rang sifatida brandbookdagi #1690F5 ishlatildi",
                  "Smartfonlar, quloqchinlar, aqlli soatlar va planshetlar focus qilindi",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-line bg-white/90 px-5 py-4 text-sm font-medium text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {perks.map((perk) => (
                <div key={perk.title} className="soft-card rounded-[30px] p-6">
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {perk.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted">{perk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="shell pt-16">
          <SectionHeading
            eyebrow="Yangi Kelganlar"
            title="Qiziqish yuqori bo'lgan gadjetlar uchun shelf bloklari"
            description="Faqat telefon emas, soat, quloqchin va planshetlar ham Aloo assortimenti sifatida ko'rsatiladi."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {freshDrops.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className="shell pt-16">
          <SectionHeading
            eyebrow="Brendlar"
            title="Telefon bozoridagi tanish nomlarni bir sahifada jamlash"
            description="Katalog filtrlarida ham, bosh sahifadagi shelf sifatida ham smartphone brandlarini ko'rsatish conversion uchun qulay."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand, index) => (
              <div
                key={brand}
                className="glass-card rounded-[28px] px-6 py-8 text-center"
                style={{
                  background:
                    index % 2 === 0
                      ? "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(233,244,255,0.9))"
                      : "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,241,230,0.86))",
                }}
              >
                <p className="font-display text-3xl font-semibold text-foreground">{brand}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="shell pt-16">
          <SectionHeading
            eyebrow="Kontent"
            title="Brandbookdagi reklama ohangini kontent bloklariga olib kirdik"
            description="Promolar, blog sarlavhalari va banner copy'lari Aloo reklama tiliga yaqinlashtirildi."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.title} className="soft-card rounded-[30px] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
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

        <section className="shell pt-16">
          <div className="overflow-hidden rounded-[40px] bg-[#050B14] px-8 py-10 text-white sm:px-10">
            <div className="grid gap-8 xl:grid-cols-[1fr_0.75fr] xl:items-center">
              <div>
                <Image
                  src="/brand/aloo-logotype-light.png"
                  alt="aloo"
                  width={140}
                  height={38}
                />
                <h2 className="mt-5 max-w-2xl font-display text-4xl font-semibold tracking-tight">
                  Keyingi bosqich: GitHub, Railway va `aloo.uz` domeniga ulash.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
                  Brand foundation endi frontga tushdi. Keyin push, auto-deploy va real
                  domen bilan Aloo storefront'ni productionga yaqinlashtiramiz.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "GitHub repo push",
                  "Railway service ulash",
                  "Custom domain mapping",
                  "Railway Postgres bilan data layer",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[26px] border border-white/10 bg-white/6 px-5 py-5 text-sm font-medium text-white/80"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
