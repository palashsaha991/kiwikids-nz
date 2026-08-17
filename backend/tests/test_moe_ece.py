from decimal import Decimal

from app.integrations.moe_ece import (
    normalize_record,
    parse_boolean,
    parse_latitude,
    parse_longitude,
    slugify,
)


def test_parse_boolean() -> None:
    assert parse_boolean("Yes") is True
    assert parse_boolean("No") is False
    assert parse_boolean("") is None
    assert parse_boolean("Unknown") is None


def test_coordinate_validation() -> None:
    assert (
        parse_latitude("-45.89892526")
        == Decimal("-45.89892526")
    )

    assert parse_latitude("100") is None

    assert (
        parse_longitude("170.49533893")
        == Decimal("170.49533893")
    )

    assert parse_longitude("200") is None


def test_slug_is_deterministic() -> None:
    assert (
        slugify(
            "Rachel Reynolds Kindergarten",
            "5503",
        )
        ==
        "rachel-reynolds-kindergarten-5503"
    )


def test_normalize_official_record() -> None:
    record = {
        "ECE_Id": "5503",
        "Org_Name":
            "Rachel Reynolds Kindergarten",
        "Add1_Line1":
            "175 Macandrew Road",
        "Add1_Suburb": "",
        "Add1_City": "Dunedin",
        "Org_Type":
            "Free Kindergarten",
        "20_Hrs_ECE": "Yes",
        "Regional_Council":
            "Otago Region",
        "Latitude":
            -45.89892526,
        "Longitude":
            170.49533893,
        "All_Children": 45,
    }

    service = normalize_record(
        record,
    )

    assert (
        service.provider_code
        == "5503"
    )

    assert (
        service.slug
        ==
        "rachel-reynolds-kindergarten-5503"
    )

    assert (
        service.name
        ==
        "Rachel Reynolds Kindergarten"
    )

    assert (
        service.suburb
        is None
    )

    assert (
        service.city
        == "Dunedin"
    )

    assert (
        service.region
        == "Otago Region"
    )

    assert (
        service.licensed_places
        == 45
    )

    assert (
        service.accepts_20_hours_ece
        is True
    )

    assert (
        service.availability_status
        == "unknown"
    )
