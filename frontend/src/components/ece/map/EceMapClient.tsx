"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import type { EceService } from "@/lib/ece";


type Props = {
  services: EceService[];
};


function coordinatesFor(
  service: EceService,
): [number, number] | null {
  const latitude = Number(service.latitude);
  const longitude = Number(service.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return [latitude, longitude];
}


function MapController({
  services,
  selected,
}: {
  services: EceService[];
  selected: EceService | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      const coordinates =
        coordinatesFor(selected);

      if (coordinates) {
        map.flyTo(
          coordinates,
          15,
          {
            duration: 0.7,
          },
        );
      }

      return;
    }

    const coordinates = services
      .map(coordinatesFor)
      .filter(
        (
          value,
        ): value is [number, number] =>
          value !== null,
      );

    if (coordinates.length > 0) {
      map.fitBounds(
        coordinates,
        {
          padding: [30, 30],
          maxZoom: 13,
        },
      );
    }
  }, [
    map,
    selected,
    services,
  ]);

  return null;
}


export function EceMapClient({
  services,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [
    serviceType,
    setServiceType,
  ] = useState("");

  const [
    twentyHoursOnly,
    setTwentyHoursOnly,
  ] = useState(false);

  const [
    selectedService,
    setSelectedService,
  ] = useState<EceService | null>(
    null,
  );

  const mappedServices = useMemo(
    () =>
      services.filter(
        (service) =>
          coordinatesFor(service) !==
          null,
      ),
    [services],
  );

  const serviceTypes = useMemo(
    () =>
      Array.from(
        new Set(
          mappedServices
            .map(
              (service) =>
                service.service_type,
            )
            .filter(Boolean),
        ),
      ).sort((a, b) =>
        a.localeCompare(b),
      ),
    [mappedServices],
  );

  const filteredServices = useMemo(
    () => {
      const query =
        search.trim().toLowerCase();

      return mappedServices.filter(
        (service) => {
          const searchableText = [
            service.name,
            service.suburb,
            service.city,
            service.address_line1,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (
            query &&
            !searchableText.includes(query)
          ) {
            return false;
          }

          if (
            serviceType &&
            service.service_type !==
              serviceType
          ) {
            return false;
          }

          if (
            twentyHoursOnly &&
            service.accepts_20_hours_ece !==
              true
          ) {
            return false;
          }

          return true;
        },
      );
    },
    [
      mappedServices,
      search,
      serviceType,
      twentyHoursOnly,
    ],
  );

  const clearFilters = () => {
    setSearch("");
    setServiceType("");
    setTwentyHoursOnly(false);
    setSelectedService(null);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">
              Explore services
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredServices.length}
              {" "}
              mapped services
            </p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Clear
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="map-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search name or location
            </label>

            <input
              id="map-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value,
                );

                setSelectedService(
                  null,
                );
              }}
              placeholder="e.g. Onehunga"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="map-service-type"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Service type
            </label>

            <select
              id="map-service-type"
              value={serviceType}
              onChange={(event) => {
                setServiceType(
                  event.target.value,
                );

                setSelectedService(
                  null,
                );
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">
                All service types
              </option>

              {serviceTypes.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ),
              )}
            </select>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={twentyHoursOnly}
              onChange={(event) => {
                setTwentyHoursOnly(
                  event.target.checked,
                );

                setSelectedService(
                  null,
                );
              }}
              className="mt-1 size-4"
            />

            <span>
              <span className="block text-sm font-semibold text-slate-800">
                20 Hours ECE indicated
              </span>

              <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                Show only services where
                the source indicates
                20 Hours ECE.
              </span>
            </span>
          </label>
        </div>

        <div className="mt-5 max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {filteredServices
            .slice(0, 100)
            .map((service) => {
              const isSelected =
                selectedService?.id ===
                service.id;

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() =>
                    setSelectedService(
                      service,
                    )
                  }
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900">
                    {service.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {[
                      service.suburb,
                      service.city,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {
                      service.service_type
                    }
                  </p>
                </button>
              );
            })}

          {filteredServices.length >
            100 && (
            <p className="py-3 text-center text-xs text-slate-500">
              Showing first 100 in
              the side list. All matching
              locations remain on the map.
            </p>
          )}

          {filteredServices.length ===
            0 && (
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <p className="font-semibold text-slate-800">
                No services match
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search
                or filters.
              </p>
            </div>
          )}
        </div>
      </aside>

      <div
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        data-testid="ece-map"
      >
        <MapContainer
          center={[
            -36.8485,
            174.7633,
          ]}
          zoom={10}
          scrollWheelZoom
          className="h-[72vh] min-h-[560px] w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            services={filteredServices}
            selected={
              selectedService
            }
          />

          {filteredServices.map(
            (service) => {
              const coordinates =
                coordinatesFor(service);

              if (!coordinates) {
                return null;
              }

              const isSelected =
                selectedService?.id ===
                service.id;

              return (
                <CircleMarker
                  key={service.id}
                  center={coordinates}
                  radius={
                    isSelected
                      ? 11
                      : 7
                  }
                  eventHandlers={{
                    click: () =>
                      setSelectedService(
                        service,
                      ),
                  }}
                  pathOptions={{
                    fillOpacity:
                      isSelected
                        ? 1
                        : 0.75,
                    weight:
                      isSelected
                        ? 4
                        : 2,
                  }}
                >
                  <Popup>
                    <div className="min-w-56">
                      <p className="font-bold">
                        {service.name}
                      </p>

                      <p className="mt-1 text-sm">
                        {[
                          service.address_line1,
                          service.suburb,
                          service.city,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                      <p className="mt-2 text-sm">
                        {
                          service.service_type
                        }
                      </p>

                      {service.accepts_20_hours_ece ===
                        true && (
                        <p className="mt-2 text-sm font-semibold">
                          20 Hours ECE
                          indicated
                        </p>
                      )}

                      <Link
                        href={`/ece/${service.slug}`}
                        className="mt-3 inline-block font-semibold text-emerald-700"
                      >
                        View service details →
                      </Link>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            },
          )}
        </MapContainer>
      </div>
    </div>
  );
}
