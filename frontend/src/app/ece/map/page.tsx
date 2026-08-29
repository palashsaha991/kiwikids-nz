import Link from "next/link";

import { EceMap } from "@/components/ece/map/EceMap";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getEceServicesForMap } from "@/lib/ece";


export default async function EceMapPage() {
  let services;

  try {
    services =
      await getEceServicesForMap();
  } catch {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />

        <section className="container-shell py-12">
          <div className="rounded-3xl border border-red-200 bg-white p-8">
            <p className="font-semibold text-red-700">
              Map temporarily unavailable
            </p>

            <p className="mt-2 text-slate-600">
              KiwiKids NZ could not load
              childcare location data.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                Explore childcare
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Childcare map
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Explore early childhood
                education services by
                location across the current
                KiwiKids NZ directory.
              </p>
            </div>

            <Link
              href="/ece"
              className="inline-flex w-fit rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
            >
              Back to list
            </Link>
          </div>
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">
            {services.length} services
            with mapped locations
          </p>

          <p className="text-xs text-slate-500">
            Map location reflects source
            coordinates. Confirm details
            directly with the provider.
          </p>
        </div>

        <EceMap services={services} />

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Map data © OpenStreetMap contributors.
          KiwiKids NZ does not infer or store
          your current location on this page.
        </p>
      </section>
    </main>
  );
}
