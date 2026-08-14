import { ServiceCard } from "@/components/ece/ServiceCard";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  formatAgeRange,
  formatAvailability,
  getEceServices,
} from "@/lib/ece";

export default async function EcePage() {
  let services;

  try {
    services = await getEceServices();
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
              We couldn&apos;t load childcare services
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-slate-600">
              Please try again shortly. KiwiKids NZ could not reach the
              childcare data service.
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
        <div className="container-shell py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Early Childhood Education
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Find early learning services
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Explore early childhood education services and compare the
            information that matters to your family.
          </p>
        </div>
      </section>

      <section className="container-shell grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Filters</h2>

          <div className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Location
              </label>

              <input
                id="location"
                type="text"
                placeholder="e.g. Onehunga"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Child&apos;s age
              </label>

              <select
                id="age"
                defaultValue=""
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600"
              >
                <option value="">Any age</option>
                <option value="0-2">0–2 years</option>
                <option value="3-5">3–5 years</option>
              </select>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">
                Service type
              </p>

              <div className="space-y-2 text-sm text-slate-600">
                {[
                  "Education and Care Service",
                  "Kindergarten",
                  "Playcentre",
                  "Home-based",
                ].map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Apply filters
            </button>

            <p className="text-xs leading-5 text-slate-500">
              Search and filtering will become active as part of the Day 6
              discovery API work.
            </p>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {services.length} services
              </span>{" "}
              found
            </p>

            <select
              aria-label="Sort services"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
              defaultValue="name"
              disabled
            >
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {services.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold">
                No services found
              </h2>

              <p className="mt-2 text-slate-600">
                There are currently no active ECE services to display.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {services.map((service) => {
                const location = [
                  service.suburb,
                  service.city,
                ]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <ServiceCard
                    key={service.id}
                    name={service.name}
                    type={service.service_type}
                    location={location}
                    ageRange={formatAgeRange(
                      service.minimum_age_months,
                      service.maximum_age_months,
                    )}
                    licensedPlaces={service.licensed_places}
                    accepts20HoursEce={service.accepts_20_hours_ece}
                    status={formatAvailability(
                      service.availability_status,
                    )}
                    slug={service.slug}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
