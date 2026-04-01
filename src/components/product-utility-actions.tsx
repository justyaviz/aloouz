"use client";

import { CompareIcon, HeartIcon } from "@/components/icons";
import { useStorefrontState } from "@/components/storefront-state-provider";

type ProductUtilityActionsProps = {
  productSlug: string;
  productName: string;
  layout?: "compact" | "detail";
};

function ActionButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: (props: { className?: string }) => React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-accent bg-[#eef6ff] text-accent"
          : "border-line bg-white text-foreground hover:border-accent/35 hover:text-accent"
      }`}
      aria-pressed={active}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export function ProductUtilityActions({
  productSlug,
  productName,
  layout = "compact",
}: ProductUtilityActionsProps) {
  const { compare, favorites, hydrated, toggleCompare, toggleFavorite } = useStorefrontState();

  const isFavorite = hydrated ? favorites.includes(productSlug) : false;
  const isCompared = hydrated ? compare.includes(productSlug) : false;

  return (
    <div className={`grid gap-2 ${layout === "detail" ? "sm:grid-cols-2" : "grid-cols-2"}`}>
      <ActionButton
        active={isFavorite}
        icon={HeartIcon}
        label={isFavorite ? "Sevimlida" : "Sevimli"}
        onClick={() => toggleFavorite(productSlug)}
      />
      <ActionButton
        active={isCompared}
        icon={CompareIcon}
        label={isCompared ? "Taqqoslanmoqda" : "Taqqoslash"}
        onClick={() => toggleCompare(productSlug)}
      />
      <span className="sr-only">{productName}</span>
    </div>
  );
}
