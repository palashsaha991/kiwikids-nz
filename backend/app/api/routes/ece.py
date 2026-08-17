from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db_session
from app.repositories.ece_service import (
    count_ece_services,
    get_ece_service_by_slug,
    list_ece_services,
)
from app.schemas.ece_service import (
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
