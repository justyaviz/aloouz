"use server";

import { randomInt } from "node:crypto";

import { getAuthViewer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { hasDatabaseUrl } from "@/lib/storefront";

export type CheckoutActionState = {
  error?: string;
  success?: boolean;
  orderNumber?: string;
  phone?: string;
};

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeProductSlugs(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index);
}

async function generateOrderNumber() {
  const year = new Date().getFullYear();

  for (let index = 0; index < 8; index += 1) {
    const orderNumber = `ALOO-${year}-${randomInt(100000, 999999)}`;
    const existing = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    });

    if (!existing) {
      return orderNumber;
    }
  }

  return `ALOO-${year}-${Date.now().toString().slice(-6)}`;
}

export async function createCheckoutOrderAction(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  if (!hasDatabaseUrl()) {
    return { error: "Database ulanmagan." };
  }

  const viewer = await getAuthViewer();

  if (!viewer) {
    return { error: "Buyurtma berish uchun avval tizimga kiring." };
  }

  const address = asString(formData.get("address"));
  const notes = asString(formData.get("notes"));
  const productSlugs = normalizeProductSlugs(asString(formData.get("productSlugs")));

  if (!address) {
    return { error: "Yetkazib berish manzilini kiriting." };
  }

  if (productSlugs.length === 0) {
    return { error: "Buyurtma uchun mahsulot tanlanmagan." };
  }

  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: productSlugs,
      },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      slug: true,
    },
  });

  if (products.length === 0) {
    return { error: "Tanlangan mahsulotlar topilmadi." };
  }

  const productMap = new Map(products.map((product) => [product.slug, product]));
  const orderedProducts = productSlugs
    .map((slug) => productMap.get(slug))
    .filter((product): product is NonNullable<typeof productMap extends Map<string, infer T> ? T : never> => Boolean(product));

  if (orderedProducts.length === 0) {
    return { error: "Tanlangan mahsulotlar topilmadi." };
  }

  const totalAmount = orderedProducts.reduce((sum, product) => sum + product.price, 0);
  const orderNumber = await generateOrderNumber();
  const noteLines = [`Manzil: ${address}`];

  if (notes) {
    noteLines.push(`Izoh: ${notes}`);
  }

  await prisma.order.create({
    data: {
      orderNumber,
      status: "PENDING",
      totalAmount,
      notes: noteLines.join("\n"),
      customerId: viewer.id,
      items: {
        create: orderedProducts.map((product) => ({
          quantity: 1,
          unitPrice: product.price,
          productName: product.name,
          productId: product.id,
        })),
      },
    },
  });

  return {
    success: true,
    orderNumber,
    phone: viewer.phone,
  };
}
