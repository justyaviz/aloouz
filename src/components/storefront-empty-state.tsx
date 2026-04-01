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
    <section className="min-h-[54vh] rounded-[32px] border border-line bg-white px-6 py-12 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:px-10">
      <div className="mx-auto flex h-full max-w-[640px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#fff2ec] text-support shadow-[0_16px_35px_rgba(254,102,0,0.12)]">
          <Icon className="h-8 w-8" />
        </div>

        {eyebrow ? (
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">{description}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={primaryHref}
            className="inline-flex min-w-[200px] items-center justify-center rounded-[20px] bg-support px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#e45d07]"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="inline-flex min-w-[200px] items-center justify-center rounded-[20px] border border-line bg-white px-6 py-4 text-sm font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>

        {footerText ? (
          <p className="mt-6 max-w-xl text-sm leading-7 text-muted">{footerText}</p>
        ) : null}
      </div>
    </section>
  );
}
