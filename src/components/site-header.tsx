import Image from "next/image";
import Link from "next/link";

const utilityLinks = [
  { href: "/catalog", label: "Aksiyalar" },
  { href: "/catalog?category=iphone", label: "Apple" },
  { href: "/catalog?category=smartfonlar", label: "Muddatli to'lov" },
];

const navItems = [
  { href: "/catalog?category=smartfonlar", label: "Smartfonlar" },
  { href: "/catalog?category=iphone", label: "iPhone" },
  { href: "/catalog?category=android", label: "Android" },
  { href: "/catalog?category=aqlli-soatlar", label: "Aqlli soatlar" },
  { href: "/catalog?category=quloqchinlar", label: "Quloqchinlar" },
  { href: "/catalog?category=planshetlar", label: "Planshetlar" },
];

const quickActions = [
  { href: "/catalog", label: "Taqqoslash" },
  { href: "/catalog", label: "Sevimlilar" },
  { href: "/catalog", label: "Savat" },
  { href: "/catalog", label: "Kirish" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="border-b border-line bg-[#f7fbff]">
        <div className="shell flex flex-col gap-2 py-2.5 text-xs text-muted lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-semibold text-foreground">+998 91 123 45 67</p>
            <p>Dushanba - Yakshanba, 09:00 - 22:00</p>
            <span className="rounded-full bg-white px-3 py-1 font-semibold text-accent shadow-sm">
              Texno hayotga ulanish!
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            {utilityLinks.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="shell flex flex-col gap-4 py-4 xl:flex-row xl:items-center">
        <div className="flex items-center justify-between gap-4 xl:min-w-[220px]">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/aloo-favicon-dark.png"
              alt="aloo mark"
              width={40}
              height={40}
              priority
              unoptimized
            />
            <div>
              <Image
                src="/brand/aloo-logotype-dark.png"
                alt="aloo"
                width={122}
                height={33}
                priority
                unoptimized
              />
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Smartfonlar bozori
              </p>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          <Link
            href="/catalog"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-white transition hover:bg-[#0b74d1]"
          >
            Katalog
          </Link>

          <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-line bg-[#f7fafc] px-4 shadow-sm">
            <span className="text-sm font-semibold text-muted">Qidiruv</span>
            <input
              aria-label="Mahsulot qidirish"
              className="min-w-0 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              placeholder="Telefon, model yoki brend bo'yicha qidirish"
              type="search"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {quickActions.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-white">
        <div className="shell flex flex-wrap items-center gap-3 py-3 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-3 py-1.5 font-medium text-foreground transition hover:bg-[#f1f7ff] hover:text-accent"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/catalog"
            className="ml-auto inline-flex items-center rounded-full bg-[#eef6ff] px-4 py-2 font-semibold text-accent transition hover:bg-[#dfefff]"
          >
            Barcha tovarlar
          </Link>
        </div>
      </div>
    </header>
  );
}
