import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Kirish",
  description: "Telefon raqami orqali aloo akkauntiga kirish",
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="shell py-6 pb-16">
        <section className="overflow-hidden rounded-[34px] border border-line bg-white shadow-[0_18px_45px_rgba(13,31,55,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden bg-[linear-gradient(145deg,#062e63_0%,#1690f5_55%,#0b1f42_100%)] p-8 text-white sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
              <div
                className="absolute -right-12 top-10 h-44 w-44 rounded-full bg-white/10"
                style={{
                  backgroundImage: "url('/brand/aloo-mark-light.png')",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "72%",
                }}
              />
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  Kirish
                </p>
                <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
                  Xarid, sevimlilar va savatni bir joydan boshqaring.
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/78">
                  MediaPark uslubiga yaqin oqimda telefon raqami orqali kirish, sevimlilarni
                  saqlash va buyurtma holatini kuzatish uchun tayyor ekran.
                </p>

                <div className="mt-8 grid gap-3">
                  {[
                    "Telefon raqami orqali tezkor kirish",
                    "Sevimlilar va savat holati saqlanadi",
                    "Keyin SMS tasdiqlash backend bilan ulanadi",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-white/14 bg-white/10 px-4 py-4 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Telefon orqali kirish
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground">
                Kirish yoki ro&apos;yxatdan o&apos;tish
              </h2>

              <form className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-foreground">
                    Telefon raqam
                  </span>
                  <div className="flex h-14 items-center rounded-[20px] border border-line bg-[#f8fbfd] px-4">
                    <span className="text-lg font-semibold text-foreground">+998</span>
                    <input
                      type="tel"
                      placeholder="90 123 45 67"
                      className="min-w-0 flex-1 bg-transparent px-3 text-base text-foreground outline-none placeholder:text-muted"
                    />
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-4">
                  <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-line" />
                  <span className="text-sm leading-7 text-muted">
                    Shartlar bilan tanishganligimni va ularga roziligimni tasdiqlayman.
                    <span className="font-semibold text-accent"> Ommaviy oferta</span>
                  </span>
                </label>

                <button
                  type="button"
                  className="inline-flex h-14 w-full items-center justify-center rounded-[20px] bg-support px-6 text-base font-semibold text-white transition hover:bg-[#e45d07]"
                >
                  Kodni yuborish
                </button>
              </form>

              <div className="mt-8 flex items-center gap-4 text-sm text-muted">
                <div className="h-px flex-1 bg-line" />
                yoki
                <div className="h-px flex-1 bg-line" />
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  className="inline-flex h-14 items-center justify-center rounded-[20px] border border-line bg-[#f8fbfd] px-6 text-base font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
                >
                  Google orqali kirish
                </button>
                <button
                  type="button"
                  className="inline-flex h-14 items-center justify-center rounded-[20px] border border-line bg-[#f8fbfd] px-6 text-base font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
                >
                  Apple orqali kirish
                </button>
              </div>

              <div className="mt-8 rounded-[24px] bg-[#f6faff] p-5">
                <p className="text-sm leading-7 text-muted">
                  Bu ekran hozir storefront uchun tayyor UI. SMS verifikatsiya va haqiqiy user
                  auth keyingi backend bosqichida ulanadi.
                </p>
                <Link
                  href="/catalog"
                  className="mt-4 inline-flex text-sm font-semibold text-accent transition hover:text-accent-strong"
                >
                  Hozircha katalogga qaytish
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
