"use server";

import { redirect } from "next/navigation";

import { createCustomerSession, logoutCustomer, parseCustomerPhone } from "@/lib/customer-auth";

export type LoginFormState = {
  error?: string;
};

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getSafeRedirectPath(value: string) {
  if (!value || !value.startsWith("/")) {
    return "/login";
  }

  return value;
}

export async function loginCustomerAction(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const phone = asString(formData.get("phone"));
  const accepted = formData.get("accepted") === "on";
  const redirectTo = getSafeRedirectPath(asString(formData.get("redirectTo")));

  if (!accepted) {
    return { error: "Davom etish uchun ommaviy ofertaga rozilik kerak." };
  }

  if (!parseCustomerPhone(phone)) {
    return { error: "Telefon raqamini to'liq kiriting." };
  }

  try {
    await createCustomerSession(phone);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Kirish paytida noma'lum xato yuz berdi.",
    };
  }

  redirect(redirectTo);
}

export async function logoutCustomerAction(formData: FormData) {
  const redirectTo = getSafeRedirectPath(asString(formData.get("redirectTo")));

  await logoutCustomer();
  redirect(redirectTo);
}
