from pydantic import BaseModel, Field
from typing import Literal

# --- Pydantic Request Models ---


class TransportationInput(BaseModel):
    milesPerWeek: float = Field(
        ..., ge=0, description="Average miles traveled per week"
    )
    vehicleType: Literal[
        "gas", "hybrid", "ev", "public_transit", "walk_bike"
    ] = Field(..., description="Primary mode of transportation")


class DietInput(BaseModel):
    dietType: Literal[
        "vegan", "vegetarian", "pescatarian", "low_meat", "high_meat"
    ] = Field(..., description="Dietary preference or meat consumption level")


class EnergyInput(BaseModel):
    kwhPerMonth: float = Field(
        ..., ge=0, description="Electricity usage in kWh per month"
    )
    source: Literal["grid", "solar", "wind"] = Field(
        ..., description="Primary electricity source"
    )


class ShoppingInput(BaseModel):
    newClothesPerMonth: float = Field(
        ...,
        ge=0,
        description="Number of new apparel items purchased per month",
    )
    techUpgradesPerYear: float = Field(
        ..., ge=0, description="Number of tech/electronics upgrades per year"
    )


class CarbonProfileInput(BaseModel):
    transportation: TransportationInput
    diet: DietInput
    energy: EnergyInput
    shopping: ShoppingInput


# --- Emission Factors (kg CO2 per unit) ---

EMISSION_FACTORS = {
    "transportation": {
        "gas": 0.404,  # kg CO2 per mile (EPA average passenger vehicle)
        "hybrid": 0.200,  # kg CO2 per mile
        "ev": 0.100,  # kg CO2 per mile (based on grid charging)
        "public_transit": 0.05,  # kg CO2 per mile per passenger
        "walk_bike": 0.0,  # kg CO2
    },
    "diet": {
        # Daily emissions multiplied by average days per month (30.4)
        "vegan": 2.9 * 30.4,
        "vegetarian": 3.8 * 30.4,
        "pescatarian": 4.5 * 30.4,
        "low_meat": 4.7 * 30.4,
        "high_meat": 7.2 * 30.4,
    },
    "energy": {
        "grid": 0.390,  # kg CO2 per kWh
        "solar": 0.020,  # kg CO2 lifecycle per kWh
        "wind": 0.010,  # kg CO2 lifecycle per kWh
    },
    "shopping": {
        "clothes_item": 14.2,  # kg CO2 per clothing item
        "tech_item": 250.0,  # kg CO2 per device (lifecycle manufacturing & shipping)
    },
}


class CarbonCalculator:
    @staticmethod
    def calculate_transportation(input_data: TransportationInput) -> float:
        # Convert weekly miles to monthly (weeks per month ~ 4.345)
        monthly_miles = input_data.milesPerWeek * 4.345
        factor = EMISSION_FACTORS["transportation"].get(
            input_data.vehicleType, 0.404
        )
        return monthly_miles * factor

    @staticmethod
    def calculate_diet(input_data: DietInput) -> float:
        return EMISSION_FACTORS["diet"].get(input_data.dietType, 4.7 * 30.4)

    @staticmethod
    def calculate_energy(input_data: EnergyInput) -> float:
        factor = EMISSION_FACTORS["energy"].get(input_data.source, 0.390)
        return input_data.kwhPerMonth * factor

    @staticmethod
    def calculate_shopping(input_data: ShoppingInput) -> float:
        clothes_emissions = (
            input_data.newClothesPerMonth
            * EMISSION_FACTORS["shopping"]["clothes_item"]
        )
        # Convert annual tech upgrades to monthly
        tech_emissions = (
            input_data.techUpgradesPerYear / 12
        ) * EMISSION_FACTORS["shopping"]["tech_item"]
        return clothes_emissions + tech_emissions

    @classmethod
    def calculate_profile(cls, profile: CarbonProfileInput) -> dict:
        trans_co2 = cls.calculate_transportation(profile.transportation)
        diet_co2 = cls.calculate_diet(profile.diet)
        energy_co2 = cls.calculate_energy(profile.energy)
        shop_co2 = cls.calculate_shopping(profile.shopping)

        total = trans_co2 + diet_co2 + energy_co2 + shop_co2

        return {
            "transportation_kg": round(trans_co2, 2),
            "diet_kg": round(diet_co2, 2),
            "energy_kg": round(energy_co2, 2),
            "shopping_kg": round(shop_co2, 2),
            "total_kg": round(total, 2),
        }
