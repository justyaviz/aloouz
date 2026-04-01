/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
import Link from "next/link";

import {
  deleteArticleAction,
  deleteProductAction,
  deletePromoDealAction,
  loginAction,
  logoutAction,
  saveArticleAction,
  saveProductAction,
  savePromoDealAction,
} from "@/app/admin/actions";
import { getAdminSetup, isAdminAuthenticated } from "@/lib/admin-auth";
import { formatMonthly, formatSum } from "@/lib/format";
import { getAdminDashboardData, getCategoryOptions } from "@/lib/storefront";

type AdminPageProps = {
  searchParams: Promise<{
    tab?: string;
    editProduct?: string;
    editArticle?: string;
    editPromo?: string;
    status?: string;
    error?: string;
    auth?: string;
  }>;
};

const productKinds = [
  { value: "phone", label: "Telefon" },
  { value: "tablet", label: "Planshet" },
  { value: "watch", label: "Soat" },
  { value: "audio", label: "Audio" },
];

function toDateInputValue(value?: string) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

function toMultilineSpecs(specs: Array<{ label: string; value: string }>) {
  return specs.map((spec) => `${spec.label}: ${spec.value}`).join("\n");
}

function feedbackMessage(status?: string, error?: string, auth?: string) {
  if (auth === "error") {
    return {
      tone: "error" as const,
      text: "Login xato. Username yoki parolni qayta tekshiring.",
    };
  }

  if (error === "database") {
    return {
      tone: "error" as const,
      text: "Admin panel uchun database ulanmagan. Railway PostgreSQL kerak bo'ladi.",
    };
  }

  if (error === "product") {
    return {
      tone: "error" as const,
      text: "Mahsulotni saqlash uchun nom, brend va kategoriya to'ldirilishi kerak.",
    };
  }

  if (error === "article") {
    return {
      tone: "error" as const,
      text: "Yangilikni saqlash uchun kamida sarlavha kerak.",
    };
  }

  if (error === "promo") {
    return {
      tone: "error" as const,
      text: "Promo blokni saqlash uchun kamida sarlavha kerak.",
    };
  }

  if (error === "image-type") {
    return {
      tone: "error" as const,
      text: "Faqat PNG, JPG, WEBP yoki AVIF formatdagi rasmlarni yuklash mumkin.",
    };
  }

  if (error === "image-size") {
    return {
      tone: "error" as const,
      text: "Mahsulot rasmi 5 MB dan oshmasligi kerak.",
    };
  }

  const successMap: Record<string, string> = {
    "product-saved": "Mahsulot muvaffaqiyatli saqlandi.",
    "product-deleted": "Mahsulot o'chirildi.",
    "article-saved": "Yangilik saqlandi.",
    "article-deleted": "Yangilik o'chirildi.",
    "promo-saved": "Promo blok saqlandi.",
    "promo-deleted": "Promo blok o'chirildi.",
  };

  if (status && successMap[status]) {
    return {
      tone: "success" as const,
      text: successMap[status],
    };
  }

  return null;
}

export const metadata = {
  title: "Admin panel",
  description: "aloo storefront boshqaruv paneli",
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const authenticated = await isAdminAuthenticated();
  const adminSetup = getAdminSetup();
  const feedback = feedbackMessage(params.status, params.error, params.auth);

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef4fb_100%)] px-4 py-10">
        <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0a56b8_0%,#1690F5_55%,#082f67_100%)] p-8 text-white shadow-[0_28px_70px_rgba(7,45,102,0.24)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              aloo admin
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Mahsulot, yangilik va promo bloklarni bir joydan boshqaring.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/80">
              Bu panel orqali storefrontdagi mahsulotlar, bosh sahifa promo kartalari va
              yangilik maqolalarini qo'shish, tahrirlash va o'chirish mumkin bo'ladi.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Mahsulot CRUD",
                "Yangiliklar boshqaruvi",
                "Promo va skidka bloklari",
                "Homepage section nazorati",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-white/12 bg-white/10 px-4 py-4 text-sm text-white/85"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-line bg-white p-8 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Kirish
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
              Admin panelga login qiling
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Username default holatda{" "}
              <span className="font-semibold text-foreground">{adminSetup.username}</span>.
              {adminSetup.hasCustomPassword
                ? " Parol env orqali sozlangan."
                : " Agar hali o'zgartirilmagan bo'lsa, vaqtinchalik parol `alooadmin123`."}
            </p>

            {feedback ? (
              <div
                className={`mt-6 rounded-[18px] px-4 py-4 text-sm font-medium ${
                  feedback.tone === "success"
                    ? "bg-[#eefaf0] text-[#24643a]"
                    : "bg-[#fff1ec] text-[#b24616]"
                }`}
              >
                {feedback.text}
              </div>
            ) : null}

            <form action={loginAction} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Username</label>
                <input
                  name="username"
                  type="text"
                  defaultValue={adminSetup.username}
                  className="h-12 w-full rounded-[16px] border border-line bg-white px-4 text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Parol</label>
                <input
                  name="password"
                  type="password"
                  className="h-12 w-full rounded-[16px] border border-line bg-white px-4 text-sm outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-[16px] bg-support px-6 text-sm font-semibold text-white transition hover:bg-[#e25a00]"
              >
                Panelga kirish
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  const dashboard = await getAdminDashboardData();
  const categoryOptions = getCategoryOptions();
  const activeTab = params.tab ?? "overview";
  const showProducts = activeTab === "overview" || activeTab === "products";
  const showArticles = activeTab === "overview" || activeTab === "articles";
  const showPromos = activeTab === "overview" || activeTab === "promos";

  const editingProduct = dashboard.products.find((item) => item.id === params.editProduct);
  const editingArticle = dashboard.articles.find((item) => item.id === params.editArticle);
  const editingPromo = dashboard.promoDeals.find((item) => item.id === params.editPromo);

  const productForm = {
    id: editingProduct?.id ?? "",
    previousSlug: editingProduct?.slug ?? "",
    name: editingProduct?.name ?? "",
    slug: editingProduct?.slug ?? "",
    sku: editingProduct?.sku ?? "",
    brand: editingProduct?.brand ?? "",
    categorySlug: editingProduct?.categorySlug ?? categoryOptions[0]?.slug ?? "smartfonlar",
    kind: editingProduct?.kind ?? "phone",
    shortDescription: editingProduct?.shortDescription ?? "",
    description: editingProduct?.description ?? "",
    price: editingProduct?.price ?? 0,
    oldPrice: editingProduct?.oldPrice ?? "",
    monthlyPrice: editingProduct?.monthlyPrice ?? 0,
    stock: editingProduct?.stock ?? 0,
    badge: editingProduct?.badge ?? "Yangi",
    rating: editingProduct?.rating ?? 5,
    reviews: editingProduct?.reviews ?? 0,
    heroLabel: editingProduct?.heroLabel ?? "Original",
    delivery: editingProduct?.delivery ?? "",
    toneFrom: editingProduct?.toneFrom ?? "#E9F4FF",
    toneTo: editingProduct?.toneTo ?? "#A8D6FF",
    imageUrl: editingProduct?.imageUrl ?? "",
    highlights: editingProduct?.highlights.join("\n") ?? "",
    colors: editingProduct?.colors.join(", ") ?? "",
    specs: editingProduct ? toMultilineSpecs(editingProduct.specs) : "",
    isActive: editingProduct?.isActive ?? true,
    isFeatured: editingProduct?.isFeatured ?? false,
    isNewArrival: editingProduct?.isNewArrival ?? false,
    isDayDeal: editingProduct?.isDayDeal ?? false,
    sortOrder: editingProduct?.sortOrder ?? 0,
  };

  const articleForm = {
    id: editingArticle?.id ?? "",
    title: editingArticle?.title ?? "",
    slug: editingArticle?.slug ?? "",
    tag: editingArticle?.tag ?? "Yangilik",
    summary: editingArticle?.summary ?? "",
    publishedAt: toDateInputValue(editingArticle?.publishedAt),
    isPublished: editingArticle?.isPublished ?? true,
    sortOrder: editingArticle?.sortOrder ?? 0,
  };

  const promoForm = {
    id: editingPromo?.id ?? "",
    eyebrow: editingPromo?.eyebrow ?? "Aksiya",
    title: editingPromo?.title ?? "",
    description: editingPromo?.description ?? "",
    ctaLabel: editingPromo?.ctaLabel ?? "Ko'rish",
    ctaHref: editingPromo?.ctaHref ?? "/catalog",
    backgroundFrom: editingPromo?.backgroundFrom ?? "#EEF6FF",
    backgroundTo: editingPromo?.backgroundTo ?? "#FFFFFF",
    isActive: editingPromo?.isActive ?? true,
    sortOrder: editingPromo?.sortOrder ?? 0,
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef4fb_100%)] pb-12">
      <div className="border-b border-line bg-white">
        <div className="shell flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              aloo admin
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground">
              Storefront boshqaruv paneli
            </h1>
            <p className="mt-3 text-sm text-muted">
              Mahsulotlar, news va promo bo'limlarini shu yerdan boshqarasiz.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-[16px] border border-line bg-white px-5 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
            >
              Saytga qaytish
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-[16px] bg-support px-5 text-sm font-semibold text-white transition hover:bg-[#e25a00]"
              >
                Chiqish
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="shell pt-6">
        {!dashboard.databaseEnabled ? (
          <div className="rounded-[20px] bg-[#fff1ec] px-5 py-4 text-sm font-medium text-[#b24616]">
            Database hali ulanmagan. Panel fallback data ko'rsatmoqda, lekin saqlash uchun
            Railway PostgreSQL kerak bo'ladi.
          </div>
        ) : null}

        {feedback ? (
          <div
            className={`mt-4 rounded-[20px] px-5 py-4 text-sm font-medium ${
              feedback.tone === "success"
                ? "bg-[#eefaf0] text-[#24643a]"
                : "bg-[#fff1ec] text-[#b24616]"
            }`}
          >
            {feedback.text}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Mahsulotlar", value: dashboard.products.length.toString() },
            { label: "Yangiliklar", value: dashboard.articles.length.toString() },
            { label: "Promo bloklar", value: dashboard.promoDeals.length.toString() },
            {
              label: "Faol mahsulotlar",
              value: dashboard.products.filter((item) => item.isActive).length.toString(),
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[24px] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
            >
              <p className="text-sm font-medium text-muted">{card.label}</p>
              <p className="mt-3 font-display text-4xl font-semibold text-foreground">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { key: "overview", label: "Overview" },
            { key: "products", label: "Mahsulotlar" },
            { key: "articles", label: "Yangiliklar" },
            { key: "promos", label: "Promo bloklar" },
          ].map((tab) => (
            <Link
              key={tab.key}
              href={`/admin?tab=${tab.key}`}
              className={`inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold transition ${
                activeTab === tab.key
                  ? "bg-accent text-white"
                  : "border border-line bg-white text-foreground hover:border-accent/35 hover:text-accent"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {showProducts ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Mahsulotlar
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
              {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Brend, kategoriya, narx, homepage flag va product detail ma'lumotlarini bir
              formda boshqarasiz.
            </p>

            <form
              action={saveProductAction}
              className="mt-6 space-y-6"
              encType="multipart/form-data"
              id="products"
            >
              <input type="hidden" name="id" value={productForm.id} />
              <input type="hidden" name="previousSlug" value={productForm.previousSlug} />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Nomi</label>
                  <input name="name" defaultValue={productForm.name} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Slug</label>
                  <input name="slug" defaultValue={productForm.slug} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">SKU</label>
                  <input name="sku" defaultValue={productForm.sku} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Brend</label>
                  <input name="brand" defaultValue={productForm.brand} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Kategoriya</label>
                  <select name="categorySlug" defaultValue={productForm.categorySlug} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent">
                    {categoryOptions.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Turi</label>
                  <select name="kind" defaultValue={productForm.kind} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent">
                    {productKinds.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Qisqa tavsif</label>
                <textarea name="shortDescription" defaultValue={productForm.shortDescription} rows={3} className="w-full rounded-[16px] border border-line px-4 py-3 text-sm outline-none focus:border-accent" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Batafsil tavsif</label>
                <textarea name="description" defaultValue={productForm.description} rows={4} className="w-full rounded-[16px] border border-line px-4 py-3 text-sm outline-none focus:border-accent" />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  { name: "price", label: "Narxi", value: productForm.price },
                  { name: "oldPrice", label: "Eski narx", value: productForm.oldPrice },
                  { name: "monthlyPrice", label: "Oylik to'lov", value: productForm.monthlyPrice },
                  { name: "stock", label: "Sklad", value: productForm.stock },
                  { name: "rating", label: "Reyting", value: productForm.rating },
                  { name: "reviews", label: "Sharhlar soni", value: productForm.reviews },
                  { name: "sortOrder", label: "Tartib", value: productForm.sortOrder },
                  { name: "badge", label: "Badge", value: productForm.badge },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="mb-2 block text-sm font-semibold text-foreground">{field.label}</label>
                    <input name={field.name} defaultValue={field.value} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Hero label</label>
                  <input name="heroLabel" defaultValue={productForm.heroLabel} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Gradient from</label>
                  <input name="toneFrom" defaultValue={productForm.toneFrom} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Gradient to</label>
                  <input name="toneTo" defaultValue={productForm.toneTo} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
              </div>

              <div className="rounded-[24px] border border-line bg-[#f7fbff] p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-xl">
                    <label className="block text-sm font-semibold text-foreground">
                      Mahsulot rasmi
                    </label>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Endi rasm link bilan emas, shu panel ichidan yuklanadi. PNG, JPG, WEBP
                      yoki AVIF formatlarini qabul qilamiz.
                    </p>
                    <input
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      className="mt-4 block w-full rounded-[16px] border border-dashed border-line bg-white px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                      name="imageFile"
                      type="file"
                    />
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">
                      Maksimal hajm: 5 MB
                    </p>
                    {editingProduct ? (
                      <label className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                        <input type="checkbox" name="removeImage" className="h-4 w-4" />
                        Joriy rasmni olib tashlash
                      </label>
                    ) : null}
                  </div>

                  <div className="w-full max-w-[16rem]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      Joriy preview
                    </p>
                    <div className="mt-3 overflow-hidden rounded-[24px] border border-line bg-white p-4 shadow-[0_12px_30px_rgba(13,31,55,0.06)]">
                      {productForm.imageUrl ? (
                        <img
                          src={productForm.imageUrl}
                          alt={productForm.name || "Mahsulot rasmi"}
                          className="h-44 w-full rounded-[20px] object-contain"
                        />
                      ) : (
                        <div className="flex h-44 items-center justify-center rounded-[20px] bg-[#eef4fb] px-4 text-center text-sm text-muted">
                          Hozircha mahsulot rasmi yuklanmagan.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Yetkazish matni</label>
                <input name="delivery" defaultValue={productForm.delivery} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Highlights</label>
                  <textarea name="highlights" defaultValue={productForm.highlights} rows={5} className="w-full rounded-[16px] border border-line px-4 py-3 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Ranglar</label>
                  <textarea name="colors" defaultValue={productForm.colors} rows={5} className="w-full rounded-[16px] border border-line px-4 py-3 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Specs (`Label: Value`)</label>
                  <textarea name="specs" defaultValue={productForm.specs} rows={5} className="w-full rounded-[16px] border border-line px-4 py-3 text-sm outline-none focus:border-accent" />
                </div>
              </div>

              <div className="flex flex-wrap gap-5">
                {[
                  { name: "isActive", label: "Faol", checked: productForm.isActive },
                  { name: "isFeatured", label: "Hero product", checked: productForm.isFeatured },
                  { name: "isNewArrival", label: "Yangilik shelf'i", checked: productForm.isNewArrival },
                  { name: "isDayDeal", label: "Tovarlar kuni", checked: productForm.isDayDeal },
                ].map((item) => (
                  <label key={item.name} className="inline-flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" name={item.name} defaultChecked={item.checked} className="h-4 w-4" />
                    {item.label}
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="submit" className="inline-flex h-12 items-center justify-center rounded-[16px] bg-support px-6 text-sm font-semibold text-white transition hover:bg-[#e25a00]">
                  {editingProduct ? "Mahsulotni saqlash" : "Mahsulot qo'shish"}
                </button>
                {editingProduct ? (
                  <Link href="/admin?tab=products" className="inline-flex h-12 items-center justify-center rounded-[16px] border border-line bg-white px-6 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent">
                    Formani tozalash
                  </Link>
                ) : null}
              </div>
            </form>
          </div>

          <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Tez overview</p>
            <div className="mt-4 space-y-4">
              {dashboard.products.slice(0, 4).map((product) => (
                <div key={product.id} className="rounded-[20px] bg-[#f7fbff] p-4">
                  <p className="font-semibold text-foreground">{product.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {product.brand} • {product.category}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted">{formatMonthly(product.monthlyPrice)}</p>
                      <p className="text-lg font-semibold text-foreground">{formatSum(product.price)}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-accent">
                      {product.stock} dona
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </section>
        ) : null}

        {showProducts ? (
          <section className="mt-6 rounded-[28px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Mahsulotlar ro'yxati</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">Mavjud mahsulotlar</h2>
            </div>
            <p className="text-sm text-muted">Tahrirlash uchun mahsulot ustidagi tugmani bosing.</p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.2em] text-muted">
                  <th className="px-4">Mahsulot</th>
                  <th className="px-4">Narx</th>
                  <th className="px-4">Holat</th>
                  <th className="px-4">Flags</th>
                  <th className="px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.products.map((product) => (
                  <tr key={product.id} className="rounded-[20px] bg-[#f7fbff]">
                    <td className="rounded-l-[18px] px-4 py-4">
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <p className="mt-1 text-sm text-muted">{product.brand} • {product.category}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      <p className="font-semibold">{formatSum(product.price)}</p>
                      <p className="text-muted">{formatMonthly(product.monthlyPrice)}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      <p>{product.stock} dona</p>
                      <p className={product.isActive ? "text-[#24643a]" : "text-[#b24616]"}>
                        {product.isActive ? "Faol" : "Nofaol"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      <div className="flex flex-wrap gap-2">
                        {product.isFeatured ? <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-accent">Hero</span> : null}
                        {product.isNewArrival ? <span className="rounded-full bg-[#eff8ef] px-3 py-1 text-xs font-semibold text-[#24643a]">Yangilik</span> : null}
                        {product.isDayDeal ? <span className="rounded-full bg-[#fff1ec] px-3 py-1 text-xs font-semibold text-support">Tovarlar kuni</span> : null}
                      </div>
                    </td>
                    <td className="rounded-r-[18px] px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin?tab=products&editProduct=${product.id}#products`} className="inline-flex h-10 items-center justify-center rounded-[14px] border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent">
                          Tahrirlash
                        </Link>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="slug" value={product.slug} />
                          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-[14px] bg-[#ffefe7] px-4 text-sm font-semibold text-support transition hover:bg-[#ffe2d3]">
                            O'chirish
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </section>
        ) : null}

        {showArticles ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8" id="articles">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Yangiliklar</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
              {editingArticle ? "Yangilikni tahrirlash" : "Yangi maqola qo'shish"}
            </h2>

            <form action={saveArticleAction} className="mt-6 space-y-4">
              <input type="hidden" name="id" value={articleForm.id} />
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Sarlavha</label>
                <input name="title" defaultValue={articleForm.title} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Slug</label>
                  <input name="slug" defaultValue={articleForm.slug} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Tag</label>
                  <input name="tag" defaultValue={articleForm.tag} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Summary</label>
                <textarea name="summary" defaultValue={articleForm.summary} rows={4} className="w-full rounded-[16px] border border-line px-4 py-3 text-sm outline-none focus:border-accent" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Sana</label>
                  <input type="date" name="publishedAt" defaultValue={articleForm.publishedAt} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Tartib</label>
                  <input name="sortOrder" defaultValue={articleForm.sortOrder} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="isPublished" defaultChecked={articleForm.isPublished} />
                E'lon qilingan
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="inline-flex h-12 items-center justify-center rounded-[16px] bg-support px-6 text-sm font-semibold text-white transition hover:bg-[#e25a00]">
                  {editingArticle ? "Yangilikni saqlash" : "Yangilik qo'shish"}
                </button>
                {editingArticle ? (
                  <Link href="/admin?tab=articles" className="inline-flex h-12 items-center justify-center rounded-[16px] border border-line bg-white px-6 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent">
                    Formani tozalash
                  </Link>
                ) : null}
              </div>
            </form>
          </div>

          <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Mavjud yangiliklar</p>
            <div className="mt-6 space-y-4">
              {dashboard.articles.map((article) => (
                <div key={article.id} className="rounded-[20px] bg-[#f7fbff] p-4">
                  <p className="font-semibold text-foreground">{article.title}</p>
                  <p className="mt-1 text-sm text-muted">{article.tag} • {article.date}</p>
                  <p className="mt-3 text-sm leading-6 text-muted">{article.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/admin?tab=articles&editArticle=${article.id}#articles`} className="inline-flex h-10 items-center justify-center rounded-[14px] border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent">
                      Tahrirlash
                    </Link>
                    <form action={deleteArticleAction}>
                      <input type="hidden" name="id" value={article.id} />
                      <button type="submit" className="inline-flex h-10 items-center justify-center rounded-[14px] bg-[#ffefe7] px-4 text-sm font-semibold text-support transition hover:bg-[#ffe2d3]">
                        O'chirish
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </section>
        ) : null}

        {showPromos ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8" id="promos">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Promo bloklar</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
              {editingPromo ? "Promo blokni tahrirlash" : "Yangi promo qo'shish"}
            </h2>

            <form action={savePromoDealAction} className="mt-6 space-y-4">
              <input type="hidden" name="id" value={promoForm.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Eyebrow</label>
                  <input name="eyebrow" defaultValue={promoForm.eyebrow} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Sarlavha</label>
                  <input name="title" defaultValue={promoForm.title} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Tavsif</label>
                <textarea name="description" defaultValue={promoForm.description} rows={4} className="w-full rounded-[16px] border border-line px-4 py-3 text-sm outline-none focus:border-accent" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">CTA label</label>
                  <input name="ctaLabel" defaultValue={promoForm.ctaLabel} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">CTA link</label>
                  <input name="ctaHref" defaultValue={promoForm.ctaHref} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Background from</label>
                  <input name="backgroundFrom" defaultValue={promoForm.backgroundFrom} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Background to</label>
                  <input name="backgroundTo" defaultValue={promoForm.backgroundTo} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Tartib</label>
                  <input name="sortOrder" defaultValue={promoForm.sortOrder} className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent" />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="isActive" defaultChecked={promoForm.isActive} />
                Faol promo
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="inline-flex h-12 items-center justify-center rounded-[16px] bg-support px-6 text-sm font-semibold text-white transition hover:bg-[#e25a00]">
                  {editingPromo ? "Promo blokni saqlash" : "Promo qo'shish"}
                </button>
                {editingPromo ? (
                  <Link href="/admin?tab=promos" className="inline-flex h-12 items-center justify-center rounded-[16px] border border-line bg-white px-6 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent">
                    Formani tozalash
                  </Link>
                ) : null}
              </div>
            </form>
          </div>

          <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Mavjud promo bloklar</p>
            <div className="mt-6 space-y-4">
              {dashboard.promoDeals.map((deal) => (
                <div key={deal.id} className="rounded-[20px] border border-line p-4" style={{ background: `linear-gradient(180deg, ${deal.backgroundFrom}, ${deal.backgroundTo})` }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{deal.eyebrow}</p>
                  <p className="mt-3 text-xl font-semibold text-foreground">{deal.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{deal.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/admin?tab=promos&editPromo=${deal.id}#promos`} className="inline-flex h-10 items-center justify-center rounded-[14px] border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent">
                      Tahrirlash
                    </Link>
                    <form action={deletePromoDealAction}>
                      <input type="hidden" name="id" value={deal.id} />
                      <button type="submit" className="inline-flex h-10 items-center justify-center rounded-[14px] bg-[#ffefe7] px-4 text-sm font-semibold text-support transition hover:bg-[#ffe2d3]">
                        O'chirish
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
