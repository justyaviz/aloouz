import Image from "next/image";
import Link from "next/link";

const topLinks = [
  { href: "/catalog", label: "Alooblog" },
  { href: "/catalog", label: "Yetkazib berish" },
  { href: "/catalog", label: "Filiallar" },
  { href: "/catalog?category=smartfonlar", label: "Muddatli to'lov" },
  { href: "/catalog", label: "Bog'lanish" },
];

const quickActions = [
  { href: "/catalog", label: "Buyurtma" },
  { href: "/catalog", label: "Taqqoslash" },
  { href: "/catalog", label: "Savat" },
  { href: "/catalog", label: "Sevimli" },
  { href: "/catalog", label: "Kirish" },
];

const chips = [
  { href: "/catalog", label: "Aksiya", active: true },
  { href: "/catalog?category=iphone", label: "iPhone" },
  { href: "/catalog?brand=Samsung", label: "Samsung" },
  { href: "/catalog?brand=Xiaomi", label: "Xiaomi" },
  { href: "/catalog?category=smartfonlar", label: "Smartfonlar" },
  { href: "/catalog?category=quloqchinlar", label: "Quloqchinlar" },
  { href: "/catalog?category=aqlli-soatlar", label: "Aqlli soatlar" },
  { href: "/catalog?category=planshetlar", label: "Planshetlar" },
];

function Shortcut({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex min-w-0 flex-col items-center gap-2 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white shadow-sm">
        <span className="h-4 w-4 rounded-full border-2 border-accent" />
      </span>
      <span className="text-[12px] font-medium leading-4 text-foreground">{label}</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="border-b border-line bg-white">
        <div className="shell flex flex-col gap-2 py-3 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            <p className="font-medium text-foreground">+998 91 123 45 67</p>
            <p>Toshkent</p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {topLinks.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="shell grid gap-4 py-5 xl:grid-cols-[220px_minmax(0,1fr)_360px] xl:items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt="aloo mark"
            width={46}
            height={46}
            priority
            unoptimized
          />
          <div>
            <p className="font-display text-[2.15rem] font-semibold leading-none text-foreground">
              <span className="text-support">a</span>loo
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              Smartfonlar bozori
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-3 lg:flex-row">
          <Link
            href="/catalog"
            className="inline-flex h-12 items-center justify-center rounded-[18px] bg-support px-6 text-sm font-semibold text-white transition hover:bg-[#e25a00]"
          >
            Katalog
          </Link>

          <div className="flex h-12 flex-1 overflow-hidden rounded-[18px] border border-line bg-white shadow-sm">
            <input
              aria-label="Mahsulot qidirish"
              className="min-w-0 flex-1 bg-transparent px-5 text-sm text-foreground outline-none placeholder:text-muted"
              placeholder="Siz qidirayotgan mahsulotni yozing"
              type="search"
            />
            <button
              type="button"
              className="inline-flex h-full items-center justify-center bg-support px-6 text-sm font-semibold text-white transition hover:bg-[#e25a00]"
            >
              Qidirish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {quickActions.map((item) => (
            <Shortcut key={item.label} href={item.href} label={item.label} />
          ))}
        </div>
      </div>

      <div className="border-t border-line bg-white">
        <div className="shell flex flex-wrap items-center gap-3 py-4">
          {chips.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className={`inline-flex h-10 items-center rounded-full px-5 text-sm font-medium transition ${
                chip.active
                  ? "bg-[#54c43a] text-white"
                  : "border border-line bg-white text-foreground hover:border-accent/35 hover:text-accent"
              }`}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
