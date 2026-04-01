import { CartView } from "@/components/cart-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStorefrontSnapshot } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Savat",
  description: "Tanlangan mahsulotlar savati",
};

export default async function CartPage() {
  const { products } = await getStorefrontSnapshot();

  return (
    <>
      <SiteHeader />
      <main className="shell py-6 pb-16">
        <CartView products={products} />
      </main>
      <SiteFooter />
    </>
  );
}
