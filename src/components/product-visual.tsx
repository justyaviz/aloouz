/* eslint-disable @next/next/no-img-element */
import type { ProductKind } from "@/data/store";

type ProductVisualProps = {
  kind: ProductKind;
  label: string;
  toneFrom: string;
  toneTo: string;
  imageUrl?: string;
  imageAlt?: string;
  size?: "compact" | "default" | "hero";
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
      ? "h-[15.5rem] rounded-[30px] sm:h-[18rem] lg:h-[20rem]"
      : visualSize === "compact"
        ? "h-40 rounded-[24px]"
        : "h-[26rem] rounded-[36px]";
  const paddingClass =
    visualSize === "compact" ? "p-4" : visualSize === "hero" ? "p-6 sm:p-8" : "p-8";
  const labelClass =
    visualSize === "compact"
      ? "bottom-3 left-3 px-3 py-1.5 text-[10px]"
      : "bottom-4 left-4 px-4 py-2 text-xs";

  return (
    <div
      className={`relative isolate overflow-hidden border border-white/60 ${heightClass}`}
      style={{
        background: `linear-gradient(135deg, ${toneFrom}, ${toneTo})`,
      }}
    >
      <div className="absolute inset-0 opacity-50 grid-fade" />
      <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
      <div className="absolute bottom-8 right-8 h-28 w-28 rounded-full bg-black/10 blur-3xl" />

      <div className={`absolute inset-0 flex items-center justify-center ${paddingClass}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt ?? label}
            className="h-full w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.22)]"
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
      </div>

      <div
        className={`absolute rounded-full bg-white/88 font-semibold uppercase tracking-[0.2em] text-slate-900 ${labelClass}`}
      >
        {label}
      </div>
    </div>
  );
}
