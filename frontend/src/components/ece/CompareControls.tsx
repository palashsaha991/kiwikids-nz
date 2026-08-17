"use client";

import { useRouter } from "next/navigation";

import { useEcePreferences } from "@/hooks/useEcePreferences";


type CompareItem = {
  slug: string;
  name: string;
};


type CompareControlsProps = {
  services: CompareItem[];
};


export function CompareControls({
  services,
}: CompareControlsProps) {
  const router = useRouter();

  const {
    removeFromCompare,
    clearCompare,
  } = useEcePreferences();


  function buildCompareUrl(
    remainingSlugs: string[],
  ): string {
    if (remainingSlugs.length === 0) {
      return "/ece/compare";
    }

    return `/ece/compare?services=${encodeURIComponent(
      remainingSlugs.join(","),
    )}`;
  }


  function handleRemove(
    slug: string,
  ): void {
    removeFromCompare(slug);

    const remainingSlugs =
      services
        .filter(
          (service) =>
            service.slug !== slug,
        )
        .map(
          (service) =>
            service.slug,
        );

    router.replace(
      buildCompareUrl(
        remainingSlugs,
      ),
    );
  }


  function handleClear(): void {
    clearCompare();

    router.replace(
      "/ece/compare",
    );
  }


  return (
    <div className="flex flex-wrap items-center gap-3">
      {services.map(
        (service) => (
          <button
            key={service.slug}
            type="button"
            onClick={() =>
              handleRemove(
                service.slug,
              )
            }
            aria-label={`Remove ${service.name} from comparison`}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Remove {service.name}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={handleClear}
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
      >
        Clear comparison
      </button>
    </div>
  );
}
