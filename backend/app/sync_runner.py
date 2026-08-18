from __future__ import annotations

import asyncio
import hmac
import os
import time
from datetime import UTC, datetime
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException, status

from app.integrations.moe_ece_import import (
    TARGET_REGION,
    fetch_auckland_services,
    import_services,
)


app = FastAPI(
    title="KiwiKids NZ Sync Runner",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

_sync_lock = asyncio.Lock()


def read_secret(path: str) -> str:
    secret_path = Path(path)

    if not secret_path.is_file():
        raise RuntimeError("Sync authentication secret is unavailable.")

    value = secret_path.read_text(
        encoding="utf-8",
    ).strip()

    if len(value) < 32:
        raise RuntimeError("Sync authentication secret is invalid.")

    return value


def authenticate(token: str | None) -> None:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )

    expected = read_secret(
        os.getenv(
            "KIWIKIDS_SYNC_TOKEN_FILE",
            "/run/secrets/sync_runner_token",
        )
    )

    if not hmac.compare_digest(token, expected):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication.",
        )


def quality_limits() -> tuple[int, int]:
    minimum = int(
        os.getenv(
            "KIWIKIDS_ECE_MIN_EXPECTED_SERVICES",
            "1000",
        )
    )

    maximum = int(
        os.getenv(
            "KIWIKIDS_ECE_MAX_EXPECTED_SERVICES",
            "3000",
        )
    )

    if minimum < 1 or maximum < minimum:
        raise RuntimeError(
            "Invalid ECE data-quality limits."
        )

    return minimum, maximum


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {
        "status": "ok",
    }


@app.post("/v1/sync/ece")
async def sync_ece(
    x_kiwikids_sync_token: str | None = Header(
        default=None,
        alias="X-KiwiKids-Sync-Token",
    ),
) -> dict[str, object]:
    authenticate(
        x_kiwikids_sync_token
    )

    try:
        await asyncio.wait_for(
            _sync_lock.acquire(),
            timeout=0.01,
        )
    except TimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An ECE synchronization is already running.",
        ) from exc

    started_at = datetime.now(UTC)
    started_monotonic = time.monotonic()

    try:
        try:
            services = await asyncio.wait_for(
                fetch_auckland_services(),
                timeout=180,
            )
        except TimeoutError as exc:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Ministry data retrieval timed out.",
            ) from exc

        service_count = len(services)

        minimum, maximum = quality_limits()

        if not minimum <= service_count <= maximum:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    "ECE data-quality gate failed. "
                    "Database was not modified."
                ),
            )

        affected_rows = await asyncio.to_thread(
            import_services,
            services,
        )

        finished_at = datetime.now(UTC)

        return {
            "status": "success",
            "region": TARGET_REGION,
            "services_received": service_count,
            "affected_rows": affected_rows,
            "quality_gate": "passed",
            "started_at": started_at.isoformat(),
            "finished_at": finished_at.isoformat(),
            "duration_seconds": round(
                time.monotonic() - started_monotonic,
                3,
            ),
        }

    finally:
        _sync_lock.release()
