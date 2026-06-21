import pytest
from app.services.calculator import (
    CarbonCalculator,
    TransportationInput,
    DietInput,
    EnergyInput,
    ShoppingInput,
    CarbonProfileInput
)

def test_calculate_transportation():
    # Test gas vehicle: 100 miles/week
    # Expected miles/month = 100 * 4.345 = 434.5 miles
    # Expected emissions = 434.5 * 0.404 = 175.538 kg
    input_gas = TransportationInput(milesPerWeek=100.0, vehicleType="gas")
    assert round(CarbonCalculator.calculate_transportation(input_gas), 3) == 175.538

    # Test EV vehicle: 150 miles/week
    # Expected emissions = (150 * 4.345) * 0.100 = 65.175 kg
    input_ev = TransportationInput(milesPerWeek=150.0, vehicleType="ev")
    assert round(CarbonCalculator.calculate_transportation(input_ev), 3) == 65.175

def test_calculate_diet():
    # Vegetarian diet: 3.8 kg CO2 per day * 30.4 days = 115.52 kg
    input_veg = DietInput(dietType="vegetarian")
    assert round(CarbonCalculator.calculate_diet(input_veg), 2) == 115.52

    # Vegan diet: 2.9 * 30.4 = 88.16 kg
    input_vegan = DietInput(dietType="vegan")
    assert round(CarbonCalculator.calculate_diet(input_vegan), 2) == 88.16

def test_calculate_energy():
    # Grid: 300 kWh * 0.390 = 117.0 kg
    input_grid = EnergyInput(kwhPerMonth=300.0, source="grid")
    assert round(CarbonCalculator.calculate_energy(input_grid), 2) == 117.0

    # Solar: 500 kWh * 0.020 = 10.0 kg
    input_solar = EnergyInput(kwhPerMonth=500.0, source="solar")
    assert round(CarbonCalculator.calculate_energy(input_solar), 2) == 10.0

def test_calculate_shopping():
    # 2 clothes/month (2 * 14.2 = 28.4 kg)
    # 1 tech upgrade/year ((1 / 12) * 250 = 20.833 kg)
    # Total = 49.233 kg
    input_shop = ShoppingInput(newClothesPerMonth=2.0, techUpgradesPerYear=1.0)
    assert round(CarbonCalculator.calculate_shopping(input_shop), 3) == 49.233

def test_calculate_profile():
    profile = CarbonProfileInput(
        transportation=TransportationInput(milesPerWeek=100.0, vehicleType="gas"),
        diet=DietInput(dietType="vegetarian"),
        energy=EnergyInput(kwhPerMonth=300.0, source="grid"),
        shopping=ShoppingInput(newClothesPerMonth=2.0, techUpgradesPerYear=1.0)
    )
    result = CarbonCalculator.calculate_profile(profile)
    # Gas transportation: 175.54
    # Veg diet: 115.52
    # Grid energy: 117.00
    # Shopping: 49.23
    # Total = 457.29
    assert result["transportation_kg"] == 175.54
    assert result["diet_kg"] == 115.52
    assert result["energy_kg"] == 117.00
    assert result["shopping_kg"] == 49.23
    assert result["total_kg"] == 457.29
