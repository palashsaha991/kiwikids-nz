import Link from "next/link";

import { CompareControls } from "@/components/ece/CompareControls";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  formatAgeRange,
  formatAvailability,
  getEceServiceBySlug,
} from "@/lib/ece";


type ComparePageSearchParams = {
  services?: string | string[];
};


function getSingleValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}


function parseServiceSlugs(
  value: string | undefined,
): string[] {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean),
    ),
  ).slice(0, 3);
}


export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<ComparePageSearchParams>;
}) {
  const params = await searchParams;

  const slugs = parseServiceSlugs(
    getSingleValue(params.services),
  );

  if (slugs.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />

        <section className="container-shell py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Compare services
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              No services selected
            </h1>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
              Select up to three early childhood education services before
              opening the comparison page.
            </p>

            <Link
              href="/ece"
              className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
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

  const services = results.flatMap(
    (result) =>
      result.status === "fulfilled" &&
      result.value !== null
        ? [result.value]
        : [],
  );

  if (services.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />

        <section className="container-shell py-16">
          <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
              Comparison unavailable
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              We couldn&apos;t load the selected services
            </h1>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
              Please return to the ECE listing and select the services again.
            </p>

            <Link
              href="/ece"
              className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Back to ECE services
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            ECE comparison
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Compare early learning services
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Review the key information side by side before deciding which
            services you want to explore further.
          </p>

          <Link
            href="/ece"
            className="mt-5 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            ← Back to search
          </Link>

          <div className="mt-6">
            <CompareControls
              services={services.map(
                (service) => ({
                  slug: service.slug,
                  name: service.name,
                }),
              )}
            />
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-5 lg:grid-cols-3">
          {services.map((service) => {
            const location = [
              service.suburb,
              service.city,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <article
                key={service.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-200 p-6">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {formatAvailability(
                      service.availability_status,
                    )}
                  </span>

                  <h2 className="mt-4 text-2xl font-bold tracking-tight">
                    {service.name}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {service.service_type}
                  </p>
                </div>

                <dl className="divide-y divide-slate-100">
                  <div className="p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Location
                    </dt>

                    <dd className="mt-2 text-sm font-medium text-slate-700">
                      {location || "To confirm"}
                    </dd>
                  </div>

                  <div className="p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Age range
                    </dt>

                    <dd className="mt-2 text-sm font-medium text-slate-700">
                      {formatAgeRange(
                        service.minimum_age_months,
                        service.maximum_age_months,
                      )}
                    </dd>
                  </div>

                  <div className="p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Licensed places
                    </dt>

                    <dd className="mt-2 text-sm font-medium text-slate-700">
                      {service.licensed_places ??
                        "To confirm"}
                    </dd>
                  </div>

                  <div className="p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      20 Hours ECE
                    </dt>

                    <dd className="mt-2 text-sm font-medium text-slate-700">
                      {service.accepts_20_hours_ece === true
                        ? "Indicated"
                        : service.accepts_20_hours_ece === false
                          ? "Not indicated"
                          : "To confirm"}
                    </dd>
                  </div>

                  <div className="p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Availability
                    </dt>

                    <dd className="mt-2 text-sm font-medium text-slate-700">
                      {formatAvailability(
                        service.availability_status,
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="p-6">
                  <Link
                    href={`/ece/${service.slug}`}
                    className="inline-flex w-full justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    View details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
