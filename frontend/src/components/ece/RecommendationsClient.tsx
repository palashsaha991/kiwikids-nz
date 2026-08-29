"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { LocationPicker } from "@/components/ece/LocationPicker";
import { RecommendationCard } from "@/components/ece/RecommendationCard";
import type {
  EceRecommendationListResponse,
} from "@/lib/ece";


type FacetSuburb = {
  value: string;
  label: string;
  services: number;
};

type FacetArea = {
  value: string;
  label: string;
  services: number;
  suburbs: FacetSuburb[];
};

type FacetsResponse = {
  areas: FacetArea[];
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


function canonicalLabel(
  value: string,
): string {
  let result = value.trim();

  result = result.replace(
    /^Mt\s+/i,
    "Mount ",
  );

  result = result.replace(
    /-Auckland$/i,
    "",
  );

  return result;
}


export function RecommendationsClient() {
  const [areas, setAreas] =
    useState<FacetArea[]>([]);

  const [area, setArea] =
    useState("");

  const [suburb, setSuburb] =
    useState("");

  const [serviceType, setServiceType] =
    useState("");

  const [wants20Hours, setWants20Hours] =
    useState("");

  const [minimumCapacity, setMinimumCapacity] =
    useState("");

  const [latitude, setLatitude] =
    useState<number | undefined>();

  const [longitude, setLongitude] =
    useState<number | undefined>();

  const [result, setResult] =
    useState<EceRecommendationListResponse | null>(
      null,
    );

  const [loading, setLoading] =
    useState(false);

  const [failed, setFailed] =
    useState(false);


  useEffect(() => {
    let active = true;

    async function loadFacets() {
      try {
        const response = await fetch(
          "/api/ece/facets",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as FacetsResponse;

        if (active) {
          setAreas(data.areas);
        }
      } catch {
        // Dropdown gracefully remains empty.
      }
    }

    void loadFacets();

    return () => {
      active = false;
    };
  }, []);


  const selectedArea =
    useMemo(
      () =>
        areas.find(
          (item) =>
            item.value === area,
        ),
      [areas, area],
    );


  const suburbs =
    useMemo(() => {
      if (!selectedArea) {
        return [];
      }

      const grouped =
        new Map<
          string,
          FacetSuburb
        >();

      for (
        const item
        of selectedArea.suburbs
      ) {
        const label =
          canonicalLabel(
            item.label,
          );

        const key =
          label.toLocaleLowerCase(
            "en-NZ",
          );

        const existing =
          grouped.get(key);

        if (existing) {
          existing.services +=
            item.services;
          continue;
        }

        grouped.set(
          key,
          {
            value: label,
            label,
            services:
              item.services,
          },
        );
      }

      return Array.from(
        grouped.values(),
      ).sort(
        (a, b) =>
          a.label.localeCompare(
            b.label,
            "en-NZ",
          ),
      );
    }, [selectedArea]);


  function handleAreaChange(
    value: string,
  ) {
    setArea(value);
    setSuburb("");
  }


  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setFailed(false);
    setResult(null);

    const payload: {
      suburb?: string;
      service_type?: string;
      wants_20_hours_ece?: boolean;
      minimum_capacity?: number;
      latitude?: number;
      longitude?: number;
      limit: number;
    } = {
      limit: 10,
    };

    if (suburb) {
      payload.suburb = suburb;
    }

    if (serviceType) {
      payload.service_type =
        serviceType;
    }

    if (wants20Hours === "true") {
      payload.wants_20_hours_ece =
        true;
    }

    if (wants20Hours === "false") {
      payload.wants_20_hours_ece =
        false;
    }

    if (minimumCapacity) {
      payload.minimum_capacity =
        Number.parseInt(
          minimumCapacity,
          10,
        );
    }

    if (
      latitude !== undefined &&
      longitude !== undefined
    ) {
      payload.latitude = latitude;
      payload.longitude = longitude;
    }

    try {
      const response = await fetch(
        "/api/ece/recommendations",
        {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify(
            payload,
          ),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Recommendation request failed",
        );
      }

      const data =
        (await response.json()) as
          EceRecommendationListResponse;

      setResult(data);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }


  function clearPreferences() {
    setArea("");
    setSuburb("");
    setServiceType("");
    setWants20Hours("");
    setMinimumCapacity("");
    setLatitude(undefined);
    setLongitude(undefined);
    setResult(null);
    setFailed(false);
  }


  const hasPreferences =
    Boolean(suburb) ||
    Boolean(serviceType) ||
    Boolean(wants20Hours) ||
    Boolean(minimumCapacity) ||
    (
      latitude !== undefined &&
      longitude !== undefined
    );


  return (
    <section className="container-shell py-8 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside>
          <form
            onSubmit={submit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-950">
              Your preferences
            </h2>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Area / Town
                </span>

                <select
                  value={area}
                  onChange={(event) =>
                    handleAreaChange(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">
                    Choose an area
                  </option>

                  {areas.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label} (
                        {item.services})
                      </option>
                    ),
                  )}
                </select>
              </label>


              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Suburb
                </span>

                <select
                  value={suburb}
                  disabled={!area}
                  onChange={(event) =>
                    setSuburb(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:bg-slate-100"
                >
                  <option value="">
                    {area
                      ? "Any suburb"
                      : "Choose area first"}
                  </option>

                  {suburbs.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label} (
                        {item.services})
                      </option>
                    ),
                  )}
                </select>
              </label>


              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Service type
                </span>

                <select
                  value={serviceType}
                  onChange={(event) =>
                    setServiceType(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                >
                  {SERVICE_TYPES.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
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
                  value={wants20Hours}
                  onChange={(event) =>
                    setWants20Hours(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
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
                  min={1}
                  max={1000}
                  value={minimumCapacity}
                  onChange={(event) =>
                    setMinimumCapacity(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. 40"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                />
              </label>


              <LocationPicker
                initialLatitude={
                  latitude
                }
                initialLongitude={
                  longitude
                }
                onLocationChange={(
                  lat,
                  lon,
                ) => {
                  setLatitude(lat);
                  setLongitude(lon);
                }}
              />
            </div>


            <button
              type="submit"
              disabled={
                loading ||
                !hasPreferences
              }
              className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Finding matches…"
                : "Find my matches"}
            </button>


            {hasPreferences && (
              <button
                type="button"
                onClick={
                  clearPreferences
                }
                className="mt-3 block w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-800"
              >
                Clear preferences
              </button>
            )}
          </form>
        </aside>


        <div>
          {!hasPreferences &&
            !result && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  Start with your preferences
                </h2>

                <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
                  Choose an area and
                  suburb, or optionally
                  use your current
                  location for
                  distance-aware
                  matching.
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
                Please try again
                shortly.
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
                  active Auckland
                  services
                </p>
              </div>


              {result.items.length ===
              0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8">
                  <h3 className="text-xl font-bold">
                    No recommendations
                    found
                  </h3>
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


          <div className="mt-6">
            <Link
              href="/ece"
              className="text-sm font-semibold text-emerald-700"
            >
              Browse all childcare →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
