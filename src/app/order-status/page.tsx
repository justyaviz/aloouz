/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import { ClipboardIcon, SearchIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatSum } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { hasDatabaseUrl } from "@/lib/storefront";

type OrderStatusPageProps = {
  searchParams: Promise<{
    number?: string;
    phone?: string;
  }>;
};

function normalizeInput(value?: string) {
  return value?.trim() ?? "";
}

function normalizePhone(value?: string) {
  return normalizeInput(value).replace(/\s+/g, "");
}

function formatOrderDate(value: Date) {
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(value)
    .replace(/\u00A0/g, " ");
}

function statusPresentation(status: string) {
  switch (status) {
    case "CONFIRMED":
      return { label: "Tasdiqlangan", className: "bg-[#eef6ff] text-accent" };
    case "PAID":
      return { label: "To'langan", className: "bg-[#eff8ef] text-[#2d7a46]" };
    case "FULFILLED":
      return { label: "Topshirilgan", className: "bg-[#f4f5ff] text-[#4f54d9]" };
    case "CANCELLED":
      return { label: "Bekor qilingan", className: "bg-[#fff1ea] text-support" };
    default:
      return { label: "Jarayonda", className: "bg-[#fff7dc] text-[#9a6a00]" };
  }
}

export const metadata = {
  title: "Buyurtma holati",
  description: "Buyurtma raqami va telefon orqali statusni tekshirish sahifasi",
};

export default async function OrderStatusPage({ searchParams }: OrderStatusPageProps) {
  const params = await searchParams;
  const number = normalizeInput(params.number);
  const phone = normalizePhone(params.phone);
  const hasLookupInput = Boolean(number && phone);

  let order:
    | {
        orderNumber: string;
        status: string;
        totalAmount: number;
        createdAt: Date;
        customer: {
          firstName: string;
          lastName: string | null;
          phone: string;
        };
        items: Array<{
          id: string;
          productName: string;
          quantity: number;
          unitPrice: number;
        }>;
      }
    | null = null;

  if (hasLookupInput && hasDatabaseUrl()) {
    try {
      order = await prisma.order.findFirst({
        where: {
          orderNumber: number,
          customer: {
            is: {
              phone,
            },
          },
        },
        include: {
          customer: true,
          items: {
            orderBy: {
              id: "asc",
            },
          },
        },
      });
    } catch (error) {
      console.error("Order lookup failed", error);
    }
  }

  const status = order ? statusPresentation(order.status) : null;

  return (
    <>
      <SiteHeader />
      <main className="shell py-6 pb-16">
        <section className="rounded-[32px] border border-line bg-white px-5 py-10 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:px-10">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#fff2ec] text-support">
              <ClipboardIcon className="h-8 w-8" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Buyurtma holati
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Buyurtmangiz qayergacha yetganini tekshiring
            </h1>
            <p className="mt-4 text-base leading-8 text-muted">
              Buyurtma raqami va telefon raqamingizni kiriting. Tizim mavjud bo'lsa ayni holatni shu yerning o'zida chiqaradi.
            </p>

            <form className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_240px_auto]" method="get">
              <input
                defaultValue={number}
                name="number"
                placeholder="Masalan: ALOO-2026-001"
                className="h-14 rounded-[20px] border border-line bg-[#fbfdff] px-5 text-sm text-foreground outline-none focus:border-accent"
              />
              <input
                defaultValue={normalizeInput(params.phone)}
                name="phone"
                placeholder="+998 91 123 45 67"
                className="h-14 rounded-[20px] border border-line bg-[#fbfdff] px-5 text-sm text-foreground outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-[20px] bg-support px-6 text-sm font-semibold text-white transition hover:bg-[#e45d07]"
              >
                <SearchIcon className="h-4 w-4" />
                Qidirish
              </button>
            </form>

            {!hasLookupInput ? (
              <div className="mt-8 rounded-[22px] bg-[#f6faff] px-5 py-5 text-sm leading-7 text-muted">
                Buyurtma raqami va telefon kiritilgach, holat, vaqt va ichidagi mahsulotlar shu sahifada ko'rinadi.
              </div>
            ) : order ? (
              <div className="mt-8 space-y-4 text-left">
                <div className="rounded-[28px] border border-line bg-[#fbfdff] p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                        Topildi
                      </p>
                      <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                        {order.orderNumber}
                      </h2>
                      <p className="mt-2 text-sm text-muted">{formatOrderDate(order.createdAt)}</p>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${status?.className}`}>
                      {status?.label}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[20px] bg-white px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Mijoz
                      </p>
                      <p className="mt-2 text-base font-semibold text-foreground">
                        {[order.customer.firstName, order.customer.lastName].filter(Boolean).join(" ")}
                      </p>
                      <p className="mt-1 text-sm text-muted">{order.customer.phone}</p>
                    </div>

                    <div className="rounded-[20px] bg-white px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Jami summa
                      </p>
                      <p className="mt-2 text-base font-semibold text-foreground">
                        {formatSum(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 rounded-[18px] border border-line bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{item.productName}</p>
                          <p className="mt-1 text-sm text-muted">{item.quantity} dona</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatSum(item.unitPrice)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-[22px] bg-[#fff5ef] px-5 py-5 text-sm leading-7 text-support">
                Bu ma'lumot bo'yicha buyurtma topilmadi. Buyurtma raqami yoki telefonni qayta tekshirib ko'ring.
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-[20px] border border-line bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
              >
                Katalogga o'tish
              </Link>
              <a
                href="tel:+998781220800"
                className="inline-flex items-center justify-center rounded-[20px] bg-[#0f2340] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#17345d]"
              >
                Operatorga qo'ng'iroq
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
