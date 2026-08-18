from __future__ import annotations

from pathlib import Path

import pytest
from fastapi import HTTPException

from app import sync_runner


def test_read_secret(tmp_path: Path) -> None:
    secret = tmp_path / "token"
    secret.write_text(
        "a" * 64,
        encoding="utf-8",
    )

    assert sync_runner.read_secret(
        str(secret)
    ) == "a" * 64


def test_authenticate_rejects_missing_token() -> None:
    with pytest.raises(HTTPException) as exc:
        sync_runner.authenticate(None)

    assert exc.value.status_code == 401


def test_quality_limits(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv(
        "KIWIKIDS_ECE_MIN_EXPECTED_SERVICES",
        "1000",
    )
    monkeypatch.setenv(
        "KIWIKIDS_ECE_MAX_EXPECTED_SERVICES",
        "3000",
    )

    assert sync_runner.quality_limits() == (
        1000,
        3000,
    )
