import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "aloo_admin_session";

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "aloo-admin-dev-secret";
}

function getAdminUsername() {
  return process.env.ADMIN_USERNAME ?? "admin";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "alooadmin123";
}

function signValue(value: string) {
  return createHmac("sha256", getAdminSecret()).update(value).digest("hex");
}

function buildSessionToken(value: string) {
  return `${value}.${signValue(value)}`;
}

function verifySessionToken(token?: string) {
  if (!token) {
    return false;
  }

  const [value, signature] = token.split(".");

  if (!value || !signature) {
    return false;
  }

  const expected = signValue(value);

  if (expected.length !== signature.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) && value === "admin";
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function loginAdmin(username: string, password: string) {
  if (username !== getAdminUsername() || password !== getAdminPassword()) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, buildSessionToken("admin"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export function getAdminSetup() {
  return {
    username: getAdminUsername(),
    hasCustomPassword: Boolean(process.env.ADMIN_PASSWORD),
  };
}
