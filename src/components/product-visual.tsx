/* eslint-disable @next/next/no-img-element */
"use client";
import type { ProductKind } from "@/data/store";

type ProductVisualProps = {
  kind: ProductKind;
  label: string;
  toneFrom: string;
  toneTo: string;
  imageUrl?: string;
  imageAlt?: string;
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
  size,
  compact = false,
}: ProductVisualProps) {
  const visualSize = size ?? (compact ? "compact" : "default");
  const heightClass =
    visualSize === "hero"
      ? "h-[12.5rem] rounded-[24px] sm:h-[14rem] lg:h-[15.2rem]"
      : visualSize === "deal"
        ? "h-[8.9rem] rounded-[18px] sm:h-[9.8rem] xl:h-[8.2rem]"
      : visualSize === "compact"
        ? "h-[12.8rem] rounded-[22px] sm:h-[14.25rem]"
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
      ? "scale-[1.08]"
      : visualSize === "deal"
        ? "scale-[1.14]"
        : visualSize === "compact"
          ? "scale-[1.12]"
          : "scale-100";

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
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt ?? label}
            className={`h-full w-full object-contain object-center drop-shadow-[0_24px_40px_rgba(0,0,0,0.22)] ${imageScaleClass}`}
            loading="lazy"
            decoding="async"
          />
        ) : null}

        {!imageUrl && kind === "phone" ? (
          <div className="relative h-full max-h-80 w-36 rounded-[2rem] border border-white/60 bg-slate-950/90 shadow-2xl">
            <div className="absolute left-1/2 top-3 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/25" />
            <div className="absolute inset-x-3 bottom-3 top-6 rounded-[1.5rem] bg-gradient-to-b from-white/95 via-white/70 to-white/20" />
          </div>
        ) : null}

        {!imageUrl && kind === "watch" ? (
          <div className="relative flex h-full max-h-80 w-48 items-center justify-center">
            <div className="absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 rounded-full bg-slate-950/80" />
            <div className="relative z-10 flex h-40 w-36 items-center justify-center rounded-[2rem] border border-white/60 bg-slate-950/90 shadow-2xl">
              <div className="h-24 w-24 rounded-full bg-gradient-to-b from-white/90 to-white/25" />
            </div>
          </div>
        ) : null}

        {!imageUrl && kind === "tablet" ? (
          <div className="relative h-full max-h-80 w-full max-w-sm rounded-[2rem] border border-white/60 bg-slate-950/90 p-3 shadow-2xl">
            <div className="h-full w-full rounded-[1.5rem] bg-gradient-to-br from-white/90 via-white/55 to-white/10" />
            <div className="absolute left-1/2 top-1.5 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/25" />
          </div>
        ) : null}

        {!imageUrl && kind === "audio" ? (
          <div className="relative flex w-full max-w-md flex-col items-center gap-5">
            <div className="h-16 w-full rounded-[1.4rem] border border-white/60 bg-slate-950/90 shadow-2xl" />
            <div className="h-32 w-32 rounded-full border border-white/60 bg-slate-950/90 shadow-2xl" />
          </div>
        ) : null}

        {!imageUrl && kind === "keyboard" ? (
          <div className="relative w-full max-w-md rounded-[1.8rem] border border-white/60 bg-slate-950/90 p-4 shadow-2xl">
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className="h-7 rounded-[0.8rem] bg-gradient-to-b from-white/85 to-white/15"
                />
              ))}
            </div>
          </div>
        ) : null}

        {!imageUrl && kind === "speaker" ? (
          <div className="relative flex h-full max-h-80 w-full max-w-md items-center justify-center">
            <div className="flex h-44 w-32 items-center justify-center rounded-[2rem] border border-white/60 bg-slate-950/90 shadow-2xl">
              <div className="h-24 w-24 rounded-full border border-white/30 bg-gradient-to-b from-white/90 to-white/15" />
            </div>
          </div>
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
