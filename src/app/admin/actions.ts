"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { loginAdmin, logoutAdmin, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getCategoryOptions, getCategoryPalette, hasDatabaseUrl, slugify } from "@/lib/storefront";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalString(value: FormDataEntryValue | null) {
  const parsed = asString(value);
  return parsed.length > 0 ? parsed : undefined;
}

function asInt(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number.parseInt(asString(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asFloat(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number.parseFloat(asString(value));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asBool(value: FormDataEntryValue | null) {
  return value === "on";
}

function parseLines(value: FormDataEntryValue | null) {
  return asString(value)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseColors(value: FormDataEntryValue | null) {
  return asString(value)
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSpecs(value: FormDataEntryValue | null) {
  return parseLines(value)
    .map((item) => {
      const [label, ...rest] = item.split(":");

      if (!label || rest.length === 0) {
        return null;
      }

      const specValue = rest.join(":").trim();

      if (!specValue) {
        return null;
      }

      return {
        label: label.trim(),
        value: specValue,
      };
    })
    .filter((item): item is { label: string; value: string } => item !== null);
}

function ensureDatabase() {
  if (!hasDatabaseUrl()) {
    redirect("/admin?error=database");
  }
}

function revalidateStorefront(productSlug?: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin");

  if (previousSlug) {
    revalidatePath(`/product/${previousSlug}`);
  }

  if (productSlug) {
    revalidatePath(`/product/${productSlug}`);
  }
}

export async function loginAction(formData: FormData) {
  const username = asString(formData.get("username"));
  const password = asString(formData.get("password"));

  const success = await loginAdmin(username, password);

  redirect(success ? "/admin" : "/admin?auth=error");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  ensureDatabase();

  const id = asOptionalString(formData.get("id"));
  const previousSlug = asOptionalString(formData.get("previousSlug"));
  const name = asString(formData.get("name"));
  const customSlug = asOptionalString(formData.get("slug"));
  const slug = customSlug ?? slugify(name);
  const sku = asOptionalString(formData.get("sku")) ?? `ALOO-${slug.toUpperCase().replace(/-/g, "_")}`;
  const brandName = asString(formData.get("brand"));
  const categorySlug = asString(formData.get("categorySlug"));
  const categoryOption = getCategoryOptions().find((item) => item.slug === categorySlug);

  if (!name || !brandName || !categoryOption) {
    redirect("/admin?tab=products&error=product");
  }

  const category = await prisma.category.upsert({
    where: { slug: categoryOption.slug },
    update: {
      name: categoryOption.name,
      description: categoryOption.description,
    },
    create: {
      name: categoryOption.name,
      slug: categoryOption.slug,
      description: categoryOption.description,
    },
  });

  const brand = await prisma.brand.upsert({
    where: { slug: slugify(brandName) },
    update: {
      name: brandName,
    },
    create: {
      name: brandName,
      slug: slugify(brandName),
    },
  });

  const palette = getCategoryPalette(categorySlug);
  const price = asInt(formData.get("price"));
  const monthlyPrice = asInt(formData.get("monthlyPrice"), Math.round(price / 12));

  const data = {
    name,
    slug,
    sku,
    shortDescription: asString(formData.get("shortDescription")),
    description: asOptionalString(formData.get("description")),
    kind: asString(formData.get("kind")) || "phone",
    price,
    compareAtPrice: asOptionalString(formData.get("oldPrice"))
      ? asInt(formData.get("oldPrice"))
      : null,
    monthlyPrice,
    stock: asInt(formData.get("stock")),
    badge: asString(formData.get("badge")) || "Yangi",
    rating: asFloat(formData.get("rating"), 5),
    reviews: asInt(formData.get("reviews")),
    heroLabel: asString(formData.get("heroLabel")) || "Original",
    delivery:
      asString(formData.get("delivery")) || "Toshkent bo'ylab tezkor yetkazib berish mavjud",
    highlights: parseLines(formData.get("highlights")),
    colors: parseColors(formData.get("colors")),
    specs: parseSpecs(formData.get("specs")),
    toneFrom: asString(formData.get("toneFrom")) || palette.toneFrom,
    toneTo: asString(formData.get("toneTo")) || palette.toneTo,
    imageUrl: asOptionalString(formData.get("imageUrl")) ?? null,
    isActive: asBool(formData.get("isActive")),
    isFeatured: asBool(formData.get("isFeatured")),
    isNewArrival: asBool(formData.get("isNewArrival")),
    isDayDeal: asBool(formData.get("isDayDeal")),
    sortOrder: asInt(formData.get("sortOrder")),
    categoryId: category.id,
    brandId: brand.id,
  };

  if (id) {
    await prisma.product.update({
      where: { id },
      data,
    });
  } else {
    await prisma.product.create({
      data,
    });
  }

  revalidateStorefront(slug, previousSlug);
  redirect("/admin?tab=products&status=product-saved");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  ensureDatabase();

  const id = asString(formData.get("id"));
  const slug = asOptionalString(formData.get("slug"));

  if (id) {
    await prisma.product.delete({
      where: { id },
    });
  }

  revalidateStorefront(undefined, slug);
  redirect("/admin?tab=products&status=product-deleted");
}

export async function saveArticleAction(formData: FormData) {
  await requireAdmin();
  ensureDatabase();

  const id = asOptionalString(formData.get("id"));
  const title = asString(formData.get("title"));
  const slug = asOptionalString(formData.get("slug")) ?? slugify(title);

  if (!title) {
    redirect("/admin?tab=articles&error=article");
  }

  const data = {
    title,
    slug,
    tag: asString(formData.get("tag")) || "Yangilik",
    summary:
      asString(formData.get("summary")) ||
      "aloo uchun yangiliklar, promo takliflar va smartfon tanlash bo'yicha foydali maslahatlar.",
    publishedAt: new Date(asString(formData.get("publishedAt")) || new Date().toISOString()),
    isPublished: asBool(formData.get("isPublished")),
    sortOrder: asInt(formData.get("sortOrder")),
  };

  if (id) {
    await prisma.article.update({
      where: { id },
      data,
    });
  } else {
    await prisma.article.create({
      data,
    });
  }

  revalidateStorefront();
  redirect("/admin?tab=articles&status=article-saved");
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  ensureDatabase();

  const id = asString(formData.get("id"));

  if (id) {
    await prisma.article.delete({
      where: { id },
    });
  }

  revalidateStorefront();
  redirect("/admin?tab=articles&status=article-deleted");
}

export async function savePromoDealAction(formData: FormData) {
  await requireAdmin();
  ensureDatabase();

  const id = asOptionalString(formData.get("id"));
  const title = asString(formData.get("title"));

  if (!title) {
    redirect("/admin?tab=promos&error=promo");
  }

  const data = {
    eyebrow: asString(formData.get("eyebrow")) || "Aksiya",
    title,
    description: asString(formData.get("description")),
    ctaLabel: asString(formData.get("ctaLabel")) || "Ko'rish",
    ctaHref: asString(formData.get("ctaHref")) || "/catalog",
    backgroundFrom: asString(formData.get("backgroundFrom")) || "#EEF6FF",
    backgroundTo: asString(formData.get("backgroundTo")) || "#FFFFFF",
    isActive: asBool(formData.get("isActive")),
    sortOrder: asInt(formData.get("sortOrder")),
  };

  if (id) {
    await prisma.promoDeal.update({
      where: { id },
      data,
    });
  } else {
    await prisma.promoDeal.create({
      data,
    });
  }

  revalidateStorefront();
  redirect("/admin?tab=promos&status=promo-saved");
}

export async function deletePromoDealAction(formData: FormData) {
  await requireAdmin();
  ensureDatabase();

  const id = asString(formData.get("id"));

  if (id) {
    await prisma.promoDeal.delete({
      where: { id },
    });
  }

  revalidateStorefront();
  redirect("/admin?tab=promos&status=promo-deleted");
}
