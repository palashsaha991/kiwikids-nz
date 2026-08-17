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
    <div>
      <p className="text-sm font-semibold text-slate-700">
        {services.length}{" "}
        {services.length === 1
          ? "service"
          : "services"}{" "}
        selected
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
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
              title={`Remove ${service.name}`}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              <span className="max-w-[220px] truncate sm:max-w-[320px]">
                {service.name}
              </span>

              <span
                aria-hidden="true"
                className="text-base leading-none"
              >
                ×
              </span>
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={handleClear}
        className="mt-4 text-sm font-semibold text-red-700 underline-offset-4 transition hover:underline focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
      >
        Clear comparison
      </button>
    </div>
  );
}
