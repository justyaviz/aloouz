import Link from "next/link";

import { ArrowRightIcon, MegaphoneIcon, NewspaperIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStorefrontSnapshot } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "alooBlog",
  description: "alooBlog, yangiliklar va smartfon tanlash bo'yicha foydali maqolalar",
};

const blogTopics = [
  "Yangiliklar",
  "Tavsif",
  "Reyting",
  "KiberSport",
  "AI",
  "Smartfon",
  "Aksessuar",
];

export default async function BlogPage() {
  const { articles, promoDeals, products } = await getStorefrontSnapshot();
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);
  const promo = promoDeals[1] ?? promoDeals[0];
  const topProducts = products.slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main className="shell page-enter py-6 pb-16">
        <section className="rounded-[32px] border border-line bg-white px-5 py-6 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:px-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  alooBlog
                </p>
                <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
                  Yangiliklar, tavsiyalar va editorial kontent
                </h1>
              </div>

              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {blogTopics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex h-10 shrink-0 items-center rounded-full border border-line bg-[#f8fbfd] px-4 text-sm font-medium text-foreground"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-[30px] p-6 text-white shadow-[0_18px_50px_rgba(10,44,96,0.16)] sm:p-8"
              style={{
                background: `linear-gradient(120deg, ${promo?.backgroundFrom ?? "#11305b"} 0%, ${promo?.backgroundTo ?? "#177ddc"} 100%)`,
              }}
            >
              <div
                className="absolute right-0 top-0 h-40 w-40 opacity-[0.12]"
                style={{
                  backgroundImage: "url('/brand/aloo-mark-light.png')",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                }}
              />
              <p className="relative text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                alooBlog
              </p>
              <h2 className="relative mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-white sm:text-[2.9rem]">
                {promo?.title ?? "Innovatsiyalar va smartfon bozori haqida yangiliklar"}
              </h2>
              <p className="relative mt-4 max-w-2xl text-base leading-8 text-white/80">
                {promo?.description ??
                  "Mahsulot tavsifi, aksiyalar va foydali tanlov qo'llanmalari bir joyga jamlandi."}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 pt-8 xl:grid-cols-[1.08fr_0.92fr]">
          <article className="rounded-[30px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  {featuredArticle?.tag ?? "Editorial"}
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground">
                  {featuredArticle?.title ?? "Aqlli tanlov uchun foydali editorial"}
                </h2>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f4f8ff] text-accent">
                <NewspaperIcon className="h-5 w-5" />
              </span>
            </div>

            <p className="mt-4 text-base leading-8 text-muted">
              {featuredArticle?.summary ??
                "Mahsulot, narx va imkoniyatlarni tushunarli qilib beradigan editorial blok."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {topProducts.map((product) => (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  className="rounded-[22px] border border-line bg-[#fbfdff] px-4 py-4 transition hover:border-accent/25 hover:bg-white"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {product.brand}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-foreground">
                    {product.name}
                  </p>
                </Link>
              ))}
            </div>
          </article>

          <div className="space-y-4">
            {otherArticles.map((article) => (
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
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#fff2ec] text-support">
                    <MegaphoneIcon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted">{article.summary}</p>
                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted">
                  <span>{article.date}</span>
                  <Link href="/catalog" className="inline-flex items-center gap-2 font-semibold text-accent">
                    Mos mahsulotlar
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
