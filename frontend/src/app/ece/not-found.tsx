import Link from "next/link";

import { SiteHeader } from "@/components/layout/SiteHeader";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="container-shell py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Service not found
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            We couldn&apos;t find that childcare service
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            The service may no longer be active, or the link may be incorrect.
          </p>

          <Link
            href="/ece"
            className="mt-7 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Browse childcare services
          </Link>
        </div>
      </section>
    </main>
  );
}
