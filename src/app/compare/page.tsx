import { CompareView } from "@/components/compare-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStorefrontSnapshot } from "@/lib/storefront";

export const metadata = {
  title: "Taqqoslash",
  description: "Tanlangan mahsulotlarni yonma-yon taqqoslash sahifasi",
};

export default async function ComparePage() {
  const { products } = await getStorefrontSnapshot();

  return (
    <>
      <SiteHeader />
      <main className="shell py-6 pb-16">
        <CompareView products={products} />
      </main>
      <SiteFooter />
    </>
  );
}
