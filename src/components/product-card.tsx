/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import type { Product } from "@/data/store";
import { formatMonthly, formatSum } from "@/lib/format";

import { ProductVisual } from "./product-visual";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="soft-card flex h-full flex-col rounded-[30px] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(19,32,28,0.14)]">
      <ProductVisual
        compact
        kind={product.kind}
        label={product.heroLabel}
        toneFrom={product.toneFrom}
        toneTo={product.toneTo}
      />

      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          <span>{product.badge}</span>
          <span>
            {product.rating} / {product.reviews}
          </span>
        </div>

        <p className="mt-3 text-sm text-muted">{product.brand}</p>

        <Link
          href={`/product/${product.slug}`}
          className="mt-2 font-display text-xl font-semibold leading-8 tracking-tight text-foreground"
        >
          {product.name}
        </Link>

        <p className="mt-3 text-sm leading-6 text-muted">{product.shortDescription}</p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            {product.oldPrice ? (
              <p className="text-sm text-muted line-through">{formatSum(product.oldPrice)}</p>
            ) : null}
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {formatSum(product.price)}
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Bo'lib to'lash</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatMonthly(product.monthlyPrice)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0F6ECE]"
          >
            Ko'rish
          </Link>
          <Link
            href={`/product/${product.slug}#purchase`}
            className="inline-flex items-center justify-center rounded-full border border-line px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-white"
          >
            Savatga
          </Link>
        </div>
      </div>
    </article>
  );
}
