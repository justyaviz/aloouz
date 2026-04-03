import Link from "next/link";

import { ArrowRightIcon } from "./icons";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
}: SectionHeadingProps) {
  return (
    <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="inline-flex rounded-full border border-accent/12 bg-[#eef5ff] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-4 font-display text-[2rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[2.5rem] sm:leading-[1.02]">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-[15px]">
          {description}
        </p>
      </div>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dbe5f0] bg-white px-5 py-3 text-sm font-semibold text-foreground shadow-[0_12px_28px_rgba(13,31,55,0.06)] transition hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent"
        >
          <ArrowRightIcon className="h-4 w-4" />
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
