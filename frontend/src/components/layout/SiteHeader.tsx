"use client";

import { useState } from "react";

const navigation = [
  { name: "Childcare", href: "#childcare" },
  { name: "Schools", href: "#schools" },
  { name: "Activities", href: "#activities" },
  { name: "Resources", href: "#resources" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <a
          href="#"
          className="flex items-center gap-3"
          aria-label="KiwiKids NZ home"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white"
            aria-hidden="true"
          >
            K
          </div>

          <div>
            <span className="block text-xl font-bold tracking-tight">
              KiwiKids NZ
            </span>
            <span className="block text-xs text-slate-500">
              Birth to Year 13
            </span>
          </div>
        </a>

        <nav
          className="hidden items-center gap-7 text-sm font-medium text-slate-700 md:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.name}
              className="transition hover:text-emerald-700"
              href={item.href}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Log in
          </button>

          <button
            type="button"
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Get started
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="text-xl" aria-hidden="true">
            {menuOpen ? "×" : "☰"}
          </span>
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white md:hidden"
        >
          <nav
            className="container-shell flex flex-col gap-1 py-4"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold"
              >
                Log in
              </button>

              <button
                type="button"
                className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white"
              >
                Get started
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
