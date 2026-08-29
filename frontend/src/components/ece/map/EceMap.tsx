"use client";

import dynamic from "next/dynamic";

import type { EceService } from "@/lib/ece";


const Map = dynamic(
  () =>
    import("./EceMapClient").then(
      (module) => module.EceMapClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[68vh] min-h-[520px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <p className="text-sm font-medium text-slate-500">
          Loading childcare map…
        </p>
      </div>
    ),
  },
);


export function EceMap({
  services,
}: {
  services: EceService[];
}) {
  return <Map services={services} />;
}
