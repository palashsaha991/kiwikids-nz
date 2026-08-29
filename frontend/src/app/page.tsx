"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { SiteHeader } from "@/components/layout/SiteHeader";

const categories = [
  {
    title: "Childcare",
    description: "Search real Auckland early learning and ECE services.",
    href: "/ece",
    available: true,
  },
  {
    title: "Recommendations",
    description: "Get explainable recommendations based on your preferences.",
    href: "/ece/recommendations",
    available: true,
  },
  {
    title: "Schools",
    description: "Primary, intermediate and secondary school discovery.",
    href: "#",
    available: false,
  },
  {
    title: "Activities",
    description: "Sports, arts, STEM, music and holiday programmes.",
    href: "#",
    available: false,
  },
];

export default function Home() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [ageMonths, setAgeMonths] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = new URLSearchParams();

    const trimmedLocation = location.trim();

    if (trimmedLocation) {
      query.set("search", trimmedLocation);
    }

    if (ageMonths) {
      query.set("age_months", ageMonths);
    }

    const queryString = query.toString();

    router.push(queryString ? `/ece?${queryString}` : "/ece");
  }

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
              Find the right early learning service
              <span className="mt-2 block text-emerald-700">
                for your family.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Search trusted New Zealand ECE information, compare services and
              get explainable recommendations based on your family&apos;s needs.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60"
            >
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
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    autoComplete="address-level2"
                    placeholder="e.g. Onehunga"
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
                    value={ageMonths}
                    onChange={(event) => setAgeMonths(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Any age</option>
                    <option value="6">Under 1 year</option>
                    <option value="12">1 year</option>
                    <option value="24">2 years</option>
                    <option value="36">3 years</option>
                    <option value="48">4 years</option>
                    <option value="60">5 years</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    Find childcare
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/ece"
                  className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                >
                  Browse all childcare
                </Link>

                <Link
                  href="/ece?accepts_20_hours_ece=true"
                  className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                >
                  20 Hours ECE
                </Link>

                <Link
                  href="/ece/recommendations"
                  className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                >
                  Get recommendations
                </Link>

                <Link
                  href="/ece/compare"
                  className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                >
                  Compare services
                </Link>
              </div>
            </form>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span>Trusted NZ data</span>
              <span>Privacy-first</span>
              <span>Explainable recommendations</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-200/60">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                Start exploring
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Real ECE services are ready to search
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Browse services, view detailed information, save favourites,
                compare providers and use KiwiKids recommendations.
              </p>

              <div className="mt-7 grid gap-3">
                <Link
                  href="/ece"
                  className="rounded-xl bg-emerald-700 px-5 py-4 text-center font-semibold text-white transition hover:bg-emerald-800"
                >
                  View all ECE services
                </Link>

                <Link
                  href="/ece/recommendations"
                  className="rounded-xl border border-slate-300 px-5 py-4 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Find my best matches
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container-shell py-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Explore KiwiKids
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Useful today, growing for tomorrow
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-800">
                  {category.title.charAt(0)}
                </div>

                <h3 className="text-lg font-bold">{category.title}</h3>

                <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>

                {category.available ? (
                  <Link
                    href={category.href}
                    className="mt-5 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Explore →
                  </Link>
                ) : (
                  <span className="mt-5 inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                    Coming soon
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="container-shell grid gap-8 py-14 md:grid-cols-4">
          <div>
            <h3 className="font-semibold">Trusted information</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Built around official New Zealand ECE data.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Regularly updated</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Automated data synchronisation keeps service information current.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Secure & private</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Security and privacy are part of the platform architecture.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Explainable matching</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Recommendation scores show why services match your preferences.
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
            <span>Privacy information coming soon</span>
            <span>Data source attribution coming soon</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
