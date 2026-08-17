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
    <>
      <div
        aria-hidden="true"
        className="h-32 sm:h-24"
      />

      <aside
        aria-label="ECE comparison"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.10)] backdrop-blur"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                Compare ECE services
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {compare.length} of{" "}
                {maxCompareItems} selected
              </p>
            </div>

            <button
              type="button"
              onClick={clearCompare}
              className="shrink-0 text-sm font-semibold text-slate-600 underline-offset-4 transition hover:text-red-700 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              Clear
            </button>
          </div>

          <Link
            href={compareHref}
            className="mt-3 flex w-full items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 sm:ml-auto sm:w-auto"
          >
            Compare selected
          </Link>
        </div>
      </aside>
    </>
  );
}
