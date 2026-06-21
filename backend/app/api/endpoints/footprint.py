from fastapi import APIRouter, HTTPException
from app.services.calculator import CarbonCalculator, CarbonProfileInput

router = APIRouter()


@router.post("/calculate")
def calculate_footprint(profile: CarbonProfileInput):
    """
    Calculates carbon footprint values based on user lifestyle parameters.
    """
    try:
        results = CarbonCalculator.calculate_profile(profile)
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
