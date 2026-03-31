import Link from "next/link";

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
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted">{description}</p>
      </div>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
