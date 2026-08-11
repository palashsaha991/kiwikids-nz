from fastapi import FastAPI, HTTPException, status

from app.core.config import get_settings
from app.db.readiness import check_database

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


@app.get("/health", tags=["Operations"])
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "kiwikids-api",
    }


@app.get("/ready", tags=["Operations"])
def readiness() -> dict[str, str]:
    try:
        check_database()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database dependency is not ready",
        ) from exc

    return {
        "status": "ready",
        "service": "kiwikids-api",
        "database": "available",
    }
