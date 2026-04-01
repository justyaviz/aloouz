import Link from "next/link";

import {
  CartIcon,
  ClipboardIcon,
  ClockIcon,
  CompareIcon,
  HeartIcon,
  LocationIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import { SiteLogo } from "@/components/site-logo";

const topLinks = [
  { href: "/catalog", label: "alooblog" },
  { href: "/catalog", label: "Yetkazib berish" },
  { href: "/catalog", label: "Filiallar" },
  { href: "/catalog?category=smartfonlar", label: "Muddatli to'lov" },
  { href: "/catalog", label: "Bog'lanish" },
];

const quickActions = [
  { href: "/catalog", label: "Buyurtma", icon: ClipboardIcon },
  { href: "/catalog", label: "Taqqoslash", icon: CompareIcon },
  { href: "/catalog", label: "Savat", icon: CartIcon },
  { href: "/catalog", label: "Sevimli", icon: HeartIcon },
  { href: "/admin", label: "Admin", icon: UserIcon },
];

const mobileShortcuts = quickActions.slice(0, 4);

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

function Shortcut({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex min-w-0 flex-col items-center gap-2 rounded-[20px] px-2 py-2 text-center transition hover:-translate-y-0.5"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#dce8f3] bg-[#f5f9fd] text-[#0a336c] shadow-sm transition group-hover:bg-accent group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-[12px] font-medium leading-4 text-foreground">{label}</span>
    </Link>
  );
}

function MobileAction({
  href,
  icon: Icon,
}: {
  href: string;
  icon: (props: { className?: string }) => React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#dbe5ef] bg-white text-[#0a336c] shadow-[0_10px_24px_rgba(10,41,86,0.08)]"
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/92 backdrop-blur-md">
      <div className="lg:hidden">
        <div className="shell py-3">
          <div className="flex items-center justify-between gap-3">
            <SiteLogo href="/" priority showTagline width={124} className="flex flex-col gap-1" />

            <div className="flex items-center gap-2">
              <MobileAction href="/catalog" icon={SearchIcon} />
              <MobileAction href="/catalog" icon={CartIcon} />
              <MobileAction href="/admin" icon={UserIcon} />
            </div>
          </div>

          <div className="mt-3 rounded-[26px] border border-line bg-[linear-gradient(180deg,#ffffff_0%,#f5f9fc_100%)] p-3 shadow-[0_14px_35px_rgba(13,31,55,0.08)]">
            <div className="flex items-center gap-2">
              <Link
                href="/catalog"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[16px] bg-catalog px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(84,196,58,0.26)]"
              >
                <MenuIcon className="h-4 w-4" />
                Katalog
              </Link>

              <div className="flex h-11 min-w-0 flex-1 items-center rounded-[16px] border border-[#dbe6f1] bg-white px-3">
                <SearchIcon className="h-4 w-4 shrink-0 text-muted" />
                <input
                  aria-label="Mahsulot qidirish"
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted"
                  placeholder="Qidirish"
                  type="search"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 rounded-full bg-[#edf6ff] px-3 py-2 text-[11px] font-medium text-[#0a336c]">
                <PhoneIcon className="h-3.5 w-3.5 text-accent" />
                +998 91 123 45 67
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#edf6ff] px-3 py-2 text-[11px] font-medium text-[#0a336c]">
                <LocationIcon className="h-3.5 w-3.5 text-accent" />
                Toshkent
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#edf6ff] px-3 py-2 text-[11px] font-medium text-[#0a336c]">
                <ClockIcon className="h-3.5 w-3.5 text-accent" />
                09:00 - 22:00
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {mobileShortcuts.map((item) => (
              <Shortcut key={item.label} href={item.href} label={item.label} icon={item.icon} />
            ))}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {chips.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className={`inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-medium transition ${
                  chip.active
                    ? "bg-catalog text-white"
                    : "border border-line bg-white text-foreground"
                }`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="border-b border-line bg-white">
          <div className="shell flex flex-col gap-2 py-3 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-5">
              <p className="inline-flex items-center gap-2 font-medium text-foreground">
                <PhoneIcon className="h-4 w-4 text-accent" />
                +998 91 123 45 67
              </p>
              <p className="inline-flex items-center gap-2">
                <LocationIcon className="h-4 w-4 text-accent" />
                Toshkent
              </p>
              <p className="inline-flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-accent" />
                09:00 - 22:00
              </p>
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

        <div className="shell grid gap-4 py-4 xl:grid-cols-[220px_minmax(0,1fr)_390px] xl:items-center">
          <SiteLogo
            href="/"
            priority
            showTagline
            className="reveal-up flex flex-col gap-1.5"
          />

          <div className="reveal-up reveal-up-delay-1 flex flex-col gap-3 lg:flex-row">
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[18px] bg-catalog px-6 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(84,196,58,0.26)] transition hover:bg-catalog-strong"
            >
              <MenuIcon className="h-5 w-5" />
              Katalog
            </Link>

            <div className="flex h-12 flex-1 items-center overflow-hidden rounded-[18px] border border-line bg-white shadow-sm">
              <SearchIcon className="ml-4 h-5 w-5 shrink-0 text-muted" />
              <input
                aria-label="Mahsulot qidirish"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted"
                placeholder="Siz qidirayotgan mahsulotni yozing"
                type="search"
              />
              <button
                type="button"
                className="inline-flex h-full items-center justify-center gap-2 bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                <SearchIcon className="h-4 w-4" />
                Qidirish
              </button>
            </div>
          </div>

          <div className="reveal-up reveal-up-delay-2 grid grid-cols-5 gap-2">
            {quickActions.map((item) => (
              <Shortcut key={item.label} href={item.href} label={item.label} icon={item.icon} />
            ))}
          </div>
        </div>

        <div className="border-t border-line bg-white">
          <div className="shell flex flex-wrap items-center gap-3 py-3.5">
            {chips.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className={`inline-flex h-10 items-center rounded-full px-5 text-sm font-medium transition ${
                  chip.active
                    ? "bg-catalog text-white"
                    : "border border-line bg-white text-foreground hover:border-accent/35 hover:text-accent"
                }`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
