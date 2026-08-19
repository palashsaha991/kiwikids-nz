export type EceService = {
  id: string;
  slug: string;
  provider_code: string | null;
  name: string;
  service_type: string;
  description: string | null;
  address_line1: string | null;
  suburb: string | null;
  city: string;
  region: string;
  postcode: string | null;
  latitude: string | null;
  longitude: string | null;
  minimum_age_months: number | null;
  maximum_age_months: number | null;
  licensed_places: number | null;
  accepts_20_hours_ece: boolean | null;
  availability_status:
    | "unknown"
    | "available"
    | "waitlist"
    | "check_availability";
  ero_report_url: string | null;
  source_url: string | null;
  source_updated_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type EceSortOption =
  | "name_asc"
  | "name_desc"
  | "capacity_desc";

export type EceSearchParams = {
  search?: string;
  region?: string;
  suburb?: string;
  service_type?: string;
  availability_status?: EceService["availability_status"];
  accepts_20_hours_ece?: boolean;
  age_months?: number;
  sort?: EceSortOption;
  limit?: number;
  offset?: number;
};

export type EceServiceListResponse = {
  items: EceService[];
  total: number;
  limit: number;
  offset: number;
};

const API_BASE_URL =
  process.env.KIWIKIDS_API_BASE_URL ?? "http://127.0.0.1:8000";

function buildEceSearchParams(
  params: EceSearchParams,
): URLSearchParams {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.region) {
    query.set("region", params.region);
  }

  if (params.suburb) {
    query.set("suburb", params.suburb);
  }

  if (params.service_type) {
    query.set("service_type", params.service_type);
  }

  if (params.availability_status) {
    query.set(
      "availability_status",
      params.availability_status,
    );
  }

  if (params.accepts_20_hours_ece !== undefined) {
    query.set(
      "accepts_20_hours_ece",
      String(params.accepts_20_hours_ece),
    );
  }

  if (params.age_months !== undefined) {
    query.set("age_months", String(params.age_months));
  }

  if (params.sort) {
    query.set("sort", params.sort);
  }

  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }

  if (params.offset !== undefined) {
    query.set("offset", String(params.offset));
  }

  return query;
}

export async function getEceServices(
  params: EceSearchParams = {},
): Promise<EceServiceListResponse> {
  const query = buildEceSearchParams(params);

  const url =
    query.size > 0
      ? `${API_BASE_URL}/api/v1/ece?${query.toString()}`
      : `${API_BASE_URL}/api/v1/ece`;

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load ECE services: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<EceServiceListResponse>;
}

export async function getEceServiceBySlug(
  slug: string,
): Promise<EceService | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/ece/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to load ECE service: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<EceService>;
}

export function formatAgeRange(
  minimumMonths: number | null,
  maximumMonths: number | null,
): string {
  if (
    minimumMonths === null ||
    maximumMonths === null
  ) {
    return "Age range to confirm";
  }

  const formatAge = (months: number): string => {
    if (months === 0) {
      return "Birth";
    }

    if (months < 12) {
      return `${months} mo`;
    }

    if (months % 12 === 0) {
      const years = months / 12;

      return `${years} ${years === 1 ? "yr" : "yrs"}`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    return `${years} yr ${remainingMonths} mo`;
  };

  return `${formatAge(minimumMonths)} – ${formatAge(maximumMonths)}`;
}

export function formatAvailability(
  status: EceService["availability_status"],
): "Available" | "Waitlist" | "Check availability" | "Unknown" {
  switch (status) {
    case "available":
      return "Available";

    case "waitlist":
      return "Waitlist";

    case "check_availability":
      return "Check availability";

    default:
      return "Unknown";
  }
}

export function formatFundingStatus(
  accepts20HoursEce: boolean | null,
): string {
  if (accepts20HoursEce === true) {
    return "20 Hours ECE indicated";
  }

  if (accepts20HoursEce === false) {
    return "20 Hours ECE not indicated";
  }

  return "Funding eligibility to confirm";
}

export function formatServiceAddress(
  service: EceService,
): string {
  return [
    service.address_line1,
    service.suburb,
    service.city,
    service.region !== service.city ? service.region : null,
    service.postcode,
  ]
    .filter(Boolean)
    .join(", ");
}


export type EceRecommendationReason = {
  factor: string;
  matched: boolean | null;
  points_earned: number;
  points_available: number;
  explanation: string;
};

export type EceRecommendationItem = {
  service: EceService;
  match_score: number;
  points_earned: number;
  points_available: number;
  reasons: EceRecommendationReason[];
};

export type EceRecommendationListResponse = {
  items: EceRecommendationItem[];
  total: number;
};

export type EceRecommendationParams = {
  suburb?: string;
  service_type?: string;
  wants_20_hours_ece?: boolean;
  minimum_capacity?: number;
  latitude?: number;
  longitude?: number;
  limit?: number;
};

export async function getEceRecommendations(
  params: EceRecommendationParams,
): Promise<EceRecommendationListResponse> {
  const query = new URLSearchParams();

  if (params.suburb) {
    query.set("suburb", params.suburb);
  }

  if (params.service_type) {
    query.set(
      "service_type",
      params.service_type,
    );
  }

  if (
    params.wants_20_hours_ece !==
    undefined
  ) {
    query.set(
      "wants_20_hours_ece",
      String(params.wants_20_hours_ece),
    );
  }

  if (
    params.minimum_capacity !==
    undefined
  ) {
    query.set(
      "minimum_capacity",
      String(params.minimum_capacity),
    );
  }

  if (
    params.latitude !== undefined &&
    params.longitude !== undefined
  ) {
    query.set(
      "latitude",
      String(params.latitude),
    );

    query.set(
      "longitude",
      String(params.longitude),
    );
  }

  if (params.limit !== undefined) {
    query.set(
      "limit",
      String(params.limit),
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/ece/recommendations?${query.toString()}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load ECE recommendations: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<EceRecommendationListResponse>;
}
