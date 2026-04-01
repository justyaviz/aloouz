"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ClipboardIcon,
  CompareIcon,
  GridIcon,
  HeartIcon,
  HomeIcon,
} from "@/components/icons";
import { useStorefrontState } from "@/components/storefront-state-provider";

const navItems = [
  { href: "/", label: "Bosh", icon: HomeIcon, match: "/" },
  { href: "/catalog", label: "Katalog", icon: GridIcon, match: "/catalog" },
  { href: "/compare", label: "Taqqoslash", icon: CompareIcon, match: "/compare", countKey: "compare" as const },
  { href: "/favorites", label: "Sevimli", icon: HeartIcon, match: "/favorites", countKey: "favorites" as const },
  { href: "/order-status", label: "Status", icon: ClipboardIcon, match: "/order-status" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { compare, favorites, hydrated } = useStorefrontState();
  const counts = {
    compare: hydrated ? compare.length : 0,
    favorites: hydrated ? favorites.length : 0,
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
      <nav className="pointer-events-auto mx-auto flex max-w-xl items-center justify-between rounded-[28px] border border-white/12 bg-[rgba(7,19,34,0.9)] px-3 py-2.5 text-white shadow-[0_18px_45px_rgba(3,10,20,0.34)] backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match ? pathname === item.match : false;
          const count = item.countKey ? counts[item.countKey] : 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex min-w-[56px] flex-col items-center gap-1 rounded-[18px] px-2 py-2 text-[11px] font-medium transition ${
                isActive ? "bg-white/12 text-white" : "text-white/62"
              }`}
            >
              <Icon className="h-5 w-5" />
              {count > 0 ? (
                <span className="absolute right-1 top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-support px-1.5 py-1 text-[10px] font-bold leading-none text-white">
                  {count}
                </span>
              ) : null}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
