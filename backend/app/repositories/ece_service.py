from typing import Literal

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models import ECEService


SortOption = Literal[
    "name_asc",
    "name_desc",
    "capacity_desc",
]


def _build_filters(
    *,
    search: str | None = None,
    region: str | None = None,
    suburb: str | None = None,
    service_type: str | None = None,
    availability_status: str | None = None,
    accepts_20_hours_ece: bool | None = None,
    age_months: int | None = None,
):
    conditions = [
        ECEService.is_active.is_(True)
    ]

    if search:
        search_term = f"%{search.strip()}%"

        conditions.append(
            or_(
                ECEService.name.ilike(search_term),
                ECEService.suburb.ilike(search_term),
                ECEService.city.ilike(search_term),
                ECEService.region.ilike(search_term),
                ECEService.provider_code.ilike(search_term),
            )
        )

    if region:
        conditions.append(
            ECEService.region.ilike(region.strip())
        )

    if suburb:
        conditions.append(
            ECEService.suburb.ilike(suburb.strip())
        )

    if service_type:
        conditions.append(
            ECEService.service_type.ilike(
                service_type.strip()
            )
        )

    if availability_status:
        conditions.append(
            ECEService.availability_status
            == availability_status
        )

    if accepts_20_hours_ece is not None:
        conditions.append(
            ECEService.accepts_20_hours_ece.is_(
                accepts_20_hours_ece
            )
        )

    if age_months is not None:
        conditions.extend(
            [
                ECEService.minimum_age_months
                <= age_months,
                ECEService.maximum_age_months
                >= age_months,
            ]
        )

    return conditions


def list_ece_services(
    session: Session,
    *,
    search: str | None = None,
    region: str | None = None,
    suburb: str | None = None,
    service_type: str | None = None,
    availability_status: str | None = None,
    accepts_20_hours_ece: bool | None = None,
    age_months: int | None = None,
    sort: SortOption = "name_asc",
    limit: int = 20,
    offset: int = 0,
) -> list[ECEService]:
    conditions = _build_filters(
        search=search,
        region=region,
        suburb=suburb,
        service_type=service_type,
        availability_status=availability_status,
        accepts_20_hours_ece=accepts_20_hours_ece,
        age_months=age_months,
    )

    statement = select(ECEService).where(
        *conditions
    )

    if sort == "name_desc":
        statement = statement.order_by(
            ECEService.name.desc()
        )

    elif sort == "capacity_desc":
        statement = statement.order_by(
            ECEService.licensed_places
            .desc()
            .nullslast(),
            ECEService.name.asc(),
        )

    else:
        statement = statement.order_by(
            ECEService.name.asc()
        )

    statement = statement.limit(limit).offset(offset)

    return list(
        session.scalars(statement).all()
    )


def count_ece_services(
    session: Session,
    *,
    search: str | None = None,
    region: str | None = None,
    suburb: str | None = None,
    service_type: str | None = None,
    availability_status: str | None = None,
    accepts_20_hours_ece: bool | None = None,
    age_months: int | None = None,
) -> int:
    conditions = _build_filters(
        search=search,
        region=region,
        suburb=suburb,
        service_type=service_type,
        availability_status=availability_status,
        accepts_20_hours_ece=accepts_20_hours_ece,
        age_months=age_months,
    )

    statement = (
        select(func.count())
        .select_from(ECEService)
        .where(*conditions)
    )

    return int(
        session.scalar(statement) or 0
    )


def get_ece_service_by_slug(
    session: Session,
    slug: str,
) -> ECEService | None:
    statement = (
        select(ECEService)
        .where(
            ECEService.slug == slug,
            ECEService.is_active.is_(True),
        )
        .limit(1)
    )

    return session.scalar(statement)
