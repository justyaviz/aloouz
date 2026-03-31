/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProduct, products } from "@/data/store";
import { formatMonthly, formatSum } from "@/lib/format";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {
      title: "Mahsulot topilmadi",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main className="shell py-6 pb-16">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-foreground">
            Bosh sahifa
          </Link>
          <span>/</span>
          <Link href={`/catalog?category=${product.categorySlug}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-line bg-white p-6 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#eef6ff] px-3 py-1.5 text-xs font-semibold text-accent">
                {product.badge}
              </span>
              <span className="rounded-full bg-[#eff8ef] px-3 py-1.5 text-xs font-semibold text-[#2d7a46]">
                IMEI + original
              </span>
              <span className="rounded-full bg-[#fff4eb] px-3 py-1.5 text-xs font-semibold text-support">
                {product.rating} / {product.reviews}
              </span>
            </div>

            <div className="mt-6">
              <ProductVisual
                kind={product.kind}
                label={product.heroLabel}
                toneFrom={product.toneFrom}
                toneTo={product.toneTo}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {product.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-[20px] bg-[#f6faff] px-4 py-4 text-sm leading-6 text-foreground"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <div
            id="purchase"
            className="rounded-[32px] border border-line bg-white p-6 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              {product.brand}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-muted">{product.shortDescription}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-[#f6faff] p-5">
                {product.oldPrice ? (
                  <p className="text-sm text-muted line-through">{formatSum(product.oldPrice)}</p>
                ) : null}
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {formatSum(product.price)}
                </p>
                <p className="mt-2 text-sm text-muted">Naqd yoki karta orqali to'lov</p>
              </div>

              <div className="rounded-[24px] bg-accent p-5 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                  Bo'lib to'lash
                </p>
                <p className="mt-2 text-3xl font-semibold">{formatMonthly(product.monthlyPrice)}</p>
                <p className="mt-2 text-sm text-white/75">12 oyga qadar qulay taqsimot</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Ranglar</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-foreground"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] border border-line bg-[#fbfdff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Ombor holati
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  Omborda {product.stock} dona mavjud
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">{product.delivery}</p>
              </div>

              <div className="rounded-[20px] border border-line bg-[#fbfdff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Pickup va filial
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Filiallar moduli ulanadigan joy tayyor. Mahsulotni do'kondan olib ketish va
                  joyida konsultatsiya olish oqimi shu blok bilan ishlaydi.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href="tel:+998911234567"
                className="inline-flex items-center justify-center rounded-2xl bg-foreground px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#12233b]"
              >
                Bir klikda buyurtma
              </a>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-line bg-white px-6 py-4 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
              >
                Telegram orqali yozish
              </a>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "Retail detail ichida narx, oylik to'lov va ombor holati alohida ko'rsatiladi.",
                "Aksiya va trust label'lari yuqorida bir qarashda ko'rinadi.",
                "Keyingi bosqichda reviews, IMEI tekshiruv va filial bo'yicha stock qo'shiladi.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] bg-[#f6faff] px-4 py-4 text-sm leading-6 text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[32px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Texnik tavsif
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.specs.map((spec) => (
                <div key={spec.label} className="rounded-[20px] bg-[#f6faff] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    {spec.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-foreground">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Xizmatlar
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Tezkor delivery va pick-up",
                  "Telefon va Telegram orqali konsultatsiya",
                  "Muddatli to'lov va aksiya bannerlari",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] bg-[#f6faff] px-4 py-4 text-sm text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-[#0a1524] p-5 text-white shadow-[0_20px_50px_rgba(10,21,36,0.2)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                Commerce note
              </p>
              <p className="mt-3 text-sm leading-7 text-white/75">
                Product detail ham bosh sahifa kabi retail uslubda soddalashtirildi. Bu
                strukturada sticky purchase panel, sharhlar va real backend stock logikasi
                qo'shish osonroq bo'ladi.
              </p>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="mt-12">
            <SectionHeading
              eyebrow="O'xshash Mahsulotlar"
              title="Shu kategoriya ichidagi boshqa tavsiyalar"
              description="Detail sahifa ichida ham merchandizing shelf saqlanadi, bu retail tajriba uchun muhim."
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.slug} product={relatedProduct} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </>
  );
}
