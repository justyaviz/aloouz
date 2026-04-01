"use client";
import Link from "next/link";

import type { Product } from "@/data/store";
import { formatMonthly, formatSum } from "@/lib/format";

import { AddToCartButton } from "./add-to-cart-button";
import { ArrowRightIcon } from "./icons";
import { ProductUtilityActions } from "./product-utility-actions";
import { ProductVisual } from "./product-visual";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;
  const installmentOptions = [
    product.installment6 ? { months: 6, amount: product.installment6 } : null,
    { months: 12, amount: product.installment12 ?? product.monthlyPrice },
    product.installment24 ? { months: 24, amount: product.installment24 } : null,
  ].filter((item): item is { months: number; amount: number } => item !== null);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white p-3.5 shadow-[0_16px_34px_rgba(13,31,55,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(13,31,55,0.12)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-[11px] font-semibold text-accent">
            {product.badge}
          </span>
          {discount ? (
            <span className="rounded-full bg-[#fff1ea] px-3 py-1 text-[11px] font-semibold text-support">
              -{discount}%
            </span>
          ) : null}
        </div>
        <span className="rounded-full bg-[#f4f7fb] px-2.5 py-1 text-[11px] font-semibold text-muted">
          {product.rating} / {product.reviews}
        </span>
      </div>

      <ProductVisual
        size="compact"
        kind={product.kind}
        label={product.heroLabel}
        toneFrom={product.toneFrom}
        toneTo={product.toneTo}
        imageUrl={product.imageUrl}
        imageAlt={product.name}
      />

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          <span>{product.brand}</span>
          <span>{product.branchStock ?? product.stock} dona mavjud</span>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 mt-3 min-h-[3.05rem] font-display text-[1rem] font-semibold leading-6 tracking-tight text-foreground"
        >
          {product.name}
        </Link>

        <p className="line-clamp-1 mt-2 min-h-[1.4rem] text-[13px] leading-5 text-muted">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-accent/20 bg-[#f6faff] px-3 py-2 text-[11px] font-semibold text-accent">
            12 oy: {formatMonthly(product.installment12 ?? product.monthlyPrice)}
          </span>
          <div className="flex flex-wrap gap-2">
            {installmentOptions
              .filter((option) => option.months !== 12)
              .slice(0, 2)
              .map((option) => (
                <span
                  key={option.months}
                  className="rounded-full bg-[#f4f7fb] px-3 py-2 text-[11px] font-semibold text-muted"
                >
                  {option.months} oy
                </span>
              ))}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            {product.oldPrice ? (
              <p className="text-sm text-muted line-through">{formatSum(product.oldPrice)}</p>
            ) : null}
            <p className="mt-1 text-xl font-semibold text-foreground">
              {formatSum(product.price)}
            </p>
            <p className="mt-1 text-[12px] text-muted">
              {product.stockLabel || product.branchName || `${product.stock} dona mavjud`}
            </p>
          </div>
          <span className="rounded-full bg-[#eff8ef] px-3 py-2 text-[11px] font-semibold text-[#2d7a46]">
            IMEI + original
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
          >
            <ArrowRightIcon className="h-4 w-4" />
            Batafsil
          </Link>
          <AddToCartButton productSlug={product.slug} />
        </div>

        <div className="mt-2 flex justify-end">
          <ProductUtilityActions productSlug={product.slug} productName={product.name} />
        </div>
      </div>
    </article>
  );
}
