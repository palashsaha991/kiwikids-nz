export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white">
              K
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">KiwiKids NZ</h1>
              <p className="text-xs text-slate-500">Birth to Year 13</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 md:flex">
            <a className="transition hover:text-emerald-700" href="#">
              Childcare
            </a>
            <a className="transition hover:text-emerald-700" href="#">
              Schools
            </a>
            <a className="transition hover:text-emerald-700" href="#">
              Activities
            </a>
            <a className="transition hover:text-emerald-700" href="#">
              Resources
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:block">
              Log in
            </button>

            <button className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              Made for New Zealand families
            </div>

            <h2 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl">
              Everything parents need,
              <span className="mt-2 block text-emerald-700">
                from birth to high school.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Discover childcare, schools, activities and trusted family
              information in one place — designed to make every stage of your
              child&apos;s journey easier.
            </p>

            {/* Search Card */}
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    placeholder="e.g. Onehunga, Auckland"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Child&apos;s age
                  </label>
                  <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                    <option>Select age</option>
                    <option>0-2 years</option>
                    <option>3-5 years</option>
                    <option>5-10 years</option>
                    <option>11-13 years</option>
                    <option>14-18 years</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800">
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
                    className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
              <span>Trusted NZ data</span>
              <span>Privacy-first</span>
              <span>Built for families</span>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="relative">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Recommended near you
                  </p>
                  <h3 className="mt-1 text-2xl font-bold">Onehunga, Auckland</h3>
                </div>

                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Live preview
                </div>
              </div>

              <div className="space-y-4">
                {[
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
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.type} · {item.distance}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-slate-50">
                View all services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Explore by category
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              Support for every stage of growing up
            </h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Childcare", "Early learning and ECE services"],
              ["Schools", "Primary through secondary"],
              ["Activities", "Sports, arts, STEM and more"],
              ["Holiday Programmes", "Fun and educational options"],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <div className="mb-4 h-11 w-11 rounded-xl bg-emerald-100" />
                <h4 className="text-lg font-bold">{title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-4">
          {[
            ["Trusted information", "Designed around reliable NZ data sources"],
            ["Up to date", "Built for regular data synchronisation"],
            ["Secure & private", "Privacy and security by design"],
            ["One place", "From early learning to Year 13"],
          ].map(([title, description]) => (
            <div key={title}>
              <h4 className="font-semibold">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
