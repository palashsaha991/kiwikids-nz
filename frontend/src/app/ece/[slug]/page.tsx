import Link from "next/link";
import { notFound } from "next/navigation";

import { ServiceActions } from "@/components/ece/ServiceActions";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  formatAgeRange,
  formatAvailability,
  formatFundingStatus,
  formatServiceAddress,
  getEceServiceBySlug,
} from "@/lib/ece";


type EceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


export default async function EceDetailPage({
  params,
}: EceDetailPageProps) {
  const { slug } = await params;

  let service;

  try {
    service = await getEceServiceBySlug(slug);
  } catch {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />

        <section className="container-shell py-16">
          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
              Service unavailable
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              We couldn&apos;t load this childcare service
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-slate-600">
              Please try again shortly. KiwiKids NZ could not reach the
              childcare data service.
            </p>

            <Link
              href="/ece"
              className="mt-6 inline-flex rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Back to childcare
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (service === null) {
    notFound();
  }

  const address = formatServiceAddress(service);
  const ageRange = formatAgeRange(
    service.minimum_age_months,
    service.maximum_age_months,
  );
  const availability = formatAvailability(
    service.availability_status,
  );
  const funding = formatFundingStatus(
    service.accepts_20_hours_ece,
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-6">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-slate-500"
          >
            <Link
              href="/"
              className="hover:text-emerald-700"
            >
              Home
            </Link>

            <span className="px-2">/</span>

            <Link
              href="/ece"
              className="hover:text-emerald-700"
            >
              Childcare
            </Link>

            <span className="px-2">/</span>

            <span className="text-slate-700">
              {service.name}
            </span>
          </nav>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {availability}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {funding}
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    {service.name}
                  </h1>

                  <p className="mt-2 text-slate-600">
                    {service.service_type}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {[service.suburb, service.city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                <ServiceActions
                  slug={service.slug}
                  mode="save-only"
                />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Age range
                  </p>

                  <p className="mt-1 font-semibold">
                    {ageRange}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Licensed places
                  </p>

                  <p className="mt-1 font-semibold">
                    {service.licensed_places ?? "To confirm"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Service type
                  </p>

                  <p className="mt-1 font-semibold">
                    {service.service_type}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold">
                About this service
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                {service.description ??
                  "More information about this service will be added as verified data becomes available."}
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Address
                  </p>

                  <p className="mt-1">
                    {address || "Address to confirm"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Provider code
                  </p>

                  <p className="mt-1">
                    {service.provider_code ?? "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Availability
                  </p>

                  <p className="mt-1">
                    {availability}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Funding
                  </p>

                  <p className="mt-1">
                    {funding}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold">
                Location
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">
                    Latitude
                  </p>

                  <p className="mt-1">
                    {service.latitude ?? "Not available"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">
                    Longitude
                  </p>

                  <p className="mt-1">
                    {service.longitude ?? "Not available"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Interactive maps and commute-aware discovery will be added
                in a later product milestone.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold">
                Funding & official information
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                  <h3 className="font-bold text-emerald-900">
                    20 Hours ECE
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                    {funding}. Eligibility, fees and conditions should
                    always be confirmed directly with the provider.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-bold">
                    ERO information
                  </h3>

                  {service.ero_report_url ? (
                    <a
                      href={service.ero_report_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      View ERO information
                    </a>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      ERO information will appear here when verified
                      government data is connected.
                    </p>
                  )}
                </div>
              </div>

              {service.source_url && (
                <div className="mt-4">
                  <a
                    href={service.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    View original data source
                  </a>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <section className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">
                Interested in this service?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Save this service or compare it with other early learning
                options.
              </p>

              <div className="mt-6 space-y-3">
                <ServiceActions
                  slug={service.slug}
                />

                <Link
                  href="/ece"
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold transition hover:bg-slate-50"
                >
                  Back to all services
                </Link>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-xs leading-5 text-slate-500">
                  KiwiKids NZ does not guarantee availability, fees,
                  enrolment eligibility or service quality. Confirm
                  important information directly with the provider.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
