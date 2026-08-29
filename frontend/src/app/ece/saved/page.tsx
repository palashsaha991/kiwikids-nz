import Link from "next/link";

import { SavedControls } from "@/components/ece/SavedControls";
import { SavedHydrator } from "@/components/ece/SavedHydrator";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  formatAgeRange,
  formatAvailability,
  getEceServiceBySlug,
} from "@/lib/ece";

type SearchParams = {
  services?: string | string[];
};

function single(
  value: string | string[] | undefined,
): string {
  return Array.isArray(value)
    ? value[0] ?? ""
    : value ?? "";
}

function parseSlugs(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).slice(0, 50);
}

export default async function SavedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const slugs = parseSlugs(
    single(params.services),
  );

  if (slugs.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />

        <section className="container-shell py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Your shortlist
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              No saved services yet
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Save ECE services while browsing and they will appear here.
            </p>

            <SavedHydrator />

            <Link
              href="/ece"
              className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse ECE services
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const results = await Promise.allSettled(
    slugs.map((slug) =>
      getEceServiceBySlug(slug),
    ),
  );

  const services = results.flatMap((result) =>
    result.status === "fulfilled" &&
    result.value !== null
      ? [result.value]
      : [],
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Your shortlist
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Saved ECE services
          </h1>

          <p className="mt-3 text-slate-600">
            Keep track of services you want to revisit.
          </p>

          <div className="mt-6">
            <SavedControls
              services={services.map((service) => ({
                slug: service.slug,
                name: service.name,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-5 lg:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                  {formatAvailability(
                    service.availability_status,
                  )}
                </span>

                {service.accepts_20_hours_ece && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    20 Hours ECE
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                {service.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {service.service_type}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 text-sm">
                    {[service.suburb, service.city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Age range
                  </p>
                  <p className="mt-1 text-sm">
                    {formatAgeRange(
                      service.minimum_age_months,
                      service.maximum_age_months,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Places
                  </p>
                  <p className="mt-1 text-sm">
                    {service.licensed_places ??
                      "To confirm"}
                  </p>
                </div>
              </div>

              <Link
                href={`/ece/${service.slug}`}
                className="mt-6 inline-flex rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"
              >
                View details
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
