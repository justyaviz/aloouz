"use client";

import {
  createContext,
  startTransition,
  useContext,
  useSyncExternalStore,
} from "react";

const FAVORITES_KEY = "aloo:favorites";
const COMPARE_KEY = "aloo:compare";
const RECENT_KEY = "aloo:recent";
const CHANGE_EVENT = "aloo-storefront-change";
const MAX_COMPARE_ITEMS = 4;
const MAX_RECENT_ITEMS = 8;

type StorefrontSnapshot = {
  favorites: string[];
  compare: string[];
  recent: string[];
};

type StorefrontStateContextValue = StorefrontSnapshot & {
  hydrated: boolean;
  toggleFavorite: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  rememberProduct: (slug: string) => void;
  clearCompare: () => void;
};

const EMPTY_SNAPSHOT: StorefrontSnapshot = {
  favorites: [],
  compare: [],
  recent: [],
};

const StorefrontStateContext = createContext<StorefrontStateContextValue | null>(null);

function sanitizeList(value: unknown, maxItems?: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  const uniqueItems = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index);

  return typeof maxItems === "number" ? uniqueItems.slice(0, maxItems) : uniqueItems;
}

function readList(key: string, maxItems?: number) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return sanitizeList(rawValue ? JSON.parse(rawValue) : [], maxItems);
  } catch {
    return [];
  }
}

function writeList(key: string, value: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function emitChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function getSnapshot(): StorefrontSnapshot {
  return {
    favorites: readList(FAVORITES_KEY),
    compare: readList(COMPARE_KEY, MAX_COMPARE_ITEMS),
    recent: readList(RECENT_KEY, MAX_RECENT_ITEMS),
  };
}

function subscribe(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => listener();

  window.addEventListener("storage", handleChange);
  window.addEventListener(CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CHANGE_EVENT, handleChange);
  };
}

function updateList(
  key: string,
  maxItems: number | undefined,
  updater: (previous: string[]) => string[],
) {
  if (typeof window === "undefined") {
    return;
  }

  const currentValue = readList(key, maxItems);
  const nextValue = sanitizeList(updater(currentValue), maxItems);

  writeList(key, nextValue);
  emitChange();
}

function toggleItem(previous: string[], slug: string, maxItems?: number) {
  if (previous.includes(slug)) {
    return previous.filter((item) => item !== slug);
  }

  const nextItems = [slug, ...previous];
  return typeof maxItems === "number" ? nextItems.slice(0, maxItems) : nextItems;
}

function rememberItem(previous: string[], slug: string, maxItems: number) {
  return [slug, ...previous.filter((item) => item !== slug)].slice(0, maxItems);
}

export function StorefrontStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_SNAPSHOT);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const value: StorefrontStateContextValue = {
    ...snapshot,
    hydrated,
    toggleFavorite: (slug) => {
      startTransition(() => {
        updateList(FAVORITES_KEY, undefined, (previous) => toggleItem(previous, slug));
      });
    },
    toggleCompare: (slug) => {
      startTransition(() => {
        updateList(COMPARE_KEY, MAX_COMPARE_ITEMS, (previous) =>
          toggleItem(previous, slug, MAX_COMPARE_ITEMS),
        );
      });
    },
    rememberProduct: (slug) => {
      startTransition(() => {
        updateList(RECENT_KEY, MAX_RECENT_ITEMS, (previous) =>
          rememberItem(previous, slug, MAX_RECENT_ITEMS),
        );
      });
    },
    clearCompare: () => {
      startTransition(() => {
        updateList(COMPARE_KEY, MAX_COMPARE_ITEMS, () => []);
      });
    },
  };

  return (
    <StorefrontStateContext.Provider value={value}>
      {children}
    </StorefrontStateContext.Provider>
  );
}

export function useStorefrontState() {
  const context = useContext(StorefrontStateContext);

  if (!context) {
    throw new Error("useStorefrontState must be used inside StorefrontStateProvider");
  }

  return context;
}
