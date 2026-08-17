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

      <section className="container-shell grid gap-8 py-10 lg:grid-cols-[300px_1fr]">
        <div>
          <div className="h-12 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm lg:hidden" />

          <div className="hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
            <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />

            <div className="mt-6 space-y-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item}>
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

                  <div className="mt-2 h-11 animate-pulse rounded-xl bg-slate-100" />
                </div>
              ))}
            </div>

            <div className="mt-6 h-12 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>

        <div>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-4 w-40 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="h-11 w-44 max-w-full animate-pulse rounded-xl bg-slate-200" />
          </div>

          <div className="space-y-5">
            {[1, 2].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-2">
                      <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
                      <div className="h-6 w-28 animate-pulse rounded-full bg-slate-100" />
                    </div>

                    <div className="mt-4 h-7 w-72 max-w-full animate-pulse rounded bg-slate-200" />

                    <div className="mt-3 h-4 w-48 max-w-full animate-pulse rounded bg-slate-100" />
                  </div>

                  <div className="h-10 w-20 animate-pulse rounded-xl bg-slate-100" />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((box) => (
                    <div key={box}>
                      <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

                      <div className="mt-2 h-5 w-28 max-w-full animate-pulse rounded bg-slate-100" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />

                  <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-100" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <p className="sr-only" role="status">
        Loading early childhood education services.
      </p>
    </main>
  );
}
