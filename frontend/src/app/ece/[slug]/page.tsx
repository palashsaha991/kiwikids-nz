import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";

const service = {
  name: "Little Steps Early Learning",
  type: "Education & Care",
  suburb: "Onehunga, Auckland",
  distance: "1.2 km",
  ageRange: "0–5 years",
  matchScore: 92,
  status: "Available",
  address: "12 Example Road, Onehunga, Auckland",
  phone: "09 555 0101",
  website: "https://example.co.nz",
  hours: [
    ["Monday", "7:00 AM – 5:30 PM"],
    ["Tuesday", "7:00 AM – 5:30 PM"],
    ["Wednesday", "7:00 AM – 5:30 PM"],
    ["Thursday", "7:00 AM – 5:30 PM"],
    ["Friday", "7:00 AM – 5:30 PM"],
  ],
};

export default function EceDetailPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-6">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-slate-500"
          >
            <Link href="/" className="hover:text-emerald-700">
              Home
            </Link>
            <span className="px-2">/</span>
            <Link href="/ece" className="hover:text-emerald-700">
              Childcare
            </Link>
            <span className="px-2">/</span>
            <span className="text-slate-700">{service.name}</span>
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
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {service.matchScore}% match
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {service.status}
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    {service.name}
                  </h1>

                  <p className="mt-2 text-slate-600">
                    {service.type} · {service.suburb}
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
                >
                  Save
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Distance
                  </p>
                  <p className="mt-1 font-semibold">{service.distance}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Age range
                  </p>
                  <p className="mt-1 font-semibold">{service.ageRange}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Service type
                  </p>
                  <p className="mt-1 font-semibold">{service.type}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold">About this service</h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Address
                  </p>
                  <p className="mt-1">{service.address}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Phone
                  </p>
                  <p className="mt-1">{service.phone}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Website
                  </p>
                  <a
                    href={service.website}
                    className="mt-1 inline-block font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Visit provider website
                  </a>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Data freshness
                  </p>
                  <p className="mt-1">Synced from trusted NZ data sources</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold">Opening hours</h2>

              <div className="mt-6 divide-y divide-slate-200">
                {service.hours.map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span className="font-medium">{day}</span>
                    <span className="text-slate-600">{hours}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold">Funding & official information</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                  <h3 className="font-bold text-emerald-900">
                    20 Hours ECE
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                    Eligibility and actual fees must be confirmed directly with
                    the service.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-bold">ERO information</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Official review information will be linked here when the
                    government data integration is connected.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Interested in this service?</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Save it to your shortlist or compare it with other nearby
                services.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Add to shortlist
                </button>

                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-slate-50"
                >
                  Add to compare
                </button>

                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-slate-50"
                >
                  Get directions
                </button>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-xs leading-5 text-slate-500">
                  KiwiKids NZ does not guarantee availability, fees, enrolment
                  eligibility or service quality. Always confirm important
                  information directly with the provider.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
