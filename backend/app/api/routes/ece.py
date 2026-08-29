from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db_session
from app.repositories.ece_service import (
    count_ece_services,
    get_ece_service_by_slug,
    list_ece_services,
    list_recommendation_candidates,
    list_ece_location_facets,
)
from app.schemas.ece_service import (
    ECERecommendationItemResponse,
    ECERecommendationListResponse,
    ECERecommendationRequest,
    ECERecommendationReasonResponse,
    ECEFacetsResponse,
    ECEServiceListResponse,
    ECEServiceResponse,
)


router = APIRouter(
    prefix="/ece",
    tags=["ECE"],
)

DatabaseSession = Annotated[
    Session,
    Depends(get_db_session),
]

AvailabilityStatus = Literal[
    "unknown",
    "available",
    "waitlist",
    "check_availability",
]

SortOption = Literal[
    "name_asc",
    "name_desc",
    "capacity_desc",
]


from app.services.ece_recommendation import (
    RecommendationPreferences,
    score_ece_service,
)


@router.get(
    "",
    response_model=ECEServiceListResponse,
)
def get_ece_services(
    session: DatabaseSession,
    search: Annotated[
        str | None,
        Query(
            min_length=1,
            max_length=120,
        ),
    ] = None,
    region: Annotated[
        str | None,
        Query(
            min_length=1,
            max_length=120,
        ),
    ] = None,
    suburb: Annotated[
        str | None,
        Query(
            min_length=1,
            max_length=120,
        ),
    ] = None,
    service_type: Annotated[
        str | None,
        Query(
            min_length=1,
            max_length=80,
        ),
    ] = None,
    availability_status: AvailabilityStatus | None = None,
    accepts_20_hours_ece: bool | None = None,
    age_months: Annotated[
        int | None,
        Query(
            ge=0,
            le=216,
        ),
    ] = None,
    sort: SortOption = "name_asc",
    limit: Annotated[
        int,
        Query(
            ge=1,
            le=100,
        ),
    ] = 20,
    offset: Annotated[
        int,
        Query(
            ge=0,
        ),
    ] = 0,
) -> ECEServiceListResponse:
    items = list_ece_services(
        session,
        search=search,
        region=region,
        suburb=suburb,
        service_type=service_type,
        availability_status=availability_status,
        accepts_20_hours_ece=accepts_20_hours_ece,
        age_months=age_months,
        sort=sort,
        limit=limit,
        offset=offset,
    )

    total = count_ece_services(
        session,
        search=search,
        region=region,
        suburb=suburb,
        service_type=service_type,
        availability_status=availability_status,
        accepts_20_hours_ece=accepts_20_hours_ece,
        age_months=age_months,
    )

    return ECEServiceListResponse(
        items=items,
        total=total,
        limit=limit,
        offset=offset,
    )



@router.get(
    "/facets",
    response_model=ECEFacetsResponse,
)
def get_ece_facets(
    session: DatabaseSession,
) -> ECEFacetsResponse:
    return ECEFacetsResponse(
        areas=list_ece_location_facets(
            session,
        )
    )


@router.post(
    "/recommendations",
    response_model=ECERecommendationListResponse,
)
def get_ece_recommendations(
    payload: ECERecommendationRequest,
    session: DatabaseSession,
) -> ECERecommendationListResponse:
    preferences = RecommendationPreferences(
        suburb=payload.suburb,
        service_type=payload.service_type,
        wants_20_hours_ece=(
            payload.wants_20_hours_ece
        ),
        minimum_capacity=(
            payload.minimum_capacity
        ),
        latitude=payload.latitude,
        longitude=payload.longitude,
    )

    candidates = list_recommendation_candidates(
        session,
        region="Auckland Region",
    )

    scored = []

    for service in candidates:
        score = score_ece_service(
            service,
            preferences,
        )

        scored.append(
            (
                service,
                score,
            )
        )

    scored.sort(
        key=lambda item: (
            -item[1].match_score,
            item[0].name.casefold(),
        )
    )

    items = [
        ECERecommendationItemResponse(
            service=service,
            match_score=score.match_score,
            points_earned=score.points_earned,
            points_available=score.points_available,
            reasons=[
                ECERecommendationReasonResponse(
                    factor=reason.factor,
                    matched=reason.matched,
                    points_earned=reason.points_earned,
                    points_available=(
                        reason.points_available
                    ),
                    explanation=(
                        reason.explanation
                    ),
                )
                for reason in score.reasons
            ],
        )
        for service, score
        in scored[:payload.limit]
    ]

    return ECERecommendationListResponse(
        items=items,
        total=len(scored),
    )


@router.get(
    "/{slug}",
    response_model=ECEServiceResponse,
)
def get_ece_service(
    slug: str,
    session: DatabaseSession,
) -> ECEServiceResponse:
    service = get_ece_service_by_slug(
        session,
        slug,
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ECE service not found.",
        )

    return service
