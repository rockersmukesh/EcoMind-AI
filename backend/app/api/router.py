from fastapi import APIRouter
from app.api.endpoints import footprint, coach

api_router = APIRouter()

api_router.include_router(
    footprint.router, prefix="/footprint", tags=["Footprint"]
)
api_router.include_router(coach.router, prefix="/coach", tags=["Coach"])
