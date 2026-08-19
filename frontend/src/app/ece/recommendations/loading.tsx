import { SiteHeader } from "@/components/layout/SiteHeader";


export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="container-shell py-12">
        <div
          role="status"
          className="rounded-3xl border border-slate-200 bg-white p-8"
        >
          <span className="sr-only">
            Loading recommendations
          </span>

          <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-9 w-2/3 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 space-y-4">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse rounded-2xl bg-slate-100"
                />
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
