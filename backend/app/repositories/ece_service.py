from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import ECEService


def list_ece_services(
    session: Session,
    *,
    limit: int = 20,
    offset: int = 0,
) -> list[ECEService]:
    statement = (
        select(ECEService)
        .where(
            ECEService.is_active.is_(True)
        )
        .order_by(
            ECEService.name.asc()
        )
        .limit(limit)
        .offset(offset)
    )

    return list(
        session.scalars(statement).all()
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
