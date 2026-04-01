import { redirect } from "next/navigation";

import { CustomerCabinet } from "@/components/customer-cabinet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAuthViewer } from "@/lib/customer-auth";
import { getCustomerCabinetData } from "@/lib/customer-cabinet";

export const metadata = {
  title: "Shaxsiy kabinet",
  description: "aloo mijozlar uchun shaxsiy kabinet",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const viewer = await getAuthViewer();

  if (!viewer) {
    redirect("/login");
  }

  const cabinetData = await getCustomerCabinetData(viewer.id, viewer.phone);

  return (
    <>
      <SiteHeader />
      <main className="shell py-6 pb-16">
        <CustomerCabinet viewer={viewer} data={cabinetData} />
      </main>
      <SiteFooter />
    </>
  );
}
