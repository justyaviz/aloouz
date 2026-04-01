import { prisma } from "@/lib/prisma";
import { resolveProductImageUrl } from "@/lib/product-images";
import { hasDatabaseUrl } from "@/lib/storefront";

type OrderStatusKey = "all" | "active" | "fulfilled" | "cancelled";

export type CustomerCabinetAddress = {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  city: string;
  district?: string;
  line1: string;
  landmark?: string;
  isPrimary: boolean;
  createdAt: string;
};

export type CustomerCabinetOrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  productName: string;
  productSlug?: string;
  imageUrl?: string;
  kind: string;
  heroLabel: string;
  toneFrom: string;
  toneTo: string;
};

export type CustomerCabinetOrder = {
  id: string;
  orderNumber: string;
  status: string;
  statusLabel: string;
  statusGroup: OrderStatusKey;
  createdAt: string;
  totalAmount: number;
  address?: string;
  note?: string;
  items: CustomerCabinetOrderItem[];
};

export type CustomerCabinetComment = {
  id: string;
  body: string;
  createdAt: string;
  productName: string;
  productSlug: string;
  imageUrl?: string;
  kind: string;
  heroLabel: string;
  toneFrom: string;
  toneTo: string;
};

export type CustomerCabinetData = {
  birthDate?: string;
  gender?: string;
  smsOptIn: boolean;
  addresses: CustomerCabinetAddress[];
  orders: CustomerCabinetOrder[];
  comments: CustomerCabinetComment[];
  verification: {
    phoneVerified: boolean;
    telegramConnected: boolean;
    telegramUsername?: string;
    telegramName?: string;
  };
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(value)
    .replace(/\u00A0/g, " ");
}

function formatDateInput(value: Date | null | undefined) {
  if (!value) {
    return undefined;
  }

  return value.toISOString().slice(0, 10);
}

function parseOrderNotes(notes?: string | null) {
  if (!notes) {
    return {
      address: undefined,
      note: undefined,
    };
  }

  const lines = notes
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const addressLine = lines.find((line) => line.toLowerCase().startsWith("manzil:"));
  const noteLine = lines.find((line) => line.toLowerCase().startsWith("izoh:"));

  return {
    address: addressLine ? addressLine.replace(/^manzil:\s*/i, "") : undefined,
    note: noteLine ? noteLine.replace(/^izoh:\s*/i, "") : undefined,
  };
}

function mapOrderStatus(status: string) {
  switch (status) {
    case "FULFILLED":
      return {
        label: "Bajarildi",
        group: "fulfilled" as const,
      };
    case "CANCELLED":
      return {
        label: "Bekor qilindi",
        group: "cancelled" as const,
      };
    case "CONFIRMED":
    case "PAID":
      return {
        label: "Faol",
        group: "active" as const,
      };
    default:
      return {
        label: "Kutilmoqda",
        group: "active" as const,
      };
  }
}

export async function getCustomerCabinetData(customerId: string, phone: string): Promise<CustomerCabinetData> {
  if (!hasDatabaseUrl()) {
    return {
      smsOptIn: false,
      addresses: [],
      orders: [],
      comments: [],
      verification: {
        phoneVerified: true,
        telegramConnected: false,
      },
    };
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      birthDate: true,
      gender: true,
      smsOptIn: true,
      telegramIdentity: {
        select: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
      addresses: {
        orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
      },
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                select: {
                  slug: true,
                  imageAssetId: true,
                  imageUrl: true,
                  kind: true,
                  heroLabel: true,
                  toneFrom: true,
                  toneTo: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const comments = await prisma.productComment.findMany({
    where: {
      phone,
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: {
        select: {
          slug: true,
          name: true,
          imageAssetId: true,
          imageUrl: true,
          kind: true,
          heroLabel: true,
          toneFrom: true,
          toneTo: true,
        },
      },
    },
  });

  return {
    birthDate: formatDateInput(customer?.birthDate),
    gender: customer?.gender ?? undefined,
    smsOptIn: customer?.smsOptIn ?? false,
    addresses:
      customer?.addresses.map((address) => ({
        id: address.id,
        title: address.title,
        recipientName: address.recipientName,
        phone: address.phone,
        city: address.city,
        district: address.district ?? undefined,
        line1: address.line1,
        landmark: address.landmark ?? undefined,
        isPrimary: address.isPrimary,
        createdAt: formatDate(address.createdAt),
      })) ?? [],
    orders:
      customer?.orders.map((order) => {
        const status = mapOrderStatus(order.status);
        const details = parseOrderNotes(order.notes);

        return {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          statusLabel: status.label,
          statusGroup: status.group,
          createdAt: formatDate(order.createdAt),
          totalAmount: order.totalAmount,
          address: details.address,
          note: details.note,
          items: order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            productName: item.productName,
            productSlug: item.product?.slug ?? undefined,
            imageUrl: resolveProductImageUrl(item.product?.imageAssetId, item.product?.imageUrl),
            kind: item.product?.kind ?? "phone",
            heroLabel: item.product?.heroLabel ?? "Original",
            toneFrom: item.product?.toneFrom ?? "#EAF4FF",
            toneTo: item.product?.toneTo ?? "#A8D6FF",
          })),
        };
      }) ?? [],
    comments: comments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      createdAt: formatDate(comment.createdAt),
      productName: comment.product.name,
      productSlug: comment.product.slug,
      imageUrl: resolveProductImageUrl(comment.product.imageAssetId, comment.product.imageUrl),
      kind: comment.product.kind,
      heroLabel: comment.product.heroLabel,
      toneFrom: comment.product.toneFrom,
      toneTo: comment.product.toneTo,
    })),
    verification: {
      phoneVerified: true,
      telegramConnected: Boolean(customer?.telegramIdentity),
      telegramUsername: customer?.telegramIdentity?.username ?? undefined,
      telegramName: [customer?.telegramIdentity?.firstName, customer?.telegramIdentity?.lastName]
        .filter(Boolean)
        .join(" ") || undefined,
    },
  };
}
