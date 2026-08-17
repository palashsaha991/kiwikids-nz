"use client";

import Link from "next/link";
import { useState } from "react";

import { useEcePreferences } from "@/hooks/useEcePreferences";


type ServiceCardProps = {
  name: string;
  type: string;
  location: string;
  ageRange: string;
  licensedPlaces: number | null;
  accepts20HoursEce: boolean | null;
  status:
    | "Available"
    | "Waitlist"
    | "Check availability"
    | "Unknown";
  slug: string;
};


function fundingLabel(
  accepts20HoursEce: boolean | null,
): string {
  if (accepts20HoursEce === true) {
    return "20 Hours ECE";
  }

  if (accepts20HoursEce === false) {
    return "No 20 Hours ECE";
  }

  return "Funding to confirm";
}


export function ServiceCard({
  name,
  type,
  location,
  ageRange,
  licensedPlaces,
  accepts20HoursEce,
  status,
  slug,
}: ServiceCardProps) {
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

  const favourite =
    isFavourite(slug);

  const compared =
    isCompared(slug);


  function handleFavourite(): void {
    toggleFavourite(slug);

    setMessage(
      favourite
        ? "Removed from saved services."
        : "Saved for later.",
    );
  }


  function handleCompare(): void {
    if (compared) {
      removeFromCompare(slug);

      setMessage(
        "Removed from comparison.",
      );

      return;
    }

    const result =
      addToCompare(slug);

    if (result === "added") {
      setMessage(
        "Added to comparison.",
      );

      return;
    }

    if (result === "exists") {
      setMessage(
        "This service is already in comparison.",
      );

      return;
    }

    setMessage(
      `You can compare up to ${maxCompareItems} services at a time.`,
    );
  }


  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {status}
            </span>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {fundingLabel(
                accepts20HoursEce,
              )}
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {name}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {type}
          </p>
        </div>

        <button
          type="button"
          onClick={handleFavourite}
          aria-pressed={favourite}
          className={
            favourite
              ? "rounded-xl border border-emerald-700 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
              : "rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          }
        >
          {favourite
            ? "Saved"
            : "Save"}
        </button>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Location
          </span>

          <span className="mt-1 block">
            {location}
          </span>
        </div>

        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Age range
          </span>

          <span className="mt-1 block">
            {ageRange}
          </span>
        </div>

        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Licensed places
          </span>

          <span className="mt-1 block">
            {licensedPlaces ??
              "To confirm"}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={`/ece/${slug}`}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          View details
        </Link>

        <button
          type="button"
          onClick={handleCompare}
          aria-pressed={compared}
          className={
            compared
              ? "rounded-xl border border-emerald-700 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
              : "rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          }
        >
          {compared
            ? "Remove from compare"
            : "Add to compare"}
        </button>

        {compare.length > 0 && (
          <span className="text-xs font-medium text-slate-500">
            {compare.length}/
            {maxCompareItems} selected
          </span>
        )}
      </div>

      {message && (
        <p
          className="mt-4 text-sm text-slate-600"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </article>
  );
}
