/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

import { categories } from "@/data/store";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="shell grid gap-8 py-12 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/brand/aloo-favicon-dark.png"
              alt="aloo mark"
              width={42}
              height={42}
            />
            <div>
              <Image
                src="/brand/aloo-logotype-dark.png"
                alt="aloo"
                width={122}
                height={33}
              />
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Texno hayotga ulanish!
              </p>
            </div>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
            aloo - mobil telefonlar va gadjetlar do'koni. Brandbookdagi ko'k, qora va oq
            yo'nalish asosida retail storefront sifatida yig'ilgan.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
            Kategoriyalar
          </p>
          <div className="mt-4 space-y-3 text-sm">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="block text-foreground transition hover:text-accent"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
            Xizmatlar
          </p>
          <div className="mt-4 space-y-3 text-sm text-foreground">
            <p>IMEI va original qurilmalar</p>
            <p>12 oygacha muddatli to'lov</p>
            <p>Tezkor delivery va pick-up</p>
            <p>Telegram konsultatsiya</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">Aloqa</p>
          <div className="mt-4 space-y-3 text-sm text-foreground">
            <p>support@aloo.uz</p>
            <p>+998 91 123 45 67</p>
            <p>Toshkent, Amir Temur ko'chasi, 45-uy</p>
            <p>Dushanba - Yakshanba, 09:00 - 22:00</p>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-2 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 aloo. Barcha huquqlar himoyalangan.</p>
          <p>Smartfonlar bozori va texno hayotga ulanish uchun yagona manzil.</p>
        </div>
      </div>
    </footer>
  );
}
