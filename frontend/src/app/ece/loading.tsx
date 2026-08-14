import { SiteHeader } from "@/components/layout/SiteHeader";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-10">
          <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-5 w-[520px] max-w-full animate-pulse rounded bg-slate-200" />
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-7 w-72 max-w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-4 w-52 animate-pulse rounded bg-slate-200" />

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((box) => (
                  <div
                    key={box}
                    className="h-20 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
