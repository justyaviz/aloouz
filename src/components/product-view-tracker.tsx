"use client";

import { useEffect, useEffectEvent } from "react";

import { useStorefrontState } from "@/components/storefront-state-provider";

export function ProductViewTracker({ productSlug }: { productSlug: string }) {
  const { rememberProduct } = useStorefrontState();
  const handleRememberProduct = useEffectEvent(() => {
    rememberProduct(productSlug);
  });

  useEffect(() => {
    handleRememberProduct();
  }, [productSlug]);

  return null;
}
