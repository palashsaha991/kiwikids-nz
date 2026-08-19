from __future__ import annotations


ECE_SERVICE_TYPES = {
    "education_care": "Education & Care Service",
    "kindergarten": "Free Kindergarten",
    "homebased": "Homebased Network",
    "playcentre": "Playcentre",
    "kohanga_reo": "Te Kōhanga Reo",
    "leo_fanau_immersion": "Leo o Fanau Moana Immersion",
    "leo_fanau_bilingual": "Leo o Fanau Moana Bilingual",
    "hospital_based": "Hospital Based",
    "reo_rua": "Reo Rua Education and Care",
    "puna_reo": "Puna Reo",
    "casual_education_care": "Casual-Education and Care",
}


def resolve_service_type(
    value: str | None,
) -> str | None:
    if value is None:
        return None

    cleaned = value.strip()

    if not cleaned:
        return None

    return ECE_SERVICE_TYPES.get(
        cleaned,
        cleaned,
    )
