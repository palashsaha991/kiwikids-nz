"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useEcePreferences } from "@/hooks/useEcePreferences";

export function SavedHydrator() {
  const router = useRouter();
  const { favourites } = useEcePreferences();

  useEffect(() => {
    if (favourites.length === 0) {
      return;
    }

    router.replace(
      `/ece/saved?services=${encodeURIComponent(
        favourites.join(","),
      )}`,
    );
  }, [favourites, router]);

  if (favourites.length === 0) {
    return null;
  }

  return (
    <p className="mt-4 text-sm text-slate-500">
      Loading your saved services…
    </p>
  );
}
