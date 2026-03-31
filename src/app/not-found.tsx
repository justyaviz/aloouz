/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="shell flex flex-1 items-center py-16">
        <div className="glass-card w-full rounded-[40px] p-10 text-center sm:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">404</p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-foreground">
            Qidirgan sahifa topilmadi
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">
            Route hali yaratilmagan bo'lishi mumkin yoki aloo katalogidagi product slug
            noto'g'ri kiritilgan.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-4 text-sm font-semibold text-background"
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
