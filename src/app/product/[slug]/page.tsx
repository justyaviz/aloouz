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

      <main className="shell py-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
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
          <div className="glass-card rounded-[38px] p-6 sm:p-8">
            <ProductVisual
              kind={product.kind}
              label={product.heroLabel}
              toneFrom={product.toneFrom}
              toneTo={product.toneTo}
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {product.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-[24px] border border-line bg-white/80 px-4 py-4 text-sm leading-6 text-foreground"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <div id="purchase" className="soft-card rounded-[38px] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
              {product.badge}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="mt-5 text-base leading-8 text-muted">{product.shortDescription}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-white p-5">
                {product.oldPrice ? (
                  <p className="text-sm text-muted line-through">{formatSum(product.oldPrice)}</p>
                ) : null}
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {formatSum(product.price)}
                </p>
                <p className="mt-2 text-sm text-muted">Naqd yoki karta orqali to'lov</p>
              </div>

              <div className="rounded-[28px] bg-[#13201c] p-5 text-white">
                <p className="text-xs uppercase tracking-[0.22em] text-white/65">Bo'lib to'lash</p>
                <p className="mt-2 text-3xl font-semibold">{formatMonthly(product.monthlyPrice)}</p>
                <p className="mt-2 text-sm text-white/70">12 oyga qadar ko'rinish</p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">Ranglar</p>
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

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">Holat</p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                Omborda {product.stock} dona mavjud
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">{product.delivery}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+998911234567"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-foreground px-6 py-4 text-sm font-semibold text-background transition hover:bg-[#20352f]"
              >
                Bir klikda buyurtma
              </a>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-line bg-white px-6 py-4 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
              >
                Telegram orqali yozish
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-line bg-white/80 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  Delivery
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground">
                  Toshkent bo'ylab tezkor yetkazib berish, viloyatlarga esa alohida tarif
                  bilan yuborish oqimini Aloo call-center bilan bog'laymiz.
                </p>
              </div>

              <div className="rounded-[24px] border border-line bg-white/80 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  Pickup
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground">
                  Filiallar moduli keyingi iteratsiyada qo'shiladi, mahsulotni do'kondan
                  olib ketish va joyida maslahat olish oqimi ham shu yerga ulanadi.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <div className="glass-card rounded-[36px] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
              Texnik tavsif
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {product.specs.map((spec) => (
                <div key={spec.label} className="rounded-[24px] border border-line bg-white/85 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    {spec.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-foreground">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="soft-card rounded-[36px] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
              Commerce notes
            </p>
            <div className="mt-5 space-y-4">
              {[
                "Mahsulot detail sahifasi alohida SEO entry-point bo'ladi.",
                "Bu blokka keyin reviews, IMEI tekshiruv va stock per filial logikasini qo'shamiz.",
                "Prisma schema foundation orqali real products jadvaliga o'tish oson bo'ladi.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-line bg-white px-5 py-5 text-sm leading-7 text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="mt-16">
            <SectionHeading
              eyebrow="O'xshash mahsulotlar"
              title="Shu kategoriya ichidagi boshqa pozitsiyalar"
              description="Aloo vitrinasida detail sahifa ichida ham merchandizing shelf'lar ishlaydi."
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
