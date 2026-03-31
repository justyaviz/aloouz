/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/catalog", label: "Smartfonlar" },
  { href: "/catalog?category=iphone", label: "iPhone" },
  { href: "/catalog?category=android", label: "Android" },
  { href: "/catalog?category=quloqchinlar", label: "Quloqchinlar" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-[rgba(252,254,255,0.94)] backdrop-blur-xl">
      <div className="border-b border-line/70 bg-white/70">
        <div className="shell flex flex-col gap-2 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>+998 91 123 45 67 | Dushanba - Yakshanba, 09:00 - 22:00</p>
          <div className="flex flex-wrap gap-4">
            <span className="font-semibold text-accent">Texno hayotga ulanish!</span>
            <Link href="/catalog?category=smartfonlar" className="hover:text-foreground">
              Aloo bilan sevimli telefoning qo'lingda
            </Link>
            <Link href="/catalog?category=smartfonlar" className="hover:text-foreground">
              Muddatli to'lovga smartfonlar
            </Link>
          </div>
        </div>
      </div>

      <div className="shell flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/aloo-favicon-dark.png"
              alt="aloo mark"
              width={40}
              height={40}
              priority
            />
            <div>
              <Image
                src="/brand/aloo-logotype-dark.png"
                alt="aloo"
                width={122}
                height={33}
                priority
              />
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Smartfonlar bozori
              </p>
            </div>
          </Link>
          <div className="rounded-full bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent lg:hidden">
            12 oy muddatli to'lov
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 lg:max-w-3xl lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-line bg-white px-4 py-3 shadow-sm">
            <span className="text-sm font-semibold text-muted">Qidiruv</span>
            <input
              aria-label="Mahsulot qidirish"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              placeholder="iPhone 16, Galaxy S24, AirPods, Apple Watch..."
              type="search"
            />
          </div>

          <nav className="hidden items-center gap-4 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-muted transition hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-full border border-line px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-white"
            >
              Katalog
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:bg-[#101a2a]"
            >
              Savat
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
