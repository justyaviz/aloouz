"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import type { ProductCommentView } from "@/lib/storefront";

import { submitProductCommentAction } from "@/app/product/[slug]/actions";

type ProductCommentsSectionProps = {
  productId: string;
  productSlug: string;
  comments: ProductCommentView[];
  initialName?: string;
  initialPhone?: string;
};

function onlyDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  const localDigits = digits.length === 12 && digits.startsWith("998") ? digits.slice(3) : digits;
  return localDigits.slice(0, 9);
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
      className="inline-flex h-12 items-center justify-center rounded-[18px] bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Yuborilmoqda..." : "Izoh qoldirish"}
    </button>
  );
}

export function ProductCommentsSection({
  productId,
  productSlug,
  comments,
  initialName,
  initialPhone,
}: ProductCommentsSectionProps) {
  const [state, formAction] = useActionState(submitProductCommentAction, {});
  const [phone, setPhone] = useState(initialPhone ? onlyDigits(initialPhone) : "");
  const formattedPhone = useMemo(() => formatPhone(phone), [phone]);

  return (
    <section className="rounded-[32px] border border-line bg-white p-6 shadow-[0_12px_30px_rgba(13,31,55,0.06)] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Izohlar</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
            Mijozlar fikri
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Mahsulot haqida savol, fikr yoki foydalanish tajribangizni shu yerda qoldirishingiz
            mumkin.
          </p>
        </div>
        <span className="rounded-full bg-[#eef6ff] px-4 py-2 text-sm font-semibold text-accent">
          {comments.length} ta izoh
        </span>
      </div>

      <form action={formAction} className="mt-6 rounded-[26px] bg-[#f8fbfd] p-5">
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="productSlug" value={productSlug} />

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">Ism</span>
            <input
              defaultValue={initialName}
              name="authorName"
              className="h-12 w-full rounded-[16px] border border-[#dbe4ef] bg-white px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
              placeholder="Ismingiz"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">
              Telefon ixtiyoriy
            </span>
            <div className="flex h-12 items-center rounded-[16px] border border-[#dbe4ef] bg-white px-4">
              <span className="text-sm font-semibold text-foreground">+998</span>
              <input
                value={formattedPhone}
                onChange={(event) => setPhone(onlyDigits(event.target.value))}
                name="phone"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted"
                placeholder="90 123 45 67"
              />
            </div>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Izoh</span>
          <textarea
            name="body"
            rows={4}
            className="w-full rounded-[16px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
            placeholder="Mahsulot haqida fikringizni yozing"
          />
        </label>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-muted">
            Yuborilgan izoh mahsulot sahifasida darhol ko&apos;rinadi.
          </p>
          <SubmitButton />
        </div>

        {state.error ? (
          <p className="mt-4 rounded-[16px] bg-[#fff2ec] px-4 py-3 text-sm text-support">
            {state.error}
          </p>
        ) : null}

        {state.success ? (
          <p className="mt-4 rounded-[16px] bg-[#eefaf0] px-4 py-3 text-sm text-[#24643a]">
            {state.success}
          </p>
        ) : null}
      </form>

      <div className="mt-6 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-[22px] border border-line bg-white p-5 shadow-[0_8px_18px_rgba(13,31,55,0.04)]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-foreground">{comment.authorName}</p>
                  <p className="mt-1 text-sm text-muted">
                    {comment.phone ? `+${comment.phone}` : "Mijoz"} - {comment.createdAt}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-foreground">{comment.body}</p>
            </article>
          ))
        ) : (
          <div className="rounded-[22px] border border-dashed border-[#dbe4ef] bg-[#fbfdff] px-5 py-6 text-sm leading-7 text-muted">
            Hozircha bu mahsulot uchun izohlar yo&apos;q. Birinchi fikrni siz yozishingiz mumkin.
          </div>
        )}
      </div>
    </section>
  );
}
