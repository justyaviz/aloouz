import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutCustomerAction } from "@/app/login/actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAuthViewer } from "@/lib/customer-auth";

export const metadata = {
  title: "Profil",
  description: "aloo foydalanuvchi kabineti",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const viewer = await getAuthViewer();

  if (!viewer) {
    redirect("/login");
  }

  return (
    <>
      <SiteHeader />
      <main className="shell py-6 pb-16">
        <section className="relative min-h-[68vh] overflow-hidden rounded-[34px] border border-line bg-[linear-gradient(180deg,#f5f9fd_0%,#ffffff_100%)] px-4 py-10 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,144,245,0.08),transparent_28%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(254,102,0,0.08),transparent_24%)]" />

          <div className="relative flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-[560px] rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(13,31,55,0.18)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Profil
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
                Shaxsiy kabinet
              </h1>
              <p className="mt-3 text-base leading-8 text-muted">
                Telegram orqali tasdiqlangan akkauntingiz faol. Endi buyurtmalar, savat va sevimli
                mahsulotlar bilan davom etishingiz mumkin.
              </p>

              <div className="mt-7 grid gap-4 rounded-[24px] border border-line bg-[#fbfdff] p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Ism
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {[viewer.firstName, viewer.lastName].filter(Boolean).join(" ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Telefon
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{viewer.displayPhone}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/catalog"
                  className="inline-flex h-14 items-center justify-center rounded-[20px] bg-support px-6 text-base font-semibold text-white transition hover:bg-[#e45d07]"
                >
                  Katalogga o&apos;tish
                </Link>
                <form action={logoutCustomerAction}>
                  <input type="hidden" name="redirectTo" value="/login" />
                  <button
                    type="submit"
                    className="inline-flex h-14 w-full items-center justify-center rounded-[20px] border border-line bg-white px-6 text-base font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
                  >
                    Chiqish
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
