from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from typing import Any

import httpx


MOE_DATASTORE_URL = (
    "https://catalogue.data.govt.nz/api/3/action/datastore_search"
)

MOE_ECE_RESOURCE_ID = (
    "a9d65b07-8483-4b05-bdfd-d2abe4f38827"
)

MOE_SOURCE_URL = (
    "https://catalogue.data.govt.nz/dataset/"
    "early-childhood-education-directory"
)

DEFAULT_PAGE_SIZE = 500
MAX_PAGE_SIZE = 1000
REQUEST_TIMEOUT_SECONDS = 20.0


@dataclass(frozen=True)
class NormalizedEceService:
    provider_code: str
    slug: str
    name: str
    service_type: str
    address_line1: str | None
    suburb: str | None
    city: str
    region: str
    latitude: Decimal | None
    longitude: Decimal | None
    licensed_places: int | None
    accepts_20_hours_ece: bool | None
    availability_status: str
    source_url: str
    is_active: bool


def clean_text(
    value: Any,
) -> str | None:
    if value is None:
        return None

    text = str(value).strip()

    return text or None


def parse_boolean(
    value: Any,
) -> bool | None:
    text = clean_text(value)

    if text is None:
        return None

    normalized = text.casefold()

    if normalized in {
        "yes",
        "y",
        "true",
        "1",
    }:
        return True

    if normalized in {
        "no",
        "n",
        "false",
        "0",
    }:
        return False

    return None


def parse_int(
    value: Any,
) -> int | None:
    if value is None or value == "":
        return None

    try:
        parsed = int(value)
    except (
        TypeError,
        ValueError,
    ):
        return None

    if parsed < 0:
        return None

    return parsed


def parse_positive_int(
    value: Any,
) -> int | None:
    parsed = parse_int(value)

    if parsed is None or parsed <= 0:
        return None

    return parsed


def parse_decimal(
    value: Any,
) -> Decimal | None:
    if value is None or value == "":
        return None

    try:
        return Decimal(str(value))
    except (
        InvalidOperation,
        TypeError,
        ValueError,
    ):
        return None


def parse_latitude(
    value: Any,
) -> Decimal | None:
    parsed = parse_decimal(value)

    if parsed is None:
        return None

    if not (
        Decimal("-90")
        <= parsed
        <= Decimal("90")
    ):
        return None

    return parsed


def parse_longitude(
    value: Any,
) -> Decimal | None:
    parsed = parse_decimal(value)

    if parsed is None:
        return None

    if not (
        Decimal("-180")
        <= parsed
        <= Decimal("180")
    ):
        return None

    return parsed


def slugify(
    name: str,
    provider_code: str,
) -> str:
    normalized = unicodedata.normalize(
        "NFKD",
        name,
    )

    ascii_name = normalized.encode(
        "ascii",
        "ignore",
    ).decode("ascii")

    slug_name = re.sub(
        r"[^a-z0-9]+",
        "-",
        ascii_name.casefold(),
    ).strip("-")

    if not slug_name:
        slug_name = "ece-service"

    provider_slug = provider_code.casefold()

    max_name_length = (
        180
        - len(provider_slug)
        - 1
    )

    slug_name = (
        slug_name[:max_name_length]
        .rstrip("-")
    )

    if not slug_name:
        slug_name = "ece"

    return (
        f"{slug_name}-"
        f"{provider_slug}"
    )


def normalize_record(
    record: dict[str, Any],
) -> NormalizedEceService:
    provider_code = clean_text(
        record.get("ECE_Id"),
    )

    name = clean_text(
        record.get("Org_Name"),
    )

    city = clean_text(
        record.get("Add1_City"),
    )

    service_type = clean_text(
        record.get("Org_Type"),
    )

    if provider_code is None:
        raise ValueError(
            "ECE_Id is required."
        )

    if name is None:
        raise ValueError(
            "Org_Name is required."
        )

    if city is None:
        city = "Unknown"

    if service_type is None:
        service_type = "Unknown"

    region = (
        clean_text(
            record.get(
                "Regional_Council",
            ),
        )
        or clean_text(
            record.get(
                "Education_Region",
            ),
        )
        or "Unknown"
    )

    return NormalizedEceService(
        provider_code=provider_code,
        slug=slugify(
            name,
            provider_code,
        ),
        name=name,
        service_type=service_type,
        address_line1=clean_text(
            record.get(
                "Add1_Line1",
            ),
        ),
        suburb=clean_text(
            record.get(
                "Add1_Suburb",
            ),
        ),
        city=city,
        region=region,
        latitude=parse_latitude(
            record.get("Latitude"),
        ),
        longitude=parse_longitude(
            record.get("Longitude"),
        ),
        licensed_places=parse_positive_int(
            record.get(
                "All_Children",
            ),
        ),
        accepts_20_hours_ece=(
            parse_boolean(
                record.get(
                    "20_Hrs_ECE",
                ),
            )
        ),
        availability_status="unknown",
        source_url=MOE_SOURCE_URL,
        is_active=True,
    )


async def fetch_page(
    *,
    limit: int = DEFAULT_PAGE_SIZE,
    offset: int = 0,
) -> dict[str, Any]:
    if limit < 1 or limit > MAX_PAGE_SIZE:
        raise ValueError(
            f"limit must be between 1 and {MAX_PAGE_SIZE}"
        )

    if offset < 0:
        raise ValueError(
            "offset cannot be negative"
        )

    params = {
        "resource_id":
            MOE_ECE_RESOURCE_ID,
        "limit": limit,
        "offset": offset,
    }

    timeout = httpx.Timeout(
        REQUEST_TIMEOUT_SECONDS,
    )

    async with httpx.AsyncClient(
        timeout=timeout,
        follow_redirects=True,
        headers={
            "Accept":
                "application/json",
            "User-Agent":
                "KiwiKidsNZ/1.0",
        },
    ) as client:
        response = await client.get(
            MOE_DATASTORE_URL,
            params=params,
        )

        response.raise_for_status()

        payload = response.json()

    if payload.get("success") is not True:
        raise RuntimeError(
            "Ministry ECE API returned "
            "an unsuccessful response."
        )

    result = payload.get("result")

    if not isinstance(result, dict):
        raise RuntimeError(
            "Ministry ECE API response "
            "has no valid result object."
        )

    return result


async def fetch_normalized_services(
    *,
    limit: int = DEFAULT_PAGE_SIZE,
    offset: int = 0,
) -> tuple[
    list[NormalizedEceService],
    int,
]:
    result = await fetch_page(
        limit=limit,
        offset=offset,
    )

    raw_records = result.get(
        "records",
        [],
    )

    if not isinstance(
        raw_records,
        list,
    ):
        raise RuntimeError(
            "Ministry ECE records "
            "payload is invalid."
        )

    normalized: list[
        NormalizedEceService
    ] = []

    for record in raw_records:
        if not isinstance(
            record,
            dict,
        ):
            continue

        try:
            normalized.append(
                normalize_record(
                    record,
                ),
            )
        except ValueError:
            continue

    total_raw = result.get(
        "total",
        0,
    )

    try:
        total = int(total_raw)
    except (
        TypeError,
        ValueError,
    ):
        total = 0

    return normalized, total
