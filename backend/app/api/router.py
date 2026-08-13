from fastapi import APIRouter

from app.api.routes.ece import router as ece_router


api_router = APIRouter(
    prefix="/api/v1"
)

api_router.include_router(
    ece_router
)
