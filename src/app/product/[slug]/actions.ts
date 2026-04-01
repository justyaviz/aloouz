"use server";

import { revalidatePath } from "next/cache";

import { hasDatabaseUrl } from "@/lib/storefront";
import { prisma } from "@/lib/prisma";

export type ProductCommentFormState = {
  error?: string;
  success?: string;
};

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return undefined;
  }

  if (digits.length === 9) {
    return `998${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("998")) {
    return digits;
  }

  return null;
}

export async function submitProductCommentAction(
  _previousState: ProductCommentFormState,
  formData: FormData,
): Promise<ProductCommentFormState> {
  if (!hasDatabaseUrl()) {
    return { error: "Izoh qoldirish uchun database ulanmagan." };
  }

  const productId = asString(formData.get("productId"));
  const productSlug = asString(formData.get("productSlug"));
  const authorName = asString(formData.get("authorName"));
  const phoneInput = asString(formData.get("phone"));
  const body = asString(formData.get("body"));

  if (!productId || !productSlug) {
    return { error: "Mahsulot ma'lumoti topilmadi." };
  }

  if (authorName.length < 2) {
    return { error: "Ismingizni to'liq kiriting." };
  }

  if (body.length < 6) {
    return { error: "Izoh kamida 6 ta belgidan iborat bo'lsin." };
  }

  const normalizedPhone = normalizePhone(phoneInput);

  if (phoneInput && !normalizedPhone) {
    return { error: "Telefon raqamini to'g'ri kiriting yoki bo'sh qoldiring." };
  }

  await prisma.productComment.create({
    data: {
      productId,
      authorName,
      phone: normalizedPhone ?? null,
      body,
    },
  });

  revalidatePath(`/product/${productSlug}`);
  return { success: "Izohingiz qo'shildi." };
}
