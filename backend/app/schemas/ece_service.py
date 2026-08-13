from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ECEServiceResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID
    slug: str
    provider_code: str | None

    name: str
    service_type: str
    description: str | None

    address_line1: str | None
    suburb: str | None
    city: str
    region: str
    postcode: str | None

    latitude: Decimal | None
    longitude: Decimal | None

    minimum_age_months: int
    maximum_age_months: int
    licensed_places: int | None

    accepts_20_hours_ece: bool | None
    availability_status: str

    ero_report_url: str | None
    source_url: str | None
    source_updated_at: datetime | None

    is_active: bool

    created_at: datetime
    updated_at: datetime
