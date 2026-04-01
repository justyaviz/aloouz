/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
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
  syncSeOneProductsAction,
} from "@/app/admin/actions";
import {
  DatabaseIcon,
  EditIcon,
  GridIcon,
  MegaphoneIcon,
  NewspaperIcon,
  PackageIcon,
  SparklesIcon,
  TrashIcon,
  TrendUpIcon,
} from "@/components/icons";
import { ProductVisual } from "@/components/product-visual";
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

type AdminTone = "success" | "error";

const productKinds = [
  { value: "phone", label: "Telefon" },
  { value: "tablet", label: "Planshet" },
  { value: "watch", label: "Soat" },
  { value: "audio", label: "Audio" },
  { value: "keyboard", label: "Klaviatura" },
  { value: "speaker", label: "Kalonka" },
];

const inputClassName =
  "h-12 w-full rounded-[18px] border border-[#dbe4ef] bg-[#f8fbfd] px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent focus:bg-white";
const textAreaClassName =
  "w-full rounded-[18px] border border-[#dbe4ef] bg-[#f8fbfd] px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent focus:bg-white";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

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

  if (error === "seone-auth") {
    return {
      tone: "error" as const,
      text: "SE-ONE sessiyasi ishlamayapti. Session cookie yangilanishi kerak.",
    };
  }

  if (error === "seone-config") {
    return {
      tone: "error" as const,
      text: "SE-ONE sync env hali to'liq sozlanmagan. Cookie header kiritilishi kerak.",
    };
  }

  if (error === "seone-empty") {
    return {
      tone: "error" as const,
      text: "SE-ONE sahifasi ochildi, lekin qoldiqi bor kerakli mahsulotlar topilmadi.",
    };
  }

  if (error === "seone-parse") {
    return {
      tone: "error" as const,
      text: "SE-ONE jadvali parse qilinmadi. HTML struktura yoki sessiya tekshirilishi kerak.",
    };
  }

  const successMap: Record<string, string> = {
    "product-saved": "Mahsulot muvaffaqiyatli saqlandi.",
    "product-deleted": "Mahsulot o'chirildi.",
    "article-saved": "Yangilik saqlandi.",
    "article-deleted": "Yangilik o'chirildi.",
    "promo-saved": "Promo blok saqlandi.",
    "promo-deleted": "Promo blok o'chirildi.",
    "seone-synced": "SE-ONE mahsulotlari sync qilindi va katalog yangilandi.",
  };

  if (status && successMap[status]) {
    return {
      tone: "success" as const,
      text: successMap[status],
    };
  }

  return null;
}

function loginFeatureList() {
  return [
    "SE-ONE bilan filial narxi va qoldiq sync markazi",
    "Mahsulotlar va media upload boshqaruvi",
    "Homepage yangilik va promo queue nazorati",
    "Live storefront bilan bir xil data oqimi",
    "Railway + PostgreSQL asosidagi professional foundation",
  ];
}

function statusToneClass(tone: AdminTone) {
  return tone === "success"
    ? "border-[#b9e6c7] bg-[#eefaf0] text-[#24643a]"
    : "border-[#ffd7c4] bg-[#fff4ee] text-[#b24616]";
}

export const dynamic = "force-dynamic";

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
      <main className="min-h-screen overflow-hidden bg-[#06111d] px-4 py-8 sm:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[-5%] h-72 w-72 rounded-full bg-[#1690f5]/18 blur-3xl" />
          <div className="absolute right-[-10%] top-[12%] h-72 w-72 rounded-full bg-[#54c43a]/14 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#fe6600]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="overflow-hidden p-8 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <AdminEyebrow tone="light">aloo admin suite</AdminEyebrow>
                <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Katalog, kontent va promo boshqaruvi uchun yagona control center.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">
                  Storefrontdagi mahsulotlar, yangiliklar, bannerlar va merchandising
                  flag&apos;larini tartibli, tez va professional usulda boshqarish uchun yig&apos;ildi.
                </p>
              </div>
              <div className="hidden h-14 w-14 items-center justify-center rounded-[20px] border border-white/12 bg-white/10 text-white sm:inline-flex">
                <SparklesIcon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {loginFeatureList().map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-4 text-sm text-white/86"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Realtime panel", value: "24/7" },
                { label: "Media upload", value: "DB-backed" },
                { label: "Deploy flow", value: "GitHub + Railway" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-5 py-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/58">
                    {item.label}
                  </p>
                  <p className="mt-3 font-display text-3xl font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          <PanelCard className="p-8 sm:p-10">
            <AdminEyebrow tone="accent">Kirish</AdminEyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
              Panelga xavfsiz login
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Username default holatda{" "}
              <span className="font-semibold text-foreground">{adminSetup.username}</span>.
              {adminSetup.hasCustomPassword
                ? " Parol hozir env orqali sozlangan."
                : " Agar hali o'zgartirilmagan bo'lsa, vaqtinchalik parol `alooadmin123`."}
            </p>

            {feedback ? (
              <StatusNotice className="mt-6" text={feedback.text} tone={feedback.tone} />
            ) : null}

            <form action={loginAction} className="mt-8 space-y-5">
              <Field label="Username">
                <TextInput defaultValue={adminSetup.username} name="username" type="text" />
              </Field>

              <Field label="Parol">
                <TextInput name="password" type="password" />
              </Field>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-[18px] bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                Panelga kirish
              </button>
            </form>

            <div className="mt-8 rounded-[24px] border border-line bg-[#f7fbff] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Access note
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Bu panel orqali qilingan o&apos;zgarishlar storefrontda darhol ko&apos;rinadi:
                mahsulotlar, kontent bloklar va admin ichidan yuklangan rasmlar shu oqimga ulangan.
              </p>
            </div>
          </PanelCard>
        </div>
      </main>
    );
  }

  const dashboard = await getAdminDashboardData();
  const categoryOptions = getCategoryOptions();
  const activeTab = params.tab ?? "overview";
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
    installment6: editingProduct?.installment6 ?? "",
    installment12: editingProduct?.installment12 ?? editingProduct?.monthlyPrice ?? 0,
    installment24: editingProduct?.installment24 ?? "",
    stock: editingProduct?.stock ?? 0,
    branchName: editingProduct?.branchName ?? "",
    branchStock: editingProduct?.branchStock ?? "",
    stockLabel: editingProduct?.stockLabel ?? "",
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

  const totalProducts = dashboard.products.length;
  const activeProducts = dashboard.products.filter((item) => item.isActive).length;
  const featuredProducts = dashboard.products.filter((item) => item.isFeatured).length;
  const newArrivalProducts = dashboard.products.filter((item) => item.isNewArrival).length;
  const dayDeals = dashboard.products.filter((item) => item.isDayDeal).length;
  const lowStockProducts = dashboard.products.filter((item) => item.stock <= 10);
  const uploadedImages = dashboard.products.filter((item) => item.imageUrl).length;
  const syncedProducts = dashboard.products.filter((item) => item.sourceType === "se_one_sync").length;
  const publishedArticles = dashboard.articles.filter((item) => item.isPublished).length;
  const activePromos = dashboard.promoDeals.filter((item) => item.isActive).length;

  const managementTabs = [
    {
      key: "overview",
      label: "Overview",
      description: "Operatsion ko'rinish va tezkor signal paneli",
      icon: GridIcon,
      count: null,
    },
    {
      key: "products",
      label: "Mahsulotlar",
      description: "Katalog, narx, rasm va flag boshqaruvi",
      icon: PackageIcon,
      count: totalProducts,
    },
    {
      key: "articles",
      label: "Yangiliklar",
      description: "Blog, guide va kampaniya kontenti",
      icon: NewspaperIcon,
      count: dashboard.articles.length,
    },
    {
      key: "promos",
      label: "Promo bloklar",
      description: "Banner, gradient va CTA oqimi",
      icon: MegaphoneIcon,
      count: dashboard.promoDeals.length,
    },
  ] as const;

  const currentEditCard =
    editingProduct
      ? {
          title: "Mahsulot tahrirlanmoqda",
          subtitle: editingProduct.name,
        }
      : editingArticle
        ? {
            title: "Yangilik tahrirlanmoqda",
            subtitle: editingArticle.title,
          }
        : editingPromo
          ? {
              title: "Promo tahrirlanmoqda",
              subtitle: editingPromo.title,
            }
          : null;

  return (
    <main className="min-h-screen overflow-hidden bg-[#06111d] pb-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-3%] h-72 w-72 rounded-full bg-[#1690f5]/18 blur-3xl" />
        <div className="absolute right-[-14%] top-[14%] h-80 w-80 rounded-full bg-[#54c43a]/12 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[32%] h-[28rem] w-[28rem] rounded-full bg-[#fe6600]/8 blur-3xl" />
      </div>

      <div className="shell relative py-6 lg:py-8">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
            <GlassCard className="p-6">
              <AdminEyebrow tone="light">aloo admin</AdminEyebrow>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">
                Professional storefront control center
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Mahsulotlar, kontent va promo bloklarni bir ritmda boshqarish uchun yangilangan
                workspace.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <MiniDarkStat label="Faol mahsulot" value={activeProducts.toString()} />
                <MiniDarkStat label="Media upload" value={uploadedImages.toString()} />
              </div>
            </GlassCard>

            <GlassCard className="p-3">
              <div className="space-y-2">
                {managementTabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <Link
                      key={tab.key}
                      href={`/admin?tab=${tab.key}`}
                      className={cn(
                        "flex items-start gap-3 rounded-[22px] px-4 py-4 transition",
                        activeTab === tab.key
                          ? "bg-white text-foreground shadow-[0_18px_35px_rgba(7,19,34,0.12)]"
                          : "text-white/76 hover:bg-white/8 hover:text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px]",
                          activeTab === tab.key
                            ? "bg-[#eef6ff] text-accent"
                            : "bg-white/8 text-white",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold">{tab.label}</span>
                          {tab.count !== null ? (
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                                activeTab === tab.key
                                  ? "bg-[#f0f5fb] text-foreground"
                                  : "bg-white/10 text-white/82",
                              )}
                            >
                              {tab.count}
                            </span>
                          ) : null}
                        </span>
                        <span
                          className={cn(
                            "mt-1 block text-[12px] leading-5",
                            activeTab === tab.key ? "text-muted" : "text-white/58",
                          )}
                        >
                          {tab.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-[16px]",
                    dashboard.databaseEnabled ? "bg-[#0f6b43] text-white" : "bg-support text-white",
                  )}
                >
                  <DatabaseIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Tizim holati</p>
                  <p className="text-xs text-white/58">
                    {dashboard.databaseEnabled ? "Database ulangan" : "Fallback rejim"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-white/76">
                <SidebarSignal
                  label="Published news"
                  value={`${publishedArticles}/${dashboard.articles.length}`}
                />
                <SidebarSignal
                  label="Faol promo"
                  value={`${activePromos}/${dashboard.promoDeals.length}`}
                />
                <SidebarSignal
                  label="Low stock"
                  value={lowStockProducts.length.toString()}
                />
              </div>
            </GlassCard>

            {currentEditCard ? (
              <GlassCard className="p-6">
                <AdminEyebrow tone="light">Tahrirlash</AdminEyebrow>
                <p className="mt-3 text-sm font-semibold text-white">{currentEditCard.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/68">{currentEditCard.subtitle}</p>
              </GlassCard>
            ) : null}
          </aside>

          <div className="space-y-6">
            <GlassCard className="overflow-hidden p-6 sm:p-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <AdminEyebrow tone="light">Workspace</AdminEyebrow>
                  <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white">
                    Storefront boshqaruv paneli
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
                    Katalog, blog va promo oqimi endi alohida workspacelarga bo'lingan.
                    Professional ritmda ishlash uchun statistika, form va list qatlamlari
                    ancha tartibli joylashtirildi.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="inline-flex h-12 items-center justify-center rounded-[18px] border border-white/12 bg-white/8 px-5 text-sm font-semibold text-white transition hover:bg-white/14"
                  >
                    Saytga qaytish
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="inline-flex h-12 items-center justify-center rounded-[18px] bg-support px-5 text-sm font-semibold text-white transition hover:bg-[#e25a00]"
                    >
                      Chiqish
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                {[
                  {
                    label: "Mahsulotlar",
                    value: totalProducts.toString(),
                    note: `${syncedProducts} ta sync, ${dayDeals} ta day deal`,
                    icon: PackageIcon,
                  },
                  {
                    label: "Yangiliklar",
                    value: dashboard.articles.length.toString(),
                    note: `${publishedArticles} ta published`,
                    icon: NewspaperIcon,
                  },
                  {
                    label: "Promo bloklar",
                    value: dashboard.promoDeals.length.toString(),
                    note: `${activePromos} ta faol`,
                    icon: MegaphoneIcon,
                  },
                  {
                    label: "O'sish signali",
                    value: `${newArrivalProducts}`,
                    note: "Yangilik shelf mahsulotlari",
                    icon: TrendUpIcon,
                  },
                ].map((card) => {
                  const Icon = card.icon;

                  return (
                    <div
                      key={card.label}
                      className="rounded-[24px] border border-white/10 bg-white/6 p-5 text-white"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white/72">{card.label}</p>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10 text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <p className="mt-4 font-display text-4xl font-semibold">{card.value}</p>
                      <p className="mt-2 text-sm text-white/62">{card.note}</p>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {!dashboard.databaseEnabled ? (
              <StatusNotice
                text="Database hali ulanmagan. Panel fallback data ko'rsatmoqda, lekin saqlash uchun Railway PostgreSQL kerak."
                tone="error"
              />
            ) : null}

            {feedback ? <StatusNotice text={feedback.text} tone={feedback.tone} /> : null}

            {activeTab === "overview" ? (
              <OverviewWorkspace
                activePromos={activePromos}
                dashboard={dashboard}
                lowStockProducts={lowStockProducts}
                syncedProducts={syncedProducts}
                uploadedImages={uploadedImages}
              />
            ) : null}

            {activeTab === "products" ? (
              <ProductsWorkspace
                categoryOptions={categoryOptions}
                dashboard={dashboard}
                dayDeals={dayDeals}
                editingProduct={editingProduct}
                featuredProducts={featuredProducts}
                lowStockProducts={lowStockProducts}
                newArrivalProducts={newArrivalProducts}
                productForm={productForm}
                syncedProducts={syncedProducts}
              />
            ) : null}

            {activeTab === "articles" ? (
              <ArticlesWorkspace
                articleForm={articleForm}
                dashboard={dashboard}
                editingArticle={editingArticle}
              />
            ) : null}

            {activeTab === "promos" ? (
              <PromosWorkspace
                dashboard={dashboard}
                editingPromo={editingPromo}
                promoForm={promoForm}
              />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

function OverviewWorkspace({
  activePromos,
  dashboard,
  lowStockProducts,
  syncedProducts,
  uploadedImages,
}: {
  activePromos: number;
  dashboard: Awaited<ReturnType<typeof getAdminDashboardData>>;
  lowStockProducts: Awaited<ReturnType<typeof getAdminDashboardData>>["products"];
  syncedProducts: number;
  uploadedImages: number;
}) {
  const managementCards = [
    {
      key: "products",
      title: "Katalog boshqaruvi",
      description: "Narx, stock, rasm upload va merchandising flag'lari shu workspace ichida.",
      href: "/admin?tab=products#products",
      count: `${dashboard.products.length} ta mahsulot`,
      accentClass: "from-[#eaf4ff] to-[#ffffff]",
    },
    {
      key: "articles",
      title: "Kontent va blog",
      description: "Yangiliklar, guide va marketing maqolalarini published queue bilan boshqaring.",
      href: "/admin?tab=articles#articles",
      count: `${dashboard.articles.length} ta maqola`,
      accentClass: "from-[#eef8ef] to-[#ffffff]",
    },
    {
      key: "promos",
      title: "Promo va bannerlar",
      description: "Gradient, CTA va homepage merchandising bloklarini bir joydan nazorat qiling.",
      href: "/admin?tab=promos#promos",
      count: `${dashboard.promoDeals.length} ta promo`,
      accentClass: "from-[#fff4eb] to-[#ffffff]",
    },
  ];

  return (
    <>
      <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <PanelCard className="p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <AdminEyebrow tone="accent">Control map</AdminEyebrow>
              <h3 className="mt-3 font-display text-3xl font-semibold text-foreground">
                Bo'limlar bo'yicha tezkor kirish
              </h3>
            </div>
            <p className="text-sm text-muted">Ishni kerakli workspace'dan boshlang.</p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {managementCards.map((card) => (
              <Link
                key={card.key}
                href={card.href}
                className={`rounded-[26px] border border-line bg-[linear-gradient(180deg,var(--tw-gradient-from),var(--tw-gradient-to))] p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(13,31,55,0.08)] ${card.accentClass}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  {card.count}
                </p>
                <h4 className="mt-3 text-xl font-semibold text-foreground">{card.title}</h4>
                <p className="mt-3 text-sm leading-7 text-muted">{card.description}</p>
                <p className="mt-5 text-sm font-semibold text-accent">Workspace'ni ochish</p>
              </Link>
            ))}
          </div>
        </PanelCard>

        <PanelCard className="p-6 sm:p-8">
          <AdminEyebrow tone="accent">Signal panel</AdminEyebrow>
          <h3 className="mt-3 font-display text-3xl font-semibold text-foreground">
            Operatsion status
          </h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Low stock",
                value: lowStockProducts.length.toString(),
                note: "10 donadan kam qolgan mahsulotlar",
              },
              {
                label: "Uploaded visuals",
                value: uploadedImages.toString(),
                note: "Admin orqali rasm yuklangan productlar",
              },
              {
                label: "SE-ONE sync",
                value: syncedProducts.toString(),
                note:
                  dashboard.syncState?.lastSucceededAt
                    ? `Oxirgi muvaffaqiyatli sync: ${dashboard.syncState.lastSucceededAt}`
                    : "Hali live sync bajarilmagan",
              },
              {
                label: "Published news",
                value: dashboard.articles.filter((item) => item.isPublished).length.toString(),
                note: "Ko'rinayotgan kontent birliklari",
              },
              {
                label: "Faol promo",
                value: activePromos.toString(),
                note: "Homepage'dagi ishlayotgan bannerlar",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] bg-[#f7fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {item.label}
                </p>
                <p className="mt-3 font-display text-3xl font-semibold text-foreground">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.note}</p>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <PanelCard className="p-6 sm:p-8">
          <SectionHeader
            eyebrow="Mahsulotlar"
            title="So'nggi katalog birikmalari"
            description="Tez ko'rish uchun so'nggi mahsulotlar."
          />
          <div className="mt-6 space-y-3">
            {dashboard.products.slice(0, 5).map((product) => (
              <CompactListItem
                key={product.id}
                href={`/admin?tab=products&editProduct=${product.id}#products`}
                title={product.name}
                subtitle={`${product.brand} • ${formatMonthly(product.monthlyPrice)}`}
                meta={formatSum(product.price)}
              />
            ))}
          </div>
        </PanelCard>

        <PanelCard className="p-6 sm:p-8">
          <SectionHeader
            eyebrow="Yangiliklar"
            title="Kontent navbati"
            description="Blog va yangiliklar ketma-ketligi."
          />
          <div className="mt-6 space-y-3">
            {dashboard.articles.slice(0, 5).map((article) => (
              <CompactListItem
                key={article.id}
                href={`/admin?tab=articles&editArticle=${article.id}#articles`}
                title={article.title}
                subtitle={`${article.tag} • ${article.date}`}
                meta={article.isPublished ? "Published" : "Draft"}
              />
            ))}
          </div>
        </PanelCard>

        <PanelCard className="p-6 sm:p-8">
          <SectionHeader
            eyebrow="Promo"
            title="Banner va CTA navbati"
            description="Homepage merchandising bloklari."
          />
          <div className="mt-6 space-y-3">
            {dashboard.promoDeals.slice(0, 5).map((promo) => (
              <CompactListItem
                key={promo.id}
                href={`/admin?tab=promos&editPromo=${promo.id}#promos`}
                title={promo.title}
                subtitle={promo.eyebrow}
                meta={promo.isActive ? "Faol" : "Pausa"}
              />
            ))}
          </div>
        </PanelCard>
      </div>
    </>
  );
}

function ProductsWorkspace({
  categoryOptions,
  dashboard,
  dayDeals,
  editingProduct,
  featuredProducts,
  lowStockProducts,
  newArrivalProducts,
  productForm,
  syncedProducts,
}: {
  categoryOptions: ReturnType<typeof getCategoryOptions>;
  dashboard: Awaited<ReturnType<typeof getAdminDashboardData>>;
  dayDeals: number;
  editingProduct: Awaited<ReturnType<typeof getAdminDashboardData>>["products"][number] | undefined;
  featuredProducts: number;
  lowStockProducts: Awaited<ReturnType<typeof getAdminDashboardData>>["products"];
  newArrivalProducts: number;
  syncedProducts: number;
  productForm: {
    id: string;
    previousSlug: string;
    name: string;
    slug: string;
    sku: string;
    brand: string;
    categorySlug: string;
    kind: string;
    shortDescription: string;
    description: string;
    price: number | string;
    oldPrice: number | string;
    monthlyPrice: number | string;
    installment6: number | string;
    installment12: number | string;
    installment24: number | string;
    stock: number | string;
    branchName: string;
    branchStock: number | string;
    stockLabel: string;
    badge: string;
    rating: number | string;
    reviews: number | string;
    heroLabel: string;
    delivery: string;
    toneFrom: string;
    toneTo: string;
    imageUrl: string;
    highlights: string;
    colors: string;
    specs: string;
    isActive: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
    isDayDeal: boolean;
    sortOrder: number | string;
  };
}) {
  const previewProduct = editingProduct ?? dashboard.products[0];
  const previewKind = productForm.kind as
    | "phone"
    | "tablet"
    | "watch"
    | "audio"
    | "keyboard"
    | "speaker";
  const checklist = [
    { label: "Nomi va brend tayyor", done: Boolean(productForm.name && productForm.brand) },
    { label: "Narx va bo'lib to'lash kiritilgan", done: Boolean(productForm.price && productForm.monthlyPrice) },
    { label: "Filial va qoldiq kiritilgan", done: Boolean(productForm.branchName && productForm.stock) },
    { label: "Mahsulot rasmi biriktirilgan", done: Boolean(productForm.imageUrl || editingProduct?.imageUrl) },
    { label: "Highlights va specs tayyor", done: Boolean(productForm.highlights && productForm.specs) },
  ];

  return (
    <>
      <PanelCard className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <SectionHeader
              eyebrow="SE-ONE sync"
              title="Filial narxlari va qoldiqni katalogga ulash"
              description="Faqat qoldiqi bor smartfon, aqlli soat, airpods/quloqchin, klaviatura va kalonkalar olinadi. Filiallar ichidan eng arzon mavjud variant tanlanadi, `sotuv narx` ustiga chiziladi, `naqd` narx asosiy ko'rsatiladi."
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricMini
                label="Sync mahsulotlar"
                value={syncedProducts.toString()}
                note="Katalogda ishlayotgan live birliklar"
              />
              <MetricMini
                label="Oxirgi holat"
                value={dashboard.syncState?.status ?? "idle"}
                note={dashboard.syncState?.lastFinishedAt ?? "Hali run bo'lmagan"}
              />
              <MetricMini
                label="Import"
                value={dashboard.syncState?.lastSummary?.importedProducts?.toString() ?? "0"}
                note="Oxirgi syncdagi kirgan mahsulotlar"
              />
              <MetricMini
                label="Offers"
                value={dashboard.syncState?.lastSummary?.offersScanned?.toString() ?? "0"}
                note="SE-ONE tomondan ko'rilgan qatorlar"
              />
            </div>

            <div className="mt-5 space-y-2 text-sm text-muted">
              <p>
                Session env tayyor bo'lsa, sync demo mahsulotlarni o'chirib, katalogni SE-ONE
                ma'lumotlari bilan almashtiradi.
              </p>
              <p>
                6/12/24 oy summalari 1000 so'mga yaxlitlanadi: 989 375 dan 989 000 ga,
                989 647 dan 990 000 ga.
              </p>
              {dashboard.syncState?.lastError ? (
                <p className="font-medium text-support">{dashboard.syncState.lastError}</p>
              ) : null}
            </div>
          </div>

          <div className="w-full max-w-xl rounded-[26px] border border-line bg-[#f7fbff] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Sync controls
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Tugma katalogni to'liq live source bilan yangilaydi. Session ishlamasa, panel
              xatoni shu yerning o'zida ko'rsatadi.
            </p>

            <form action={syncSeOneProductsAction} className="mt-5 space-y-4">
              <label className="flex items-start gap-3 rounded-[20px] border border-line bg-white px-4 py-4">
                <input className="mt-1 h-4 w-4" defaultChecked name="replaceCatalog" type="checkbox" />
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    Eski demo katalogni almashtirish
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted">
                    Sync muvaffaqiyatli bo'lsa manual/demo productlar o'chirilib, faqat live
                    katalog qoladi.
                  </span>
                </span>
              </label>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-[18px] bg-catalog px-6 text-sm font-semibold text-white transition hover:bg-catalog-strong"
              >
                Hozir sync qilish
              </button>
            </form>
          </div>
        </div>
      </PanelCard>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <PanelCard className="p-6 sm:p-8" id="products">
          <SectionHeader
            eyebrow="Mahsulot workspace"
            title={editingProduct ? "Mahsulotni professional tartibda tahrirlash" : "Yangi mahsulot qo'shish"}
            description="Katalog, narx, rasm upload, merchandising flag va product detail ma'lumotlari shu form ichida boshqariladi."
          />

          <form
            action={saveProductAction}
            className="mt-8 space-y-6"
            encType="multipart/form-data"
          >
            <input type="hidden" name="id" value={productForm.id} />
            <input type="hidden" name="previousSlug" value={productForm.previousSlug} />

            <FormGroup title="Asosiy ma'lumotlar" description="Slug, SKU, tur va kategoriya shu blokda.">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Nomi">
                  <TextInput defaultValue={productForm.name} name="name" />
                </Field>
                <Field label="Slug">
                  <TextInput defaultValue={productForm.slug} name="slug" />
                </Field>
                <Field label="SKU">
                  <TextInput defaultValue={productForm.sku} name="sku" />
                </Field>
                <Field label="Brend">
                  <TextInput defaultValue={productForm.brand} name="brand" />
                </Field>
                <Field label="Kategoriya">
                  <SelectInput defaultValue={productForm.categorySlug} name="categorySlug">
                    {categoryOptions.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Turi">
                  <SelectInput defaultValue={productForm.kind} name="kind">
                    {productKinds.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
            </FormGroup>

            <FormGroup title="Tavsiflar" description="Kartochka va detail sahifada ko'rinadigan matnlar.">
              <div className="grid gap-4">
                <Field label="Qisqa tavsif">
                  <TextArea defaultValue={productForm.shortDescription} name="shortDescription" rows={3} />
                </Field>
                <Field label="Batafsil tavsif">
                  <TextArea defaultValue={productForm.description} name="description" rows={5} />
                </Field>
              </div>
            </FormGroup>

            <FormGroup title="Savdo ko'rsatkichlari" description="Narx, stock, reyting va merchandising tartibi.">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { name: "price", label: "Narxi", value: productForm.price },
                  { name: "oldPrice", label: "Eski narx", value: productForm.oldPrice },
                  { name: "monthlyPrice", label: "Asosiy oylik", value: productForm.monthlyPrice },
                  { name: "installment6", label: "6 oy", value: productForm.installment6 },
                  { name: "installment12", label: "12 oy", value: productForm.installment12 },
                  { name: "installment24", label: "24 oy", value: productForm.installment24 },
                  { name: "stock", label: "Sklad", value: productForm.stock },
                  { name: "branchName", label: "Filial", value: productForm.branchName },
                  { name: "branchStock", label: "Filial qoldig'i", value: productForm.branchStock },
                  { name: "stockLabel", label: "Stock label", value: productForm.stockLabel },
                  { name: "rating", label: "Reyting", value: productForm.rating },
                  { name: "reviews", label: "Sharhlar soni", value: productForm.reviews },
                  { name: "sortOrder", label: "Tartib", value: productForm.sortOrder },
                  { name: "badge", label: "Badge", value: productForm.badge },
                ].map((field) => (
                  <Field key={field.name} label={field.label}>
                    <TextInput defaultValue={field.value} name={field.name} />
                  </Field>
                ))}
              </div>
            </FormGroup>

            <FormGroup title="Vizual va delivery" description="Hero label, gradient, upload va logistika matni.">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Hero label">
                  <TextInput defaultValue={productForm.heroLabel} name="heroLabel" />
                </Field>
                <Field label="Gradient from">
                  <TextInput defaultValue={productForm.toneFrom} name="toneFrom" />
                </Field>
                <Field label="Gradient to">
                  <TextInput defaultValue={productForm.toneTo} name="toneTo" />
                </Field>
                <Field label="Yetkazish matni">
                  <TextInput defaultValue={productForm.delivery} name="delivery" />
                </Field>
              </div>

              <div className="mt-5 rounded-[24px] border border-line bg-[#f7fbff] p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-xl">
                    <p className="text-sm font-semibold text-foreground">Mahsulot rasmi</p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Endi rasm link bilan emas, shu panel ichidan yuklanadi. Tavsiya: tiniq
                      fonli PNG yoki WEBP, 5 MB gacha.
                    </p>
                    <input
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      className="mt-4 block w-full rounded-[18px] border border-dashed border-[#c9d7e6] bg-white px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                      name="imageFile"
                      type="file"
                    />
                    {editingProduct ? (
                      <label className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                        <input className="h-4 w-4" name="removeImage" type="checkbox" />
                        Joriy rasmni olib tashlash
                      </label>
                    ) : null}
                  </div>

                  <div className="w-full max-w-[16rem]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      Preview
                    </p>
                    <div className="mt-3 overflow-hidden rounded-[24px] border border-line bg-white p-4">
                      {productForm.imageUrl ? (
                        <img
                          src={productForm.imageUrl}
                          alt={productForm.name || "Mahsulot rasmi"}
                          className="h-44 w-full rounded-[18px] object-contain"
                        />
                      ) : (
                        <div className="flex h-44 items-center justify-center rounded-[18px] bg-[#eef4fb] px-4 text-center text-sm text-muted">
                          Hozircha mahsulot rasmi yuklanmagan.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FormGroup>

            <FormGroup title="Detail tarkibi" description="Highlights, ranglar va specs ro'yxati.">
              <div className="grid gap-4 lg:grid-cols-3">
                <Field label="Highlights">
                  <TextArea defaultValue={productForm.highlights} name="highlights" rows={6} />
                </Field>
                <Field label="Ranglar">
                  <TextArea defaultValue={productForm.colors} name="colors" rows={6} />
                </Field>
                <Field label="Specs (`Label: Value`)">
                  <TextArea defaultValue={productForm.specs} name="specs" rows={6} />
                </Field>
              </div>
            </FormGroup>

            <FormGroup title="Merchandising flag'lari" description="Homepage va shelf ko'rinishini belgilash.">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    name: "isActive",
                    label: "Faol",
                    description: "Storefrontda ko'rinadi",
                    checked: productForm.isActive,
                  },
                  {
                    name: "isFeatured",
                    label: "Hero product",
                    description: "Bosh sahifa banneriga nomzod",
                    checked: productForm.isFeatured,
                  },
                  {
                    name: "isNewArrival",
                    label: "Yangilik shelf'i",
                    description: "Yangi kelganlar blokiga tushadi",
                    checked: productForm.isNewArrival,
                  },
                  {
                    name: "isDayDeal",
                    label: "Tovarlar kuni",
                    description: "Kunlik deal spotlight'i",
                    checked: productForm.isDayDeal,
                  },
                ].map((item) => (
                  <label
                    key={item.name}
                    className="flex items-start gap-3 rounded-[20px] border border-line bg-[#f8fbfd] px-4 py-4"
                  >
                    <input
                      className="mt-0.5 h-4 w-4"
                      defaultChecked={item.checked}
                      name={item.name}
                      type="checkbox"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted">
                        {item.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </FormGroup>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-[18px] bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                {editingProduct ? "Mahsulotni saqlash" : "Mahsulot qo'shish"}
              </button>
              {editingProduct ? (
                <Link
                  href="/admin?tab=products"
                  className="inline-flex h-12 items-center justify-center rounded-[18px] border border-line bg-white px-6 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
                >
                  Formani tozalash
                </Link>
              ) : null}
            </div>
          </form>
        </PanelCard>

        <div className="space-y-6">
          <PanelCard className="p-6">
            <SectionHeader
              eyebrow="Live preview"
              title="Mahsulot kartasi ko'rinishi"
              description="Storefront stilidagi tezkor preview."
            />

            <div className="mt-5">
              <ProductVisual
                compact
                kind={previewKind ?? previewProduct?.kind ?? "phone"}
                label={productForm.heroLabel || previewProduct?.heroLabel || "Original"}
                toneFrom={productForm.toneFrom}
                toneTo={productForm.toneTo}
                imageUrl={productForm.imageUrl || previewProduct?.imageUrl}
                imageAlt={productForm.name || previewProduct?.name || "Mahsulot"}
              />
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                {productForm.name || previewProduct?.name || "Mahsulot nomi"}
              </p>
              <p className="text-sm text-muted">
                {productForm.brand || previewProduct?.brand || "Brend"} •{" "}
                {productForm.stock || previewProduct?.stock || 0} dona
              </p>
              <p className="text-lg font-semibold text-foreground">
                {formatSum(Number(productForm.price || previewProduct?.price || 0))}
              </p>
              <p className="text-sm text-accent">
                {formatMonthly(
                  Number(
                    productForm.installment12 ||
                      productForm.monthlyPrice ||
                      previewProduct?.installment12 ||
                      previewProduct?.monthlyPrice ||
                      0,
                  ),
                )}
              </p>
              <p className="text-sm text-muted">
                {productForm.stockLabel ||
                  previewProduct?.stockLabel ||
                  `${productForm.stock || previewProduct?.stock || 0} dona mavjud`}
              </p>
            </div>
          </PanelCard>

          <PanelCard className="p-6">
            <SectionHeader
              eyebrow="Checklist"
              title="Saqlashdan oldingi tekshiruv"
              description="Operator uchun tezkor sanity-check."
            />
            <div className="mt-5 space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "rounded-[18px] px-4 py-4 text-sm",
                    item.done ? "bg-[#eefaf0] text-[#24643a]" : "bg-[#fff4ee] text-[#a25320]",
                  )}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard className="p-6">
            <SectionHeader
              eyebrow="Signal panel"
              title="Katalog snapshot"
              description="Merchandising bo'yicha tezkor ko'rsatkichlar."
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
              {[
                { label: "Hero product", value: featuredProducts },
                { label: "Yangilik shelf'i", value: newArrivalProducts },
                { label: "Kunlik deal", value: dayDeals },
                { label: "Low stock", value: lowStockProducts.length },
                { label: "SE-ONE sync", value: syncedProducts },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] bg-[#f7fbff] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    {item.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </PanelCard>
        </div>
      </div>

      <PanelCard className="p-6 sm:p-8">
        <SectionHeader
          eyebrow="Mahsulotlar ro'yxati"
          title="Mavjud katalog birliklari"
          description="Rasm preview, stock holati va merch flag'lari bilan boyitilgan ro'yxat."
        />

        <div className="mt-6 space-y-3">
          {dashboard.products.map((product) => (
            <EntityRow
              key={product.id}
              actions={
                <>
                  <Link
                    href={`/admin?tab=products&editProduct=${product.id}#products`}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
                  >
                    <EditIcon className="h-4 w-4" />
                    Tahrirlash
                  </Link>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="slug" value={product.slug} />
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] bg-[#fff2ec] px-4 text-sm font-semibold text-support transition hover:bg-[#ffe5d8]"
                    >
                      <TrashIcon className="h-4 w-4" />
                      O'chirish
                    </button>
                  </form>
                </>
              }
              badges={[
                product.sourceType === "se_one_sync"
                  ? { label: "SE-ONE", className: "bg-[#eefaf0] text-[#24643a]" }
                  : { label: "Manual", className: "bg-[#f4f7fb] text-muted" },
                product.isFeatured ? { label: "Hero", className: "bg-[#eef6ff] text-accent" } : null,
                product.isNewArrival
                  ? { label: "Yangilik", className: "bg-[#eefaf0] text-[#24643a]" }
                  : null,
                product.isDayDeal
                  ? { label: "Day deal", className: "bg-[#fff4ee] text-support" }
                  : null,
                product.isActive
                  ? { label: "Faol", className: "bg-[#eff8ef] text-[#24643a]" }
                  : { label: "Pausa", className: "bg-[#f2f4f7] text-muted" },
              ]}
              media={
                <MediaThumb
                  imageUrl={product.imageUrl}
                  label={product.name}
                  toneFrom={product.toneFrom}
                  toneTo={product.toneTo}
                />
              }
              meta={
                <>
                  <div>
                    <p className="text-sm text-muted">Narx</p>
                    <p className="mt-1 font-semibold text-foreground">{formatSum(product.price)}</p>
                    <p className="text-sm text-accent">
                      {formatMonthly(product.installment12 ?? product.monthlyPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Holat</p>
                    <p className="mt-1 font-semibold text-foreground">
                      {product.stockLabel || `${product.stock} dona`}
                    </p>
                    <p className="text-sm text-muted">{product.branchName || product.brand}</p>
                  </div>
                </>
              }
              subtitle={`${product.brand} • ${product.category}`}
              title={product.name}
            />
          ))}
        </div>
      </PanelCard>
    </>
  );
}

function ArticlesWorkspace({
  articleForm,
  dashboard,
  editingArticle,
}: {
  articleForm: {
    id: string;
    title: string;
    slug: string;
    tag: string;
    summary: string;
    publishedAt: string;
    isPublished: boolean;
    sortOrder: number | string;
  };
  dashboard: Awaited<ReturnType<typeof getAdminDashboardData>>;
  editingArticle: Awaited<ReturnType<typeof getAdminDashboardData>>["articles"][number] | undefined;
}) {
  return (
    <>
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.05fr)_340px]">
        <PanelCard className="p-6 sm:p-8" id="articles">
          <SectionHeader
            eyebrow="Content workspace"
            title={editingArticle ? "Yangilik maqolasini tahrirlash" : "Yangi maqola qo'shish"}
            description="Blog va content marketing oqimi uchun sarlavha, tag, sana va summary shu yerda boshqariladi."
          />

          <form action={saveArticleAction} className="mt-8 space-y-6">
            <input type="hidden" name="id" value={articleForm.id} />

            <FormGroup title="Kontent ma'lumotlari" description="Asosiy metadata va summary.">
              <div className="grid gap-4">
                <Field label="Sarlavha">
                  <TextInput defaultValue={articleForm.title} name="title" />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Slug">
                    <TextInput defaultValue={articleForm.slug} name="slug" />
                  </Field>
                  <Field label="Tag">
                    <TextInput defaultValue={articleForm.tag} name="tag" />
                  </Field>
                </div>
                <Field label="Summary">
                  <TextArea defaultValue={articleForm.summary} name="summary" rows={6} />
                </Field>
              </div>
            </FormGroup>

            <FormGroup title="Publish sozlamalari" description="Sana, tartib va ko'rinish holati.">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Sana">
                  <TextInput defaultValue={articleForm.publishedAt} name="publishedAt" type="date" />
                </Field>
                <Field label="Tartib">
                  <TextInput defaultValue={articleForm.sortOrder} name="sortOrder" />
                </Field>
              </div>

              <div className="mt-4">
                <label className="flex items-start gap-3 rounded-[20px] border border-line bg-[#f8fbfd] px-4 py-4">
                  <input className="mt-0.5 h-4 w-4" defaultChecked={articleForm.isPublished} name="isPublished" type="checkbox" />
                  <span>
                    <span className="block text-sm font-semibold text-foreground">Published</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">
                      Bosh sahifadagi blog blokida ko'rinishini yoqadi.
                    </span>
                  </span>
                </label>
              </div>
            </FormGroup>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-[18px] bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                {editingArticle ? "Yangilikni saqlash" : "Yangilik qo'shish"}
              </button>
              {editingArticle ? (
                <Link
                  href="/admin?tab=articles"
                  className="inline-flex h-12 items-center justify-center rounded-[18px] border border-line bg-white px-6 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
                >
                  Formani tozalash
                </Link>
              ) : null}
            </div>
          </form>
        </PanelCard>

        <div className="space-y-6">
          <PanelCard className="p-6">
            <SectionHeader
              eyebrow="Preview"
              title="Kontent preview"
              description="Storefront blog blokidagi umumiy ko'rinish."
            />
            <div className="mt-5 rounded-[24px] border border-line bg-[#f7fbff] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                {articleForm.tag || "Yangilik"}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
                {articleForm.title || "Sarlavha shu yerda ko'rinadi"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {articleForm.summary || "Summary shu yerda ko'rinadi."}
              </p>
              <p className="mt-4 text-sm text-muted">
                {articleForm.publishedAt || new Date().toISOString().slice(0, 10)}
              </p>
            </div>
          </PanelCard>

          <PanelCard className="p-6">
            <SectionHeader
              eyebrow="Queue"
              title="Kontent ritmi"
              description="Published oqim bo'yicha tez ko'rsatkichlar."
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
              <MetricMini label="Jami maqola" value={dashboard.articles.length.toString()} />
              <MetricMini
                label="Published"
                value={dashboard.articles.filter((item) => item.isPublished).length.toString()}
              />
            </div>
          </PanelCard>
        </div>
      </div>

      <PanelCard className="p-6 sm:p-8">
        <SectionHeader
          eyebrow="Mavjud yangiliklar"
          title="Kontent ro'yxati"
          description="Blog va news oqimini shu blokdan nazorat qiling."
        />

        <div className="mt-6 space-y-3">
          {dashboard.articles.map((article) => (
            <EntityRow
              key={article.id}
              actions={
                <>
                  <Link
                    href={`/admin?tab=articles&editArticle=${article.id}#articles`}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
                  >
                    <EditIcon className="h-4 w-4" />
                    Tahrirlash
                  </Link>
                  <form action={deleteArticleAction}>
                    <input type="hidden" name="id" value={article.id} />
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] bg-[#fff2ec] px-4 text-sm font-semibold text-support transition hover:bg-[#ffe5d8]"
                    >
                      <TrashIcon className="h-4 w-4" />
                      O'chirish
                    </button>
                  </form>
                </>
              }
              badges={[
                {
                  label: article.isPublished ? "Published" : "Draft",
                  className: article.isPublished
                    ? "bg-[#eefaf0] text-[#24643a]"
                    : "bg-[#f2f4f7] text-muted",
                },
                { label: article.tag, className: "bg-[#eef6ff] text-accent" },
              ]}
              media={
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#eef6ff] text-accent">
                  <NewspaperIcon className="h-6 w-6" />
                </div>
              }
              meta={
                <div>
                  <p className="text-sm text-muted">Sana</p>
                  <p className="mt-1 font-semibold text-foreground">{article.date}</p>
                </div>
              }
              subtitle={article.summary ?? "Summary hali qo'shilmagan."}
              title={article.title}
            />
          ))}
        </div>
      </PanelCard>
    </>
  );
}

function PromosWorkspace({
  dashboard,
  editingPromo,
  promoForm,
}: {
  dashboard: Awaited<ReturnType<typeof getAdminDashboardData>>;
  editingPromo: Awaited<ReturnType<typeof getAdminDashboardData>>["promoDeals"][number] | undefined;
  promoForm: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    backgroundFrom: string;
    backgroundTo: string;
    isActive: boolean;
    sortOrder: number | string;
  };
}) {
  return (
    <>
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.02fr)_360px]">
        <PanelCard className="p-6 sm:p-8" id="promos">
          <SectionHeader
            eyebrow="Promo workspace"
            title={editingPromo ? "Promo blokni tahrirlash" : "Yangi promo qo'shish"}
            description="Homepage banner va merchandising CTA bloklarini shu joydan boshqaring."
          />

          <form action={savePromoDealAction} className="mt-8 space-y-6">
            <input type="hidden" name="id" value={promoForm.id} />

            <FormGroup title="Promo ma'lumotlari" description="Eyebrow, title va tavsif.">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Eyebrow">
                  <TextInput defaultValue={promoForm.eyebrow} name="eyebrow" />
                </Field>
                <Field label="Sarlavha">
                  <TextInput defaultValue={promoForm.title} name="title" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Tavsif">
                  <TextArea defaultValue={promoForm.description} name="description" rows={5} />
                </Field>
              </div>
            </FormGroup>

            <FormGroup title="CTA va visual" description="Button matni, link va gradient.">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="CTA label">
                  <TextInput defaultValue={promoForm.ctaLabel} name="ctaLabel" />
                </Field>
                <Field label="CTA link">
                  <TextInput defaultValue={promoForm.ctaHref} name="ctaHref" />
                </Field>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Field label="Background from">
                  <TextInput defaultValue={promoForm.backgroundFrom} name="backgroundFrom" />
                </Field>
                <Field label="Background to">
                  <TextInput defaultValue={promoForm.backgroundTo} name="backgroundTo" />
                </Field>
                <Field label="Tartib">
                  <TextInput defaultValue={promoForm.sortOrder} name="sortOrder" />
                </Field>
              </div>

              <div className="mt-4">
                <label className="flex items-start gap-3 rounded-[20px] border border-line bg-[#f8fbfd] px-4 py-4">
                  <input className="mt-0.5 h-4 w-4" defaultChecked={promoForm.isActive} name="isActive" type="checkbox" />
                  <span>
                    <span className="block text-sm font-semibold text-foreground">Faol promo</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">
                      Bosh sahifada ko'rinishini yoqadi.
                    </span>
                  </span>
                </label>
              </div>
            </FormGroup>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-[18px] bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                {editingPromo ? "Promo blokni saqlash" : "Promo qo'shish"}
              </button>
              {editingPromo ? (
                <Link
                  href="/admin?tab=promos"
                  className="inline-flex h-12 items-center justify-center rounded-[18px] border border-line bg-white px-6 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
                >
                  Formani tozalash
                </Link>
              ) : null}
            </div>
          </form>
        </PanelCard>

        <div className="space-y-6">
          <PanelCard className="p-6">
            <SectionHeader
              eyebrow="Preview"
              title="Promo blok ko'rinishi"
              description="Gradient va CTA bir qarashda."
            />
            <div
              className="mt-5 rounded-[26px] border border-line p-5"
              style={{
                background: `linear-gradient(180deg, ${promoForm.backgroundFrom} 0%, ${promoForm.backgroundTo} 100%)`,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                {promoForm.eyebrow || "Aksiya"}
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-foreground">
                {promoForm.title || "Promo sarlavhasi"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {promoForm.description || "Promo tavsifi shu yerda ko'rinadi."}
              </p>
              <p className="mt-5 text-sm font-semibold text-accent">
                {promoForm.ctaLabel || "Ko'rish"}
              </p>
            </div>
          </PanelCard>

          <PanelCard className="p-6">
            <SectionHeader
              eyebrow="Promo ritmi"
              title="Queue ko'rsatkichlari"
              description="Homepage merchandising bo'yicha signal."
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
              <MetricMini label="Jami promo" value={dashboard.promoDeals.length.toString()} />
              <MetricMini
                label="Faol promo"
                value={dashboard.promoDeals.filter((item) => item.isActive).length.toString()}
              />
            </div>
          </PanelCard>
        </div>
      </div>

      <PanelCard className="p-6 sm:p-8">
        <SectionHeader
          eyebrow="Promo ro'yxati"
          title="Mavjud merchandising bloklar"
          description="Gradient, CTA va holati bilan boyitilgan ro'yxat."
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {dashboard.promoDeals.map((deal) => (
            <div
              key={deal.id}
              className="rounded-[26px] border border-line p-5 shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
              style={{
                background: `linear-gradient(180deg, ${deal.backgroundFrom} 0%, ${deal.backgroundTo} 100%)`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                    {deal.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-foreground">{deal.title}</h3>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    deal.isActive ? "bg-[#eefaf0] text-[#24643a]" : "bg-[#f2f4f7] text-muted",
                  )}
                >
                  {deal.isActive ? "Faol" : "Pausa"}
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-muted">{deal.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-line bg-white/70 px-3 py-2 text-xs font-semibold text-foreground">
                  {deal.ctaLabel}
                </span>
                <span className="rounded-full border border-line bg-white/70 px-3 py-2 text-xs text-muted">
                  {deal.ctaHref}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/admin?tab=promos&editPromo=${deal.id}#promos`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
                >
                  <EditIcon className="h-4 w-4" />
                  Tahrirlash
                </Link>
                <form action={deletePromoDealAction}>
                  <input type="hidden" name="id" value={deal.id} />
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] bg-[#fff2ec] px-4 text-sm font-semibold text-support transition hover:bg-[#ffe5d8]"
                  >
                    <TrashIcon className="h-4 w-4" />
                    O'chirish
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </PanelCard>
    </>
  );
}

function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,28,46,0.96)0%,rgba(8,18,31,0.94)100%)] shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </section>
  );
}

function PanelCard({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-[32px] border border-line bg-white shadow-[0_18px_45px_rgba(13,31,55,0.08)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

function AdminEyebrow({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "accent" | "light";
}) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.24em]",
        tone === "accent" ? "text-accent" : "text-white/62",
      )}
    >
      {children}
    </p>
  );
}

function MiniDarkStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/52">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SidebarSignal({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] border border-white/10 bg-white/6 px-4 py-3">
      <span>{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function StatusNotice({
  className,
  text,
  tone,
}: {
  className?: string;
  text: string;
  tone: AdminTone;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border px-5 py-4 text-sm font-medium shadow-[0_12px_30px_rgba(13,31,55,0.06)]",
        statusToneClass(tone),
        className,
      )}
    >
      {text}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <AdminEyebrow tone="accent">{eyebrow}</AdminEyebrow>
      <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {description ? <p className="mt-3 text-sm leading-7 text-muted">{description}</p> : null}
    </div>
  );
}

function FormGroup({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-[26px] border border-line bg-[#fbfdff] p-5 sm:p-6">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Field({
  children,
  hint,
  label,
}: {
  children: ReactNode;
  hint?: string;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-foreground">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input {...rest} className={cn(inputClassName, className)} />;
}

function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <select {...rest} className={cn(inputClassName, className)}>
      {children}
    </select>
  );
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return <textarea {...rest} className={cn(textAreaClassName, className)} />;
}

function CompactListItem({
  href,
  meta,
  subtitle,
  title,
}: {
  href: string;
  meta: string;
  subtitle: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start justify-between gap-3 rounded-[20px] border border-line bg-[#f8fbfd] px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_30px_rgba(13,31,55,0.06)]"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-1 block text-sm text-muted">{subtitle}</span>
      </span>
      <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-accent">
        {meta}
      </span>
    </Link>
  );
}

function MetricMini({
  label,
  note,
  value,
}: {
  label: string;
  note?: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] bg-[#f7fbff] px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
      {note ? <p className="mt-2 text-sm leading-6 text-muted">{note}</p> : null}
    </div>
  );
}

function MediaThumb({
  imageUrl,
  label,
  toneFrom,
  toneTo,
}: {
  imageUrl?: string;
  label: string;
  toneFrom: string;
  toneTo: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={label}
        className="h-16 w-16 rounded-[18px] border border-line object-contain"
      />
    );
  }

  return (
    <div
      className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-line text-lg font-semibold text-[#0a336c]"
      style={{
        background: `linear-gradient(135deg, ${toneFrom}, ${toneTo})`,
      }}
    >
      {label.slice(0, 1).toUpperCase()}
    </div>
  );
}

function EntityRow({
  actions,
  badges,
  media,
  meta,
  subtitle,
  title,
}: {
  actions: ReactNode;
  badges: Array<{ label: string; className: string } | null>;
  media: ReactNode;
  meta: ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-line bg-[#fbfdff] p-4 shadow-[0_12px_30px_rgba(13,31,55,0.04)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {media}
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-foreground">{title}</p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{subtitle}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {badges.filter(Boolean).map((badge) => (
                <span
                  key={badge!.label}
                  className={cn("rounded-full px-3 py-1 text-xs font-semibold", badge!.className)}
                >
                  {badge!.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:items-end">
          <div className="flex flex-wrap gap-6">{meta}</div>
          <div className="flex flex-wrap justify-end gap-2">{actions}</div>
        </div>
      </div>
    </div>
  );
}
