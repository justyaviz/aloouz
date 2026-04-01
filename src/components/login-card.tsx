"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AppleIcon, CloseIcon } from "@/components/icons";

type LoginCardProps = {
  onClose?: () => void;
  className?: string;
};

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

export function LoginCard({ onClose, className }: LoginCardProps) {
  const [accepted, setAccepted] = useState(true);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"form" | "code" | "done">("form");
  const [message, setMessage] = useState<string | null>(null);

  const formattedPhone = useMemo(() => `+998 ${formatPhone(phone)}`.trim(), [phone]);

  function submitPhone() {
    if (!accepted) {
      setMessage("Davom etish uchun ommaviy ofertaga rozilik kerak.");
      return;
    }

    if (onlyDigits(phone).length < 9) {
      setMessage("Telefon raqamini to'liq kiriting.");
      return;
    }

    setMessage("Demo rejimda tasdiqlash kodi yuborildi.");
    setStep("code");
  }

  function submitCode() {
    if (code.trim().length < 4) {
      setMessage("Kamida 4 xonali kod kiriting.");
      return;
    }

    setMessage("Demo kabinet muvaffaqiyatli ochildi.");
    setStep("done");
  }

  function showProviderNotice(provider: string) {
    setMessage(
      `${provider} orqali kirish backend ulangach yoqiladi. Hozir telefon orqali demo oqim tayyor.`,
    );
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-[430px] rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(13,31,55,0.18)] sm:p-8",
        className,
      )}
    >
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-foreground transition hover:border-accent/35 hover:text-accent"
          aria-label="Modalni yopish"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      ) : null}

      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Kirish</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Kirish yoki ro&apos;yxatdan o&apos;tish
      </h2>

      {step === "form" ? (
        <>
          <div className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-foreground">Telefon</span>
              <div className="flex h-14 items-center rounded-[20px] border border-[#cfdceb] bg-white px-4 shadow-[0_10px_24px_rgba(13,31,55,0.04)]">
                <span className="text-base font-semibold text-foreground">+998</span>
                <input
                  value={formatPhone(phone)}
                  onChange={(event) => setPhone(onlyDigits(event.target.value))}
                  type="tel"
                  inputMode="numeric"
                  placeholder="90 123 45 67"
                  className="min-w-0 flex-1 bg-transparent px-3 text-base text-foreground outline-none placeholder:text-muted"
                />
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-[20px] border border-line bg-[#fbfdff] px-4 py-4">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-line"
              />
              <span className="text-sm leading-7 text-muted">
                Shartlar bilan tanishganligimni va ularga roziligimni tasdiqlayman.
                <span className="font-semibold text-accent"> Ommaviy oferta</span>
              </span>
            </label>

            <button
              type="button"
              onClick={submitPhone}
              className="inline-flex h-14 w-full items-center justify-center rounded-[20px] bg-support px-6 text-base font-semibold text-white transition hover:bg-[#e45d07]"
            >
              Kodni yuborish
            </button>
          </div>

          <div className="mt-7 flex items-center gap-4 text-sm text-muted">
            <div className="h-px flex-1 bg-line" />
            yoki
            <div className="h-px flex-1 bg-line" />
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => showProviderNotice("Google")}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-[20px] border border-line bg-[#f8fbfd] px-6 text-base font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#ea4335] shadow-sm">
                G
              </span>
              Google orqali kirish
            </button>
            <button
              type="button"
              onClick={() => showProviderNotice("Apple")}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-[20px] border border-line bg-[#f8fbfd] px-6 text-base font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
            >
              <AppleIcon className="h-6 w-6" />
              Apple orqali kirish
            </button>
          </div>
        </>
      ) : null}

      {step === "code" ? (
        <div className="mt-7 space-y-5">
          <div className="rounded-[22px] bg-[#f6faff] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Kod yuborildi
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {formattedPhone} raqamiga demo tasdiqlash kodi yuborildi. Istalgan 4 xonali kodni
              kiritsangiz davom etadi.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">
              Tasdiqlash kodi
            </span>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              type="text"
              inputMode="numeric"
              placeholder="0000"
              className="h-14 w-full rounded-[20px] border border-[#cfdceb] bg-white px-4 text-base tracking-[0.35em] text-foreground outline-none placeholder:text-muted"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={submitCode}
              className="inline-flex h-14 items-center justify-center rounded-[20px] bg-support px-6 text-base font-semibold text-white transition hover:bg-[#e45d07]"
            >
              Tasdiqlash
            </button>
            <button
              type="button"
              onClick={() => {
                setCode("");
                setStep("form");
                setMessage(null);
              }}
              className="inline-flex h-14 items-center justify-center rounded-[20px] border border-line bg-white px-6 text-base font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
            >
              Boshqa raqam
            </button>
          </div>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="mt-7 space-y-5">
          <div className="rounded-[22px] bg-[linear-gradient(180deg,#eef8ff_0%,#ffffff_100%)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Tayyor
            </p>
            <p className="mt-3 text-lg font-semibold text-foreground">
              {formattedPhone} uchun demo kabinet ochildi.
            </p>
            <p className="mt-2 text-sm leading-7 text-muted">
              Keyingi bosqichda bu joyga real SMS verifikatsiya va foydalanuvchi profili ulanadi.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/catalog"
              className="inline-flex h-14 items-center justify-center rounded-[20px] bg-support px-6 text-base font-semibold text-white transition hover:bg-[#e45d07]"
            >
              Katalogga o&apos;tish
            </Link>
            <button
              type="button"
              onClick={() => {
                setPhone("");
                setCode("");
                setStep("form");
                setMessage(null);
              }}
              className="inline-flex h-14 items-center justify-center rounded-[20px] border border-line bg-white px-6 text-base font-semibold text-foreground transition hover:border-accent/30 hover:text-accent"
            >
              Qayta kirish
            </button>
          </div>
        </div>
      ) : null}

      {message ? (
        <p className="mt-5 rounded-[18px] bg-[#f6faff] px-4 py-3 text-sm leading-6 text-muted">
          {message}
        </p>
      ) : null}
    </div>
  );
}
