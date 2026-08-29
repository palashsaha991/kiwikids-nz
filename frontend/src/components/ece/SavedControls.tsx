"use client";

import { useRouter } from "next/navigation";

import { useEcePreferences } from "@/hooks/useEcePreferences";

type SavedItem = {
  slug: string;
  name: string;
};

export function SavedControls({
  services,
}: {
  services: SavedItem[];
}) {
  const router = useRouter();

  const {
    isFavourite,
    toggleFavourite,
  } = useEcePreferences();

  function remove(slug: string) {
    if (isFavourite(slug)) {
      toggleFavourite(slug);
    }

    const remaining = services
      .filter((item) => item.slug !== slug)
      .map((item) => item.slug);

    if (remaining.length === 0) {
      router.replace("/ece/saved");
      return;
    }

    router.replace(
      `/ece/saved?services=${encodeURIComponent(
        remaining.join(","),
      )}`,
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {services.map((service) => (
        <button
          key={service.slug}
          type="button"
          onClick={() => remove(service.slug)}
          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          {service.name} ×
        </button>
      ))}
    </div>
  );
}
