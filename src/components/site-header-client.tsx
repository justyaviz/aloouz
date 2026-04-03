"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { AuthViewer } from "@/lib/customer-auth";

import {
  CartIcon,
  ChevronDownIcon,
  ClipboardIcon,
  CloseIcon,
  CompareIcon,
  GridIcon,
  HeartIcon,
  LocationIcon,
  MenuIcon,
  PackageIcon,
  PhoneIcon,
  ScanIcon,
  SearchIcon,
  ShareIcon,
  UserIcon,
} from "@/components/icons";
import { LoginCard } from "@/components/login-card";
import { useStorefrontState } from "@/components/storefront-state-provider";
import { SiteLogo } from "@/components/site-logo";

const callCenterLabel = "+998 78 122 08 00";
const callCenterHref = "tel:+998781220800";
const mapsHref = "https://yandex.uz/maps/?text=aloo";
const topLinks = [
  { href: "/#about", label: "Biz haqimizda" },
  { href: "/blog", label: "alooBlog", pill: true },
  { href: "/#delivery", label: "Yetkazib berish" },
  { href: "/#stores", label: "Do'konlar" },
  { href: "/#installment", label: "Muddatli to'lov" },
  { href: "/#contact", label: "Biz bilan bog'laning!" },
];

const quickActions = [
  { href: "/order-status", label: "Buyurtma holati", icon: ClipboardIcon },
  { href: "/compare", label: "Taqqoslash", icon: CompareIcon, countKey: "compare" as const },
  { href: "/cart", label: "Savatcha", icon: CartIcon, countKey: "cart" as const },
  { href: "/favorites", label: "Sevimli", icon: HeartIcon, countKey: "favorites" as const },
];

const chips = [
  { href: "/catalog", label: "Aksiyalar", active: true },
  { href: "/catalog?category=iphone", label: "Apple" },
  { href: "/catalog?brand=Samsung", label: "Samsung" },
  { href: "/catalog?brand=Xiaomi", label: "Xiaomi" },
  { href: "/catalog?brand=HONOR", label: "HONOR" },
  { href: "/catalog?brand=OPPO", label: "OPPO" },
  { href: "/catalog?category=smartfonlar", label: "Smartfonlar" },
  { href: "/catalog?category=aqlli-soatlar", label: "Aqlli soatlar" },
];

const catalogGroups = [
  {
    title: "Mashhur bo'limlar",
    links: [
      { href: "/catalog?category=smartfonlar", label: "Smartfonlar" },
      { href: "/catalog?category=iphone", label: "iPhone" },
      { href: "/catalog?brand=Samsung", label: "Samsung Galaxy" },
      { href: "/catalog?brand=HONOR", label: "HONOR" },
      { href: "/catalog?brand=Xiaomi", label: "Redmi va Xiaomi" },
      { href: "/catalog?brand=OPPO", label: "OPPO" },
    ],
  },
  {
    title: "Xarid uchun",
    links: [
      { href: "/order-status", label: "Buyurtma holati" },
      { href: "/favorites", label: "Sevimlilar" },
      { href: "/compare", label: "Taqqoslash" },
      { href: "/cart", label: "Savatcha" },
      { href: "/#installment", label: "Muddatli to'lov" },
      { href: "/#new-arrivals", label: "Yangi kelganlar" },
    ],
  },
  {
    title: "Kontent va servis",
    links: [
      { href: "/blog", label: "alooBlog" },
      { href: "/#delivery", label: "Yetkazib berish" },
      { href: "/#about", label: "Biz haqimizda" },
      { href: "/#stores", label: "Filiallar" },
      { href: "/#contact", label: "Bog'lanish" },
      { href: "/profile", label: "Kabinet" },
    ],
  },
];

const catalogSections = [
  {
    href: "/catalog?category=smartfonlar",
    label: "Barcha smartfonlar",
    icon: PhoneIcon,
    active: true,
  },
  {
    href: "/catalog?category=iphone",
    label: "iPhone va Apple qurilmalari",
    icon: GridIcon,
  },
  {
    href: "/catalog?brand=Samsung",
    label: "Samsung Galaxy",
    icon: CompareIcon,
  },
  {
    href: "/catalog?brand=Xiaomi",
    label: "Xiaomi va Redmi",
    icon: SearchIcon,
  },
  {
    href: "/catalog?brand=HONOR",
    label: "HONOR smartfonlari",
    icon: HeartIcon,
  },
  {
    href: "/catalog?brand=OPPO",
    label: "OPPO smartfonlari",
    icon: CartIcon,
  },
  {
    href: "/#new-arrivals",
    label: "Yangi kelganlar",
    icon: ClipboardIcon,
  },
  {
    href: "/catalog",
    label: "Aksiyadagi mahsulotlar",
    icon: PackageIcon,
  },
];

const brandCards = ["Apple", "Samsung", "Xiaomi", "HONOR", "OPPO", "Tecno"];

type ShortcutProps = {
  href?: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
  count?: number;
  onClick?: () => void;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Shortcut({ href, label, icon: Icon, count, onClick }: ShortcutProps) {
  const classes =
    "group relative flex min-w-0 flex-col items-center gap-2 rounded-[20px] px-2 py-2 text-center transition hover:-translate-y-0.5";
  const content = (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#e0e7ef] bg-[#fbfcfe] text-[#28415f] shadow-[0_8px_18px_rgba(13,31,55,0.05)] transition group-hover:border-support group-hover:bg-support group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      {count && count > 0 ? (
        <span className="absolute right-1 top-0 inline-flex min-w-5 items-center justify-center rounded-full bg-support px-1.5 py-1 text-[10px] font-bold leading-none text-white shadow-[0_8px_18px_rgba(242,104,26,0.24)]">
          {count}
        </span>
      ) : null}
      <span className="text-[12px] font-medium leading-4 text-[#1a2740]">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

function DesktopCatalogMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="hidden border-t border-line bg-white shadow-[0_22px_65px_rgba(13,31,55,0.12)] lg:block">
      <div className="shell grid gap-6 py-6 xl:grid-cols-[300px_minmax(0,1fr)_180px]">
        <div className="space-y-2 rounded-[30px] border border-line bg-[#fbfdff] p-4">
          {catalogSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.label}
                href={section.href}
                onClick={onClose}
                className={cn(
                  "flex items-start gap-3 rounded-[22px] px-4 py-4 transition",
                  section.active
                    ? "bg-[#fff4ef] text-foreground"
                    : "hover:bg-[#f6faff] text-foreground",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-[14px] border",
                    section.active
                      ? "border-support/20 bg-white text-support"
                      : "border-line bg-white text-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold leading-6">{section.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="rounded-[30px] border border-line bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Katalog
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
                Smartfonlar, telefonlar va gadjetlar
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-foreground transition hover:border-accent/30 hover:text-accent"
              aria-label="Katalog oynasini yopish"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {catalogGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-semibold text-foreground">{group.title}</p>
                <div className="mt-4 space-y-3">
                  {group.links.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className="block text-sm leading-6 text-muted transition hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {brandCards.map((brand) => (
            <Link
              key={brand}
              href={`/catalog?brand=${encodeURIComponent(brand)}`}
              onClick={onClose}
              className="flex min-h-[76px] items-center justify-center rounded-[24px] border border-line bg-white px-4 text-center font-display text-2xl font-semibold text-[#0a336c] shadow-[0_12px_30px_rgba(13,31,55,0.06)] transition hover:-translate-y-0.5 hover:border-accent/25 hover:text-accent"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileCatalogDrawer({
  onClose,
  onShare,
}: {
  onClose: () => void;
  onShare: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-white lg:hidden">
      <div className="mx-auto max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+6rem)] pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <div className="flex h-12 items-center rounded-[20px] bg-[#eef1f5] px-3 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e1e6ec] text-[#7b8795]">
            <ScanIcon className="h-4 w-4" />
          </span>
          <Link href="/" onClick={onClose} className="flex-1 text-center text-base font-medium">
            aloo.uz
          </Link>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e1e6ec] text-[#7b8795]"
            aria-label="Sahifani ulashish"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] text-foreground"
            aria-label="Menyuni yopish"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex h-12 min-w-0 flex-1 items-center rounded-[18px] bg-[#f5f6f8] px-4">
            <SearchIcon className="h-4 w-4 text-muted" />
            <input
              readOnly
              value=""
              placeholder="Samsung s26 ultra"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted"
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {catalogSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.label}
                href={section.href}
                onClick={onClose}
                className="flex items-start gap-3 rounded-[22px] border border-[#e6ebf1] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(13,31,55,0.04)]"
              >
                <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#fff4ef] text-support">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold leading-6 text-foreground">{section.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SiteHeaderClient({ viewer }: { viewer: AuthViewer | null }) {
  const pathname = usePathname();
  const { cart, compare, favorites, hydrated } = useStorefrontState();
  const [catalogMenuOpen, setCatalogMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const counts = {
    cart: hydrated ? cart.length : 0,
    compare: hydrated ? compare.length : 0,
    favorites: hydrated ? favorites.length : 0,
  };

  useEffect(() => {
    const closeTimer = window.setTimeout(() => {
      setCatalogMenuOpen(false);
      setLoginOpen(false);
    }, 0);

    return () => window.clearTimeout(closeTimer);
  }, [pathname]);

  useEffect(() => {
    if (!loginOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLoginOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loginOpen]);

  const handleShareSite = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      return;
    }

    try {
      await navigator.share({
        title: "aloo",
        text: "aloo smartfonlar bozori",
        url: window.location.origin,
      });
    } catch {
      // Dialog cancelled.
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-white/96 backdrop-blur-md">
        <div className="border-b border-line/80 bg-white">
          <div className="shell flex flex-wrap items-center justify-between gap-3 py-2.5 text-[13px] text-muted">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={callCenterHref}
                className="inline-flex items-center gap-2 font-medium text-foreground transition hover:text-accent"
              >
                <PhoneIcon className="h-4 w-4 text-accent" />
                {callCenterLabel}
              </a>
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-accent"
              >
                <LocationIcon className="h-4 w-4 text-accent" />
                Toshkent viloyati
              </a>
            </div>

            <div className="hidden flex-wrap items-center gap-4 lg:flex">
              {topLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                  "transition hover:text-foreground",
                    item.pill &&
                      "rounded-full bg-[#f4f7fb] px-3 py-1.5 font-semibold text-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-1 text-muted transition hover:text-foreground"
              >
                O&apos;zbek
                <ChevronDownIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="shell py-3 lg:hidden">
          <div className="flex h-12 items-center rounded-[20px] bg-[#eef1f5] px-3 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e1e6ec] text-[#7b8795]">
              <ScanIcon className="h-4 w-4" />
            </span>
            <Link href="/" className="flex-1 text-center text-base font-medium">
              aloo.uz
            </Link>
            <button
              type="button"
              onClick={handleShareSite}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e1e6ec] text-[#7b8795]"
              aria-label="Sahifani ulashish"
            >
              <ShareIcon className="h-4 w-4" />
            </button>
          </div>

          <form action="/catalog" className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCatalogMenuOpen(true)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] text-foreground"
              aria-label="Katalog menyusi"
            >
              <MenuIcon className="h-6 w-6" />
            </button>

            <div className="flex h-12 min-w-0 flex-1 items-center rounded-[18px] bg-[#f5f6f8] px-3">
              <SearchIcon className="h-4 w-4 shrink-0 text-muted" />
              <input
                aria-label="Mahsulot qidirish"
                name="query"
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted"
                placeholder="Samsung s26 ultra"
                type="search"
              />
            </div>
          </form>
        </div>

        <div className="hidden lg:block">
          <div className="shell grid gap-4 py-4 xl:grid-cols-[220px_minmax(0,1fr)_420px] xl:items-center">
            <SiteLogo href="/" priority showTagline className="flex flex-col gap-1.5" />

            <form action="/catalog" className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCatalogMenuOpen((current) => !current)}
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2 rounded-[18px] px-6 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(255,92,31,0.22)] transition",
                  catalogMenuOpen ? "bg-[#e65a20]" : "bg-catalog hover:bg-[#e65a20]",
                )}
              >
                <MenuIcon className="h-5 w-5" />
                Katalog
              </button>

              <div className="flex h-12 flex-1 items-center overflow-hidden rounded-[18px] border border-[#d9e4f0] bg-white shadow-[0_10px_24px_rgba(13,31,55,0.06)]">
                <input
                  aria-label="Mahsulot qidirish"
                  name="query"
                  className="min-w-0 flex-1 bg-transparent px-5 text-sm text-foreground outline-none placeholder:text-muted"
                  placeholder="Smartfon, model yoki brendni yozing"
                  type="search"
                />
                <button
                  type="submit"
                  className="inline-flex h-full items-center justify-center gap-2 bg-support px-6 text-sm font-semibold text-white transition hover:bg-[#e45d07]"
                >
                  <SearchIcon className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="grid grid-cols-5 gap-2">
              {quickActions.map((item) => (
                <Shortcut
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  count={item.countKey ? counts[item.countKey] : undefined}
                />
              ))}

              {viewer ? (
                <Shortcut href="/profile" label="Kabinet" icon={UserIcon} />
              ) : (
                <Shortcut label="Kirish" icon={UserIcon} onClick={() => setLoginOpen(true)} />
              )}
            </div>
          </div>

          <div className="border-t border-line bg-white">
            <div className="shell flex flex-wrap items-center gap-3 py-3.5">
              {chips.map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.href}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full px-5 text-sm font-medium transition",
                      chip.active
                        ? "bg-support text-white shadow-[0_14px_28px_rgba(255,92,31,0.18)]"
                        : "border border-[#dde6f0] bg-white text-foreground hover:border-accent/35 hover:bg-[#f9fbff] hover:text-accent",
                  )}
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {catalogMenuOpen ? <DesktopCatalogMenu onClose={() => setCatalogMenuOpen(false)} /> : null}
      </header>

      {catalogMenuOpen ? (
        <MobileCatalogDrawer
          onClose={() => setCatalogMenuOpen(false)}
          onShare={handleShareSite}
        />
      ) : null}

      {!viewer && loginOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-[rgba(6,18,33,0.55)] px-4 py-[calc(env(safe-area-inset-top)+4.25rem)] backdrop-blur-sm md:items-center md:py-6"
          onClick={() => setLoginOpen(false)}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <LoginCard onClose={() => setLoginOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
