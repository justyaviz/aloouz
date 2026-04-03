/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";

import type { Product } from "@/data/store";
import { formatMonthly, formatSum } from "@/lib/format";

import { CompareIcon } from "./icons";
import { ProductVisual } from "./product-visual";
import { StorefrontEmptyState } from "./storefront-empty-state";
import { useStorefrontState } from "./storefront-state-provider";

function compareSpecLabels(products: Product[]) {
  const labels: string[] = [];

  for (const product of products) {
    for (const spec of product.specs) {
      if (!labels.includes(spec.label)) {
        labels.push(spec.label);
      }

      if (labels.length >= 6) {
        return labels;
      }
    }
  }

  return labels;
}

export function CompareView({ products }: { products: Product[] }) {
  const { clearCompare, compare, hydrated, toggleCompare } = useStorefrontState();

  const selectedProducts = compare
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  const specLabels = compareSpecLabels(selectedProducts);

  if (!hydrated) {
    return (
      <section className="rounded-[30px] border border-line bg-white p-8 shadow-[0_18px_45px_rgba(13,31,55,0.08)]">
        <p className="text-sm font-medium text-muted">Taqqoslash yuklanmoqda...</p>
      </section>
    );
  }

  if (selectedProducts.length === 0) {
    return (
      <StorefrontEmptyState
        eyebrow="Taqqoslash"
        title="Mahsulotlarni taqqoslaymizmi?"
        description="Xususiyatlari, narxi va bo'lib to'lash summalarini solishtirish uchun mahsulot kartalaridagi taqqoslash tugmasini bosing."
        icon={CompareIcon}
        primaryHref="/catalog"
        primaryLabel="Katalogga o'tish"
        secondaryHref="/favorites"
        secondaryLabel="Sevimlilar"
        footerText="Taqqoslash modulida narx, ombor holati va asosiy tavsiflar yonma-yon ko'rinishda chiqadi."
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-line bg-white p-8 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Taqqoslash
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
              {selectedProducts.length} ta mahsulot yonma-yon
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
              Narx, oylik to'lov, ombor holati va asosiy texnik tavsiflar bitta jadvalda
              ko'rsatiladi. Shu yerning o'zida eng mos modelni tez solishtirish mumkin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-2xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
            >
              Yana mahsulot qo'shish
            </Link>
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center justify-center rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-strong"
            >
              Tozalash
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[30px] border border-line bg-white shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
        <div
          className="grid gap-px bg-line"
          style={{
            gridTemplateColumns: `220px repeat(${selectedProducts.length}, minmax(280px, 1fr))`,
          }}
        >
          <div className="bg-[#f7fbff] p-6" />

          {selectedProducts.map((product) => (
            <div key={product.slug} className="bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-[11px] font-semibold text-accent">
                  {product.badge}
                </span>
                <button
                  type="button"
                  onClick={() => toggleCompare(product.slug)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-line bg-white text-muted transition hover:border-accent/35 hover:text-accent"
                  aria-label={`${product.name} ni taqqoslashdan olib tashlash`}
                >
                  <CompareIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4">
                <ProductVisual
                  compact
                  kind={product.kind}
                  label={product.heroLabel}
                  toneFrom={product.toneFrom}
                  toneTo={product.toneTo}
                  imageUrl={product.imageUrl}
                  imageAlt={product.name}
                  productName={product.name}
                  brand={product.brand}
                  categorySlug={product.categorySlug}
                />
              </div>

              <Link
                href={`/product/${product.slug}`}
                className="mt-4 block font-display text-xl font-semibold leading-8 text-foreground"
              >
                {product.name}
              </Link>
            </div>
          ))}

          {[
            {
              label: "Narx",
              render: (product: Product) => (
                <div>
                  {product.oldPrice ? (
                    <p className="text-sm text-muted line-through">{formatSum(product.oldPrice)}</p>
                  ) : null}
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {formatSum(product.price)}
                  </p>
                </div>
              ),
            },
            {
              label: "Bo'lib to'lash",
              render: (product: Product) => (
                <p className="text-base font-semibold text-accent">
                  {formatMonthly(product.monthlyPrice)}
                </p>
              ),
            },
            {
              label: "Brend",
              render: (product: Product) => product.brand,
            },
            {
              label: "Ombor",
              render: (product: Product) => `${product.stock} dona`,
            },
            {
              label: "Ranglar",
              render: (product: Product) => product.colors.join(", "),
            },
            ...specLabels.map((label) => ({
              label,
              render: (product: Product) =>
                product.specs.find((spec) => spec.label === label)?.value ?? "-",
            })),
          ].map((row) => (
            <FragmentRow key={row.label} label={row.label}>
              {selectedProducts.map((product) => (
                <CompareCell
                  key={`${row.label}-${product.slug}`}
                  product={product}
                  render={row.render}
                />
              ))}
            </FragmentRow>
          ))}
        </div>
      </div>
    </section>
  );
}

function FragmentRow({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <>
      <div className="bg-[#f7fbff] px-5 py-5 text-sm font-semibold text-foreground sm:px-6">
        {label}
      </div>
      {children}
    </>
  );
}

function CompareCell({
  product,
  render,
}: {
  product: Product;
  render: (product: Product) => React.ReactNode;
}) {
  const content = render(product);

  return (
    <div className="bg-white p-5 text-sm leading-7 text-foreground sm:p-6">
      {typeof content === "string" ? <p>{content}</p> : content}
    </div>
  );
}
