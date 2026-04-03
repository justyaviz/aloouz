/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";

import type { Product } from "@/data/store";
import { formatSum } from "@/lib/format";

import { AddToCartButton } from "./add-to-cart-button";
import { CartIcon, TrashIcon } from "./icons";
import { ProductVisual } from "./product-visual";
import { StorefrontEmptyState } from "./storefront-empty-state";
import { useStorefrontState } from "./storefront-state-provider";

export function CartView({ products }: { products: Product[] }) {
  const { cart, clearCart, hydrated, removeFromCart } = useStorefrontState();

  const cartProducts = cart
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  const total = cartProducts.reduce((sum, product) => sum + product.price, 0);

  if (!hydrated) {
    return (
      <section className="rounded-[30px] border border-line bg-white p-8 shadow-[0_18px_45px_rgba(13,31,55,0.08)]">
        <p className="text-sm font-medium text-muted">Savat yuklanmoqda...</p>
      </section>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <StorefrontEmptyState
        eyebrow="Savatcha"
        title="Savatchangiz hozircha bo'sh"
        description="Asosiy sahifada yoki katalog ichida yoqqan smartfonlarni savatchaga qo'shing. Keyin shu joydan xaridni davom ettirasiz."
        icon={CartIcon}
        primaryHref="/catalog"
        primaryLabel="O'tish"
        secondaryHref="/favorites"
        secondaryLabel="Sevimlilar"
        footerText="Tanlangan mahsulotlar savatda vaqtincha saqlanadi, shuning uchun xaridni istalgan payt davom ettirishingiz mumkin."
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-line bg-white p-8 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Savat</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
              Xarid uchun tanlangan mahsulotlar
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
              Hozir savatda {cartProducts.length} ta mahsulot bor. Bo'sh holat, miqdor va xaridga
              qaytish oqimi qulay va soddalashtirilgan ko'rinishda ishlaydi.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-2xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
            >
              Katalogga qaytish
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center justify-center rounded-2xl bg-support px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#e45d07]"
            >
              Savatni tozalash
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {cartProducts.map((product) => (
            <article
              key={product.slug}
              className="grid gap-4 rounded-[28px] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)] md:grid-cols-[180px_minmax(0,1fr)_auto]"
            >
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

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  {product.brand}
                </p>
                <Link
                  href={`/product/${product.slug}`}
                  className="mt-2 block font-display text-2xl font-semibold leading-8 text-foreground"
                >
                  {product.name}
                </Link>
                <p className="mt-2 text-sm leading-7 text-muted">{product.shortDescription}</p>
                <p className="mt-3 text-sm font-medium text-muted">
                  {product.stockLabel || product.branchName || `${product.stock} dona mavjud`}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 md:items-end">
                <p className="text-2xl font-semibold text-foreground">{formatSum(product.price)}</p>
                <AddToCartButton productSlug={product.slug} className="w-full md:w-auto" />
                <button
                  type="button"
                  onClick={() => removeFromCart(product.slug)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-support/35 hover:text-support"
                >
                  <TrashIcon className="h-4 w-4" />
                  Olib tashlash
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-[30px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Jami
          </p>
          <div className="mt-5 rounded-[22px] bg-[#f6faff] p-5">
            <p className="text-sm text-muted">Mahsulotlar summasi</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{formatSum(total)}</p>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
            <p>Yetkazish, filial pick-up va muddatli to'lov tafsilotlari checkout bosqichida chiqadi.</p>
            <p>Tanlangan mahsulotlar savatda saqlanadi va keyingi xarid bosqichiga shu yerdan o'tiladi.</p>
          </div>
          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-strong"
          >
            Buyurtma berish
          </Link>
        </aside>
      </div>
    </section>
  );
}
