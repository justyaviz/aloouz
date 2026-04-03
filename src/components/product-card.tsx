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
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#dee7f2] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-4 shadow-[0_20px_40px_rgba(13,31,55,0.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(13,31,55,0.12)] sm:p-4.5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#edf6ff] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent sm:text-[11px]">
            {product.badge}
          </span>
          {discount ? (
            <span className="rounded-full bg-[#07111f] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white sm:text-[11px]">
              -{discount}%
            </span>
          ) : null}
        </div>
        <span className="rounded-full border border-[#dde6f0] bg-white px-3 py-1.5 text-[10px] font-semibold text-muted sm:text-[11px]">
          {product.brand}
        </span>
      </div>

      <div className="rounded-[24px] bg-[linear-gradient(180deg,#f8fbff_0%,#f1f6fc_100%)] p-2.5">
        <ProductVisual
          size="compact"
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

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[11px] sm:tracking-[0.18em]">
          <span>{product.heroLabel}</span>
          <span className="hidden rounded-full bg-[#f2f7f3] px-3 py-1 text-[#2f7f4a] sm:inline">
            {product.branchStock ?? product.stock} dona
          </span>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 mt-3 min-h-[3rem] font-display text-[1.08rem] font-semibold leading-6 tracking-tight text-foreground transition group-hover:text-accent sm:text-[1.12rem]"
        >
          {product.name}
        </Link>

        <p className="line-clamp-2 mt-2 min-h-[2.6rem] text-[12px] leading-6 text-muted">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-accent/18 bg-[#f5f9ff] px-3 py-1.5 text-[10px] font-semibold text-accent sm:py-2 sm:text-[11px]">
            12 oy: {formatMonthly(product.installment12 ?? product.monthlyPrice)}
          </span>
          <div className="flex flex-wrap gap-2">
            {installmentOptions
              .filter((option) => option.months !== 12)
              .slice(0, 2)
              .map((option) => (
                <span
                  key={option.months}
                  className="rounded-full bg-[#f4f7fb] px-3 py-1.5 text-[10px] font-semibold text-muted sm:py-2 sm:text-[11px]"
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
            <p className="mt-1 text-[1.2rem] font-semibold tracking-tight text-foreground sm:text-[1.28rem]">
              {formatSum(product.price)}
            </p>
            <p className="mt-1 text-[12px] text-muted">
              {product.stockLabel || product.branchName || `${product.stock} dona mavjud`}
            </p>
          </div>
          <span className="rounded-full bg-[#eff8ef] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2d7a46] sm:text-[11px]">
            IMEI + original
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-[#dfe7f1] bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:bg-[#f7fbff] hover:text-accent"
          >
            <ArrowRightIcon className="h-4 w-4" />
            Batafsil
          </Link>
          <AddToCartButton productSlug={product.slug} />
          <ProductUtilityActions productSlug={product.slug} productName={product.name} />
        </div>
      </div>
    </article>
  );
}
