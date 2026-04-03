"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { ProductKind } from "@/data/store";

import { ArrowLeftIcon, ArrowRightIcon } from "./icons";
import { ProductVisual } from "./product-visual";

type HeroCarouselSlide = {
  id: string;
  brand?: string;
  categorySlug?: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  accentLabel?: string;
  price?: number;
  monthlyPrice?: number;
  badge?: string;
  kind: ProductKind;
  heroLabel: string;
  imageUrl?: string;
  imageAlt?: string;
  toneFrom: string;
  toneTo: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function HeroCarousel({ slides }: { slides: HeroCarouselSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const goPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div className="reveal-up relative overflow-hidden rounded-[28px] border border-[#d9e4ef] bg-white shadow-[0_18px_38px_rgba(13,31,55,0.08)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(22,144,245,0.08),transparent_36%)]" />

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrevious}
            className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e2e9f2] bg-white text-[#243548] shadow-[0_10px_22px_rgba(10,24,44,0.12)] lg:inline-flex"
            aria-label="Oldingi banner"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e2e9f2] bg-white text-[#243548] shadow-[0_10px_22px_rgba(10,24,44,0.12)] lg:inline-flex"
            aria-label="Keyingi banner"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </>
      ) : null}

      <div className="relative min-h-[11.4rem] sm:min-h-[12.5rem] lg:min-h-[14.6rem]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition duration-500",
              index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <div className="grid h-full lg:grid-cols-[0.5fr_0.5fr]">
              <div className="relative z-10 flex flex-col justify-center overflow-hidden bg-[linear-gradient(138deg,#e90d32_0%,#d41231_62%,#c5102e_100%)] px-5 py-5 lg:min-h-[14.6rem] sm:px-6">
                <div className="absolute inset-y-0 right-[-36px] w-24 -skew-x-[20deg] bg-white/16" />
                <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_42%)]" />
                <div className="absolute -left-8 bottom-0 h-20 w-28 rounded-full bg-[#ff6781]/26 blur-3xl" />

                <div className="relative flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/18 bg-white/12 px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-white">
                    aloo
                  </span>
                  {slide.badge ? (
                    <span className="rounded-full border border-white/18 bg-black/16 px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-white/92">
                      {slide.badge}
                    </span>
                  ) : null}
                </div>

                <p className="relative mt-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/78">
                  {slide.eyebrow}
                </p>
                <h1 className="relative mt-1.5 max-w-[270px] text-balance font-display text-[1.28rem] font-semibold leading-[0.94] tracking-[-0.06em] text-white sm:text-[1.45rem] lg:text-[1.68rem]">
                  {slide.title}
                </h1>
                <p className="relative mt-2 line-clamp-2 max-w-[270px] text-[12px] leading-5 text-white/80">
                  {slide.description}
                </p>

                <div className="relative mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={slide.primaryHref}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[16px] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#162638] shadow-[0_12px_26px_rgba(5,19,37,0.18)] transition hover:bg-[#f7f9fc]"
                  >
                    {slide.primaryLabel}
                  </Link>
                  <Link
                    href={slide.secondaryHref}
                    className="hidden items-center justify-center whitespace-nowrap rounded-[16px] border border-white/24 bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/16 sm:inline-flex"
                  >
                    {slide.secondaryLabel}
                  </Link>
                </div>
              </div>

              <div className="relative z-10 flex items-center bg-[linear-gradient(180deg,#f7fbff_0%,#eef4fb_100%)] px-4 py-4 sm:px-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(22,144,245,0.1),transparent_38%)]" />
                <div className="relative w-full">
                  <ProductVisual
                    size="hero"
                    kind={slide.kind}
                    label={slide.heroLabel}
                    toneFrom={"#dbeeff"}
                    toneTo={"#bedcff"}
                    imageUrl={slide.imageUrl}
                    imageAlt={slide.imageAlt}
                    productName={slide.title}
                    brand={slide.brand}
                    categorySlug={slide.categorySlug}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 justify-center gap-1.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}-banner`}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition",
                index === activeIndex ? "bg-[#f0562f]" : "bg-[#d8e0e8]",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
