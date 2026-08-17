"use client";

import {
  type ReactNode,
  useState,
} from "react";


type FilterPanelProps = {
  children: ReactNode;
};


export function FilterPanel({
  children,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (current) => !current,
          )
        }
        aria-expanded={isOpen}
        aria-controls="ece-filter-panel"
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-900 shadow-sm lg:hidden"
      >
        <span>
          Filters
        </span>

        <span
          aria-hidden="true"
          className="text-lg"
        >
          {isOpen
            ? "−"
            : "+"}
        </span>
      </button>

      <div
        id="ece-filter-panel"
        className={
          isOpen
            ? "mt-3 block lg:mt-0 lg:block"
            : "hidden lg:block"
        }
      >
        {children}
      </div>
    </div>
  );
}
