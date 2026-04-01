import { CompareView } from "@/components/compare-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStorefrontSnapshot } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Taqqoslash",
  description: "Tanlangan mahsulotlarni yonma-yon taqqoslash sahifasi",
};

export default async function ComparePage() {
  const { products } = await getStorefrontSnapshot();

  return (
    <>
      <SiteHeader />
      <main className="shell py-4 pb-20 sm:py-6">
        <CompareView products={products} />
      </main>
      <SiteFooter />
    </>
  );
}
