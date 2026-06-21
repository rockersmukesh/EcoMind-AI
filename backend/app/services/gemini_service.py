import os
import json
import logging
from typing import Dict, List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# Initialize Gemini API if key is present
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logging.warning("GEMINI_API_KEY not found in environment variables. Gemini service will run in mock mode.")

class GeminiCoachService:
    @staticmethod
    def _get_model():
        # Fall back to mock if API key isn't provided (useful for building/testing initially)
        if not GEMINI_API_KEY:
            return None
        return genai.GenerativeModel("gemini-1.5-flash")

    @classmethod
    def get_sustainability_recommendations(
        cls, profile_summary: Dict, history: Optional[List] = None
    ) -> Dict:
        """
        Uses Gemini to generate structured personal sustainability recommendations.
        """
        model = cls._get_model()
        if not model:
            return cls._get_mock_recommendations(profile_summary)

        prompt = f"""
        You are a senior sustainability analyst and AI Sustainability Coach.
        Analyze the following monthly carbon footprint profile (in kg CO2) for a user:
        - Transportation: {profile_summary.get('transportation_kg')} kg
        - Diet/Food: {profile_summary.get('diet_kg')} kg
        - Household Energy: {profile_summary.get('energy_kg')} kg
        - Retail/Shopping: {profile_summary.get('shopping_kg')} kg
        - Total: {profile_summary.get('total_kg')} kg

        Generate a personalized sustainability analysis and high-impact, low-cost recommendations.
        Return your answer ONLY as a JSON object matching the following structure:
        {{
            "eco_score_estimate": integer (1 to 100 based on standard low carbon targets),
            "analysis": "detailed string explaining why footprint is high or what highlights stand out",
            "primary_drivers": ["driver 1", "driver 2"],
            "recommendations": [
                {{
                    "action": "specific actionable recommendation",
                    "difficulty": "low | medium | high",
                    "cost": "low | medium | high",
                    "impact": "low | medium | high",
                    "estimated_annual_savings_kg": float,
                    "explanation": "clear logic detailing how this action yields reduction"
                }}
            ],
            "confidence_score": float (between 0.0 and 1.0 representing analysis confidence)
        }}
        """

        try:
            response = model.generate_content(
                prompt,
                generation_config={
                    "response_mime_type": "application/json"
                }
            )
            # Parse the response text as JSON
            result = json.loads(response.text)
            return result
        except Exception as e:
            logging.error(f"Gemini API failure: {e}")
            return cls._get_mock_recommendations(profile_summary)

    @classmethod
    def get_simulation_feedback(
        cls, current_profile: Dict, simulated_profile: Dict
    ) -> Dict:
        """
        Uses Gemini to compare a user's current profile with a simulated future profile.
        """
        model = cls._get_model()
        if not model:
            return cls._get_mock_simulation_feedback(current_profile, simulated_profile)

        prompt = f"""
        You are an AI Sustainability Coach.
        Compare the user's current monthly carbon profile with their proposed simulated lifestyle changes:

        Current Profile (kg CO2/month):
        - Transportation: {current_profile.get('transportation_kg')} kg
        - Diet/Food: {current_profile.get('diet_kg')} kg
        - Household Energy: {current_profile.get('energy_kg')} kg
        - Retail/Shopping: {current_profile.get('shopping_kg')} kg
        - Total: {current_profile.get('total_kg')} kg

        Simulated Profile (kg CO2/month):
        - Transportation: {simulated_profile.get('transportation_kg')} kg
        - Diet/Food: {simulated_profile.get('diet_kg')} kg
        - Household Energy: {simulated_profile.get('energy_kg')} kg
        - Retail/Shopping: {simulated_profile.get('shopping_kg')} kg
        - Total: {simulated_profile.get('total_kg')} kg

        Provide constructive sustainability coaching feedback comparing these profiles.
        Return your answer ONLY as a JSON object matching this structure:
        {{
            "comparison_summary": "string summary of the simulated changes and impact",
            "projected_yearly_savings_kg": float,
            "achievable_milestones": ["milestone 1 (e.g. tree equivalents)", "milestone 2"],
            "coach_verdict": "friendly coaching advice validating or improving this scenario",
            "confidence_score": float (0.0 to 1.0)
        }}
        """

        try:
            response = model.generate_content(
                prompt,
                generation_config={
                    "response_mime_type": "application/json"
                }
            )
            result = json.loads(response.text)
            return result
        except Exception as e:
            logging.error(f"Gemini API simulation feedback failure: {e}")
            return cls._get_mock_simulation_feedback(current_profile, simulated_profile)

    @staticmethod
    def _get_mock_recommendations(profile: Dict) -> Dict:
        """Fallback mock function when Gemini is unavailable or key is missing."""
        total = profile.get("total_kg", 500)
        eco_score = max(10, min(95, int(100 - (total / 20))))
        
        # Determine highest contributor
        drivers = []
        recommendations = []
        
        trans = profile.get("transportation_kg", 0)
        diet = profile.get("diet_kg", 0)
        energy = profile.get("energy_kg", 0)
        shopping = profile.get("shopping_kg", 0)
        
        max_val = max(trans, diet, energy, shopping)
        
        if max_val == trans:
            drivers.append("Daily transportation fuel consumption")
            recommendations.append({
                "action": "Consider switching to remote work 2 days/week or carpooling.",
                "difficulty": "low",
                "cost": "low",
                "impact": "high",
                "estimated_annual_savings_kg": round(trans * 12 * 0.4, 2),
                "explanation": "Reducing drive days directly saves gas emissions without major upfront investments."
            })
        elif max_val == diet:
            drivers.append("High emissions food diet (meat/dairy)")
            recommendations.append({
                "action": "Introduce Meatless Mondays into your weekly meal planning.",
                "difficulty": "low",
                "cost": "low",
                "impact": "medium",
                "estimated_annual_savings_kg": round(diet * 12 * 0.15, 2),
                "explanation": "Shifting even one day of meals to vegetarian options yields significant collective emissions improvements."
            })
        elif max_val == energy:
            drivers.append("Home grid utility reliance")
            recommendations.append({
                "action": "Audit house insulation and transition to smart thermostat settings.",
                "difficulty": "medium",
                "cost": "low",
                "impact": "medium",
                "estimated_annual_savings_kg": round(energy * 12 * 0.1, 2),
                "explanation": "Optimization of climate control settings matches grid load reductions."
            })
        else:
            drivers.append("Frequent new clothing and retail updates")
            recommendations.append({
                "action": "Opt for thrifting or high-quality lifetime items.",
                "difficulty": "medium",
                "cost": "low",
                "impact": "medium",
                "estimated_annual_savings_kg": round(shopping * 12 * 0.25, 2),
                "explanation": "Extending retail usage lifecycles avoids global freight logistics footprints."
            })

        return {
            "eco_score_estimate": eco_score,
            "analysis": "Based on statistical carbon data, your current configuration has opportunities for optimization.",
            "primary_drivers": drivers,
            "recommendations": recommendations,
            "confidence_score": 0.85
        }

    @staticmethod
    def _get_mock_simulation_feedback(current: Dict, simulated: Dict) -> Dict:
        """Fallback mock function for simulation comparisons."""
        savings = max(0.0, current.get("total_kg", 0) - simulated.get("total_kg", 0))
        yearly_savings = savings * 12
        trees_equivalent = round(yearly_savings / 22.0) # 1 tree absorbs ~22kg CO2/year

        return {
            "comparison_summary": "Your simulated carbon choices represent a reduction in emissions across critical sectors.",
            "projected_yearly_savings_kg": round(yearly_savings, 2),
            "achievable_milestones": [
                f"Equivalent to planting {trees_equivalent} trees per year",
                f"Reduces monthly load by {round(savings, 2)} kg CO2"
            ],
            "coach_verdict": "This simulation shows excellent progress. Committing to these changes in real life makes a tangible global difference.",
            "confidence_score": 0.80
        }
