"use client";

import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container-shell flex items-center justify-between py-4">
          <a href="#" className="flex items-center gap-3" aria-label="KiwiKids NZ home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white">
              K
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">KiwiKids NZ</h1>
              <p className="text-xs text-slate-500">Birth to Year 13</p>
            </div>
          </a>

          <nav
            className="hidden items-center gap-7 text-sm font-medium text-slate-700 md:flex"
            aria-label="Primary navigation"
          >
            <a className="transition hover:text-emerald-700" href="#childcare">
              Childcare
            </a>
            <a className="transition hover:text-emerald-700" href="#schools">
              Schools
            </a>
            <a className="transition hover:text-emerald-700" href="#activities">
              Activities
            </a>
            <a className="transition hover:text-emerald-700" href="#resources">
              Resources
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Log in
            </button>

            <button className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
              Get started
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className="text-xl" aria-hidden="true">
              {menuOpen ? "×" : "☰"}
            </span>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav
              className="container-shell flex flex-col gap-1 py-4"
              aria-label="Mobile navigation"
            >
              {["Childcare", "Schools", "Activities", "Resources"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
                <button className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold">
                  Log in
                </button>

                <button className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white">
                  Get started
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />

        <div className="container-shell relative grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              Made for New Zealand families
            </div>

            <h2 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                    placeholder="e.g. Onehunga, Auckland"
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                  >
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
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60">
            <p className="text-sm font-semibold text-slate-500">
              Recommended near you
            </p>
            <h3 className="mt-1 text-2xl font-bold">Onehunga, Auckland</h3>

            <div className="mt-6 space-y-4">
              {[
                ["Little Steps Early Learning", "Education & Care", "1.2 km"],
                ["Bright Futures Kindergarten", "Kindergarten", "1.8 km"],
                ["Sunshine Kids ECE", "Education & Care", "2.4 km"],
              ].map(([title, type, distance]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300"
                >
                  <h4 className="font-semibold">{title}</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {type} · {distance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
