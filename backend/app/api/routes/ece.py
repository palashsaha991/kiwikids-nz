from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db_session
from app.repositories.ece_service import (
    get_ece_service_by_slug,
    list_ece_services,
)
from app.schemas.ece_service import ECEServiceResponse


router = APIRouter(
    prefix="/ece",
    tags=["ECE"],
)

DatabaseSession = Annotated[
    Session,
    Depends(get_db_session),
]


@router.get(
    "",
    response_model=list[ECEServiceResponse],
)
def get_ece_services(
    session: DatabaseSession,
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
) -> list[ECEServiceResponse]:
    return list_ece_services(
        session,
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
