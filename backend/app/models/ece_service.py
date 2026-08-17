import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ECEService(Base):
    __tablename__ = "ece_services"
    __table_args__ = (
        # Geographic coordinates must be globally valid.
        # NZ-specific geographic validation belongs in the
        # application/data-quality layer so valid locations such as
        # the Chatham Islands are not accidentally rejected.
        CheckConstraint(
            "latitude IS NULL OR latitude BETWEEN -90 AND 90",
            name="latitude_valid_range",
        ),
        CheckConstraint(
            "longitude IS NULL OR longitude BETWEEN -180 AND 180",
            name="longitude_valid_range",
        ),

        # Age values must be logically valid.
        CheckConstraint(
            "minimum_age_months >= 0",
            name="minimum_age_months_non_negative",
        ),
        CheckConstraint(
            "maximum_age_months >= minimum_age_months",
            name="maximum_age_not_less_than_minimum",
        ),

        # Capacity cannot be zero or negative when supplied.
        CheckConstraint(
            "licensed_places IS NULL OR licensed_places > 0",
            name="licensed_places_positive",
        ),

        # Keep internal availability values controlled and predictable.
        CheckConstraint(
            """
            availability_status IN (
                'unknown',
                'available',
                'waitlist',
                'check_availability'
            )
            """,
            name="availability_status_valid",
        ),

        # Main discovery/filtering index.
        Index(
            "ix_ece_services_discovery",
            "is_active",
            "region",
            "suburb",
            "service_type",
        ),

        # Useful for availability filtering.
        Index(
            "ix_ece_services_availability",
            "is_active",
            "availability_status",
        ),

        # Useful for name lookup/sorting.
        Index(
            "ix_ece_services_name",
            "name",
        ),

        {"schema": "app"},
    )

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    # Human-readable stable URL identifier.
    # PostgreSQL's UNIQUE constraint provides an index automatically.
    slug: Mapped[str] = mapped_column(
        String(180),
        nullable=False,
        unique=True,
    )

    # External/provider identifier.
    # Kept generic until the official NZ education data field mapping
    # is finalised.
    provider_code: Mapped[str | None] = mapped_column(
        String(80),
        nullable=True,
        unique=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    service_type: Mapped[str] = mapped_column(
        String(80),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    address_line1: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    suburb: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )

    city: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    region: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    postcode: Mapped[str | None] = mapped_column(
        String(10),
        nullable=True,
    )

    latitude: Mapped[Decimal | None] = mapped_column(
        Numeric(9, 6),
        nullable=True,
    )

    longitude: Mapped[Decimal | None] = mapped_column(
        Numeric(9, 6),
        nullable=True,
    )

    minimum_age_months: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    maximum_age_months: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    licensed_places: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # Nullable intentionally:
    # NULL = information unknown
    # False = explicitly does not participate
    # True = explicitly participates
    accepts_20_hours_ece: Mapped[bool | None] = mapped_column(
        Boolean,
        nullable=True,
    )

    availability_status: Mapped[str] = mapped_column(
        String(40),
        nullable=False,
        default="unknown",
        server_default=text("'unknown'"),
    )

    ero_report_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    source_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # Timestamp from the source system, if available.
    # This lets us track freshness independently of our own DB timestamps.
    source_updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=text("true"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
