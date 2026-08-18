from __future__ import annotations

import argparse
import asyncio
import os
import uuid
from pathlib import Path

from sqlalchemy import URL, create_engine, func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.pool import NullPool

from app.integrations.moe_ece import (
    DEFAULT_PAGE_SIZE,
    NormalizedEceService,
    fetch_normalized_services,
)
from app.models.ece_service import ECEService


TARGET_REGION = "Auckland Region"


def read_secret(path: str) -> str:
    secret_path = Path(path)

    if not secret_path.is_file():
        raise RuntimeError(
            f"Database secret not found: {path}"
        )

    value = secret_path.read_text(
        encoding="utf-8",
    ).strip()

    if not value:
        raise RuntimeError(
            "Database secret is empty."
        )

    return value


async def fetch_auckland_services() -> list[NormalizedEceService]:
    offset = 0
    total: int | None = None

    services: list[NormalizedEceService] = []

    while total is None or offset < total:
        page, total = await fetch_normalized_services(
            limit=DEFAULT_PAGE_SIZE,
            offset=offset,
        )

        services.extend(
            service
            for service in page
            if service.region.casefold()
            == TARGET_REGION.casefold()
        )

        offset += DEFAULT_PAGE_SIZE

    services.sort(
        key=lambda service: service.provider_code
    )

    return services


def build_database_url() -> URL:
    password = read_secret(
        os.getenv(
            "KIWIKIDS_INGEST_DB_PASSWORD_FILE",
            "/run/secrets/ingest_db_password",
        )
    )

    return URL.create(
        drivername="postgresql+psycopg",
        username=os.getenv(
            "KIWIKIDS_INGEST_DB_USER",
            "kiwikids_ingest",
        ),
        password=password,
        host=os.getenv(
            "KIWIKIDS_INGEST_DB_HOST",
            "postgres",
        ),
        port=int(
            os.getenv(
                "KIWIKIDS_INGEST_DB_PORT",
                "5432",
            )
        ),
        database=os.getenv(
            "KIWIKIDS_INGEST_DB_NAME",
            "kiwikids",
        ),
    )


def validate_for_database(
    service: NormalizedEceService,
) -> None:
    checks = (
        (
            "provider_code",
            service.provider_code,
            80,
        ),
        (
            "slug",
            service.slug,
            180,
        ),
        (
            "name",
            service.name,
            255,
        ),
        (
            "service_type",
            service.service_type,
            80,
        ),
        (
            "address_line1",
            service.address_line1,
            255,
        ),
        (
            "suburb",
            service.suburb,
            120,
        ),
        (
            "city",
            service.city,
            120,
        ),
        (
            "region",
            service.region,
            120,
        ),
    )

    for field, value, maximum in checks:
        if (
            value is not None
            and len(value) > maximum
        ):
            raise ValueError(
                f"{field} exceeds {maximum} characters "
                f"for provider {service.provider_code}"
            )


def import_services(
    services: list[NormalizedEceService],
) -> int:
    for service in services:
        validate_for_database(service)

    rows = [
        {
            "id": uuid.uuid4(),
            "provider_code":
                service.provider_code,
            "slug":
                service.slug,
            "name":
                service.name,
            "service_type":
                service.service_type,
            "description":
                None,
            "address_line1":
                service.address_line1,
            "suburb":
                service.suburb,
            "city":
                service.city,
            "region":
                service.region,
            "postcode":
                None,
            "latitude":
                service.latitude,
            "longitude":
                service.longitude,
            "minimum_age_months":
                None,
            "maximum_age_months":
                None,
            "licensed_places":
                service.licensed_places,
            "accepts_20_hours_ece":
                service.accepts_20_hours_ece,
            "availability_status":
                "unknown",
            "ero_report_url":
                None,
            "source_url":
                service.source_url,
            "source_updated_at":
                None,
            "is_active":
                True,
        }
        for service in services
    ]

    if not rows:
        return 0

    table = ECEService.__table__

    statement = insert(table).values(rows)

    statement = statement.on_conflict_do_update(
        index_elements=[
            table.c.provider_code,
        ],
        set_={
            "name":
                statement.excluded.name,
            "service_type":
                statement.excluded.service_type,
            "address_line1":
                statement.excluded.address_line1,
            "suburb":
                statement.excluded.suburb,
            "city":
                statement.excluded.city,
            "region":
                statement.excluded.region,
            "latitude":
                statement.excluded.latitude,
            "longitude":
                statement.excluded.longitude,
            "licensed_places":
                statement.excluded.licensed_places,
            "accepts_20_hours_ece":
                statement.excluded.accepts_20_hours_ece,
            "source_url":
                statement.excluded.source_url,
            "is_active":
                True,
            "updated_at":
                func.now(),
        },
    )

    engine = create_engine(
        build_database_url(),
        poolclass=NullPool,
        pool_pre_ping=True,
        connect_args={
            "connect_timeout": 10,
        },
    )

    try:
        with engine.begin() as connection:
            connection.execute(
                statement
            )

            return len(rows)
    finally:
        engine.dispose()


async def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Import official Ministry ECE "
            "services for Auckland."
        )
    )

    parser.add_argument(
        "--apply",
        action="store_true",
        help=(
            "Write changes to PostgreSQL. "
            "Without this flag the command "
            "is a dry-run."
        ),
    )

    args = parser.parse_args()

    services = await fetch_auckland_services()

    print(
        f"region={TARGET_REGION}"
    )
    print(
        f"services={len(services)}"
    )

    for service in services[:5]:
        print(
            service.provider_code,
            "|",
            service.name,
            "|",
            service.city,
            "|",
            service.suburb or "-",
        )

    if not args.apply:
        print(
            "mode=dry-run"
        )
        print(
            "database_writes=0"
        )
        return

    affected = import_services(
        services
    )

    print(
        "mode=apply"
    )
    print(
        f"affected_rows={affected}"
    )


if __name__ == "__main__":
    asyncio.run(main())
