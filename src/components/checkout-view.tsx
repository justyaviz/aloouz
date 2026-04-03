"use client";

import { useActionState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createCheckoutOrderAction,
  type CheckoutActionState,
} from "@/app/checkout/actions";
import type { AuthViewer } from "@/lib/customer-auth";
import type { Product } from "@/data/store";
import { formatSum } from "@/lib/format";

import { ClipboardIcon, LocationIcon } from "./icons";
import { ProductVisual } from "./product-visual";
import { StorefrontEmptyState } from "./storefront-empty-state";
import { useStorefrontState } from "./storefront-state-provider";

type CheckoutViewProps = {
  products: Product[];
  viewer: AuthViewer;
  singleProductSlug?: string;
};

const initialState: CheckoutActionState = {};

function SubmitButton() {
  return (
    <button
      type="submit"
      className="inline-flex h-14 w-full items-center justify-center rounded-[20px] bg-accent px-6 text-base font-semibold text-white transition hover:bg-accent-strong"
    >
      Buyurtmani yuborish
    </button>
  );
}

export function CheckoutView({ products, viewer, singleProductSlug }: CheckoutViewProps) {
  const router = useRouter();
  const { cart, clearCart, hydrated } = useStorefrontState();
  const [state, formAction] = useActionState(createCheckoutOrderAction, initialState);

  const selectedProducts = useMemo(() => {
    if (singleProductSlug) {
      const singleProduct = products.find((product) => product.slug === singleProductSlug);
      return singleProduct ? [singleProduct] : [];
    }

    return cart
      .map((slug) => products.find((product) => product.slug === slug))
      .filter((product): product is Product => Boolean(product));
  }, [cart, products, singleProductSlug]);

  const totalAmount = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const productSlugsValue = selectedProducts.map((product) => product.slug).join(",");

  useEffect(() => {
    if (!state.success || !state.orderNumber || !state.phone) {
      return;
    }

    if (!singleProductSlug) {
      clearCart();
    }

    router.push(
      `/order-status?number=${encodeURIComponent(state.orderNumber)}&phone=${encodeURIComponent(state.phone)}`,
    );
  }, [clearCart, router, singleProductSlug, state.orderNumber, state.phone, state.success]);

  if ((!singleProductSlug && !hydrated) || (singleProductSlug && selectedProducts.length === 0)) {
    return (
      <section className="rounded-[30px] border border-line bg-white p-8 shadow-[0_18px_45px_rgba(13,31,55,0.08)]">
        <p className="text-sm font-medium text-muted">Checkout yuklanmoqda...</p>
      </section>
    );
  }

  if (selectedProducts.length === 0) {
    return (
      <StorefrontEmptyState
        eyebrow="Checkout"
        title="Buyurtma uchun mahsulot tanlanmagan"
        description="Avval savatga mahsulot qo'shing yoki mahsulot sahifasidan to'g'ridan-to'g'ri buyurtma bering."
        icon={ClipboardIcon}
        primaryHref="/catalog"
        primaryLabel="Katalogga o'tish"
        secondaryHref="/cart"
        secondaryLabel="Savatcha"
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-line bg-white p-8 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Checkout
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
              Buyurtmani rasmiylashtirish
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
              Telefon tasdiqlangan. Endi manzilni kiriting va buyurtmani yuboring. Buyurtma
              yaratilgach status sahifasiga o&apos;tasiz.
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-2xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
          >
            Savatga qaytish
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form action={formAction} className="space-y-5 rounded-[30px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
          <input type="hidden" name="productSlugs" value={productSlugsValue} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] border border-line bg-[#fbfdff] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Ism</p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {[viewer.firstName, viewer.lastName].filter(Boolean).join(" ")}
              </p>
            </div>
            <div className="rounded-[20px] border border-line bg-[#fbfdff] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Telefon
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">{viewer.displayPhone}</p>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">
              Yetkazib berish manzili *
            </span>
            <div className="flex items-start gap-3 rounded-[20px] border border-[#cfdceb] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(13,31,55,0.04)]">
              <LocationIcon className="mt-1 h-5 w-5 shrink-0 text-accent" />
              <textarea
                name="address"
                rows={4}
                placeholder="Masalan: Toshkent shahri, Chilonzor tumani, 12-kvartal, 15-uy"
                className="min-h-28 w-full resize-none bg-transparent text-base text-foreground outline-none placeholder:text-muted"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">Qo&apos;shimcha izoh</span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Qo&apos;ng&apos;iroq qilish vaqti, mo&apos;ljal yoki boshqa izoh"
              className="min-h-28 w-full resize-none rounded-[20px] border border-[#cfdceb] bg-white px-4 py-4 text-base text-foreground outline-none placeholder:text-muted shadow-[0_10px_24px_rgba(13,31,55,0.04)]"
            />
          </label>

          {state.error ? (
            <p className="rounded-[18px] bg-[#edf6ff] px-4 py-3 text-sm leading-6 text-accent">
              {state.error}
            </p>
          ) : null}

          <SubmitButton />
        </form>

        <aside className="rounded-[30px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Buyurtma tarkibi
          </p>
          <div className="mt-5 space-y-4">
            {selectedProducts.map((product) => (
              <div
                key={product.slug}
                className="grid gap-3 rounded-[22px] border border-line bg-[#fbfdff] p-4"
              >
                <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
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
                    <p className="mt-2 text-sm font-semibold leading-6 text-foreground">
                      {product.name}
                    </p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {formatSum(product.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[22px] bg-[#f6faff] p-5">
            <p className="text-sm text-muted">Jami summa</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{formatSum(totalAmount)}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
