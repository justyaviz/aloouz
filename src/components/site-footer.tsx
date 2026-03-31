/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

import { categories } from "@/data/store";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#050B14] text-white">
      <div className="shell grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr_0.9fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/brand/aloo-favicon-light.png"
              alt="aloo mark"
              width={42}
              height={42}
            />
            <div>
              <Image
                src="/brand/aloo-logotype-light.png"
                alt="aloo"
                width={122}
                height={33}
              />
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Texno hayotga ulanish!
              </p>
            </div>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/65">
            aloo — mobil telefonlar va gadjetlar do'koni. Brendbookdagi ko'k,
            qora va oq yo'nalish asosida yig'ilgan storefront foundation.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">
            Kategoriyalar
          </p>
          <div className="mt-4 space-y-3 text-sm">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="block text-white transition hover:text-[#1690F5]"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">
            Xizmatlar
          </p>
          <div className="mt-4 space-y-3 text-sm text-white">
            <p>IMEI va original qurilmalar</p>
            <p>12 oygacha muddatli to'lov</p>
            <p>Tezkor delivery va pick-up</p>
            <p>Telegram konsultatsiya</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">Aloqa</p>
          <div className="mt-4 space-y-3 text-sm text-white">
            <p>support@aloo.uz</p>
            <p>+998 91 123 45 67</p>
            <p>Toshkent, Amir Temur ko'chasi, 45-uy</p>
            <p>Dushanba - Yakshanba, 09:00 - 22:00</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
