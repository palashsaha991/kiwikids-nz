"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useEcePreferences } from "@/hooks/useEcePreferences";

export function CompareHydrator() {
  const router = useRouter();
  const { compare } = useEcePreferences();

  useEffect(() => {
    if (compare.length === 0) {
      return;
    }

    router.replace(
      `/ece/compare?services=${encodeURIComponent(
        compare.join(","),
      )}`,
    );
  }, [compare, router]);

  if (compare.length === 0) {
    return null;
  }

  return (
    <p className="mt-4 text-sm text-slate-500">
      Loading your selected services…
    </p>
  );
}
