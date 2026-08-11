from fastapi import FastAPI

app = FastAPI(
    title="KiwiKids NZ API",
    version="0.1.0",
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
    return {
        "status": "ready",
        "service": "kiwikids-api",
    }
