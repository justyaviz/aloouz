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
    <div className="reveal-up relative overflow-hidden rounded-[24px] border border-[#1d4d80] bg-[linear-gradient(138deg,#07111f_0%,#0c2849_36%,#1387e6_79%,#90d9ff_100%)] p-2.5 text-white shadow-[0_20px_42px_rgba(5,19,37,0.16)] sm:rounded-[26px] sm:p-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_34%)]" />
      <div className="absolute inset-y-0 right-[34%] hidden w-px bg-white/14 lg:block" />
      <div
        className="absolute -right-10 top-4 h-32 w-32 opacity-[0.08]"
        style={{
          backgroundImage: "url('/brand/aloo-mark-light.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />
      <div
        className="absolute -left-8 bottom-4 h-20 w-20 opacity-[0.08]"
        style={{
          backgroundImage: "url('/brand/aloo-mark-light.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />
      <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-white/18 blur-2xl" />
      <div className="absolute bottom-8 right-8 h-20 w-20 rounded-full bg-black/18 blur-3xl" />

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrevious}
            className="absolute left-2.5 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-white/90 text-[#0b2952] shadow-[0_10px_24px_rgba(10,24,44,0.14)] lg:inline-flex"
            aria-label="Oldingi banner"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2.5 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-white/90 text-[#0b2952] shadow-[0_10px_24px_rgba(10,24,44,0.14)] lg:inline-flex"
            aria-label="Keyingi banner"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </>
      ) : null}

      <div className="relative min-h-[9.1rem] sm:min-h-[10.2rem] lg:min-h-[10.9rem]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition duration-500",
              index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <div className="grid h-full gap-3 lg:grid-cols-[1fr_0.96fr] lg:items-center">
              <div className="relative z-10 flex flex-col justify-center px-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/14 bg-white/12 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-white">
                    aloo
                  </span>
                  {slide.badge ? (
                    <span className="rounded-full border border-white/14 bg-[#07111f]/16 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-white/92">
                      {slide.badge}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/66">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-1.5 max-w-lg text-balance font-display text-[1.18rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[1.35rem] lg:text-[1.62rem]">
                  {slide.title}
                </h1>
                <p className="mt-2 line-clamp-2 max-w-md text-[11px] leading-5 text-white/76 sm:text-[12px]">
                  {slide.description}
                </p>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={slide.primaryHref}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-[#07111f] px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-[0_14px_30px_rgba(5,19,37,0.18)] transition hover:bg-[#102947]"
                  >
                    {slide.primaryLabel}
                  </Link>
                  <Link
                    href={slide.secondaryHref}
                    className="hidden items-center justify-center whitespace-nowrap rounded-[14px] border border-white/14 bg-white/88 px-3.5 py-2.5 text-[13px] font-semibold text-[#0b2952] transition hover:bg-white sm:inline-flex"
                  >
                    {slide.secondaryLabel}
                  </Link>
                </div>

                <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
                  <div className="rounded-[14px] border border-white/12 bg-white/10 px-3 py-2 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Narx</p>
                    <p className="mt-1 text-[13px] font-semibold text-white">
                      {slide.price ? formatSum(slide.price) : slide.accentLabel ?? "Aksiya"}
                    </p>
                  </div>
                  <div className="rounded-[14px] border border-white/12 bg-white/10 px-3 py-2 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">12 oy</p>
                    <p className="mt-1 text-[13px] font-semibold text-white">
                      {slide.monthlyPrice ? formatMonthly(slide.monthlyPrice) : "Qulay to'lov"}
                    </p>
                  </div>
                  <div className="rounded-[14px] border border-white/12 bg-white/10 px-3 py-2 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Yetkazish</p>
                    <p className="mt-1 text-[13px] font-semibold text-white">90 min</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 lg:pl-1">
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
        <div className="relative z-10 mt-2 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}-banner`}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition",
                index === activeIndex ? "bg-white" : "bg-white/30",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
