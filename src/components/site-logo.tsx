import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  href?: string;
  variant?: "dark" | "light";
  width?: number;
  priority?: boolean;
  className?: string;
  showTagline?: boolean;
  taglineClassName?: string;
};

export function SiteLogo({
  href,
  variant = "dark",
  width = 176,
  priority = false,
  className,
  showTagline = false,
  taglineClassName,
}: SiteLogoProps) {
  const source =
    variant === "light" ? "/brand/aloo-logotype-light.png" : "/brand/aloo-logotype-dark.png";
  const height = Math.round(width / 3.68);

  const content = (
    <>
      <Image
        src={source}
        alt="aloo"
        width={width}
        height={height}
        priority={priority}
        unoptimized
      />
      {showTagline ? (
        <p
          className={
            taglineClassName ??
            "text-[11px] font-semibold uppercase tracking-[0.22em] text-muted"
          }
        >
          smartfonlar bozori
        </p>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
