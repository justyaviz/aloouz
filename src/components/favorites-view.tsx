/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";

import type { Product } from "@/data/store";

import { HeartIcon } from "./icons";
import { ProductCard } from "./product-card";
import { StorefrontEmptyState } from "./storefront-empty-state";
import { useStorefrontState } from "./storefront-state-provider";

export function FavoritesView({ products }: { products: Product[] }) {
  const { favorites, hydrated, recent } = useStorefrontState();

  const favoriteProducts = favorites
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  const recentProducts = recent
    .filter((slug) => !favorites.includes(slug))
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product))
    .slice(0, 4);

  if (!hydrated) {
    return (
      <section className="rounded-[30px] border border-line bg-white p-8 shadow-[0_18px_45px_rgba(13,31,55,0.08)]">
        <p className="text-sm font-medium text-muted">Sevimlilar yuklanmoqda...</p>
      </section>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <section className="space-y-6">
        <StorefrontEmptyState
          eyebrow="Sevimlilar"
          title="Sizda hozircha sevimli mahsulotlar mavjud emas"
          description="Mahsulot kartalari yoki detail sahifasidagi yurak tugmasi yordamida yoqqan modellaringizni sevimlilarga saqlashingiz mumkin."
          icon={HeartIcon}
          primaryHref="/catalog"
          primaryLabel="Orqaga"
          secondaryHref="/compare"
          secondaryLabel="Taqqoslash"
        />

        {recentProducts.length > 0 ? (
          <section className="rounded-[30px] border border-line bg-white p-8 shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  So'nggi ko'rilganlar
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                  Oxirgi ko'rilgan mahsulotlar
                </h2>
              </div>
              <p className="text-sm text-muted">Bir klikda sevimliga qo'shish uchun qulay blok.</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {recentProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-line bg-white p-8 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Sevimlilar
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
              Yoqib qolgan smartfon va gadjetlar
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
              Hozir {favoriteProducts.length} ta mahsulot sevimliga saqlandi. Bu bo'lim orqali
              tanlangan modellarni tez ko'rib chiqish va keyin taqqoslashga o'tish mumkin.
            </p>
          </div>

          <Link
            href="/compare"
            className="inline-flex items-center justify-center rounded-2xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
          >
            Taqqoslashga o'tish
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
