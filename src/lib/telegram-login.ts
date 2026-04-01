import { createHash, randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { createCustomerSession, parseCustomerPhone } from "@/lib/customer-auth";
import { hasDatabaseUrl } from "@/lib/storefront";

const TELEGRAM_CODE_TTL_SECONDS = 120;
const TELEGRAM_CHALLENGE_TTL_MINUTES = 15;

type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type StartChallengeInput = {
  phone: string;
  redirectTo: string;
};

type StartChallengeResult = {
  challengeId: string;
  displayPhone: string;
  botUrl: string;
  codeSent: boolean;
};

type VerifyChallengeInput = {
  challengeId: string;
  code: string;
};

type VerifyChallengeResult = {
  redirectTo: string;
};

function getCustomerSessionSecret() {
  return process.env.CUSTOMER_SESSION_SECRET ?? "aloo-customer-dev-secret";
}

function getTelegramBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
}

function getTelegramBotUsername() {
  return process.env.TELEGRAM_BOT_USERNAME?.trim() || "aloouz_verifybot";
}

export function getTelegramWebhookSecret() {
  return process.env.TELEGRAM_WEBHOOK_SECRET?.trim() ?? "";
}

export function isTelegramLoginConfigured() {
  return Boolean(hasDatabaseUrl() && getTelegramBotToken());
}

function normalizeCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

function getChallengeWindowStart() {
  return new Date(Date.now() - TELEGRAM_CHALLENGE_TTL_MINUTES * 60 * 1000);
}

function hashTelegramCode(code: string) {
  return createHash("sha256")
    .update(`${normalizeCode(code)}.${getCustomerSessionSecret()}`)
    .digest("hex");
}

function createStartToken() {
  return randomBytes(18).toString("base64url");
}

function createOneTimeCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function escapeTelegramText(value: string) {
  return value.replace(/[&<>]/g, (character) => {
    if (character === "&") {
      return "&amp;";
    }

    if (character === "<") {
      return "&lt;";
    }

    return "&gt;";
  });
}

async function callTelegramApi(method: string, body: Record<string, unknown>) {
  const token = getTelegramBotToken();

  if (!token) {
    throw new Error("Telegram bot token topilmadi.");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Telegram API xatosi: ${response.status}`);
  }

  const payload = (await response.json()) as { ok?: boolean; description?: string };

  if (!payload.ok) {
    throw new Error(payload.description ?? "Telegram API so'rovi bajarilmadi.");
  }
}

async function sendTelegramMessage(
  chatId: string,
  text: string,
  extra?: Record<string, unknown>,
) {
  await callTelegramApi("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...extra,
  });
}

function formatExpiresLabel() {
  return `${Math.floor(TELEGRAM_CODE_TTL_SECONDS / 60)} daqiqa`;
}

async function issueLoginCodeForChallenge(params: {
  challengeId: string;
  phone: string;
  chatId: string;
  firstName?: string | null;
}) {
  const code = createOneTimeCode();
  const expiresAt = new Date(Date.now() + TELEGRAM_CODE_TTL_SECONDS * 1000);

  await prisma.telegramLoginChallenge.update({
    where: { id: params.challengeId },
    data: {
      codeHash: hashTelegramCode(code),
      codeSentAt: new Date(),
      codeExpiresAt: expiresAt,
    },
  });

  const parsedPhone = parseCustomerPhone(params.phone);
  const greetingName = params.firstName?.trim() || "mijoz";

  await sendTelegramMessage(
    params.chatId,
    [
      `Salom, <b>${escapeTelegramText(greetingName)}</b>.`,
      "",
      `aloo saytiga kirish kodi: <b>${code}</b>`,
      `${parsedPhone ? `Telefon: <b>${escapeTelegramText(parsedPhone.display)}</b>` : ""}`,
      `Kod ${formatExpiresLabel()} ichida tugaydi.`,
    ]
      .filter(Boolean)
      .join("\n"),
    {
      reply_markup: {
        remove_keyboard: true,
      },
    },
  );
}

async function syncTelegramIdentity(input: {
  phone: string;
  telegramUserId: string;
  telegramChatId: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}) {
  const customer = await prisma.customer.findUnique({
    where: { phone: input.phone },
    select: { id: true },
  });

  const matches = await prisma.telegramIdentity.findMany({
    where: {
      OR: [
        { phone: input.phone },
        { telegramUserId: input.telegramUserId },
        { telegramChatId: input.telegramChatId },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const [primary, ...duplicates] = matches;

  if (duplicates.length > 0) {
    await prisma.telegramIdentity.deleteMany({
      where: {
        id: {
          in: duplicates.map((item) => item.id),
        },
      },
    });
  }

  if (primary) {
    return prisma.telegramIdentity.update({
      where: { id: primary.id },
      data: {
        phone: input.phone,
        telegramUserId: input.telegramUserId,
        telegramChatId: input.telegramChatId,
        username: input.username ?? null,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        customerId: customer?.id ?? null,
      },
    });
  }

  return prisma.telegramIdentity.create({
    data: {
      phone: input.phone,
      telegramUserId: input.telegramUserId,
      telegramChatId: input.telegramChatId,
      username: input.username ?? null,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      customerId: customer?.id ?? null,
    },
  });
}

export async function startTelegramLoginChallenge(
  input: StartChallengeInput,
): Promise<StartChallengeResult> {
  if (!hasDatabaseUrl()) {
    throw new Error("Database ulanmagan.");
  }

  if (!getTelegramBotToken()) {
    throw new Error("Telegram bot hali sozlanmagan.");
  }

  const parsedPhone = parseCustomerPhone(input.phone);

  if (!parsedPhone) {
    throw new Error("Telefon raqamini to'liq kiriting.");
  }

  const challenge = await prisma.telegramLoginChallenge.create({
    data: {
      phone: parsedPhone.normalized,
      redirectTo: input.redirectTo,
      startToken: createStartToken(),
    },
    select: {
      id: true,
      phone: true,
      startToken: true,
    },
  });

  const identity = await prisma.telegramIdentity.findUnique({
    where: { phone: parsedPhone.normalized },
  });

  let codeSent = false;

  if (identity) {
    await issueLoginCodeForChallenge({
      challengeId: challenge.id,
      phone: challenge.phone,
      chatId: identity.telegramChatId,
      firstName: identity.firstName,
    });
    codeSent = true;
  }

  return {
    challengeId: challenge.id,
    displayPhone: parsedPhone.display,
    botUrl: `https://t.me/${getTelegramBotUsername()}?start=${challenge.startToken}`,
    codeSent,
  };
}

export async function verifyTelegramLoginChallenge(
  input: VerifyChallengeInput,
): Promise<VerifyChallengeResult> {
  if (!hasDatabaseUrl()) {
    throw new Error("Database ulanmagan.");
  }

  const code = normalizeCode(input.code);

  if (code.length !== 6) {
    throw new Error("6 xonali kodni kiriting.");
  }

  const challenge = await prisma.telegramLoginChallenge.findUnique({
    where: { id: input.challengeId },
  });

  if (!challenge || challenge.consumedAt || challenge.verifiedAt) {
    throw new Error("Tasdiqlash sessiyasi topilmadi. Qaytadan urinib ko'ring.");
  }

  if (!challenge.codeHash || !challenge.codeExpiresAt) {
    throw new Error("Kod hali yuborilmadi. Avval Telegram orqali kodni oling.");
  }

  if (challenge.codeExpiresAt.getTime() <= Date.now()) {
    throw new Error("Kodning muddati tugagan. Yangisini yuboring.");
  }

  if (challenge.codeHash !== hashTelegramCode(code)) {
    throw new Error("Kod noto'g'ri. Telegramdagi bir martalik kodni tekshiring.");
  }

  const identity = await prisma.telegramIdentity.findUnique({
    where: { phone: challenge.phone },
  });

  await createCustomerSession(challenge.phone, {
    firstName: identity?.firstName ?? challenge.telegramFirstName ?? undefined,
    lastName: identity?.lastName ?? challenge.telegramLastName ?? undefined,
  });

  const customer = await prisma.customer.findUnique({
    where: { phone: challenge.phone },
    select: { id: true },
  });

  if (identity && customer && identity.customerId !== customer.id) {
    await prisma.telegramIdentity.update({
      where: { id: identity.id },
      data: {
        customerId: customer.id,
      },
    });
  }

  await prisma.telegramLoginChallenge.update({
    where: { id: challenge.id },
    data: {
      verifiedAt: new Date(),
      consumedAt: new Date(),
    },
  });

  return {
    redirectTo: challenge.redirectTo === "/login" ? "/profile" : challenge.redirectTo,
  };
}

export async function handleTelegramStartCommand(params: {
  startToken?: string;
  chatId: string;
  user: TelegramUser;
}) {
  if (!hasDatabaseUrl()) {
    return;
  }

  if (!params.startToken) {
    await sendTelegramMessage(
      params.chatId,
      "Saytga qayting, telefon raqamingizni kiriting va keyin shu bot orqali tasdiqlang.",
    );
    return;
  }

  const challenge = await prisma.telegramLoginChallenge.findUnique({
    where: { startToken: params.startToken },
  });

  if (
    !challenge ||
    challenge.consumedAt ||
    challenge.createdAt.getTime() < getChallengeWindowStart().getTime()
  ) {
    await sendTelegramMessage(
      params.chatId,
      "Bu kirish havolasi eskirgan. Saytga qaytib, kod olishni qaytadan boshlang.",
    );
    return;
  }

  await prisma.telegramLoginChallenge.update({
    where: { id: challenge.id },
    data: {
      telegramUserId: String(params.user.id),
      telegramChatId: params.chatId,
      telegramUsername: params.user.username ?? null,
      telegramFirstName: params.user.first_name ?? null,
      telegramLastName: params.user.last_name ?? null,
    },
  });

  const identity = await prisma.telegramIdentity.findFirst({
    where: {
      OR: [
        { telegramUserId: String(params.user.id) },
        { telegramChatId: params.chatId },
      ],
    },
  });

  if (identity?.phone === challenge.phone) {
    await issueLoginCodeForChallenge({
      challengeId: challenge.id,
      phone: challenge.phone,
      chatId: params.chatId,
      firstName: identity.firstName,
    });

    return;
  }

  await sendTelegramMessage(
    params.chatId,
    [
      "Telefon raqamingizni tasdiqlash uchun pastdagi tugma orqali kontaktni yuboring.",
      "",
      "Faqat shu raqamga tegishli bir martalik kod beriladi va u 2 daqiqada tugaydi.",
    ].join("\n"),
    {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Telefon raqamni yuborish",
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    },
  );
}

export async function handleTelegramContactMessage(params: {
  chatId: string;
  user: TelegramUser;
  phone: string;
  contactUserId?: number;
}) {
  if (!hasDatabaseUrl()) {
    return;
  }

  if (params.contactUserId && params.contactUserId !== params.user.id) {
    await sendTelegramMessage(
      params.chatId,
      "Iltimos, aynan o'zingizga tegishli Telegram kontaktini yuboring.",
    );
    return;
  }

  const parsedPhone = parseCustomerPhone(params.phone);

  if (!parsedPhone) {
    await sendTelegramMessage(
      params.chatId,
      "Telefon raqam formati noto'g'ri. Saytdagi raqam bilan bir xil kontaktni yuboring.",
    );
    return;
  }

  const challenge = await prisma.telegramLoginChallenge.findFirst({
    where: {
      consumedAt: null,
      verifiedAt: null,
      createdAt: {
        gte: getChallengeWindowStart(),
      },
      OR: [
        { telegramUserId: String(params.user.id) },
        { telegramChatId: params.chatId },
      ],
    },
    orderBy: [
      { updatedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  if (!challenge) {
    await sendTelegramMessage(
      params.chatId,
      "Aktiv kirish so'rovi topilmadi. Saytga qaytib, qayta urinib ko'ring.",
    );
    return;
  }

  if (challenge.phone !== parsedPhone.normalized) {
    await sendTelegramMessage(
      params.chatId,
      [
        `Saytda kiritilgan raqam: <b>${escapeTelegramText(parseCustomerPhone(challenge.phone)?.display ?? challenge.phone)}</b>`,
        `Telegram kontakti: <b>${escapeTelegramText(parsedPhone.display)}</b>`,
        "",
        "Raqamlar mos kelmadi. Saytga qaytib, shu Telegram raqam bilan bir xil telefonni kiriting.",
      ].join("\n"),
      {
        reply_markup: {
          remove_keyboard: true,
        },
      },
    );
    return;
  }

  const identity = await syncTelegramIdentity({
    phone: parsedPhone.normalized,
    telegramUserId: String(params.user.id),
    telegramChatId: params.chatId,
    username: params.user.username ?? null,
    firstName: params.user.first_name ?? null,
    lastName: params.user.last_name ?? null,
  });

  await prisma.telegramLoginChallenge.update({
    where: { id: challenge.id },
    data: {
      telegramUserId: identity.telegramUserId,
      telegramChatId: identity.telegramChatId,
      telegramUsername: identity.username,
      telegramFirstName: identity.firstName,
      telegramLastName: identity.lastName,
    },
  });

  await issueLoginCodeForChallenge({
    challengeId: challenge.id,
    phone: challenge.phone,
    chatId: params.chatId,
    firstName: identity.firstName,
  });
}
