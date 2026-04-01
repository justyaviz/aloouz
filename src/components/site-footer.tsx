/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { ClockIcon, LocationIcon, PhoneIcon } from "@/components/icons";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { SiteLogo } from "@/components/site-logo";
import { categories } from "@/data/store";

const paymentMethods = ["Uzcard", "Humo", "Click", "Payme", "Visa", "Mastercard"];
const callCenterLabel = "+998 78 122 08 00";
const callCenterHref = "tel:+998781220800";
const mapsHref = "https://yandex.uz/maps/?text=aloo";
const socialLinks = [
  { href: "https://t.me/aloo_uzb", label: "Telegram" },
  { href: "https://www.instagram.com/aloo.uz_/", label: "Instagram" },
  { href: "https://www.youtube.com/@aloouz", label: "YouTube" },
  { href: "https://www.facebook.com/aloo.uz", label: "Facebook" },
  { href: "https://yandex.uz/maps/?text=aloo", label: "Yandex Maps" },
  { href: "https://www.threads.com/@aloo.uz_", label: "Threads" },
  { href: "https://www.tiktok.com/@aloo.uz", label: "TikTok" },
  { href: "https://x.com/aloouz", label: "X" },
];

const infoLinks = [
  { href: "/#about", label: "Biz haqimizda" },
  { href: "/blog", label: "alooBlog" },
  { href: "/#stores", label: "Bizning do'konlarimiz" },
  { href: "/#delivery", label: "Yetkazib berish" },
];

const serviceLinks = [
  { href: "/#installment", label: "Muddatli to'lov" },
  { href: "/order-status", label: "Buyurtma holati" },
  { href: "/compare", label: "Taqqoslash" },
  { href: "/favorites", label: "Sevimlilar" },
];

const customerLinks = [
  { href: "/cart", label: "Savatcha" },
  { href: "/profile", label: "Profil" },
  { href: "/catalog", label: "Katalog" },
  { href: "/#contact", label: "Biz bilan bog'lanish" },
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="mt-auto border-t border-[#153864] bg-[linear-gradient(180deg,#11243d_0%,#1b2f4d_100%)] pb-[calc(env(safe-area-inset-bottom)+5.5rem)] text-white md:pb-0"
    >
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
            aloo mobil katalogi, alooBlog va asosiy xarid bo'limlari shu yerda jamlangan.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {paymentMethods.slice(0, 4).map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3 text-center text-sm font-semibold text-white/90"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 text-sm text-white/76">
            <a href={callCenterHref} className="inline-flex items-center gap-2 transition hover:text-white">
              <PhoneIcon className="h-4 w-4 text-white/60" />
              {callCenterLabel}
            </a>
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <LocationIcon className="h-4 w-4 text-white/60" />
              Toshkent viloyati
            </a>
            <p className="inline-flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-white/60" />
              Har kuni: 09:00 - 21:00
            </p>
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/52">
              Biz ijtimoiy tarmoqlarda
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-[12px] font-medium text-white/88 transition hover:bg-white/14 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shell hidden gap-8 py-12 md:grid lg:grid-cols-[1.05fr_0.9fr_0.72fr_0.72fr_0.72fr]">
        <div>
          <SiteLogo
            href="/"
            variant="light"
            width={170}
            showTagline
            className="inline-flex flex-col gap-1.5"
            taglineClassName="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/68"
          />

          <p className="mt-4 max-w-sm text-sm leading-7 text-white/72">
            aloo - smartfonlar bozori. Katalog, alooBlog va asosiy xarid bo'limlari kundalik
            foydalanish uchun bir joyga yig'ilgan.
          </p>

          <div className="mt-6 space-y-3 text-sm text-white/82">
            <a
              href={callCenterHref}
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <PhoneIcon className="h-4 w-4 text-white/62" />
              {callCenterLabel}
            </a>
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <LocationIcon className="h-4 w-4 text-white/62" />
              Toshkent viloyati
            </a>
            <p className="inline-flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-white/62" />
              Har kuni: 09:00 - 21:00
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">
              Biz ijtimoiy tarmoqlarda
            </p>
            <div className="mt-4 flex max-w-md flex-wrap gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-[13px] font-medium text-white/88 transition hover:bg-white/14 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">
            To'lov usullari
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {paymentMethods.map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-white/10 bg-[#243a56] px-4 py-4 text-center text-sm font-semibold text-white"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">
            Ma'lumot
          </p>
          <div className="mt-4 space-y-3 text-sm">
            {infoLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-white/82 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">
            Xizmatlar
          </p>
          <div className="mt-4 space-y-3 text-sm">
            {serviceLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-white/82 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/56">
            Mijozlar uchun
          </p>
          <div className="mt-4 space-y-3 text-sm">
            {customerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-white/82 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-[13px] text-white/86"
              >
                {category.name}
              </Link>
            ))}
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
