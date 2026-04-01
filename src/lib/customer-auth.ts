import { createHash, randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { hasDatabaseUrl } from "@/lib/storefront";

const CUSTOMER_COOKIE_NAME = "aloo_customer_session";
const CUSTOMER_SESSION_TTL = 60 * 60 * 24 * 30;

export type AuthViewer = {
  id: string;
  firstName: string;
  lastName?: string;
  phone: string;
  displayPhone: string;
};

function getCustomerSessionSecret() {
  return process.env.CUSTOMER_SESSION_SECRET ?? "aloo-customer-dev-secret";
}

function normalizeLocalPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 9) {
    return `998${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("998")) {
    return digits;
  }

  return null;
}

function formatDisplayPhone(phone: string) {
  const normalized = normalizeLocalPhone(phone);

  if (!normalized) {
    return phone;
  }

  return `+${normalized.slice(0, 3)} ${normalized.slice(3, 5)} ${normalized.slice(5, 8)} ${normalized.slice(8, 10)} ${normalized.slice(10, 12)}`;
}

function hashToken(token: string) {
  return createHash("sha256")
    .update(`${token}.${getCustomerSessionSecret()}`)
    .digest("hex");
}

async function getSessionCookieStore() {
  return cookies();
}

export function parseCustomerPhone(phone: string) {
  const normalized = normalizeLocalPhone(phone.trim());

  if (!normalized) {
    return null;
  }

  return {
    normalized,
    display: formatDisplayPhone(normalized),
  };
}

function cleanName(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export async function createCustomerSession(
  phone: string,
  profile?: { firstName?: string; lastName?: string },
) {
  if (!hasDatabaseUrl()) {
    throw new Error("Database ulanmagan.");
  }

  const parsed = parseCustomerPhone(phone);

  if (!parsed) {
    throw new Error("Telefon raqamini to'liq kiriting.");
  }

  const nextFirstName = cleanName(profile?.firstName) ?? "Aloo mijoz";
  const nextLastName = cleanName(profile?.lastName);

  const customer = await prisma.customer.upsert({
    where: { phone: parsed.normalized },
    update: {
      firstName: nextFirstName,
      lastName: nextLastName ?? null,
    },
    create: {
      firstName: nextFirstName,
      lastName: nextLastName ?? null,
      phone: parsed.normalized,
    },
    select: {
      id: true,
    },
  });

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + CUSTOMER_SESSION_TTL * 1000);

  await prisma.customerSession.create({
    data: {
      tokenHash,
      customerId: customer.id,
      expiresAt,
    },
  });

  const cookieStore = await getSessionCookieStore();
  cookieStore.set(CUSTOMER_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CUSTOMER_SESSION_TTL,
  });
}

export async function getAuthViewer(): Promise<AuthViewer | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const cookieStore = await getSessionCookieStore();
  const rawToken = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;

  if (!rawToken) {
    return null;
  }

  const session = await prisma.customerSession.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
  });

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    cookieStore.delete(CUSTOMER_COOKIE_NAME);

    if (session) {
      await prisma.customerSession.delete({
        where: { id: session.id },
      });
    }

    return null;
  }

  return {
    id: session.customer.id,
    firstName: session.customer.firstName,
    lastName: session.customer.lastName ?? undefined,
    phone: session.customer.phone,
    displayPhone: formatDisplayPhone(session.customer.phone),
  };
}

export async function logoutCustomer() {
  if (!hasDatabaseUrl()) {
    return;
  }

  const cookieStore = await getSessionCookieStore();
  const rawToken = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;

  if (rawToken) {
    await prisma.customerSession.deleteMany({
      where: { tokenHash: hashToken(rawToken) },
    });
  }

  cookieStore.delete(CUSTOMER_COOKIE_NAME);
}
