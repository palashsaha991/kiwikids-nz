"use client";

import {
  useCallback,
  useSyncExternalStore,
} from "react";

const FAVOURITES_KEY = "kiwikids.ece.favourites";
const COMPARE_KEY = "kiwikids.ece.compare";

const MAX_COMPARE_ITEMS = 3;
const STORAGE_EVENT = "kiwikids-ece-preferences-change";


function readStoredSlugs(key: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return Array.from(
      new Set(
        parsed.filter(
          (item): item is string =>
            typeof item === "string" &&
            item.trim().length > 0,
        ),
      ),
    );
  } catch {
    return [];
  }
}


function writeStoredSlugs(
  key: string,
  values: string[],
): void {
  window.localStorage.setItem(
    key,
    JSON.stringify(values),
  );

  window.dispatchEvent(
    new Event(STORAGE_EVENT),
  );
}


function subscribe(
  callback: () => void,
): () => void {
  window.addEventListener(
    STORAGE_EVENT,
    callback,
  );

  window.addEventListener(
    "storage",
    callback,
  );

  return () => {
    window.removeEventListener(
      STORAGE_EVENT,
      callback,
    );

    window.removeEventListener(
      "storage",
      callback,
    );
  };
}


function getFavouritesSnapshot(): string {
  return JSON.stringify(
    readStoredSlugs(FAVOURITES_KEY),
  );
}


function getCompareSnapshot(): string {
  return JSON.stringify(
    readStoredSlugs(COMPARE_KEY),
  );
}


function getServerSnapshot(): string {
  return "[]";
}


export function useEcePreferences() {
  const favouritesSnapshot =
    useSyncExternalStore(
      subscribe,
      getFavouritesSnapshot,
      getServerSnapshot,
    );

  const compareSnapshot =
    useSyncExternalStore(
      subscribe,
      getCompareSnapshot,
      getServerSnapshot,
    );

  const favourites: string[] =
    JSON.parse(favouritesSnapshot);

  const compare: string[] =
    JSON.parse(compareSnapshot);


  const toggleFavourite =
    useCallback(
      (slug: string) => {
        const current =
          readStoredSlugs(
            FAVOURITES_KEY,
          );

        const next =
          current.includes(slug)
            ? current.filter(
                (item) =>
                  item !== slug,
              )
            : [
                ...current,
                slug,
              ];

        writeStoredSlugs(
          FAVOURITES_KEY,
          next,
        );
      },
      [],
    );


  const addToCompare =
    useCallback(
      (
        slug: string,
      ):
        | "added"
        | "exists"
        | "limit" => {
        const current =
          readStoredSlugs(
            COMPARE_KEY,
          );

        if (
          current.includes(slug)
        ) {
          return "exists";
        }

        if (
          current.length >=
          MAX_COMPARE_ITEMS
        ) {
          return "limit";
        }

        writeStoredSlugs(
          COMPARE_KEY,
          [
            ...current,
            slug,
          ],
        );

        return "added";
      },
      [],
    );


  const removeFromCompare =
    useCallback(
      (slug: string) => {
        const current =
          readStoredSlugs(
            COMPARE_KEY,
          );

        writeStoredSlugs(
          COMPARE_KEY,
          current.filter(
            (item) =>
              item !== slug,
          ),
        );
      },
      [],
    );


  const clearCompare =
    useCallback(() => {
      writeStoredSlugs(
        COMPARE_KEY,
        [],
      );
    }, []);


  return {
    favourites,
    compare,
    maxCompareItems:
      MAX_COMPARE_ITEMS,

    isFavourite: (
      slug: string,
    ) =>
      favourites.includes(slug),

    isCompared: (
      slug: string,
    ) =>
      compare.includes(slug),

    toggleFavourite,
    addToCompare,
    removeFromCompare,
    clearCompare,
  };
}
