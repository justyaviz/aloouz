import { FavoritesView } from "@/components/favorites-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStorefrontSnapshot } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sevimlilar",
  description: "Sevimliga saqlangan smartfon va gadjetlar ro'yxati",
};

export default async function FavoritesPage() {
  const { products } = await getStorefrontSnapshot();

  return (
    <>
      <SiteHeader />
      <main className="shell py-4 pb-20 sm:py-6">
        <FavoritesView products={products} />
      </main>
      <SiteFooter />
    </>
  );
}
