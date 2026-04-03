"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { ProductKind } from "@/data/store";
import { formatMonthly, formatSum } from "@/lib/format";

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
    <div className="reveal-up relative overflow-hidden rounded-[30px] border border-[#dbe6f1] bg-[linear-gradient(140deg,#eaf4ff_0%,#ffffff_48%,#eef7ff_100%)] p-4 text-foreground shadow-[0_22px_50px_rgba(13,31,55,0.08)] sm:rounded-[34px] sm:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.85),transparent_34%)]" />
      <div className="absolute inset-y-0 right-[34%] hidden w-px bg-[#e4edf6] lg:block" />
      <div
        className="absolute -right-10 top-4 h-40 w-40 opacity-[0.08]"
        style={{
          backgroundImage: "url('/brand/aloo-mark-dark.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />
      <div
        className="absolute -left-8 bottom-4 h-24 w-24 opacity-[0.06]"
        style={{
          backgroundImage: "url('/brand/aloo-mark-dark.png')",
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
            className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#dbe6f1] bg-white text-foreground shadow-[0_10px_24px_rgba(10,24,44,0.08)] lg:inline-flex"
            aria-label="Oldingi banner"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#dbe6f1] bg-white text-foreground shadow-[0_10px_24px_rgba(10,24,44,0.08)] lg:inline-flex"
            aria-label="Keyingi banner"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </>
      ) : null}

      <div className="relative min-h-[13rem] sm:min-h-[16.4rem] lg:min-h-[17.2rem]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition duration-500",
              index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <div className="grid h-full gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div className="relative z-10 flex flex-col justify-center px-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full border border-[#d8e5f4] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                    aloo
                  </span>
                  {slide.badge ? (
                    <span className="rounded-full border border-[#ffe0d2] bg-[#fff4ef] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-support">
                      {slide.badge}
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-accent/72">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-2.5 max-w-xl font-display text-[1.65rem] font-semibold leading-[1.02] tracking-[-0.05em] text-foreground sm:text-[2.05rem] lg:text-[2.45rem]">
                  {slide.title}
                </h1>
                <p className="mt-3 max-w-md text-[13px] leading-6 text-muted sm:text-[14px] sm:leading-7">
                  {slide.description}
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={slide.primaryHref}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[18px] bg-support px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,107,43,0.22)] transition hover:bg-[#f05a1c]"
                  >
                    {slide.primaryLabel}
                  </Link>
                  <Link
                    href={slide.secondaryHref}
                    className="hidden items-center justify-center whitespace-nowrap rounded-[18px] border border-[#dbe6f1] bg-white px-5 py-3.5 text-sm font-semibold text-foreground transition hover:border-accent/25 hover:text-accent sm:inline-flex"
                  >
                    {slide.secondaryLabel}
                  </Link>
                </div>

                <div className="mt-5 hidden gap-2.5 sm:grid sm:grid-cols-3">
                  <div className="rounded-[20px] border border-[#e3ebf5] bg-white px-4 py-3.5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                      Narx
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-foreground sm:text-base">
                      {slide.price ? formatSum(slide.price) : slide.accentLabel ?? "Aksiya"}
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-[#e3ebf5] bg-white px-4 py-3.5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                      12 oy
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-foreground sm:text-base">
                      {slide.monthlyPrice ? formatMonthly(slide.monthlyPrice) : "Qulay to'lov"}
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-[#e3ebf5] bg-white px-4 py-3.5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                      Yetkazish
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-foreground sm:text-base">90 min</p>
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
                  productName={slide.title}
                  brand={slide.brand}
                  categorySlug={slide.categorySlug}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="relative z-10 mt-3 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}-banner`}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition",
                index === activeIndex ? "bg-support" : "bg-[#ced9e6]",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
