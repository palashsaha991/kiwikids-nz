from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "kiwikids-api",
    }


@patch("app.main.check_database")
def test_readiness_when_database_available(mock_check_database) -> None:
    mock_check_database.return_value = None

    response = client.get("/ready")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ready",
        "service": "kiwikids-api",
        "database": "available",
    }


@patch("app.main.check_database")
def test_readiness_when_database_unavailable(mock_check_database) -> None:
    mock_check_database.side_effect = RuntimeError("database unavailable")

    response = client.get("/ready")

    assert response.status_code == 503
    assert response.json() == {
        "detail": "Database dependency is not ready"
    }
