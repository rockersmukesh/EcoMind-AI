from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.calculator import CarbonCalculator, CarbonProfileInput
from app.services.gemini_service import GeminiCoachService

router = APIRouter()


class SimulationRequest(BaseModel):
    current: CarbonProfileInput
    simulated: CarbonProfileInput


@router.post("/recommendations")
def get_recommendations(profile: CarbonProfileInput):
    """
    Calculates carbon emissions and returns personalized Gemini AI coaching recommendations.
    """
    try:
        # Step 1: Run calculations
        calculated_profile = CarbonCalculator.calculate_profile(profile)

        # Step 2: Feed into Gemini Coach Service
        recommendations = (
            GeminiCoachService.get_sustainability_recommendations(
                calculated_profile
            )
        )

        return {
            "success": True,
            "calculated_profile": calculated_profile,
            "ai_coach_response": recommendations,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/simulate")
def simulate_changes(payload: SimulationRequest):
    """
    Compares current profile with simulated changes and returns project reductions and AI coach review.
    """
    try:
        # Step 1: Calculate current profile
        current_calc = CarbonCalculator.calculate_profile(payload.current)

        # Step 2: Calculate simulated profile
        simulated_calc = CarbonCalculator.calculate_profile(payload.simulated)

        # Step 3: Compare via Gemini AI
        feedback = GeminiCoachService.get_simulation_feedback(
            current_calc, simulated_calc
        )

        return {
            "success": True,
            "current_profile": current_calc,
            "simulated_profile": simulated_calc,
            "simulation_feedback": feedback,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
