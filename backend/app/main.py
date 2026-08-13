from fastapi import FastAPI, HTTPException, status

from app.api.router import api_router
from app.core.config import settings
from app.db.readiness import check_database


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


app.include_router(api_router)


@app.get(
    "/health",
    tags=["System"],
)
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "kiwikids-api",
    }


@app.get(
    "/ready",
    tags=["System"],
)
def ready() -> dict[str, str]:
    try:
        check_database()

    except RuntimeError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database dependency is not ready",
        )

    return {
        "status": "ready",
        "service": "kiwikids-api",
        "database": "available",
    }
