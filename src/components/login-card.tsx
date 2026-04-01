"use client";

import { useActionState, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";

import { loginCustomerAction } from "@/app/login/actions";
import { CloseIcon, LockShieldIcon } from "@/components/icons";

type LoginCardProps = {
  onClose?: () => void;
  className?: string;
};

const initialLoginFormState: { error?: string } = {};

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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-14 w-full items-center justify-center rounded-[20px] bg-support px-6 text-base font-semibold text-white transition hover:bg-[#e45d07] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Kirish..." : "Kirish"}
    </button>
  );
}

export function LoginCard({ onClose, className }: LoginCardProps) {
  const pathname = usePathname();
  const [accepted, setAccepted] = useState(true);
  const [phone, setPhone] = useState("");
  const [state, formAction] = useActionState(loginCustomerAction, initialLoginFormState);

  const formattedPhone = useMemo(() => formatPhone(phone), [phone]);
  const redirectTo = pathname === "/login" ? "/login" : pathname;

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
        Telefon orqali kabinetga kirish
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted">
        Raqamingiz orqali himoyalangan session ochiladi va buyurtmalar, sevimlilar hamda shaxsiy
        kabinetga kirish yoqiladi.
      </p>

      <form action={formAction} className="mt-7 space-y-5">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Telefon</span>
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
          <span className="text-sm leading-7 text-muted">
            Shartlar bilan tanishganligimni va ularga roziligimni tasdiqlayman.
            <span className="font-semibold text-accent"> Ommaviy oferta</span>
          </span>
        </label>

        <SubmitButton />
      </form>

      <div className="mt-6 rounded-[22px] border border-[#dfeaf4] bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)] p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#eef6ff] text-accent">
            <LockShieldIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Xavfsiz backend session</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Kirish holati server cookie orqali saqlanadi. Chiqish qilganingizda session darhol
              bekor bo&apos;ladi.
            </p>
          </div>
        </div>
      </div>

      {state.error ? (
        <p className="mt-5 rounded-[18px] bg-[#fff2ec] px-4 py-3 text-sm leading-6 text-support">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
