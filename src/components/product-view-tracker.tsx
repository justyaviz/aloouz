"use client";

import { useEffect } from "react";

import { useStorefrontState } from "@/components/storefront-state-provider";

export function ProductViewTracker({ productSlug }: { productSlug: string }) {
  const { rememberProduct } = useStorefrontState();

  useEffect(() => {
    rememberProduct(productSlug);
  }, [productSlug, rememberProduct]);

  return null;
}
