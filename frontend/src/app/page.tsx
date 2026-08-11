import { SiteHeader } from "@/components/layout/SiteHeader";

const recommendations = [
  {
    title: "Little Steps Early Learning",
    type: "Education & Care",
    distance: "1.2 km",
    score: "92% match",
  },
  {
    title: "Bright Futures Kindergarten",
    type: "Kindergarten",
    distance: "1.8 km",
    score: "88% match",
  },
  {
    title: "Sunshine Kids ECE",
    type: "Education & Care",
    distance: "2.4 km",
    score: "84% match",
  },
];

const categories = [
  {
    title: "Childcare",
    description: "Early learning and ECE services near your family.",
  },
  {
    title: "Schools",
    description: "Discover primary, intermediate and secondary schools.",
  },
  {
    title: "Activities",
    description: "Sports, arts, STEM, music and more.",
  },
  {
    title: "Holiday Programmes",
    description: "Explore fun and educational holiday options.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />

        <div className="container-shell relative grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              Made for New Zealand families
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Everything parents need,
              <span className="mt-2 block text-emerald-700">
                from birth to high school.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Discover childcare, schools, activities and trusted family
              information in one place — designed to make every stage of your
              child&apos;s journey easier.
            </p>

            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="e.g. Onehunga, Auckland"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="age"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Child&apos;s age
                  </label>

                  <select
                    id="age"
                    name="age"
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="" disabled>
                      Select age
                    </option>
                    <option value="0-2">0–2 years</option>
                    <option value="3-5">3–5 years</option>
                    <option value="5-10">5–10 years</option>
                    <option value="11-13">11–13 years</option>
                    <option value="14-18">14–18 years</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    Find for my child
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Childcare near me",
                  "Schools near me",
                  "Swimming lessons",
                  "Holiday programmes",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span>Trusted NZ data</span>
              <span>Privacy-first</span>
              <span>Built for families</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Recommended near you
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    Onehunga, Auckland
                  </h2>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Preview
                </span>
              </div>

              <div className="space-y-4">
                {recommendations.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.type} · {item.distance}
                        </p>
                      </div>

                      <span className="whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {item.score}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-slate-50"
              >
                View all services
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="childcare"
        className="border-y border-slate-200 bg-white"
      >
        <div className="container-shell py-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Explore by category
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Support for every stage of growing up
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Start with early learning and expand naturally into school,
              activities and education pathways as your child grows.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category.title}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-800"
                  aria-hidden="true"
                >
                  {category.title.charAt(0)}
                </div>

                <h3 className="text-lg font-bold">{category.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>

                <button
                  type="button"
                  className="mt-5 text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-800"
                >
                  Explore
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="schools" className="bg-slate-950 text-white">
        <div className="container-shell grid gap-8 py-14 md:grid-cols-4">
          {[
            {
              title: "Trusted information",
              description: "Designed around reliable New Zealand data sources.",
            },
            {
              title: "Up to date",
              description: "Built for automated and regular data synchronisation.",
            },
            {
              title: "Secure & private",
              description: "Privacy and security are part of the architecture.",
            },
            {
              title: "One journey",
              description: "From early learning through Year 13.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="activities" className="bg-white">
        <div className="container-shell py-16">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-10 sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Growing with your family
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight">
              One platform designed to stay useful as your child grows.
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              KiwiKids NZ is being designed as a long-term family platform —
              beginning with early learning discovery and expanding into schools,
              activities, holiday programmes and education pathways.
            </p>
          </div>
        </div>
      </section>

      <footer
        id="resources"
        className="border-t border-slate-200 bg-white"
      >
        <div className="container-shell flex flex-col gap-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 KiwiKids NZ. Built for New Zealand families.</p>

          <div className="flex flex-wrap gap-5">
            <a href="#" className="transition hover:text-slate-900">
              Privacy
            </a>
            <a href="#" className="transition hover:text-slate-900">
              Data sources
            </a>
            <a href="#" className="transition hover:text-slate-900">
              Accessibility
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
