/* eslint-disable @next/next/no-img-element */
"use client";

import type { ProductKind } from "@/data/store";
import { getProductArtwork } from "@/lib/product-art";

type ProductVisualProps = {
  kind: ProductKind;
  label: string;
  toneFrom: string;
  toneTo: string;
  imageUrl?: string;
  imageAlt?: string;
  brand?: string;
  categorySlug?: string;
  productName?: string;
  size?: "compact" | "deal" | "default" | "hero";
  compact?: boolean;
};

export function ProductVisual({
  kind,
  label,
  toneFrom,
  toneTo,
  imageUrl,
  imageAlt,
  brand,
  categorySlug,
  productName,
  size,
  compact = false,
}: ProductVisualProps) {
  const visualSize = size ?? (compact ? "compact" : "default");
  const heightClass =
    visualSize === "hero"
      ? "h-[14.8rem] rounded-[24px] sm:h-[16.3rem] lg:h-[17.8rem]"
      : visualSize === "deal"
        ? "h-[10.9rem] rounded-[18px] sm:h-[11.6rem] xl:h-[10.8rem]"
        : visualSize === "compact"
          ? "h-[15.6rem] rounded-[22px] sm:h-[16.2rem]"
          : "h-[27rem] rounded-[36px]";
  const paddingClass =
    visualSize === "compact"
      ? "p-2.5 sm:p-3"
      : visualSize === "deal"
        ? "p-2 sm:p-2.5"
        : visualSize === "hero"
          ? "p-3 sm:p-4"
          : "p-8";
  const labelClass =
    visualSize === "deal"
      ? "bottom-2.5 left-2.5 px-2.5 py-1 text-[9px]"
      : visualSize === "compact"
      ? "bottom-3 left-3 px-3 py-1.5 text-[10px]"
      : "bottom-4 left-4 px-4 py-2 text-xs";
  const imageScaleClass =
    visualSize === "hero"
      ? "scale-[1.18]"
      : visualSize === "deal"
        ? "scale-[1.22]"
        : visualSize === "compact"
          ? "scale-[1.24]"
          : "scale-100";
  const fallbackImage = getProductArtwork({
    brand,
    categorySlug,
    kind,
    name: productName ?? imageAlt ?? label,
  });
  const visualImage = imageUrl ?? fallbackImage;

  return (
    <div
      className={`relative isolate overflow-hidden border border-white/60 ${heightClass}`}
      style={{
        background: `linear-gradient(135deg, ${toneFrom}, ${toneTo})`,
      }}
    >
      <div className="absolute inset-0 opacity-50 grid-fade" />
      <div
        className="absolute -right-6 top-5 h-28 w-28 rounded-full opacity-[0.16]"
        style={{
          backgroundImage: "url('/brand/aloo-mark-light.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />
      <div
        className="absolute -left-6 bottom-4 h-24 w-24 rounded-full opacity-[0.12]"
        style={{
          backgroundImage: "url('/brand/aloo-mark-dark.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />
      <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
      <div className="absolute bottom-8 right-8 h-28 w-28 rounded-full bg-black/10 blur-3xl" />

      <div className={`absolute inset-0 flex items-center justify-center ${paddingClass}`}>
        {visualImage ? (
          <img
            src={visualImage}
            alt={imageAlt ?? productName ?? label}
            className={`h-full w-full object-contain object-center drop-shadow-[0_28px_50px_rgba(0,0,0,0.24)] ${imageScaleClass}`}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              const target = event.currentTarget;

              if (target.dataset.fallbackApplied === "true") {
                return;
              }

              target.dataset.fallbackApplied = "true";
              target.src = fallbackImage;
            }}
          />
        ) : null}
      </div>

      <div
        className={`absolute rounded-full bg-white/88 font-semibold uppercase tracking-[0.2em] text-slate-900 ${labelClass}`}
      >
        {label}
      </div>
    </div>
  );
}
