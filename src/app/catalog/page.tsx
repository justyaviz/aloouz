/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brands, categories, products } from "@/data/store";

type CatalogPageProps = {
  searchParams: Promise<{
    category?: string;
    brand?: string;
  }>;
};

function buildCatalogHref(category?: string, brand?: string) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (brand) {
    params.set("brand", brand);
  }

  const query = params.toString();

  return query ? `/catalog?${query}` : "/catalog";
}

export const metadata = {
  title: "Katalog",
  description: "aloo smartfonlar va gadjetlar katalogi",
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const filters = await searchParams;
  const activeCategory = filters.category;
  const activeBrand = filters.brand;

  const selectedCategory = categories.find((category) => category.slug === activeCategory);

  const filteredProducts = products.filter((product) => {
    const categoryMatch = activeCategory ? product.categorySlug === activeCategory : true;
    const brandMatch = activeBrand ? product.brand === activeBrand : true;

    return categoryMatch && brandMatch;
  });

  return (
    <>
      <SiteHeader />

      <main className="shell py-8">
        <section className="glass-card rounded-[38px] p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Katalog</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {selectedCategory ? selectedCategory.name : "Barcha mahsulotlar"}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            aloo katalogi telefonlar, gadjetlar va aksessuarlar oqimini category hamda
            brand bo'yicha filtrlash uchun tayyor. Keyingi bosqichda real backend filter,
            pagination va aqlli qidiruv ulanadi.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                !activeCategory
                  ? "bg-foreground text-background"
                  : "border border-line bg-white text-foreground hover:bg-[#fff7ef]"
              }`}
            >
              Barchasi
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={buildCatalogHref(category.slug, activeBrand)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  activeCategory === category.slug
                    ? "bg-foreground text-background"
                    : "border border-line bg-white text-foreground hover:bg-[#fff7ef]"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <div className="soft-card rounded-[30px] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                Brendlar
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={buildCatalogHref(activeCategory)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    !activeBrand
                      ? "bg-foreground text-background"
                      : "border border-line bg-white text-foreground"
                  }`}
                >
                  Barchasi
                </Link>
                {brands.map((brand) => (
                  <Link
                    key={brand}
                    href={buildCatalogHref(activeCategory, brand)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      activeBrand === brand
                        ? "bg-foreground text-background"
                        : "border border-line bg-white text-foreground"
                    }`}
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>

            <div className="soft-card rounded-[30px] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                Savdo argumentlari
              </p>
              <div className="mt-5 space-y-4">
                {[ 
                  "Bo'lib to'lash summasi har kartochkada ko'rinadi",
                  "Original va IMEI messaging uchun joy tayyor",
                  "Mahsulot detail route'lari SEO uchun mos",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-line bg-white px-4 py-4 text-sm leading-6 text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[30px] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                Support
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">
                Buyurtma yoki konsultatsiya uchun tezkor kanal
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Aloo g'oyasidagi aloqa va maslahat ruhini qo'llab, telefon va Telegram orqali
                bir kliklik so'rov oqimini keyingi iteratsiyada ulaymiz.
              </p>
            </div>
          </aside>

          <div className="space-y-5">
              <div className="soft-card flex flex-col gap-4 rounded-[30px] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                    Natijalar
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {filteredProducts.length} ta mahsulot topildi
                </p>
              </div>

              {(activeCategory || activeBrand) && (
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground"
                >
                  Filtrlarni tozalash
                </Link>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-[36px] p-10 text-center">
                <p className="font-display text-3xl font-semibold text-foreground">
                  Bu filter bo'yicha mahsulot topilmadi
                </p>
                <p className="mt-4 text-base leading-7 text-muted">
                  Real backend ulanganda bu yerda dynamic search, IMEI filter va suggest
                  bloklari chiqadi.
                </p>
                <Link
                  href="/catalog"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-4 text-sm font-semibold text-background"
                >
                  Barcha mahsulotlarni ko'rish
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
