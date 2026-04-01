"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { ProductKind } from "@/data/store";
import { formatMonthly, formatSum } from "@/lib/format";

import { ArrowLeftIcon, ArrowRightIcon } from "./icons";
import { ProductVisual } from "./product-visual";

type HeroCarouselSlide = {
  id: string;
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
    <div className="reveal-up relative overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(125deg,#0b3a72_0%,#1487e3_50%,#0b2c59_100%)] p-3.5 text-white shadow-[0_22px_54px_rgba(10,44,96,0.18)] sm:p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_30%)]" />
      <div
        className="absolute -right-10 top-6 h-36 w-36 opacity-[0.1]"
        style={{
          backgroundImage: "url('/brand/aloo-mark-light.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />
      <div
        className="absolute -left-8 bottom-4 h-24 w-24 opacity-[0.08]"
        style={{
          backgroundImage: "url('/brand/aloo-mark-light.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrevious}
            className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/94 text-foreground shadow-[0_10px_24px_rgba(10,24,44,0.14)] lg:inline-flex"
            aria-label="Oldingi banner"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/94 text-foreground shadow-[0_10px_24px_rgba(10,24,44,0.14)] lg:inline-flex"
            aria-label="Keyingi banner"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </>
      ) : null}

      <div className="relative min-h-[13.75rem] sm:min-h-[14.5rem] lg:min-h-[14.75rem]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition duration-500",
              index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <div className="grid h-full gap-4 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
              <div className="relative z-10 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em]">
                    aloo
                  </span>
                  {slide.badge ? (
                    <span className="rounded-full bg-white/18 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                      {slide.badge}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-2 max-w-xl font-display text-[1.55rem] font-semibold leading-[1.04] tracking-tight sm:text-[1.9rem] lg:text-[2.15rem]">
                  {slide.title}
                </h1>
                <p className="mt-2 max-w-md text-[13px] leading-6 text-white/84 sm:text-sm">
                  {slide.description}
                </p>

                <div className="mt-3.5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={slide.primaryHref}
                    className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-white px-5 py-3 text-sm font-semibold text-accent transition hover:bg-[#eef6ff]"
                  >
                    {slide.primaryLabel}
                  </Link>
                  <Link
                    href={slide.secondaryHref}
                    className="inline-flex items-center justify-center rounded-[16px] border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
                  >
                    {slide.secondaryLabel}
                  </Link>
                </div>

                <div className="mt-3.5 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-[18px] border border-white/16 bg-white/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/68">
                      Narx
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-white sm:text-base">
                      {slide.price ? formatSum(slide.price) : slide.accentLabel ?? "Aksiya"}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-white/16 bg-white/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/68">
                      12 oy
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-white sm:text-base">
                      {slide.monthlyPrice ? formatMonthly(slide.monthlyPrice) : "Qulay to'lov"}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-white/16 bg-white/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/68">
                      Yetkazish
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-white sm:text-base">90 min</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 lg:pl-2">
                <ProductVisual
                  size="hero"
                  kind={slide.kind}
                  label={slide.heroLabel}
                  toneFrom={slide.toneFrom}
                  toneTo={slide.toneTo}
                  imageUrl={slide.imageUrl}
                  imageAlt={slide.imageAlt}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="relative z-10 mt-2.5 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}-banner`}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition",
                index === activeIndex ? "bg-white" : "bg-white/35",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
