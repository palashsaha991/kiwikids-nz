"use client";

import Link from "next/link";

import { useEcePreferences } from "@/hooks/useEcePreferences";


export function CompareBar() {
  const {
    compare,
    maxCompareItems,
    clearCompare,
  } = useEcePreferences();

  if (compare.length === 0) {
    return null;
  }

  const compareHref =
    `/ece/compare?services=${encodeURIComponent(
      compare.join(","),
    )}`;

  return (
    <aside
      aria-label="ECE comparison"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.10)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Compare ECE services
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {compare.length} of {maxCompareItems} selected
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={clearCompare}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Clear
          </button>

          <Link
            href={compareHref}
            className="rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Compare selected
          </Link>
        </div>
      </div>
    </aside>
  );
}
