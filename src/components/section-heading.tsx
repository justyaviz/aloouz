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
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{description}</p>
      </div>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
        >
          <ArrowRightIcon className="h-4 w-4" />
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
