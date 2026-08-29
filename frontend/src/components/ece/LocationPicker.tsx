"use client";

import { useState } from "react";


type LocationPickerProps = {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationChange?: (
    latitude: number | undefined,
    longitude: number | undefined,
  ) => void;
};


export function LocationPicker({
  initialLatitude,
  initialLongitude,
  onLocationChange,
}: LocationPickerProps) {
  const [status, setStatus] =
    useState<
      "idle" |
      "loading" |
      "success" |
      "error"
    >(
      initialLatitude !== undefined &&
      initialLongitude !== undefined
        ? "success"
        : "idle",
    );

  const [message, setMessage] =
    useState<string>("");


  function useCurrentLocation(): void {
    if (!navigator.geolocation) {
      setStatus("error");
      setMessage(
        "Location access is not supported by this browser.",
      );
      return;
    }

    setStatus("loading");
    setMessage(
      "Requesting your location…",
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange?.(
          position.coords.latitude,
          position.coords.longitude,
        );

        setStatus("success");

        setMessage(
          "Current location added. Submit the form to use distance-aware matching.",
        );
      },
      (error) => {
        setStatus("error");

        if (error.code === 1) {
          setMessage(
            "Location permission was not granted. You can still use your preferred suburb.",
          );
          return;
        }

        if (error.code === 2) {
          setMessage(
            "Your current location could not be determined.",
          );
          return;
        }

        setMessage(
          "Location request timed out. Please try again.",
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }


  function clearLocation(): void {
    onLocationChange?.(
      undefined,
      undefined,
    );

    setStatus("idle");
    setMessage("");
  }


  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-700">
        Your location
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        Optional. Allow location access to
        rank nearby services more accurately.
        KiwiKids does not need to save your
        precise location for this search.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={status === "loading"}
          className="rounded-xl border border-emerald-700 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading"
            ? "Getting location…"
            : status === "success"
              ? "Update current location"
              : "Use my current location"}
        </button>

        {status === "success" && (
          <button
            type="button"
            onClick={clearLocation}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white"
          >
            Remove location
          </button>
        )}
      </div>

      {message && (
        <p
          className={
            status === "error"
              ? "mt-3 text-xs leading-5 text-amber-700"
              : "mt-3 text-xs leading-5 text-emerald-700"
          }
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </div>
  );
}
