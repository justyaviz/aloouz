"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";

import {
  requestTelegramLoginAction,
  verifyTelegramLoginAction,
  type TelegramLoginRequestState,
  type TelegramLoginVerifyState,
} from "@/app/login/actions";
import { CloseIcon, LockShieldIcon, TelegramIcon } from "@/components/icons";

type LoginCardProps = {
  onClose?: () => void;
  className?: string;
  redirectTo?: string;
};

const initialRequestState: TelegramLoginRequestState = {};
const initialVerifyState: TelegramLoginVerifyState = {};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 9);
}

function formatPhone(value: string) {
  const digits = onlyDigits(value);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);

  return parts.join(" ");
}

function RequestButton({ hasChallenge }: { hasChallenge: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-accent px-6 text-base font-semibold text-white transition hover:bg-accent-strong disabled:cursor-wait disabled:opacity-70"
    >
      <TelegramIcon className="h-5 w-5" />
      {pending
        ? "Yuborilmoqda..."
        : hasChallenge
          ? "Kodni qayta yuborish"
          : "Telegram orqali kod olish"}
    </button>
  );
}

function VerifyButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-14 w-full items-center justify-center rounded-[20px] bg-[#123a72] px-6 text-base font-semibold text-white transition hover:bg-[#0f3160] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Tasdiqlanmoqda..." : "Kodni tasdiqlash"}
    </button>
  );
}

export function LoginCard({ onClose, className, redirectTo: redirectOverride }: LoginCardProps) {
  const pathname = usePathname();
  const [accepted, setAccepted] = useState(true);
  const [phone, setPhone] = useState("");
  const [requestState, requestAction] = useActionState(
    requestTelegramLoginAction,
    initialRequestState,
  );
  const [verifyState, verifyAction] = useActionState(
    verifyTelegramLoginAction,
    initialVerifyState,
  );

  const formattedPhone = useMemo(() => formatPhone(phone), [phone]);
  const redirectTo = redirectOverride ?? (pathname === "/login" ? "/profile" : pathname);
  const hasChallenge = Boolean(requestState.challengeId);

  return (
    <div
      className={cn(
        "relative w-full max-w-[440px] rounded-[32px] border border-white/70 bg-white p-5 shadow-[0_30px_90px_rgba(13,31,55,0.18)] sm:p-8",
        className,
      )}
    >
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#cfe0ef] bg-white text-foreground transition hover:border-accent/35 hover:text-accent"
          aria-label="Modalni yopish"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      ) : null}

      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Kirish</p>
      <h2 className="mt-4 max-w-[13ch] font-display text-[2rem] font-semibold tracking-tight text-foreground sm:max-w-none sm:text-4xl">
        Telegram orqali tasdiqlash
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted">
        Telefon raqamingizni kiriting, @aloouz_verifybot orqali bir martalik kod oling va
        tasdiqlang. Kod 2 daqiqa davomida amal qiladi.
      </p>

      <form action={requestAction} className="mt-7 space-y-5">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Telefon *</span>
          <div className="flex h-14 items-center rounded-[20px] border border-[#cfdceb] bg-white px-4 shadow-[0_10px_24px_rgba(13,31,55,0.04)]">
            <span className="text-base font-semibold text-foreground">+998</span>
            <input
              value={formattedPhone}
              onChange={(event) => setPhone(onlyDigits(event.target.value))}
              type="tel"
              name="phone"
              inputMode="numeric"
              placeholder="90 123 45 67"
              className="min-w-0 flex-1 bg-transparent px-3 text-base text-foreground outline-none placeholder:text-muted"
            />
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-4">
          <input
            type="checkbox"
            name="accepted"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-line"
          />
          <span className="text-sm font-medium leading-7 text-foreground">
            Shartlar bilan tanishganligimni va ularga roziligimni tasdiqlayman.
            <span className="font-semibold text-accent"> Ommaviy oferta</span>
          </span>
        </label>

        <RequestButton hasChallenge={hasChallenge} />
      </form>

      {requestState.info ? (
        <div className="mt-5 rounded-[20px] border border-[#d8e7f5] bg-[#f7fbff] px-4 py-4 text-sm leading-6 text-foreground">
          {requestState.info}
          {requestState.displayPhone ? (
            <p className="mt-2 font-semibold text-accent">{requestState.displayPhone}</p>
          ) : null}
        </div>
      ) : null}

      {requestState.botUrl ? (
        <Link
          href={requestState.botUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[18px] border border-[#dce8f3] bg-white px-5 text-sm font-semibold text-[#123a72] transition hover:border-[#123a72]/30 hover:bg-[#f7fbff]"
        >
          <TelegramIcon className="h-4 w-4" />
          Telegram botni ochish
        </Link>
      ) : null}

      {hasChallenge ? (
        <form action={verifyAction} className="mt-5 space-y-4 rounded-[24px] border border-line bg-[#fbfdff] p-4 sm:p-5">
          <input type="hidden" name="challengeId" value={requestState.challengeId} />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">Tasdiqlash kodi</span>
            <input
              type="text"
              name="code"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="h-14 w-full rounded-[18px] border border-[#cfdceb] bg-white px-4 text-center text-lg font-semibold tracking-[0.24em] text-foreground outline-none placeholder:tracking-normal placeholder:text-muted"
            />
          </label>

          <p className="text-sm leading-6 text-muted">
            Kod Telegram bot ichida chiqadi. Agar avvaldan bog&apos;langan raqam bo&apos;lsa, u darhol
            yuboriladi.
          </p>

          <VerifyButton />
        </form>
      ) : null}

      <div className="mt-6 rounded-[22px] border border-[#dfeaf4] bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)] p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#eef6ff] text-accent">
            <LockShieldIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">2 daqiqalik bir martalik kod</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Har bir kod faqat bir marta ishlaydi va tasdiqlangandan keyin shaxsiy profilingiz
              ochiladi.
            </p>
          </div>
        </div>
      </div>

      {requestState.error ? (
        <p className="mt-5 rounded-[18px] bg-[#edf6ff] px-4 py-3 text-sm leading-6 text-accent">
          {requestState.error}
        </p>
      ) : null}

      {verifyState.error ? (
        <p className="mt-5 rounded-[18px] bg-[#edf6ff] px-4 py-3 text-sm leading-6 text-accent">
          {verifyState.error}
        </p>
      ) : null}
    </div>
  );
}
