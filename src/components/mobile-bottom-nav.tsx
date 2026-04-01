"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BoltIcon, GridIcon, HomeIcon, SearchIcon, UserIcon } from "@/components/icons";

const navItems = [
  { href: "/", label: "Bosh", icon: HomeIcon, match: "/" },
  { href: "/catalog", label: "Katalog", icon: GridIcon, match: "/catalog" },
  { href: "/#promos", label: "Aksiya", icon: BoltIcon, match: null },
  { href: "/catalog", label: "Qidiruv", icon: SearchIcon, match: null },
  { href: "/admin", label: "Admin", icon: UserIcon, match: "/admin" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
      <nav className="pointer-events-auto mx-auto flex max-w-xl items-center justify-between rounded-[28px] border border-white/12 bg-[rgba(7,19,34,0.9)] px-3 py-2.5 text-white shadow-[0_18px_45px_rgba(3,10,20,0.34)] backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match ? pathname === item.match : false;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-[56px] flex-col items-center gap-1 rounded-[18px] px-2 py-2 text-[11px] font-medium transition ${
                isActive ? "bg-white/12 text-white" : "text-white/62"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
