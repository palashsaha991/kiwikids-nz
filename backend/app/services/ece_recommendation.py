from __future__ import annotations

from dataclasses import dataclass
from math import asin, cos, radians, sin, sqrt

from app.models.ece_service import ECEService
from app.services.ece_service_types import resolve_service_type


LOCATION_WEIGHT = 35
DISTANCE_WEIGHT = 35
TWENTY_HOURS_ECE_WEIGHT = 25
SERVICE_TYPE_WEIGHT = 20
CAPACITY_WEIGHT = 10
DATA_COMPLETENESS_WEIGHT = 10


@dataclass(frozen=True)
class RecommendationPreferences:
    suburb: str | None = None
    service_type: str | None = None
    wants_20_hours_ece: bool | None = None
    minimum_capacity: int | None = None
    latitude: float | None = None
    longitude: float | None = None


@dataclass(frozen=True)
class RecommendationReason:
    factor: str
    matched: bool | None
    points_earned: int
    points_available: int
    explanation: str


@dataclass(frozen=True)
class RecommendationScore:
    match_score: int
    points_earned: int
    points_available: int
    reasons: tuple[RecommendationReason, ...]


def calculate_distance_km(
    latitude1: float,
    longitude1: float,
    latitude2: float,
    longitude2: float,
) -> float:
    earth_radius_km = 6371.0088

    lat1 = radians(latitude1)
    lon1 = radians(longitude1)
    lat2 = radians(latitude2)
    lon2 = radians(longitude2)

    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1

    haversine = (
        sin(delta_lat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(delta_lon / 2) ** 2
    )

    return (
        2
        * earth_radius_km
        * asin(sqrt(haversine))
    )


def _distance_points(
    distance_km: float,
) -> int:
    if distance_km <= 2:
        return 35

    if distance_km <= 5:
        return 28

    if distance_km <= 10:
        return 18

    if distance_km <= 20:
        return 8

    return 0


def _normalise_text(value: str | None) -> str | None:
    if value is None:
        return None

    cleaned = value.strip()

    if not cleaned:
        return None

    return cleaned.casefold()


def _score_data_completeness(
    service: ECEService,
) -> tuple[int, RecommendationReason]:
    fields = (
        service.address_line1,
        service.suburb,
        service.latitude,
        service.longitude,
        service.licensed_places,
        service.accepts_20_hours_ece,
    )

    available = sum(
        value is not None
        for value in fields
    )

    completeness_ratio = available / len(fields)

    points = round(
        DATA_COMPLETENESS_WEIGHT
        * completeness_ratio
    )

    return (
        points,
        RecommendationReason(
            factor="data_completeness",
            matched=None,
            points_earned=points,
            points_available=DATA_COMPLETENESS_WEIGHT,
            explanation=(
                f"{available} of {len(fields)} key "
                "profile fields are available."
            ),
        ),
    )


def score_ece_service(
    service: ECEService,
    preferences: RecommendationPreferences,
) -> RecommendationScore:
    reasons: list[RecommendationReason] = []

    earned = 0
    available = 0

    if (
        preferences.latitude is not None
        and preferences.longitude is not None
    ):
        available += DISTANCE_WEIGHT

        if (
            service.latitude is None
            or service.longitude is None
        ):
            distance_km = None
            matched: bool | None = None
            points = 0

            explanation = (
                "Service coordinates are unavailable."
            )
        else:
            distance_km = calculate_distance_km(
                preferences.latitude,
                preferences.longitude,
                float(service.latitude),
                float(service.longitude),
            )

            points = _distance_points(
                distance_km
            )

            matched = points > 0

            explanation = (
                f"Approximately {distance_km:.1f} km "
                "from the preferred location."
            )

        earned += points

        reasons.append(
            RecommendationReason(
                factor="distance",
                matched=matched,
                points_earned=points,
                points_available=DISTANCE_WEIGHT,
                explanation=explanation,
            )
        )

    preferred_suburb = _normalise_text(
        preferences.suburb
    )

    has_coordinates = (
        preferences.latitude is not None
        and preferences.longitude is not None
    )

    if (
        preferred_suburb is not None
        and not has_coordinates
    ):
        available += LOCATION_WEIGHT

        service_suburb = _normalise_text(
            service.suburb
        )

        matched = (
            service_suburb == preferred_suburb
        )

        points = (
            LOCATION_WEIGHT
            if matched
            else 0
        )

        earned += points

        reasons.append(
            RecommendationReason(
                factor="suburb",
                matched=matched,
                points_earned=points,
                points_available=LOCATION_WEIGHT,
                explanation=(
                    f"Matches preferred suburb: "
                    f"{preferences.suburb.strip()}."
                    if matched
                    else (
                        "Does not match preferred "
                        f"suburb: "
                        f"{preferences.suburb.strip()}."
                    )
                ),
            )
        )

    resolved_service_type = resolve_service_type(
        preferences.service_type
    )

    preferred_service_type = _normalise_text(
        resolved_service_type
    )

    if preferred_service_type is not None:
        available += SERVICE_TYPE_WEIGHT

        service_type = _normalise_text(
            service.service_type
        )

        matched = (
            service_type
            == preferred_service_type
        )

        points = (
            SERVICE_TYPE_WEIGHT
            if matched
            else 0
        )

        earned += points

        reasons.append(
            RecommendationReason(
                factor="service_type",
                matched=matched,
                points_earned=points,
                points_available=SERVICE_TYPE_WEIGHT,
                explanation=(
                    "Matches preferred service type."
                    if matched
                    else (
                        "Does not match preferred "
                        "service type."
                    )
                ),
            )
        )

    if (
        preferences.wants_20_hours_ece
        is not None
    ):
        available += TWENTY_HOURS_ECE_WEIGHT

        if service.accepts_20_hours_ece is None:
            matched: bool | None = None
            points = 0

            explanation = (
                "20 Hours ECE participation "
                "information is unavailable."
            )
        else:
            matched = (
                service.accepts_20_hours_ece
                == preferences.wants_20_hours_ece
            )

            points = (
                TWENTY_HOURS_ECE_WEIGHT
                if matched
                else 0
            )

            explanation = (
                "Matches the 20 Hours ECE preference."
                if matched
                else (
                    "Does not match the "
                    "20 Hours ECE preference."
                )
            )

        earned += points

        reasons.append(
            RecommendationReason(
                factor="20_hours_ece",
                matched=matched,
                points_earned=points,
                points_available=TWENTY_HOURS_ECE_WEIGHT,
                explanation=explanation,
            )
        )

    if preferences.minimum_capacity is not None:
        available += CAPACITY_WEIGHT

        if service.licensed_places is None:
            matched = None
            points = 0

            explanation = (
                "Licensed capacity information "
                "is unavailable."
            )
        else:
            matched = (
                service.licensed_places
                >= preferences.minimum_capacity
            )

            points = (
                CAPACITY_WEIGHT
                if matched
                else 0
            )

            explanation = (
                (
                    "Licensed capacity meets the "
                    f"preferred minimum of "
                    f"{preferences.minimum_capacity}."
                )
                if matched
                else (
                    "Licensed capacity is below the "
                    f"preferred minimum of "
                    f"{preferences.minimum_capacity}."
                )
            )

        earned += points

        reasons.append(
            RecommendationReason(
                factor="licensed_capacity",
                matched=matched,
                points_earned=points,
                points_available=CAPACITY_WEIGHT,
                explanation=explanation,
            )
        )

    completeness_points, completeness_reason = (
        _score_data_completeness(service)
    )

    available += DATA_COMPLETENESS_WEIGHT
    earned += completeness_points
    reasons.append(completeness_reason)

    match_score = round(
        (earned / available) * 100
    )

    return RecommendationScore(
        match_score=match_score,
        points_earned=earned,
        points_available=available,
        reasons=tuple(reasons),
    )
