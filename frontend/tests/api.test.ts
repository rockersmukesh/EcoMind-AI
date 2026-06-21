import { describe, it, expect } from "vitest";
import { computeMockCalculations, CarbonProfile } from "../lib/api";

describe("Frontend Carbon Calculations", () => {
  it("should calculate correct values for baseline profile", () => {
    const profile: CarbonProfile = {
      transportation: { milesPerWeek: 100, vehicleType: "gas" },
      diet: { dietType: "vegetarian" },
      energy: { kwhPerMonth: 300, source: "grid" },
      shopping: { newClothesPerMonth: 2, techUpgradesPerYear: 1 }
    };
    
    const results = computeMockCalculations(profile);
    
    // Calculation factors:
    // Gas vehicle emissions: 100 miles/wk * 4.345 wks/mo * 0.404 = 175.54 kg
    // Vegetarian diet emissions: 3.8 * 30.4 = 115.52 kg
    // Grid energy emissions: 300 kWh * 0.390 = 117.00 kg
    // Shopping emissions: (2 clothes * 14.2) + ((1 / 12) * 250) = 49.23 kg
    // Total = 457.29 kg
    expect(results.transportation_kg).toBeCloseTo(175.54, 1);
    expect(results.diet_kg).toBeCloseTo(115.52, 1);
    expect(results.energy_kg).toBeCloseTo(117.00, 1);
    expect(results.shopping_kg).toBeCloseTo(49.23, 1);
    expect(results.total_kg).toBeCloseTo(457.29, 1);
  });

  it("should return zero emissions for walking and clean solar energy", () => {
    const zeroEmissionsProfile: CarbonProfile = {
      transportation: { milesPerWeek: 50, vehicleType: "walk_bike" },
      diet: { dietType: "vegan" }, // vegan diet does have low baseline emissions
      energy: { kwhPerMonth: 200, source: "solar" }, // solar has minor lifecycle (0.02)
      shopping: { newClothesPerMonth: 0, techUpgradesPerYear: 0 }
    };
    
    const results = computeMockCalculations(zeroEmissionsProfile);
    
    expect(results.transportation_kg).toBe(0);
    expect(results.energy_kg).toBe(4); // 200 kWh * 0.02 = 4 kg
    expect(results.shopping_kg).toBe(0);
  });
});
