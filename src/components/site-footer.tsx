/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { ClockIcon, LocationIcon, PhoneIcon } from "@/components/icons";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { SiteLogo } from "@/components/site-logo";
import { categories } from "@/data/store";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#143862] bg-[linear-gradient(180deg,#062041_0%,#092d59_100%)] pb-[calc(env(safe-area-inset-bottom)+5.5rem)] text-white md:pb-0">
      <div className="shell py-8 md:hidden">
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
          <SiteLogo
            href="/"
            variant="light"
            width={136}
            showTagline
            className="inline-flex flex-col gap-1.5"
            taglineClassName="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/68"
          />
          <p className="mt-4 text-sm leading-7 text-white/72">
            mobil xarid uchun qulaylashtirilgan aloo tajribasi.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-[13px] text-white/86"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="mt-5 space-y-2 text-sm text-white/76">
            <p className="inline-flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-white/60" />
              +998 91 123 45 67
            </p>
            <p className="inline-flex items-center gap-2">
              <LocationIcon className="h-4 w-4 text-white/60" />
              Toshkent
            </p>
          </div>
        </div>
      </div>

      <div className="shell hidden gap-8 py-12 md:grid lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
        <div>
          <SiteLogo
            href="/"
            variant="light"
            width={162}
            showTagline
            className="inline-flex flex-col gap-1.5"
            taglineClassName="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/68"
          />
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/72">
            aloo - mobil telefonlar va gadjetlar do'koni. Brandbookdagi ko'k, qora va oq
            yo'nalish asosida retail storefront sifatida yig'ilgan.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">
            Kategoriyalar
          </p>
          <div className="mt-4 space-y-3 text-sm">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="block text-white/82 transition hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">
            Xizmatlar
          </p>
          <div className="mt-4 space-y-3 text-sm text-white/82">
            <p>IMEI va original qurilmalar</p>
            <p>12 oygacha muddatli to'lov</p>
            <p>Tezkor delivery va pick-up</p>
            <Link href="/favorites" className="block transition hover:text-white">
              Sevimlilar
            </Link>
            <Link href="/compare" className="block transition hover:text-white">
              Taqqoslash
            </Link>
            <Link href="/order-status" className="block transition hover:text-white">
              Buyurtma holati
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">Aloqa</p>
          <div className="mt-4 space-y-3 text-sm text-white/82">
            <p>support@aloo.uz</p>
            <p className="inline-flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-white/68" />
              +998 91 123 45 67
            </p>
            <p className="inline-flex items-center gap-2">
              <LocationIcon className="h-4 w-4 text-white/68" />
              Toshkent, Amir Temur ko'chasi, 45-uy
            </p>
            <p className="inline-flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-white/68" />
              Dushanba - Yakshanba, 09:00 - 22:00
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-2 py-4 text-sm text-white/58 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 aloo. Barcha huquqlar himoyalangan.</p>
          <p>Smartfonlar bozori va texno hayotga ulanish uchun yagona manzil.</p>
        </div>
      </div>

      <MobileBottomNav />
    </footer>
  );
}
