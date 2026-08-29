import { RecommendationsClient } from "@/components/ece/RecommendationsClient";
import { SiteHeader } from "@/components/layout/SiteHeader";


export default function RecommendationsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-12 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
              KiwiKids Match
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Find ECE services that fit your family
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Tell us what matters to
              you. KiwiKids ranks
              Auckland ECE services and
              explains why each service
              may be a good match.
            </p>
          </div>
        </div>
      </section>

      <RecommendationsClient />
    </main>
  );
}
