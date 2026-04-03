"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HeartIcon,
  HomeIcon,
  SearchIcon,
  CartIcon,
  PhoneIcon,
  UserIcon,
} from "@/components/icons";
import { useStorefrontState } from "@/components/storefront-state-provider";

const navItems = [
  { href: "/", label: "Bosh", icon: HomeIcon, match: "/" },
  { href: "/catalog", label: "Qidiruv", icon: SearchIcon, match: "/catalog" },
  { href: "/favorites", label: "Sevimli", icon: HeartIcon, match: "/favorites", countKey: "favorites" as const },
  { href: "/cart", label: "Savat", icon: CartIcon, match: "/cart", countKey: "cart" as const },
  { href: "/profile", label: "Profil", icon: UserIcon, match: "/profile" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, favorites, hydrated } = useStorefrontState();
  const counts = {
    cart: hydrated ? cart.length : 0,
    favorites: hydrated ? favorites.length : 0,
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.7rem)] md:hidden">
      <a
        href="tel:+998781220800"
        className="pointer-events-auto absolute bottom-[calc(env(safe-area-inset-bottom)+4.7rem)] right-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-support text-white shadow-[0_20px_38px_rgba(255,92,31,0.3)] transition active:scale-95"
        aria-label="Call markazga qo'ng'iroq qilish"
      >
        <PhoneIcon className="h-6 w-6" />
      </a>

      <nav className="pointer-events-auto mx-auto flex max-w-xl items-center justify-between rounded-[32px] border border-white/90 bg-[rgba(255,255,255,0.96)] px-3 py-2.5 text-foreground shadow-[0_24px_55px_rgba(3,10,20,0.16)] backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match ? pathname === item.match : false;
          const count = item.countKey ? counts[item.countKey] : 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className={`relative flex h-14 w-14 items-center justify-center rounded-[20px] transition ${
                isActive
                  ? "bg-[#f3f4f6] text-support shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_20px_rgba(13,31,55,0.06)]"
                  : "text-[#59677b]"
              }`}
            >
              <Icon className="h-5 w-5" />
              {count > 0 ? (
                <span className="absolute right-1.5 top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-support px-1.5 py-1 text-[10px] font-bold leading-none text-white">
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
