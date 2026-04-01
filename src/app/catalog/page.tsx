/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStorefrontSnapshot } from "@/lib/storefront";

export const dynamic = "force-dynamic";

type CatalogPageProps = {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    query?: string;
  }>;
};

function buildCatalogHref(category?: string, brand?: string, query?: string) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (brand) {
    params.set("brand", brand);
  }

  if (query) {
    params.set("query", query);
  }

  const queryString = params.toString();

  return queryString ? `/catalog?${queryString}` : "/catalog";
}

export const metadata = {
  title: "Katalog",
  description: "aloo smartfonlar va gadjetlar katalogi",
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { brands, categories, products } = await getStorefrontSnapshot();
  const filters = await searchParams;
  const activeCategory = filters.category;
  const activeBrand = filters.brand;
  const activeQuery = filters.query?.trim();

  const selectedCategory = categories.find((category) => category.slug === activeCategory);

  const filteredProducts = products.filter((product) => {
    const categoryMatch = activeCategory ? product.categorySlug === activeCategory : true;
    const brandMatch = activeBrand ? product.brand === activeBrand : true;
    const queryMatch = activeQuery
      ? `${product.name} ${product.brand} ${product.category} ${product.shortDescription}`
          .toLowerCase()
          .includes(activeQuery.toLowerCase())
      : true;

    return categoryMatch && brandMatch && queryMatch;
  });

  const activeLabels = [selectedCategory?.name, activeBrand, activeQuery ? `"${activeQuery}"` : undefined].filter(Boolean);

  return (
    <>
      <SiteHeader />

      <main className="shell py-6 pb-16">
        <nav className="mb-4 hidden flex-wrap items-center gap-2 text-sm text-muted sm:flex">
          <Link href="/" className="hover:text-foreground">
            Bosh sahifa
          </Link>
          <span>/</span>
          <span className="text-foreground">Katalog</span>
        </nav>

        <section className="rounded-[30px] border border-line bg-white p-5 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Katalog
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {selectedCategory ? selectedCategory.name : "Barcha mahsulotlar"}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                aloo katalogi endi retail marketplace ritmida ishlaydi: chap tomonda filtrlar,
                o'ng tomonda esa natijalar, sort chip'lari va mahsulot grid'i. Bu MediaPark
                uslubiga yaqinroq ichki oqim beradi.
              </p>

              <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-1">
                <Link
                  href="/catalog"
                  className={`shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    !activeCategory
                      ? "bg-accent text-white"
                      : "border border-line bg-white text-foreground hover:border-accent/30 hover:text-accent"
                  }`}
                >
                  Barchasi
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                  href={buildCatalogHref(category.slug, activeBrand, activeQuery)}
                    className={`shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition ${
                      activeCategory === category.slug
                        ? "bg-accent text-white"
                        : "border border-line bg-white text-foreground hover:border-accent/30 hover:text-accent"
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#f6faff] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Savdo argumenti
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-[18px] bg-white px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">
                    {filteredProducts.length} ta mahsulot topildi
                  </p>
                </div>
                <div className="rounded-[18px] bg-white px-4 py-4 text-sm text-foreground">
                  12 oygacha muddatli to'lov har kartada ko'rinadi
                </div>
                <div className="rounded-[18px] bg-white px-4 py-4 text-sm text-foreground">
                  IMEI va original qurilma messaging uchun joy tayyor
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden space-y-4 xl:block">
            <div className="rounded-[26px] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Brendlar
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={buildCatalogHref(activeCategory, undefined, activeQuery)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    !activeBrand
                      ? "bg-accent text-white"
                      : "border border-line bg-white text-foreground hover:border-accent/30 hover:text-accent"
                  }`}
                >
                  Barchasi
                </Link>
                {brands.map((brand) => (
                  <Link
                    key={brand}
                    href={buildCatalogHref(activeCategory, brand, activeQuery)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeBrand === brand
                        ? "bg-accent text-white"
                        : "border border-line bg-white text-foreground hover:border-accent/30 hover:text-accent"
                    }`}
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Xizmatlar
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Muddatli to'lov summasi kartochkaning yuqori qismida ko'rinadi",
                  "Mahsulot detail sahifasi orqali batafsil tavsif va rang tanlovi beriladi",
                  "Admin panel orqali qo'shilgan mahsulotlar shu katalogga avtomatik tushadi",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] bg-[#f6faff] px-4 py-4 text-sm leading-6 text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] bg-[#0a1524] p-5 text-white shadow-[0_20px_50px_rgba(10,21,36,0.2)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                Support
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold">
                Buyurtma va konsultatsiya uchun tezkor kanal
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Aloo g'oyasidagi muloqot ruhi katalog ichida ham qoladi. Telefon va Telegram
                orqali bir klikda bog'lanish keyingi iteratsiyada ulanadi.
              </p>
            </div>
          </aside>

          <div className="space-y-4">
            <div className="xl:hidden">
              <div className="rounded-[24px] border border-line bg-white p-4 shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  Mobil filterlar
                </p>
                <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
                  <Link
                  href={buildCatalogHref(activeCategory, undefined, activeQuery)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                      !activeBrand
                        ? "bg-accent text-white"
                        : "border border-line bg-white text-foreground"
                    }`}
                  >
                    Barcha brendlar
                  </Link>
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={buildCatalogHref(activeCategory, brand, activeQuery)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                        activeBrand === brand
                          ? "bg-accent text-white"
                          : "border border-line bg-white text-foreground"
                      }`}
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[26px] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)] lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  Natijalar
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {filteredProducts.length} ta mahsulot topildi
                </p>
                {activeLabels.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeLabels.map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-[#eef6ff] px-3 py-1.5 text-xs font-semibold text-accent"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {["Mashhurligi", "Narxi", "Yangi kelganlar"].map((item, index) => (
                  <span
                    key={item}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      index === 0
                        ? "bg-[#eef6ff] text-accent"
                        : "border border-line bg-white text-foreground"
                    }`}
                  >
                    {item}
                  </span>
                ))}

                {(activeCategory || activeBrand || activeQuery) && (
                  <Link
                    href="/catalog"
                    className="inline-flex items-center justify-center rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
                  >
                    Filtrlarni tozalash
                  </Link>
                )}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-[30px] border border-line bg-white p-10 text-center shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
                <p className="font-display text-3xl font-semibold text-foreground">
                  Bu filter bo'yicha mahsulot topilmadi
                </p>
                <p className="mt-4 text-base leading-7 text-muted">
                  Filtrni o'zgartirib qayta urinib ko'ring yoki admin paneldan yangi mahsulot
                  qo'shing.
                </p>
                <Link
                  href="/catalog"
                  className="mt-6 inline-flex items-center justify-center rounded-2xl bg-accent px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0b74d1]"
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
