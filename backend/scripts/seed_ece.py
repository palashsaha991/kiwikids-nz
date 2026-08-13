from sqlalchemy import select

from app.db.session import get_session_factory
from app.models import ECEService


SAMPLE_SERVICES = [
    {
        "slug": "harbour-view-early-learning",
        "provider_code": "SAMPLE-ECE-001",
        "name": "Harbour View Early Learning",
        "service_type": "Education and Care Service",
        "description": "Sample ECE service for KiwiKids NZ development.",
        "address_line1": "10 Sample Street",
        "suburb": "Auckland Central",
        "city": "Auckland",
        "region": "Auckland",
        "postcode": "1010",
        "latitude": -36.850900,
        "longitude": 174.764500,
        "minimum_age_months": 3,
        "maximum_age_months": 60,
        "licensed_places": 45,
        "accepts_20_hours_ece": True,
        "availability_status": "available",
        "is_active": True,
    },
    {
        "slug": "onehunga-childrens-centre",
        "provider_code": "SAMPLE-ECE-002",
        "name": "Onehunga Children's Centre",
        "service_type": "Education and Care Service",
        "description": "Sample ECE service for search and detail API testing.",
        "address_line1": "25 Sample Road",
        "suburb": "Onehunga",
        "city": "Auckland",
        "region": "Auckland",
        "postcode": "1061",
        "latitude": -36.923900,
        "longitude": 174.785000,
        "minimum_age_months": 6,
        "maximum_age_months": 60,
        "licensed_places": 35,
        "accepts_20_hours_ece": True,
        "availability_status": "waitlist",
        "is_active": True,
    },
    {
        "slug": "north-shore-little-learners",
        "provider_code": "SAMPLE-ECE-003",
        "name": "North Shore Little Learners",
        "service_type": "Education and Care Service",
        "description": "Sample development record for KiwiKids NZ.",
        "address_line1": "8 Sample Avenue",
        "suburb": "Takapuna",
        "city": "Auckland",
        "region": "Auckland",
        "postcode": "0622",
        "latitude": -36.787000,
        "longitude": 174.773000,
        "minimum_age_months": 0,
        "maximum_age_months": 60,
        "licensed_places": 50,
        "accepts_20_hours_ece": None,
        "availability_status": "check_availability",
        "is_active": True,
    },
]


def main() -> None:
    session_factory = get_session_factory()

    with session_factory() as session:
        inserted = 0
        skipped = 0

        for data in SAMPLE_SERVICES:
            existing = session.scalar(
                select(ECEService).where(
                    ECEService.slug == data["slug"]
                )
            )

            if existing is not None:
                skipped += 1
                continue

            session.add(
                ECEService(**data)
            )
            inserted += 1

        session.commit()

    print(
        f"Seed complete: inserted={inserted}, skipped={skipped}"
    )


if __name__ == "__main__":
    main()
