import Link from "next/link";

import { LocationPicker } from "@/components/ece/LocationPicker";
import { RecommendationCard } from "@/components/ece/RecommendationCard";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  EceRecommendationParams,
  getEceRecommendations,
} from "@/lib/ece";


type PageSearchParams = {
  suburb?: string | string[];
  service_type?: string | string[];
  wants_20_hours_ece?: string | string[];
  minimum_capacity?: string | string[];
  latitude?: string | string[];
  longitude?: string | string[];
};


const SERVICE_TYPES = [
  {
    value: "",
    label: "Any service type",
  },
  {
    value: "education_care",
    label: "Education & Care",
  },
  {
    value: "kindergarten",
    label: "Kindergarten",
  },
  {
    value: "homebased",
    label: "Home-based",
  },
  {
    value: "playcentre",
    label: "Playcentre",
  },
  {
    value: "kohanga_reo",
    label: "Te Kōhanga Reo",
  },
  {
    value: "puna_reo",
    label: "Puna Reo",
  },
];


function single(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}


function parseBoolean(
  value: string,
): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}


function parseCapacity(
  value: string,
): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(
    value,
    10,
  );

  if (
    Number.isNaN(parsed) ||
    parsed < 1 ||
    parsed > 1000
  ) {
    return undefined;
  }

  return parsed;
}


function parseCoordinate(
  value: string,
  minimum: number,
  maximum: number,
): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (
    !Number.isFinite(parsed) ||
    parsed < minimum ||
    parsed > maximum
  ) {
    return undefined;
  }

  return parsed;
}


export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const raw = await searchParams;

  const suburb =
    single(raw.suburb)
      .trim()
      .slice(0, 120);

  const serviceType =
    single(raw.service_type)
      .trim()
      .slice(0, 80);

  const wants20Hours =
    parseBoolean(
      single(
        raw.wants_20_hours_ece,
      ),
    );

  const minimumCapacity =
    parseCapacity(
      single(
        raw.minimum_capacity,
      ),
    );

  const latitude =
    parseCoordinate(
      single(raw.latitude),
      -90,
      90,
    );

  const longitude =
    parseCoordinate(
      single(raw.longitude),
      -180,
      180,
    );

  const hasCoordinatePair =
    latitude !== undefined &&
    longitude !== undefined;

  const hasPreferences =
    Boolean(suburb) ||
    Boolean(serviceType) ||
    wants20Hours !== undefined ||
    minimumCapacity !== undefined ||
    hasCoordinatePair;

  const params: EceRecommendationParams = {
    limit: 10,
  };

  if (suburb) {
    params.suburb = suburb;
  }

  if (serviceType) {
    params.service_type =
      serviceType;
  }

  if (wants20Hours !== undefined) {
    params.wants_20_hours_ece =
      wants20Hours;
  }

  if (
    minimumCapacity !== undefined
  ) {
    params.minimum_capacity =
      minimumCapacity;
  }

  if (hasCoordinatePair) {
    params.latitude = latitude;
    params.longitude = longitude;
  }

  let result = null;
  let failed = false;

  if (hasPreferences) {
    try {
      result =
        await getEceRecommendations(
          params,
        );
    } catch {
      failed = true;
    }
  }

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
              Tell us what matters to you.
              KiwiKids ranks Auckland ECE
              services and explains why each
              service may be a good match.
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside>
            <form
              method="get"
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-slate-950">
                Your preferences
              </h2>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Preferred suburb
                  </span>

                  <input
                    type="text"
                    name="suburb"
                    defaultValue={suburb}
                    maxLength={120}
                    placeholder="e.g. Onehunga"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Service type
                  </span>

                  <select
                    name="service_type"
                    defaultValue={
                      serviceType
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    {SERVICE_TYPES.map(
                      (item) => (
                        <option
                          key={
                            item.value
                          }
                          value={
                            item.value
                          }
                        >
                          {item.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    20 Hours ECE
                  </span>

                  <select
                    name="wants_20_hours_ece"
                    defaultValue={
                      single(
                        raw.wants_20_hours_ece,
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">
                      No preference
                    </option>

                    <option value="true">
                      Prefer services indicating 20 Hours ECE
                    </option>

                    <option value="false">
                      No
                    </option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Minimum licensed places
                  </span>

                  <input
                    type="number"
                    name="minimum_capacity"
                    min={1}
                    max={1000}
                    defaultValue={
                      minimumCapacity
                    }
                    placeholder="e.g. 40"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <LocationPicker
                  initialLatitude={latitude}
                  initialLongitude={longitude}
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                Find my matches
              </button>

              {hasPreferences && (
                <Link
                  href="/ece/recommendations"
                  className="mt-3 block text-center text-sm font-semibold text-slate-500 hover:text-slate-800"
                >
                  Clear preferences
                </Link>
              )}
            </form>
          </aside>

          <div>
            {!hasPreferences && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  Start with your preferences
                </h2>

                <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
                  Choose one or more
                  preferences and KiwiKids
                  will rank services with
                  transparent match reasons.
                </p>
              </div>
            )}

            {failed && (
              <div className="rounded-3xl border border-red-200 bg-white p-8">
                <p className="font-semibold text-red-700">
                  Recommendations are
                  temporarily unavailable.
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  Please try again shortly.
                </p>
              </div>
            )}

            {result && (
              <>
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">
                      Your recommendations
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-950">
                      Best matches
                    </h2>
                  </div>

                  <p className="text-sm text-slate-500">
                    Ranked against{" "}
                    {result.total.toLocaleString()}{" "}
                    active Auckland services
                  </p>
                </div>

                {result.items.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-8">
                    <h3 className="text-xl font-bold">
                      No recommendations found
                    </h3>

                    <p className="mt-2 text-slate-600">
                      Try broadening your
                      preferences.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {result.items.map(
                      (item) => (
                        <RecommendationCard
                          key={
                            item.service.id
                          }
                          recommendation={
                            item
                          }
                        />
                      ),
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
