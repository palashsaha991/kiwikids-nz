"use client";

import { useState } from "react";

import { useEcePreferences } from "@/hooks/useEcePreferences";

type ServiceActionsProps = {
  slug: string;
  mode?: "full" | "save-only";
};

export function ServiceActions({
  slug,
  mode = "full",
}: ServiceActionsProps) {
  const {
    compare,
    maxCompareItems,
    isFavourite,
    isCompared,
    toggleFavourite,
    addToCompare,
    removeFromCompare,
  } = useEcePreferences();

  const [message, setMessage] =
    useState<string | null>(null);

  const favourite = isFavourite(slug);
  const compared = isCompared(slug);

  function handleFavourite() {
    toggleFavourite(slug);

    setMessage(
      favourite
        ? "Removed from saved services."
        : "Saved to your shortlist.",
    );
  }

  function handleCompare() {
    if (compared) {
      removeFromCompare(slug);
      setMessage("Removed from comparison.");
      return;
    }

    const result = addToCompare(slug);

    if (result === "added") {
      setMessage("Added to comparison.");
      return;
    }

    if (result === "exists") {
      setMessage(
        "This service is already selected.",
      );
      return;
    }

    setMessage(
      `You can compare up to ${maxCompareItems} services.`,
    );
  }

  if (mode === "save-only") {
    return (
      <button
        type="button"
        onClick={handleFavourite}
        aria-pressed={favourite}
        className={
          favourite
            ? "rounded-xl border border-emerald-700 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800"
            : "rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
        }
      >
        {favourite ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleFavourite}
          aria-pressed={favourite}
          className={
            favourite
              ? "w-full rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-700"
              : "w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          }
        >
          {favourite
            ? "Remove from shortlist"
            : "Add to shortlist"}
        </button>

        <button
          type="button"
          onClick={handleCompare}
          aria-pressed={compared}
          className={
            compared
              ? "w-full rounded-xl border border-emerald-700 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
              : "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-slate-50"
          }
        >
          {compared
            ? "Remove from compare"
            : "Add to compare"}
        </button>
      </div>

      {compare.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          {compare.length}/{maxCompareItems} selected for comparison
        </p>
      )}

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-sm text-slate-600"
        >
          {message}
        </p>
      )}
    </div>
  );
}
