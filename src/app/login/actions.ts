"use server";

import { redirect } from "next/navigation";

import { logoutCustomer, parseCustomerPhone } from "@/lib/customer-auth";
import {
  startTelegramLoginChallenge,
  verifyTelegramLoginChallenge,
} from "@/lib/telegram-login";

export type TelegramLoginRequestState = {
  error?: string;
  info?: string;
  challengeId?: string;
  displayPhone?: string;
  botUrl?: string;
  codeSent?: boolean;
};

export type TelegramLoginVerifyState = {
  error?: string;
};

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getSafeRedirectPath(value: string) {
  if (!value || !value.startsWith("/")) {
    return "/profile";
  }

  return value;
}

export async function requestTelegramLoginAction(
  _previousState: TelegramLoginRequestState,
  formData: FormData,
): Promise<TelegramLoginRequestState> {
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
    const challenge = await startTelegramLoginChallenge({ phone, redirectTo });

    return {
      challengeId: challenge.challengeId,
      displayPhone: challenge.displayPhone,
      botUrl: challenge.botUrl,
      codeSent: challenge.codeSent,
      info: challenge.codeSent
        ? "Kod Telegram botga yuborildi. Uni pastdagi maydonga kiriting."
        : "Botni ochib, telefoningizni tasdiqlang. Kod Telegram ichida beriladi.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Kod yuborish paytida noma'lum xato yuz berdi.",
    };
  }
}

export async function verifyTelegramLoginAction(
  _previousState: TelegramLoginVerifyState,
  formData: FormData,
): Promise<TelegramLoginVerifyState> {
  const challengeId = asString(formData.get("challengeId"));
  const code = asString(formData.get("code"));

  if (!challengeId) {
    return { error: "Avval Telegram orqali kod oling." };
  }

  try {
    const result = await verifyTelegramLoginChallenge({ challengeId, code });
    redirect(result.redirectTo);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Kodni tasdiqlash paytida noma'lum xato yuz berdi.",
    };
  }
}

export async function logoutCustomerAction(formData: FormData) {
  const redirectTo = getSafeRedirectPath(asString(formData.get("redirectTo")));

  await logoutCustomer();
  redirect(redirectTo);
}
