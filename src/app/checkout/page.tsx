import { redirect } from "next/navigation";

import { CheckoutView } from "@/components/checkout-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAuthViewer } from "@/lib/customer-auth";
import { getStorefrontSnapshot } from "@/lib/storefront";

export const metadata = {
  title: "Checkout",
  description: "aloo buyurtmani rasmiylashtirish sahifasi",
};

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  searchParams: Promise<{
    product?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const viewer = await getAuthViewer();
  const params = await searchParams;
  const singleProductSlug = params.product?.trim() || undefined;

  if (!viewer) {
    const redirectTo = singleProductSlug
      ? `/checkout?product=${encodeURIComponent(singleProductSlug)}`
      : "/checkout";

    redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  const { products } = await getStorefrontSnapshot();

  return (
    <>
      <SiteHeader />
      <main className="shell py-6 pb-16">
        <CheckoutView
          products={products}
          viewer={viewer}
          singleProductSlug={singleProductSlug}
        />
      </main>
      <SiteFooter />
    </>
  );
}
