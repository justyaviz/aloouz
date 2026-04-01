"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HeartIcon,
  HomeIcon,
  SearchIcon,
  CartIcon,
  UserIcon,
} from "@/components/icons";
import { useStorefrontState } from "@/components/storefront-state-provider";

const navItems = [
  { href: "/", label: "Bosh", icon: HomeIcon, match: "/" },
  { href: "/catalog", label: "Qidiruv", icon: SearchIcon, match: "/catalog" },
  { href: "/favorites", label: "Sevimli", icon: HeartIcon, match: "/favorites", countKey: "favorites" as const },
  { href: "/cart", label: "Savat", icon: CartIcon, match: "/cart", countKey: "cart" as const },
  { href: "/login", label: "Kirish", icon: UserIcon, match: "/login" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, favorites, hydrated } = useStorefrontState();
  const counts = {
    cart: hydrated ? cart.length : 0,
    favorites: hydrated ? favorites.length : 0,
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
      <nav className="pointer-events-auto mx-auto flex max-w-xl items-center justify-between rounded-[28px] border border-white/90 bg-[rgba(255,255,255,0.94)] px-3 py-2.5 text-foreground shadow-[0_18px_45px_rgba(3,10,20,0.16)] backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match ? pathname === item.match : false;
          const count = item.countKey ? counts[item.countKey] : 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex min-w-[56px] flex-col items-center gap-1 rounded-[18px] px-2 py-2 text-[11px] font-medium transition ${
                isActive ? "bg-[#f1f4f8] text-support" : "text-muted"
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
