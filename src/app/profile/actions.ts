"use server";

import { revalidatePath } from "next/cache";

import { getAuthViewer, parseCustomerPhone } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { hasDatabaseUrl } from "@/lib/storefront";

export type CustomerProfileFormState = {
  error?: string;
  success?: string;
};

export type CustomerAddressFormState = {
  error?: string;
  success?: string;
};

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function toDateOrNull(value: string) {
  if (!value) {
    return null;
  }

  const nextValue = new Date(`${value}T00:00:00`);
  return Number.isNaN(nextValue.getTime()) ? null : nextValue;
}

export async function updateCustomerProfileAction(
  _previousState: CustomerProfileFormState,
  formData: FormData,
): Promise<CustomerProfileFormState> {
  if (!hasDatabaseUrl()) {
    return { error: "Database ulanmagan." };
  }

  const viewer = await getAuthViewer();

  if (!viewer) {
    return { error: "Avval tizimga qayta kiring." };
  }

  const firstName = asString(formData.get("firstName"));
  const lastName = asString(formData.get("lastName"));
  const birthDateValue = asString(formData.get("birthDate"));
  const gender = asString(formData.get("gender"));
  const smsOptIn = formData.get("smsOptIn") === "on";

  if (firstName.length < 2) {
    return { error: "Ism kamida 2 ta belgidan iborat bo'lsin." };
  }

  const birthDate = birthDateValue ? toDateOrNull(birthDateValue) : null;

  if (birthDateValue && !birthDate) {
    return { error: "Tug'ilgan sana noto'g'ri kiritildi." };
  }

  if (gender && !["male", "female", "not_specified"].includes(gender)) {
    return { error: "Jins qiymati noto'g'ri." };
  }

  await prisma.customer.update({
    where: { id: viewer.id },
    data: {
      firstName,
      lastName: lastName || null,
      birthDate,
      gender: gender || null,
      smsOptIn,
    },
  });

  revalidatePath("/profile");
  return { success: "Shaxsiy ma'lumotlar saqlandi." };
}

export async function addCustomerAddressAction(
  _previousState: CustomerAddressFormState,
  formData: FormData,
): Promise<CustomerAddressFormState> {
  if (!hasDatabaseUrl()) {
    return { error: "Database ulanmagan." };
  }

  const viewer = await getAuthViewer();

  if (!viewer) {
    return { error: "Avval tizimga qayta kiring." };
  }

  const title = asString(formData.get("title"));
  const recipientName = asString(formData.get("recipientName"));
  const phoneInput = asString(formData.get("phone"));
  const city = asString(formData.get("city"));
  const district = asString(formData.get("district"));
  const line1 = asString(formData.get("line1"));
  const landmark = asString(formData.get("landmark"));
  const makePrimary = formData.get("isPrimary") === "on";

  if (title.length < 2) {
    return { error: "Manzil nomini kiriting." };
  }

  if (recipientName.length < 2) {
    return { error: "Qabul qiluvchi ismini kiriting." };
  }

  if (city.length < 2) {
    return { error: "Shahar yoki hududni kiriting." };
  }

  if (line1.length < 6) {
    return { error: "Manzilni to'liqroq kiriting." };
  }

  const parsedPhone = parseCustomerPhone(phoneInput || viewer.phone);

  if (!parsedPhone) {
    return { error: "Telefon raqami noto'g'ri." };
  }

  const addressCount = await prisma.customerAddress.count({
    where: { customerId: viewer.id },
  });

  const isPrimary = makePrimary || addressCount === 0;

  await prisma.$transaction(async (tx) => {
    if (isPrimary) {
      await tx.customerAddress.updateMany({
        where: { customerId: viewer.id },
        data: { isPrimary: false },
      });
    }

    await tx.customerAddress.create({
      data: {
        title,
        recipientName,
        phone: parsedPhone.normalized,
        city,
        district: district || null,
        line1,
        landmark: landmark || null,
        isPrimary,
        customerId: viewer.id,
      },
    });
  });

  revalidatePath("/profile");
  return { success: "Yangi manzil qo'shildi." };
}

export async function setPrimaryCustomerAddressAction(formData: FormData) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const viewer = await getAuthViewer();

  if (!viewer) {
    return;
  }

  const addressId = asString(formData.get("addressId"));

  if (!addressId) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const address = await tx.customerAddress.findFirst({
      where: {
        id: addressId,
        customerId: viewer.id,
      },
      select: { id: true },
    });

    if (!address) {
      return;
    }

    await tx.customerAddress.updateMany({
      where: { customerId: viewer.id },
      data: { isPrimary: false },
    });

    await tx.customerAddress.update({
      where: { id: address.id },
      data: { isPrimary: true },
    });
  });

  revalidatePath("/profile");
}

export async function deleteCustomerAddressAction(formData: FormData) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const viewer = await getAuthViewer();

  if (!viewer) {
    return;
  }

  const addressId = asString(formData.get("addressId"));

  if (!addressId) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const address = await tx.customerAddress.findFirst({
      where: {
        id: addressId,
        customerId: viewer.id,
      },
      select: {
        id: true,
        isPrimary: true,
      },
    });

    if (!address) {
      return;
    }

    await tx.customerAddress.delete({
      where: { id: address.id },
    });

    if (address.isPrimary) {
      const nextAddress = await tx.customerAddress.findFirst({
        where: { customerId: viewer.id },
        orderBy: [{ createdAt: "desc" }],
        select: { id: true },
      });

      if (nextAddress) {
        await tx.customerAddress.update({
          where: { id: nextAddress.id },
          data: { isPrimary: true },
        });
      }
    }
  });

  revalidatePath("/profile");
}
