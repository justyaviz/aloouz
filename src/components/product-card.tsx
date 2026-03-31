/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import type { Product } from "@/data/store";
import { formatMonthly, formatSum } from "@/lib/format";

import { ProductVisual } from "./product-visual";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-white p-4 shadow-[0_18px_45px_rgba(13,31,55,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(13,31,55,0.12)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-accent">
            {product.badge}
          </span>
          {discount ? (
            <span className="rounded-full bg-[#fff1ea] px-3 py-1 text-xs font-semibold text-support">
              -{discount}%
            </span>
          ) : null}
        </div>
        <span className="text-xs font-semibold text-muted">
          {product.rating} / {product.reviews}
        </span>
      </div>

      <ProductVisual
        compact
        kind={product.kind}
        label={product.heroLabel}
        toneFrom={product.toneFrom}
        toneTo={product.toneTo}
      />

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          <span>{product.brand}</span>
          <span>{product.stock} dona mavjud</span>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="mt-3 min-h-[4rem] font-display text-xl font-semibold leading-8 tracking-tight text-foreground"
        >
          {product.name}
        </Link>

        <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-muted">
          {product.shortDescription}
        </p>

        <div className="mt-4 rounded-[20px] bg-[#f6faff] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Bo'lib to'lash</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatMonthly(product.monthlyPrice)}
          </p>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            {product.oldPrice ? (
              <p className="text-sm text-muted line-through">{formatSum(product.oldPrice)}</p>
            ) : null}
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {formatSum(product.price)}
            </p>
          </div>
          <span className="rounded-full bg-[#eff8ef] px-3 py-2 text-xs font-semibold text-[#2d7a46]">
            IMEI + original
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center justify-center rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
          >
            Batafsil
          </Link>
          <Link
            href={`/product/${product.slug}#purchase`}
            className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b74d1]"
          >
            Savatga
          </Link>
        </div>
      </div>
    </article>
  );
}
