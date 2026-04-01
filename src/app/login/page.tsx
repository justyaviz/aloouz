import { redirect } from "next/navigation";

import { LoginCard } from "@/components/login-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAuthViewer } from "@/lib/customer-auth";

export const metadata = {
  title: "Kirish",
  description: "Telegram orqali tasdiqlash va aloo akkauntiga kirish",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const viewer = await getAuthViewer();

  if (viewer) {
    redirect("/profile");
  }

  return (
    <>
      <SiteHeader />
      <main className="shell py-6 pb-16">
        <section className="relative min-h-[68vh] overflow-hidden rounded-[34px] border border-line bg-[linear-gradient(180deg,#f5f9fd_0%,#ffffff_100%)] px-4 py-10 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,144,245,0.08),transparent_28%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(254,102,0,0.08),transparent_24%)]" />

          <div className="relative flex min-h-[60vh] items-center justify-center">
            <LoginCard />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
