from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


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

    minimum_age_months: int | None
    maximum_age_months: int | None
    licensed_places: int | None

    accepts_20_hours_ece: bool | None
    availability_status: str

    ero_report_url: str | None
    source_url: str | None
    source_updated_at: datetime | None

    is_active: bool

    created_at: datetime
    updated_at: datetime


class ECEServiceListResponse(BaseModel):
    items: list[ECEServiceResponse]
    total: int
    limit: int
    offset: int


class ECERecommendationReasonResponse(BaseModel):
    factor: str
    matched: bool | None
    points_earned: int
    points_available: int
    explanation: str


class ECERecommendationItemResponse(BaseModel):
    service: ECEServiceResponse
    match_score: int
    points_earned: int
    points_available: int
    reasons: list[ECERecommendationReasonResponse]


class ECERecommendationListResponse(BaseModel):
    items: list[ECERecommendationItemResponse]
    total: int


class ECERecommendationRequest(BaseModel):
    suburb: str | None = Field(
        default=None,
        min_length=1,
        max_length=120,
    )
    service_type: str | None = Field(
        default=None,
        min_length=1,
        max_length=80,
    )
    wants_20_hours_ece: bool | None = None
    minimum_capacity: int | None = Field(
        default=None,
        ge=1,
        le=1000,
    )
    latitude: float | None = Field(
        default=None,
        ge=-90,
        le=90,
    )
    longitude: float | None = Field(
        default=None,
        ge=-180,
        le=180,
    )
    limit: int = Field(
        default=10,
        ge=1,
        le=50,
    )

    @model_validator(mode="after")
    def validate_coordinate_pair(
        self,
    ) -> "ECERecommendationRequest":
        if (
            (self.latitude is None)
            != (self.longitude is None)
        ):
            raise ValueError(
                "latitude and longitude must "
                "be supplied together."
            )

        return self


class ECEFacetSuburb(BaseModel):
    value: str
    label: str
    services: int


class ECEFacetArea(BaseModel):
    value: str
    label: str
    services: int
    suburbs: list[ECEFacetSuburb]


class ECEFacetsResponse(BaseModel):
    areas: list[ECEFacetArea]
