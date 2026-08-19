from decimal import Decimal

from app.models.ece_service import ECEService
from app.services.ece_recommendation import (
    RecommendationPreferences,
    score_ece_service,
)


def make_service(
    *,
    suburb: str | None = "Onehunga",
    service_type: str = "Education and Care Service",
    accepts_20_hours_ece: bool | None = True,
    licensed_places: int | None = 60,
) -> ECEService:
    return ECEService(
        slug="test-ece",
        provider_code="TEST001",
        name="Test ECE",
        service_type=service_type,
        description=None,
        address_line1="1 Test Street",
        suburb=suburb,
        city="Auckland",
        region="Auckland Region",
        postcode=None,
        latitude=Decimal("-36.922000"),
        longitude=Decimal("174.785000"),
        minimum_age_months=None,
        maximum_age_months=None,
        licensed_places=licensed_places,
        accepts_20_hours_ece=accepts_20_hours_ece,
        availability_status="unknown",
        ero_report_url=None,
        source_url=None,
        source_updated_at=None,
        is_active=True,
    )


def test_full_preference_match_scores_100() -> None:
    service = make_service()

    preferences = RecommendationPreferences(
        suburb="Onehunga",
        service_type="Education and Care Service",
        wants_20_hours_ece=True,
        minimum_capacity=50,
    )

    result = score_ece_service(
        service,
        preferences,
    )

    assert result.match_score == 100
    assert result.points_earned == 100
    assert result.points_available == 100


def test_mismatched_preferences_reduce_score() -> None:
    service = make_service(
        suburb="Mount Eden",
        accepts_20_hours_ece=False,
        licensed_places=20,
    )

    preferences = RecommendationPreferences(
        suburb="Onehunga",
        wants_20_hours_ece=True,
        minimum_capacity=50,
    )

    result = score_ece_service(
        service,
        preferences,
    )

    assert result.match_score < 50


def test_unknown_20_hours_ece_is_explained() -> None:
    service = make_service(
        accepts_20_hours_ece=None,
    )

    preferences = RecommendationPreferences(
        wants_20_hours_ece=True,
    )

    result = score_ece_service(
        service,
        preferences,
    )

    reason = next(
        item
        for item in result.reasons
        if item.factor == "20_hours_ece"
    )

    assert reason.matched is None
    assert reason.points_earned == 0
    assert "unavailable" in reason.explanation.lower()


def test_unspecified_preferences_do_not_reduce_score() -> None:
    service = make_service()

    preferences = RecommendationPreferences()

    result = score_ece_service(
        service,
        preferences,
    )

    assert result.points_available == 10
    assert result.match_score == 100


def test_service_type_alias_matches_ministry_value() -> None:
    service = make_service(
        service_type="Free Kindergarten",
    )

    preferences = RecommendationPreferences(
        service_type="kindergarten",
    )

    result = score_ece_service(
        service,
        preferences,
    )

    reason = next(
        item
        for item in result.reasons
        if item.factor == "service_type"
    )

    assert reason.matched is True
    assert reason.points_earned == 20


def test_distance_calculation_for_nearby_service() -> None:
    service = make_service()

    preferences = RecommendationPreferences(
        latitude=-36.922000,
        longitude=174.785000,
    )

    result = score_ece_service(
        service,
        preferences,
    )

    reason = next(
        item
        for item in result.reasons
        if item.factor == "distance"
    )

    assert reason.points_earned == 35
    assert reason.matched is True


def test_far_service_gets_no_distance_points() -> None:
    service = make_service()

    preferences = RecommendationPreferences(
        latitude=-36.848500,
        longitude=174.763300,
    )

    result = score_ece_service(
        service,
        preferences,
    )

    reason = next(
        item
        for item in result.reasons
        if item.factor == "distance"
    )

    assert reason.points_earned < 35


def test_coordinates_prevent_suburb_double_counting() -> None:
    service = make_service(
        suburb="Onehunga",
    )

    preferences = RecommendationPreferences(
        suburb="Onehunga",
        latitude=-36.922000,
        longitude=174.785000,
    )

    result = score_ece_service(
        service,
        preferences,
    )

    factors = {
        reason.factor
        for reason in result.reasons
    }

    assert "distance" in factors
    assert "suburb" not in factors
