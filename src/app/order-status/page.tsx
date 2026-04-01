/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

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
      return { label: "Yakunda topshirilgan", className: "bg-[#f4f5ff] text-[#4f54d9]" };
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
        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[30px] border border-line bg-white p-8 shadow-[0_18px_45px_rgba(13,31,55,0.08)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Buyurtma holati
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
              Buyurtmangiz qayergacha yetganini tekshiring
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              MediaPark’dagi `Status заказа` oqimiga yaqin funksiya tayyorlandi. Buyurtma
              raqami va telefon raqamingizni kiriting, tizim mavjud bo'lsa hozirgi holatni
              chiqaradi.
            </p>

            <form className="mt-6 space-y-4" method="get">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Buyurtma raqami
                </label>
                <input
                  defaultValue={number}
                  name="number"
                  placeholder="Masalan: ALOO-2026-001"
                  className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Telefon raqami
                </label>
                <input
                  defaultValue={normalizeInput(params.phone)}
                  name="phone"
                  placeholder="+998 91 123 45 67"
                  className="h-12 w-full rounded-[16px] border border-line px-4 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-strong"
                >
                  Holatni tekshirish
                </button>
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center rounded-2xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:text-accent"
                >
                  Xaridni davom ettirish
                </Link>
              </div>
            </form>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                "Tasdiqlash bosqichi",
                "Yetkazib berishga tayyorlash",
                "Topshirilgan yoki pick-up holati",
              ].map((item) => (
                <div key={item} className="rounded-[18px] bg-[#f6faff] px-4 py-4 text-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-line bg-white p-8 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-10">
              {!hasLookupInput ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                    Natija
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                    Status shu yerda ko'rinadi
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted">
                    Buyurtma raqami va telefon kiritilgach, tizim topilgan buyurtma holatini
                    shu blokda ko'rsatadi.
                  </p>
                </>
              ) : order ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                        Topildi
                      </p>
                      <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                        {order.orderNumber}
                      </h2>
                    </div>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${status?.className}`}
                    >
                      {status?.label}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[18px] bg-[#f6faff] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Mijoz
                      </p>
                      <p className="mt-2 text-base font-semibold text-foreground">
                        {[order.customer.firstName, order.customer.lastName].filter(Boolean).join(" ")}
                      </p>
                      <p className="mt-1 text-sm text-muted">{order.customer.phone}</p>
                    </div>

                    <div className="rounded-[18px] bg-[#f6faff] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Vaqt
                      </p>
                      <p className="mt-2 text-base font-semibold text-foreground">
                        {formatOrderDate(order.createdAt)}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Jami: {formatSum(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 rounded-[18px] border border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
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
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-support">
                    Topilmadi
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                    Bu ma'lumot bo'yicha buyurtma topilmadi
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted">
                    Buyurtma raqami yoki telefon noto'g'ri kiritilgan bo'lishi mumkin. Qayta
                    tekshirib ko'ring yoki operator bilan bog'laning.
                  </p>
                </>
              )}
            </div>

            <div className="rounded-[30px] bg-[#0a1524] p-8 text-white shadow-[0_20px_50px_rgba(10,21,36,0.2)] sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                Yordam
              </p>
              <p className="mt-4 text-sm leading-7 text-white/76">
                Agar buyurtma topilmasa, operatorga telefon qiling yoki Telegram orqali yozing.
                Bu blok keyinchalik real call-center integratsiyasi uchun tayyorlandi.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="tel:+998911234567"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-foreground"
                >
                  Qo'ng'iroq qilish
                </a>
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
