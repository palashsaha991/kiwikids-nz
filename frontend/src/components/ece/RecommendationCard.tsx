import Link from "next/link";

import {
  EceRecommendationItem,
  formatAgeRange,
  formatAvailability,
  formatFundingStatus,
  formatServiceAddress,
} from "@/lib/ece";


type RecommendationCardProps = {
  recommendation: EceRecommendationItem;
};


function matchLabel(
  score: number,
): string {
  if (score >= 90) {
    return "Excellent match";
  }

  if (score >= 75) {
    return "Strong match";
  }

  if (score >= 60) {
    return "Good match";
  }

  return "Possible match";
}


export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const {
    service,
    match_score: matchScore,
    reasons,
  } = recommendation;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                {matchLabel(matchScore)}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {formatAvailability(
                  service.availability_status,
                )}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {formatFundingStatus(
                  service.accepts_20_hours_ece,
                )}
              </span>
            </div>

            <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
              {service.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {service.service_type}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl bg-emerald-700 px-5 py-4 text-center text-white">
            <span className="block text-3xl font-bold">
              {matchScore}%
            </span>

            <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-emerald-100">
              Match
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-y border-slate-100 py-5 text-sm sm:grid-cols-3">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Location
            </span>

            <span className="mt-1 block text-slate-700">
              {formatServiceAddress(service)}
            </span>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Age range
            </span>

            <span className="mt-1 block text-slate-700">
              {formatAgeRange(
                service.minimum_age_months,
                service.maximum_age_months,
              )}
            </span>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Licensed places
            </span>

            <span className="mt-1 block text-slate-700">
              {service.licensed_places ??
                "To confirm"}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-bold text-slate-900">
            Why this match?
          </h3>

          <ul className="mt-3 space-y-2">
            {reasons.map((reason) => (
              <li
                key={reason.factor}
                className="flex gap-3 text-sm leading-6 text-slate-600"
              >
                <span
                  aria-hidden="true"
                  className={
                    reason.matched === false
                      ? "text-slate-400"
                      : "text-emerald-600"
                  }
                >
                  {reason.matched === false
                    ? "○"
                    : "✓"}
                </span>

                <span>
                  {reason.explanation}

                  <span className="ml-2 font-semibold text-slate-800">
                    {reason.points_earned}/
                    {reason.points_available}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <Link
            href={`/ece/${service.slug}`}
            className="inline-flex rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            View service details
          </Link>
        </div>
      </div>
    </article>
  );
}
