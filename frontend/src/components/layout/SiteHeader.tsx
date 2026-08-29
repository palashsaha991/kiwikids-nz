"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { name: "Childcare", href: "/ece" },
  {
    name: "Recommendations",
    href: "/ece/recommendations",
  },
  {
    name: "Saved",
    href: "/ece/saved",
  },
  {
    name: "Compare",
    href: "/ece/compare",
  },
  {
    name: "Resources",
    href: "/#resources",
  },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="KiwiKids NZ home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white">
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
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition hover:text-emerald-700"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="px-3 py-2 text-sm font-semibold text-slate-400">
            Login coming soon
          </span>

          <Link
            href="/ece"
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Find childcare
          </Link>
        </div>

        <button
          type="button"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 md:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="container-shell flex flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() =>
                  setMenuOpen(false)
                }
                className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/ece"
              onClick={() =>
                setMenuOpen(false)
              }
              className="mt-3 rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Find childcare
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
