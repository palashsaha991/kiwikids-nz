import { SiteHeader } from "@/components/layout/SiteHeader";
import { ServiceCard } from "@/components/ece/ServiceCard";

const services = [
  {
    name: "Little Steps Early Learning",
    type: "Education & Care",
    suburb: "Onehunga, Auckland",
    distance: "1.2 km",
    ageRange: "0–5 years",
    matchScore: 92,
    status: "Available" as const,
    slug: "little-steps-early-learning",
  },
  {
    name: "Bright Futures Kindergarten",
    type: "Kindergarten",
    suburb: "Onehunga, Auckland",
    distance: "1.8 km",
    ageRange: "2–5 years",
    matchScore: 88,
    status: "Waitlist" as const,
    slug: "little-steps-early-learning",
  },
  {
    name: "Sunshine Kids ECE",
    type: "Education & Care",
    suburb: "Royal Oak, Auckland",
    distance: "2.4 km",
    ageRange: "0–5 years",
    matchScore: 84,
    status: "Check availability" as const,
    slug: "little-steps-early-learning",
  },
  {
    name: "Harbour View Early Learning",
    type: "Education & Care",
    suburb: "Onehunga, Auckland",
    distance: "3.1 km",
    ageRange: "6 months–5 years",
    matchScore: 81,
    status: "Available" as const,
    slug: "little-steps-early-learning",
  },
];

export default function EcePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Early Childhood Education
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Childcare near Onehunga
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Explore and compare early learning services based on your location
            and family preferences.
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
                defaultValue="Onehunga"
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
                defaultValue="3-5"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600"
              >
                <option value="0-2">0–2 years</option>
                <option value="3-5">3–5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="distance"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Distance
              </label>

              <select
                id="distance"
                defaultValue="5"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600"
              >
                <option value="2">Within 2 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
              </select>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">
                Service type
              </p>

              <div className="space-y-2 text-sm text-slate-600">
                {[
                  "Education & Care",
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
              defaultValue="match"
            >
              <option value="match">Best match</option>
              <option value="distance">Nearest first</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          <div className="space-y-5">
            {services.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
