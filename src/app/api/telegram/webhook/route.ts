import { NextResponse } from "next/server";

import {
  getTelegramWebhookSecret,
  handleTelegramContactMessage,
  handleTelegramStartCommand,
} from "@/lib/telegram-login";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat?: {
      id: number;
    };
    from?: {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
    contact?: {
      phone_number: string;
      user_id?: number;
    };
  };
};

function isAuthorized(request: Request) {
  const secret = getTelegramWebhookSecret();

  if (!secret) {
    return true;
  }

  return request.headers.get("x-telegram-bot-api-secret-token") === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const update = (await request.json()) as TelegramUpdate;
    const message = update.message;

    if (!message?.chat?.id || !message.from) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);

    if (typeof message.text === "string" && message.text.startsWith("/start")) {
      const [, startToken] = message.text.trim().split(/\s+/, 2);

      await handleTelegramStartCommand({
        startToken,
        chatId,
        user: message.from,
      });

      return NextResponse.json({ ok: true });
    }

    if (message.contact?.phone_number) {
      await handleTelegramContactMessage({
        chatId,
        user: message.from,
        phone: message.contact.phone_number,
        contactUserId: message.contact.user_id,
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
