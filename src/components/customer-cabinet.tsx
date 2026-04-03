"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  addCustomerAddressAction,
  type CustomerAddressFormState,
  type CustomerProfileFormState,
  deleteCustomerAddressAction,
  setPrimaryCustomerAddressAction,
  updateCustomerProfileAction,
} from "@/app/profile/actions";
import { logoutCustomerAction } from "@/app/login/actions";
import { ProductVisual } from "@/components/product-visual";
import type { AuthViewer } from "@/lib/customer-auth";
import type {
  CustomerCabinetData,
  CustomerCabinetOrder,
} from "@/lib/customer-cabinet";
import { formatSum } from "@/lib/format";

import {
  ArrowLeftIcon,
  ClipboardIcon,
  ClockIcon,
  CloseIcon,
  EditIcon,
  HeartIcon,
  LocationIcon,
  LockShieldIcon,
  PackageIcon,
  PackageOffIcon,
  SparklesIcon,
  TargetIcon,
  UserIcon,
} from "./icons";

type CustomerCabinetProps = {
  viewer: AuthViewer;
  data: CustomerCabinetData;
};

type CustomerKind = "phone" | "tablet" | "watch" | "audio" | "keyboard" | "speaker";

type CabinetTab =
  | "profile"
  | "addresses"
  | "orders"
  | "comments"
  | "returns"
  | "promocodes"
  | "verification";

const profileInitialState: CustomerProfileFormState = {};
const addressInitialState: CustomerAddressFormState = {};

const tabItems: Array<{
  key: CabinetTab;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
}> = [
  { key: "profile", label: "Shaxsiy kabinet", icon: UserIcon },
  { key: "addresses", label: "Manzillar", icon: LocationIcon },
  { key: "orders", label: "Mening buyurtmalarim", icon: PackageIcon },
  { key: "comments", label: "Izohlar", icon: ClockIcon },
  { key: "returns", label: "Qaytarilganlar", icon: ArrowLeftIcon },
  { key: "promocodes", label: "Mening promokodlarim", icon: TargetIcon },
  { key: "verification", label: "Verifikatsiya", icon: LockShieldIcon },
];

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getActiveTab(value: string | null): CabinetTab {
  return tabItems.find((item) => item.key === value)?.key ?? "profile";
}

function asProductKind(value: string): CustomerKind {
  return ["phone", "tablet", "watch", "audio", "keyboard", "speaker"].includes(value)
    ? (value as CustomerKind)
    : "phone";
}

function CabinetSection({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-line bg-white p-4 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:rounded-[30px] sm:p-7">
      <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between sm:pb-5">
        <h1 className="font-display text-[2rem] font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {actions}
      </div>
      <div className="pt-5 sm:pt-6">{children}</div>
    </section>
  );
}

function CabinetEmpty({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: (props: { className?: string }) => ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] bg-[#fafbfd] px-5 py-8 text-center sm:min-h-[420px] sm:rounded-[26px] sm:px-6 sm:py-10">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#edf6ff] text-accent shadow-[0_18px_40px_rgba(22,144,245,0.12)] sm:h-20 sm:w-20 sm:rounded-[28px]">
        <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
      </span>
      <h2 className="mt-5 font-display text-[1.9rem] font-semibold tracking-tight text-foreground sm:mt-6 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-[520px] text-[15px] leading-7 text-muted sm:mt-4 sm:text-base sm:leading-8">
        {description}
      </p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}

function OrderStatusBadge({ order }: { order: CustomerCabinetOrder }) {
  const toneClass =
    order.statusGroup === "cancelled"
      ? "bg-[#edf6ff] text-accent"
      : order.statusGroup === "fulfilled"
        ? "bg-[#eefaf1] text-[#2d7a46]"
        : "bg-[#eef5ff] text-accent";

  return (
    <span className={cn("inline-flex rounded-full px-4 py-2 text-sm font-semibold", toneClass)}>
      {order.statusLabel}
    </span>
  );
}

export function CustomerCabinet({ viewer, data }: CustomerCabinetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = getActiveTab(searchParams.get("tab"));
  const [showAddressForm, setShowAddressForm] = useState(data.addresses.length === 0);
  const [orderFilter, setOrderFilter] = useState<"all" | "active" | "fulfilled" | "cancelled">(
    "all",
  );
  const [commentTab, setCommentTab] = useState<"pending" | "mine">("pending");
  const [profileState, profileAction] = useActionState(
    updateCustomerProfileAction,
    profileInitialState,
  );
  const [addressState, addressAction] = useActionState(
    addCustomerAddressAction,
    addressInitialState,
  );

  useEffect(() => {
    if (profileState.success) {
      router.refresh();
    }
  }, [profileState.success, router]);

  useEffect(() => {
    if (addressState.success) {
      router.refresh();
    }
  }, [addressState.success, router]);

  const initials = useMemo(() => {
    const fullName = [viewer.firstName, viewer.lastName].filter(Boolean).join(" ").trim();

    if (!fullName) {
      return "AL";
    }

    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [viewer.firstName, viewer.lastName]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === "all") {
      return data.orders;
    }

    return data.orders.filter((order) => order.statusGroup === orderFilter);
  }, [data.orders, orderFilter]);

  const tabHref = (tab: CabinetTab) => `/profile?tab=${tab}`;

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-6">
      <div className="xl:hidden">
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#0c346e_0%,#1686e3_58%,#dfefff_100%)] p-4 text-white shadow-[0_18px_40px_rgba(14,58,118,0.22)]">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/16 text-xl font-semibold backdrop-blur-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">
                Shaxsiy kabinet
              </p>
              <p className="mt-1 line-clamp-1 font-display text-[1.45rem] font-semibold tracking-tight">
                {[viewer.firstName, viewer.lastName].filter(Boolean).join(" ")}
              </p>
              <p className="mt-1 text-sm text-white/82">{viewer.displayPhone}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[18px] border border-white/14 bg-white/12 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Buyurtmalar
              </p>
              <p className="mt-1 text-xl font-semibold">{data.orders.length}</p>
            </div>
            <div className="rounded-[18px] border border-white/14 bg-white/12 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Manzillar
              </p>
              <p className="mt-1 text-xl font-semibold">{data.addresses.length}</p>
            </div>
          </div>
        </div>
      </div>

      <aside className="rounded-[28px] border border-line bg-white p-3 shadow-[0_18px_45px_rgba(13,31,55,0.08)] xl:rounded-[30px]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:block">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <Link
                key={item.key}
                href={tabHref(item.key)}
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-[20px] px-4 py-4 text-sm font-semibold transition xl:min-w-0",
                  isActive
                    ? "bg-[#edf6ff] text-accent"
                    : "text-foreground hover:bg-[#f7f9fc]",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border",
                    isActive
                      ? "border-accent/20 bg-white text-accent"
                      : "border-line bg-white text-muted",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="leading-5">{item.label}</span>
              </Link>
            );
          })}

          <form action={logoutCustomerAction} className="xl:mt-2">
            <input type="hidden" name="redirectTo" value="/login" />
            <button
              type="submit"
              className="flex min-w-0 items-center gap-3 rounded-[20px] px-4 py-4 text-sm font-semibold text-accent transition hover:bg-[#edf6ff] xl:min-w-0"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-accent/15 bg-white text-accent">
                <CloseIcon className="h-5 w-5" />
              </span>
              <span>Chiqish</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        {activeTab === "profile" ? (
          <CabinetSection title="Shaxsiy kabinet">
            <form action={profileAction} className="space-y-6">
              <div className="flex flex-col gap-6 rounded-[28px] bg-[#fbfdff] p-5 sm:flex-row sm:items-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#eef5ff] font-display text-2xl font-semibold text-accent">
                  {initials}
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {[viewer.firstName, viewer.lastName].filter(Boolean).join(" ")}
                  </p>
                  <p className="mt-1 text-sm text-muted">{viewer.displayPhone}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                    <EditIcon className="h-4 w-4 text-accent" />
                    Profil ma&apos;lumotlarini yangilang
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-foreground">Ism *</span>
                  <input
                    name="firstName"
                    defaultValue={viewer.firstName}
                    className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 text-base text-foreground outline-none transition focus:border-accent/40"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-foreground">
                    Familiya
                  </span>
                  <input
                    name="lastName"
                    defaultValue={viewer.lastName ?? ""}
                    className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 text-base text-foreground outline-none transition focus:border-accent/40"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-foreground">
                    Tug&apos;ilgan sana
                  </span>
                  <input
                    type="date"
                    name="birthDate"
                    defaultValue={data.birthDate ?? ""}
                    className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 text-base text-foreground outline-none transition focus:border-accent/40"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-foreground">
                    Telefon *
                  </span>
                  <input
                    value={viewer.displayPhone}
                    readOnly
                    className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-[#f7f9fc] px-5 text-base font-semibold text-foreground outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-foreground">Jins</span>
                  <select
                    name="gender"
                    defaultValue={data.gender ?? "not_specified"}
                    className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 text-base text-foreground outline-none transition focus:border-accent/40"
                  >
                    <option value="not_specified">Ko&apos;rsatmaslik</option>
                    <option value="male">Erkak</option>
                    <option value="female">Ayol</option>
                  </select>
                </label>

                <div className="rounded-[24px] border border-line bg-[#fbfdff] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">SMS-bildirishnoma</p>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        Yangi aksiyalar va buyurtma yangilanishlari haqida sms xabarnoma oling.
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        name="smsOptIn"
                        defaultChecked={data.smsOptIn}
                        className="peer sr-only"
                      />
                      <span className="h-8 w-14 rounded-full bg-[#e6ebf1] transition peer-checked:bg-catalog" />
                      <span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-6" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[22px] border border-line bg-[#fbfdff] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Telefon verifikatsiyasi
                  </p>
                  <p className="mt-3 text-lg font-semibold text-foreground">Tasdiqlangan</p>
                  <p className="mt-1 text-sm text-muted">{viewer.displayPhone}</p>
                </div>
                <div className="rounded-[22px] border border-line bg-[#fbfdff] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Telegram
                  </p>
                  <p className="mt-3 text-lg font-semibold text-foreground">
                    {data.verification.telegramConnected ? "Ulangan" : "Ulanmagan"}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {data.verification.telegramUsername
                      ? `@${data.verification.telegramUsername}`
                      : "@aloouz_verifybot orqali ulash mumkin"}
                  </p>
                </div>
              </div>

              {profileState.error ? (
                <p className="rounded-[18px] bg-[#edf6ff] px-4 py-3 text-sm text-accent">
                  {profileState.error}
                </p>
              ) : null}
              {profileState.success ? (
                <p className="rounded-[18px] bg-[#eefaf1] px-4 py-3 text-sm text-[#2d7a46]">
                  {profileState.success}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex h-14 items-center justify-center rounded-[20px] bg-accent px-8 text-base font-semibold text-white transition hover:bg-accent-strong"
                >
                  Saqlash
                </button>
                <button
                  type="reset"
                  className="inline-flex h-14 items-center justify-center rounded-[20px] border border-line bg-[#f4f6f9] px-8 text-base font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </CabinetSection>
        ) : null}

        {activeTab === "addresses" ? (
          <CabinetSection
            title="Manzillar"
            actions={
              <button
                type="button"
                onClick={() => setShowAddressForm((current) => !current)}
                className="inline-flex h-12 items-center justify-center rounded-[18px] border border-accent/35 px-5 text-sm font-semibold text-accent transition hover:bg-[#edf6ff]"
              >
                {showAddressForm ? "Yopish" : "Manzil qo&apos;shish"}
              </button>
            }
          >
            <div className="space-y-5">
              {showAddressForm ? (
                <form
                  action={addressAction}
                  className="rounded-[24px] border border-line bg-[#fbfdff] p-5"
                >
                  <div className="grid gap-4 lg:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-foreground">
                        Manzil nomi *
                      </span>
                      <input
                        name="title"
                        placeholder="Masalan: Uy, Ofis"
                        className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 text-base text-foreground outline-none transition focus:border-accent/40"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-foreground">
                        Qabul qiluvchi *
                      </span>
                      <input
                        name="recipientName"
                        defaultValue={[viewer.firstName, viewer.lastName].filter(Boolean).join(" ")}
                        className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 text-base text-foreground outline-none transition focus:border-accent/40"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-foreground">
                        Telefon *
                      </span>
                      <input
                        name="phone"
                        defaultValue={viewer.displayPhone}
                        className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 text-base text-foreground outline-none transition focus:border-accent/40"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-foreground">
                        Shahar yoki viloyat *
                      </span>
                      <input
                        name="city"
                        placeholder="Toshkent shahri"
                        className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 text-base text-foreground outline-none transition focus:border-accent/40"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-foreground">
                        Tuman
                      </span>
                      <input
                        name="district"
                        placeholder="Chilonzor tumani"
                        className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 text-base text-foreground outline-none transition focus:border-accent/40"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-foreground">
                        Mo&apos;ljal
                      </span>
                      <input
                        name="landmark"
                        placeholder="Masalan: Makro yonida"
                        className="h-14 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 text-base text-foreground outline-none transition focus:border-accent/40"
                      />
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <span className="mb-2 block text-sm font-semibold text-foreground">
                      To&apos;liq manzil *
                    </span>
                    <textarea
                      name="line1"
                      rows={4}
                      placeholder="Ko'cha, uy, kirish, qavat, xonadon"
                      className="min-h-28 w-full rounded-[18px] border border-[#d8e1eb] bg-white px-5 py-4 text-base text-foreground outline-none transition focus:border-accent/40"
                    />
                  </label>

                  <label className="mt-4 inline-flex items-center gap-3 text-sm font-medium text-foreground">
                    <input
                      type="checkbox"
                      name="isPrimary"
                      className="h-5 w-5 rounded border-line text-accent"
                    />
                    Asosiy manzil sifatida saqlash
                  </label>

                  {addressState.error ? (
                    <p className="mt-4 rounded-[18px] bg-[#edf6ff] px-4 py-3 text-sm text-accent">
                      {addressState.error}
                    </p>
                  ) : null}
                  {addressState.success ? (
                    <p className="mt-4 rounded-[18px] bg-[#eefaf1] px-4 py-3 text-sm text-[#2d7a46]">
                      {addressState.success}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="inline-flex h-14 items-center justify-center rounded-[20px] bg-accent px-8 text-base font-semibold text-white transition hover:bg-accent-strong"
                    >
                      Manzilni saqlash
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="inline-flex h-14 items-center justify-center rounded-[20px] border border-line bg-white px-8 text-base font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </form>
              ) : null}

              {data.addresses.length === 0 ? (
                <CabinetEmpty
                  icon={LocationIcon}
                  title="Hech qanday manzil saqlanmadi"
                  description="Sizda hech qanday manzil saqlanmadi. Birinchi manzilingizni qo'shing va keyingi buyurtmalarda tezroq davom eting."
                  action={
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="inline-flex h-14 items-center justify-center rounded-[20px] bg-accent px-8 text-base font-semibold text-white transition hover:bg-accent-strong"
                    >
                      Manzil qo&apos;shish
                    </button>
                  }
                />
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {data.addresses.map((address) => (
                    <article
                      key={address.id}
                      className="rounded-[24px] border border-line bg-[#fbfdff] p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xl font-semibold text-foreground">{address.title}</p>
                          <p className="mt-2 text-sm text-muted">{address.createdAt}</p>
                        </div>
                        {address.isPrimary ? (
                          <span className="rounded-full bg-[#eefaf1] px-3 py-1 text-sm font-semibold text-[#2d7a46]">
                            Asosiy
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4 space-y-2 text-sm leading-7 text-muted">
                        <p>
                          <span className="font-semibold text-foreground">Qabul qiluvchi:</span>{" "}
                          {address.recipientName}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Telefon:</span>{" "}
                          {address.phone}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Hudud:</span>{" "}
                          {[address.city, address.district].filter(Boolean).join(", ")}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Manzil:</span>{" "}
                          {address.line1}
                        </p>
                        {address.landmark ? (
                          <p>
                            <span className="font-semibold text-foreground">Mo&apos;ljal:</span>{" "}
                            {address.landmark}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {!address.isPrimary ? (
                          <form action={setPrimaryCustomerAddressAction}>
                            <input type="hidden" name="addressId" value={address.id} />
                            <button
                              type="submit"
                              className="inline-flex h-11 items-center justify-center rounded-[16px] border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
                            >
                              Asosiy qilish
                            </button>
                          </form>
                        ) : null}
                        <form action={deleteCustomerAddressAction}>
                          <input type="hidden" name="addressId" value={address.id} />
                          <button
                            type="submit"
                            className="inline-flex h-11 items-center justify-center rounded-[16px] border border-accent/20 bg-[#edf6ff] px-4 text-sm font-semibold text-accent transition hover:bg-[#dff1ff]"
                          >
                            O&apos;chirish
                          </button>
                        </form>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </CabinetSection>
        ) : null}

        {activeTab === "orders" ? (
          <CabinetSection title="Mening buyurtmalarim">
            <div className="flex flex-wrap gap-3 border-b border-line pb-5">
              {[
                { key: "all", label: "Barcha buyurtmalar" },
                { key: "active", label: "Faol" },
                { key: "fulfilled", label: "Bajarildi" },
                { key: "cancelled", label: "Bekor qilingan" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() =>
                    setOrderFilter(filter.key as "all" | "active" | "fulfilled" | "cancelled")
                  }
                  className={cn(
                    "inline-flex h-12 items-center justify-center rounded-[16px] px-5 text-sm font-semibold transition",
                    orderFilter === filter.key
                      ? "bg-[#edf6ff] text-accent"
                      : "text-foreground hover:bg-[#f7f9fc]",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <CabinetEmpty
                icon={PackageIcon}
                title="Buyurtmalar hali yo'q"
                description="Checkout orqali buyurtma berganingizdan keyin barcha holatlar shu yerda ko'rinadi."
              />
            ) : (
              <div className="space-y-5">
                {filteredOrders.map((order) => {
                  const previewItem = order.items[0];

                  return (
                    <article
                      key={order.id}
                      className="overflow-hidden rounded-[26px] border border-line bg-white"
                    >
                      <div className="flex flex-col gap-4 border-b border-line px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                            Buyurtma # {order.orderNumber}
                          </h2>
                          <p className="mt-2 text-sm text-muted">{order.createdAt}</p>
                        </div>
                        <OrderStatusBadge order={order} />
                      </div>

                      <div className="grid gap-6 px-5 py-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="space-y-3 text-[15px] leading-8 text-muted">
                          <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)]">
                            <span>Buyurtma vaqti:</span>
                            <span className="font-medium text-foreground">{order.createdAt}</span>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)]">
                            <span>Holati:</span>
                            <span className="font-medium text-foreground">{order.statusLabel}</span>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)]">
                            <span>Qabul qilish usuli:</span>
                            <span className="font-medium text-foreground">
                              {order.address ? "Yetkazib berish" : "Olib ketish"}
                            </span>
                          </div>
                          {order.address ? (
                            <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)]">
                              <span>Yetkazib berish manzili:</span>
                              <span className="font-medium text-foreground">{order.address}</span>
                            </div>
                          ) : null}
                          {order.note ? (
                            <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)]">
                              <span>Izoh:</span>
                              <span className="font-medium text-foreground">{order.note}</span>
                            </div>
                          ) : null}

                          <div className="mt-4 border-t border-line pt-4">
                            <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)]">
                              <span>{order.items.length} ta mahsulot</span>
                              <span className="font-semibold text-foreground">
                                {formatSum(order.totalAmount)}
                              </span>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)]">
                              <span>Yetkazib berish</span>
                              <span className="font-semibold text-foreground">0 so&apos;m</span>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)]">
                              <span className="font-semibold text-foreground">Jami</span>
                              <span className="font-semibold text-foreground">
                                {formatSum(order.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {previewItem ? (
                          <div className="rounded-[24px] bg-[#f6f8fb] p-4">
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-4">
                              <div className="w-[110px]">
                                <ProductVisual
                                  size="deal"
                                  kind={asProductKind(previewItem.kind)}
                                  label={previewItem.heroLabel}
                                  toneFrom={previewItem.toneFrom}
                                  toneTo={previewItem.toneTo}
                                  imageUrl={previewItem.imageUrl}
                                  imageAlt={previewItem.productName}
                                  productName={previewItem.productName}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="line-clamp-2 text-lg font-semibold leading-7 text-foreground">
                                  {previewItem.productName}
                                </p>
                                <p className="mt-3 text-2xl font-semibold text-foreground">
                                  {formatSum(previewItem.unitPrice)}
                                </p>
                                <p className="mt-2 text-sm text-muted">
                                  {previewItem.quantity} ta
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </CabinetSection>
        ) : null}

        {activeTab === "comments" ? (
          <CabinetSection title="Izohlar">
            <div className="grid grid-cols-2 gap-3 border-b border-line pb-5">
              {[
                { key: "pending", label: "Kutilmoqda" },
                { key: "mine", label: "Izohlarim" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCommentTab(item.key as "pending" | "mine")}
                  className={cn(
                    "inline-flex h-12 items-center justify-center rounded-[16px] px-5 text-sm font-semibold transition",
                    commentTab === item.key
                      ? "bg-[#edf6ff] text-accent"
                      : "text-foreground hover:bg-[#f7f9fc]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {commentTab === "pending" ? (
              <CabinetEmpty
                icon={ClockIcon}
                title="Kutilayotgan sharhlar yo'q"
                description="Mahsulot sahifasida qoldirilgan yangi sharhlar shu bo'limda vaqtincha ko'rinadi."
              />
            ) : data.comments.length === 0 ? (
              <CabinetEmpty
                icon={HeartIcon}
                title="Sizda hali sharhlar yo'q"
                description="Mahsulot sahifalarida izoh qoldirganingizdan keyin ular shu yerda jamlanadi."
              />
            ) : (
              <div className="grid gap-4">
                {data.comments.map((comment) => (
                  <article
                    key={comment.id}
                    className="grid gap-4 rounded-[24px] border border-line bg-[#fbfdff] p-4 sm:grid-cols-[108px_minmax(0,1fr)]"
                  >
                    <div className="w-[108px]">
                      <ProductVisual
                        size="deal"
                        kind={asProductKind(comment.kind)}
                        label={comment.heroLabel}
                        toneFrom={comment.toneFrom}
                        toneTo={comment.toneTo}
                        imageUrl={comment.imageUrl}
                        imageAlt={comment.productName}
                        productName={comment.productName}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <Link
                            href={`/product/${comment.productSlug}`}
                            className="text-lg font-semibold text-foreground transition hover:text-accent"
                          >
                            {comment.productName}
                          </Link>
                          <p className="mt-1 text-sm text-muted">{comment.createdAt}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-accent shadow-sm">
                          Nashr etilgan
                        </span>
                      </div>
                      <p className="mt-4 text-base leading-8 text-muted">{comment.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </CabinetSection>
        ) : null}

        {activeTab === "returns" ? (
          <CabinetSection title="Qaytarilganlar">
            <CabinetEmpty
              icon={PackageOffIcon}
              title="Qaytarilgan buyurtmalar yo'q"
              description="Bekor qilingan yoki qaytarilgan buyurtmalar shu bo'limda ko'rinadi."
            />
          </CabinetSection>
        ) : null}

        {activeTab === "promocodes" ? (
          <CabinetSection title="Mening promokodlarim">
            <CabinetEmpty
              icon={TargetIcon}
              title="Sizda hali promokodlar yo'q"
              description="Yangi aksiyalar va shaxsiy takliflar paydo bo'lsa, ular shu kabinet bo'limida ko'rinadi."
            />
          </CabinetSection>
        ) : null}

        {activeTab === "verification" ? (
          <CabinetSection title="Verifikatsiya">
            <div className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-[24px] border border-line bg-[#fbfdff] p-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#eef6ff] text-accent">
                  <LockShieldIcon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-lg font-semibold text-foreground">Telefon tasdiqlangan</p>
                <p className="mt-2 text-sm leading-7 text-muted">{viewer.displayPhone}</p>
              </article>

              <article className="rounded-[24px] border border-line bg-[#fbfdff] p-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#eefaf1] text-[#2d7a46]">
                  <SparklesIcon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-lg font-semibold text-foreground">
                  {data.verification.telegramConnected ? "Telegram ulangan" : "Telegram ulanmagan"}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {data.verification.telegramUsername
                    ? `@${data.verification.telegramUsername}`
                    : "@aloouz_verifybot orqali verifikatsiya qilinadi"}
                </p>
              </article>

              <article className="rounded-[24px] border border-line bg-[#fbfdff] p-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#edf6ff] text-accent">
                  <ClipboardIcon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-lg font-semibold text-foreground">Bildirishnomalar</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {data.smsOptIn
                    ? "SMS xabarnomalar yoqilgan."
                    : "SMS xabarnomalar hozircha o'chirilgan."}
                </p>
              </article>
            </div>
          </CabinetSection>
        ) : null}
      </div>
    </div>
  );
}
