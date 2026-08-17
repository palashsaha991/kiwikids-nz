import Link from "next/link";
import { redirect } from "next/navigation";

import { CompareBar } from "@/components/ece/CompareBar";
import { ServiceCard } from "@/components/ece/ServiceCard";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  EceSearchParams,
  EceSortOption,
  formatAgeRange,
  formatAvailability,
  getEceServices,
} from "@/lib/ece";


type PageSearchParams = {
  search?: string | string[];
  age_months?: string | string[];
  service_type?: string | string[];
  availability_status?: string | string[];
  accepts_20_hours_ece?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};


const PAGE_SIZE = 2;


function getSingleValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}


function parseAgeMonths(
  value: string | undefined,
): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (
    Number.isNaN(parsed) ||
    parsed < 0 ||
    parsed > 216
  ) {
    return undefined;
  }

  return parsed;
}


function parseBoolean(
  value: string | undefined,
): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}


function parseSort(
  value: string | undefined,
): EceSortOption {
  if (
    value === "name_desc" ||
    value === "capacity_desc"
  ) {
    return value;
  }

  return "name_asc";
}


function parsePage(
  value: string | undefined,
): number {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);

  if (
    Number.isNaN(parsed) ||
    parsed < 1
  ) {
    return 1;
  }

  return parsed;
}


function buildPageHref(
  params: {
    search: string;
    ageMonths: number | undefined;
    serviceType: string;
    availabilityStatus: string;
    accepts20HoursEce: boolean | undefined;
    sort: EceSortOption;
  },
  page: number,
): string {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.ageMonths !== undefined) {
    query.set(
      "age_months",
      String(params.ageMonths),
    );
  }

  if (params.serviceType) {
    query.set(
      "service_type",
      params.serviceType,
    );
  }

  if (params.availabilityStatus) {
    query.set(
      "availability_status",
      params.availabilityStatus,
    );
  }

  if (params.accepts20HoursEce !== undefined) {
    query.set(
      "accepts_20_hours_ece",
      String(params.accepts20HoursEce),
    );
  }

  if (params.sort !== "name_asc") {
    query.set("sort", params.sort);
  }

  if (page > 1) {
    query.set("page", String(page));
  }

  const queryString = query.toString();

  return queryString
    ? `/ece?${queryString}`
    : "/ece";
}


export default async function EcePage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const rawSearchParams = await searchParams;

  const search =
    getSingleValue(rawSearchParams.search)?.trim() ?? "";

  const ageMonths = parseAgeMonths(
    getSingleValue(rawSearchParams.age_months),
  );

  const serviceType =
    getSingleValue(rawSearchParams.service_type) ?? "";

  const availabilityStatus =
    getSingleValue(rawSearchParams.availability_status) ?? "";

  const accepts20HoursEce = parseBoolean(
    getSingleValue(
      rawSearchParams.accepts_20_hours_ece,
    ),
  );

  const sort = parseSort(
    getSingleValue(rawSearchParams.sort),
  );

  const rawPage =
    getSingleValue(rawSearchParams.page);

  const currentPage = parsePage(
    rawPage,
  );

  const hasInvalidPageValue =
    rawPage !== undefined &&
    (
      !/^\d+$/.test(rawPage) ||
      Number.parseInt(rawPage, 10) < 1
    );

  const offset =
    (currentPage - 1) * PAGE_SIZE;

  const apiParams: EceSearchParams = {
    sort,
    limit: PAGE_SIZE,
    offset,
  };

  if (search) {
    apiParams.search = search;
  }

  if (ageMonths !== undefined) {
    apiParams.age_months = ageMonths;
  }

  if (serviceType) {
    apiParams.service_type = serviceType;
  }

  if (
    availabilityStatus === "unknown" ||
    availabilityStatus === "available" ||
    availabilityStatus === "waitlist" ||
    availabilityStatus === "check_availability"
  ) {
    apiParams.availability_status =
      availabilityStatus;
  }

  if (accepts20HoursEce !== undefined) {
    apiParams.accepts_20_hours_ece =
      accepts20HoursEce;
  }

  let result;

  try {
    result = await getEceServices(
      apiParams,
    );
  } catch {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />

        <section className="container-shell py-16">
          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
              Service unavailable
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              We couldn&apos;t load childcare services
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-slate-600">
              Please try again shortly. KiwiKids NZ could not reach the
              childcare data service.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const services = result.items;
  const total = result.total;

  const totalPages =
    total === 0
      ? 1
      : Math.ceil(
          total / PAGE_SIZE,
        );

  const paginationParams = {
    search,
    ageMonths,
    serviceType,
    availabilityStatus,
    accepts20HoursEce,
    sort,
  };

  if (hasInvalidPageValue) {
    redirect(
      buildPageHref(
        paginationParams,
        1,
      ),
    );
  }

  if (
    total > 0 &&
    currentPage > totalPages
  ) {
    redirect(
      buildPageHref(
        paginationParams,
        totalPages,
      ),
    );
  }

  if (
    total === 0 &&
    currentPage > 1
  ) {
    redirect(
      buildPageHref(
        paginationParams,
        1,
      ),
    );
  }

  const safeCurrentPage = currentPage;

  const showingFrom =
    total === 0
      ? 0
      : result.offset + 1;

  const showingTo =
    total === 0
      ? 0
      : Math.min(
          result.offset + services.length,
          total,
        );

  const hasPreviousPage =
    safeCurrentPage > 1;

  const hasNextPage =
    safeCurrentPage < totalPages;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="container-shell py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Early Childhood Education
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Find early learning services
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Explore early childhood education services and compare the
            information that matters to your family.
          </p>
        </div>
      </section>

      <section className="container-shell grid gap-8 py-10 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">
              Filters
            </h2>

            <Link
              href="/ece"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Clear
            </Link>
          </div>

          <form
            action="/ece"
            method="get"
            className="mt-5 space-y-5"
          >
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search or location
              </label>

              <input
                id="search"
                name="search"
                type="search"
                defaultValue={search}
                placeholder="e.g. Onehunga or Harbour View"
                maxLength={120}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="age_months"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Child&apos;s age
              </label>

              <select
                id="age_months"
                name="age_months"
                defaultValue={
                  ageMonths !== undefined
                    ? String(ageMonths)
                    : ""
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">
                  Any age
                </option>
                <option value="0">
                  Newborn
                </option>
                <option value="6">
                  6 months
                </option>
                <option value="12">
                  1 year
                </option>
                <option value="24">
                  2 years
                </option>
                <option value="36">
                  3 years
                </option>
                <option value="48">
                  4 years
                </option>
                <option value="60">
                  5 years
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="service_type"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Service type
              </label>

              <select
                id="service_type"
                name="service_type"
                defaultValue={serviceType}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">
                  Any service type
                </option>
                <option value="Education and Care Service">
                  Education and Care Service
                </option>
                <option value="Kindergarten">
                  Kindergarten
                </option>
                <option value="Playcentre">
                  Playcentre
                </option>
                <option value="Home-based">
                  Home-based
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="availability_status"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Availability
              </label>

              <select
                id="availability_status"
                name="availability_status"
                defaultValue={
                  availabilityStatus
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">
                  Any availability
                </option>
                <option value="available">
                  Available
                </option>
                <option value="waitlist">
                  Waitlist
                </option>
                <option value="check_availability">
                  Check availability
                </option>
                <option value="unknown">
                  Unknown
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="accepts_20_hours_ece"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                20 Hours ECE
              </label>

              <select
                id="accepts_20_hours_ece"
                name="accepts_20_hours_ece"
                defaultValue={
                  accepts20HoursEce === undefined
                    ? ""
                    : String(
                        accepts20HoursEce,
                      )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">
                  Any funding status
                </option>
                <option value="true">
                  20 Hours ECE indicated
                </option>
                <option value="false">
                  Not indicated
                </option>
              </select>
            </div>

            <input
              type="hidden"
              name="sort"
              value={sort}
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              Apply filters
            </button>
          </form>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {total}{" "}
                {total === 1
                  ? "service"
                  : "services"}{" "}
                found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Showing {showingFrom}–{showingTo} of {total}
              </p>
            </div>

            <form
              action="/ece"
              method="get"
              className="flex items-center gap-2"
            >
              {search && (
                <input
                  type="hidden"
                  name="search"
                  value={search}
                />
              )}

              {ageMonths !== undefined && (
                <input
                  type="hidden"
                  name="age_months"
                  value={ageMonths}
                />
              )}

              {serviceType && (
                <input
                  type="hidden"
                  name="service_type"
                  value={serviceType}
                />
              )}

              {availabilityStatus && (
                <input
                  type="hidden"
                  name="availability_status"
                  value={availabilityStatus}
                />
              )}

              {accepts20HoursEce !== undefined && (
                <input
                  type="hidden"
                  name="accepts_20_hours_ece"
                  value={String(
                    accepts20HoursEce,
                  )}
                />
              )}

              <label
                htmlFor="sort"
                className="sr-only"
              >
                Sort services
              </label>

              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="name_asc">
                  Name A–Z
                </option>

                <option value="name_desc">
                  Name Z–A
                </option>

                <option value="capacity_desc">
                  Largest capacity
                </option>
              </select>

              <button
                type="submit"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Sort
              </button>
            </form>
          </div>

          {services.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold">
                No services match your filters
              </h2>

              <p className="mt-2 text-slate-600">
                Try changing the location, child&apos;s age, availability,
                service type, or funding filter.
              </p>

              <Link
                href="/ece"
                className="mt-5 inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-5">
                {services.map(
                  (service) => {
                    const location = [
                      service.suburb,
                      service.city,
                    ]
                      .filter(Boolean)
                      .join(", ");

                    return (
                      <ServiceCard
                        key={service.id}
                        name={service.name}
                        type={service.service_type}
                        location={location}
                        ageRange={formatAgeRange(
                          service.minimum_age_months,
                          service.maximum_age_months,
                        )}
                        licensedPlaces={
                          service.licensed_places
                        }
                        accepts20HoursEce={
                          service.accepts_20_hours_ece
                        }
                        status={formatAvailability(
                          service.availability_status,
                        )}
                        slug={service.slug}
                      />
                    );
                  },
                )}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label="ECE service pagination"
                  className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-sm text-slate-600">
                    Page{" "}
                    <span className="font-semibold text-slate-900">
                      {safeCurrentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-900">
                      {totalPages}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    {hasPreviousPage ? (
                      <Link
                        href={buildPageHref(
                          paginationParams,
                          safeCurrentPage - 1,
                        )}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
                      >
                        Previous
                      </span>
                    )}

                    {hasNextPage ? (
                      <Link
                        href={buildPageHref(
                          paginationParams,
                          safeCurrentPage + 1,
                        )}
                        className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                      >
                        Next
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
                      >
                        Next
                      </span>
                    )}
                  </div>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <CompareBar />
    </main>
  );
}
