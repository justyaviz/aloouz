"use client";

import Link from "next/link";

import { CartIcon } from "@/components/icons";
import { useStorefrontState } from "@/components/storefront-state-provider";

type AddToCartButtonProps = {
  productSlug: string;
  mode?: "solid" | "icon";
  className?: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function AddToCartButton({
  productSlug,
  mode = "solid",
  className,
}: AddToCartButtonProps) {
  const { addToCart, cart, hydrated } = useStorefrontState();
  const inCart = hydrated ? cart.includes(productSlug) : false;

  if (mode === "icon") {
    return (
      <button
        type="button"
        onClick={() => addToCart(productSlug)}
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-accent text-white transition hover:bg-accent-strong",
          inCart && "bg-catalog hover:bg-catalog-strong",
          className,
        )}
        aria-label={inCart ? "Mahsulot savatda" : "Savatga qo'shish"}
      >
        <CartIcon className="h-5 w-5" />
      </button>
    );
  }

  if (inCart) {
    return (
      <Link
        href="/cart"
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-2xl bg-catalog px-4 py-3 text-sm font-semibold text-white transition hover:bg-catalog-strong",
          className,
        )}
      >
        <CartIcon className="h-4 w-4" />
        Savatda
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addToCart(productSlug)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong",
        className,
      )}
    >
      <CartIcon className="h-4 w-4" />
      Savatga
    </button>
  );
}
