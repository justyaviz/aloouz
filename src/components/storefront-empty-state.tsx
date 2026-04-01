"use client";

import Link from "next/link";

type StorefrontEmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  icon: (props: { className?: string }) => React.ReactNode;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  footerText?: string;
};

export function StorefrontEmptyState({
  eyebrow,
  title,
  description,
  icon: Icon,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  footerText,
}: StorefrontEmptyStateProps) {
  return (
    <section className="min-h-[58vh] rounded-[32px] border border-transparent bg-[#f7f8fb] px-5 py-10 shadow-none sm:border-line sm:bg-white sm:px-10 sm:py-12 sm:shadow-[0_18px_45px_rgba(13,31,55,0.08)]">
      <div className="mx-auto flex h-full max-w-[640px] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#fff3ef] text-support shadow-[0_16px_35px_rgba(254,102,0,0.1)] sm:h-20 sm:w-20 sm:rounded-[28px]">
          <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>

        {eyebrow ? (
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent sm:mt-6 sm:text-xs">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-4 max-w-[14ch] font-display text-[2rem] font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-[26ch] text-base leading-8 text-muted sm:max-w-2xl">{description}</p>

        <div className="mt-8 flex w-full max-w-[380px] flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex min-h-14 w-full items-center justify-center rounded-[20px] bg-support px-6 py-4 text-base font-semibold text-white transition hover:bg-[#e45d07] sm:min-w-[200px] sm:w-auto sm:text-sm"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="inline-flex min-h-14 w-full items-center justify-center rounded-[20px] border border-line bg-white px-6 py-4 text-base font-semibold text-foreground transition hover:border-accent/30 hover:text-accent sm:min-w-[200px] sm:w-auto sm:text-sm"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>

        {footerText ? (
          <p className="mt-6 max-w-[28ch] text-sm leading-7 text-muted sm:max-w-xl">{footerText}</p>
        ) : null}
      </div>
    </section>
  );
}
