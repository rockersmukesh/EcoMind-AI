const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export interface TransportationData {
  milesPerWeek: number;
  vehicleType: "gas" | "hybrid" | "ev" | "public_transit" | "walk_bike";
}

export interface DietData {
  dietType: "vegan" | "vegetarian" | "pescatarian" | "low_meat" | "high_meat";
}

export interface EnergyData {
  kwhPerMonth: number;
  source: "grid" | "solar" | "wind";
}

export interface ShoppingData {
  newClothesPerMonth: number;
  techUpgradesPerYear: number;
}

export interface CarbonProfile {
  transportation: TransportationData;
  diet: DietData;
  energy: EnergyData;
  shopping: ShoppingData;
}

export interface CalculationResult {
  transportation_kg: number;
  diet_kg: number;
  energy_kg: number;
  shopping_kg: number;
  total_kg: number;
}

export interface RecommendationItem {
  action: string;
  difficulty: "low" | "medium" | "high";
  cost: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  estimated_annual_savings_kg: number;
  explanation: string;
}

export interface CoachResponse {
  eco_score_estimate: number;
  analysis: string;
  primary_drivers: string[];
  recommendations: RecommendationItem[];
  confidence_score: number;
}

export interface SimulationResponse {
  comparison_summary: string;
  projected_yearly_savings_kg: number;
  achievable_milestones: string[];
  coach_verdict: string;
  confidence_score: number;
}

// Fallback calculations in typescript when FastAPI backend is offline
export const computeMockCalculations = (profile: CarbonProfile): CalculationResult => {
  const weeks = 4.345;
  const transitFactors = { gas: 0.404, hybrid: 0.200, ev: 0.100, public_transit: 0.05, walk_bike: 0.0 };
  const dietFactors = { vegan: 2.9 * 30.4, vegetarian: 3.8 * 30.4, pescatarian: 4.5 * 30.4, low_meat: 4.7 * 30.4, high_meat: 7.2 * 30.4 };
  const energyFactors = { grid: 0.390, solar: 0.020, wind: 0.010 };
  
  const trans = profile.transportation.milesPerWeek * weeks * transitFactors[profile.transportation.vehicleType];
  const diet = dietFactors[profile.diet.dietType];
  const energy = profile.energy.kwhPerMonth * energyFactors[profile.energy.source];
  const shopping = (profile.shopping.newClothesPerMonth * 14.2) + ((profile.shopping.techUpgradesPerYear / 12) * 250);
  
  return {
    transportation_kg: Math.round(trans * 100) / 100,
    diet_kg: Math.round(diet * 100) / 100,
    energy_kg: Math.round(energy * 100) / 100,
    shopping_kg: Math.round(shopping * 100) / 100,
    total_kg: Math.round((trans + diet + energy + shopping) * 100) / 100
  };
};

export const fetchCalculations = async (profile: CarbonProfile): Promise<CalculationResult> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/footprint/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error("API failed");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("Calculations API offline, falling back to mock logic.", err);
    return computeMockCalculations(profile);
  }
};

export const fetchRecommendations = async (profile: CarbonProfile): Promise<{ calculated_profile: CalculationResult, ai_coach_response: CoachResponse }> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/coach/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error("API failed");
    const json = await res.json();
    return {
      calculated_profile: json.calculated_profile,
      ai_coach_response: json.ai_coach_response
    };
  } catch (err) {
    console.warn("Recommendations API offline, falling back to mock logic.", err);
    const mockCalc = computeMockCalculations(profile);
    const total = mockCalc.total_kg;
    const ecoScore = Math.max(10, Math.min(95, Math.round(100 - (total / 20))));
    
    return {
      calculated_profile: mockCalc,
      ai_coach_response: {
        eco_score_estimate: ecoScore,
        analysis: "Your carbon profile shows areas for potential optimization. Let's start with your highest contributor.",
        primary_drivers: [profile.transportation.vehicleType === "gas" ? "Gas vehicle transit" : "Consumer energy footprint"],
        recommendations: [
          {
            action: "Switch to vegetarian options one additional day per week.",
            difficulty: "low",
            cost: "low",
            impact: "medium",
            estimated_annual_savings_kg: 240,
            explanation: "Minor modifications to food purchasing choices reduce agricultural methane profiles."
          }
        ],
        confidence_score: 0.8
      }
    };
  }
};

export const fetchSimulation = async (current: CarbonProfile, simulated: CarbonProfile): Promise<{ current_profile: CalculationResult, simulated_profile: CalculationResult, simulation_feedback: SimulationResponse }> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/coach/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current, simulated })
    });
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch (err) {
    console.warn("Simulation API offline, falling back to mock logic.", err);
    const currentCalc = computeMockCalculations(current);
    const simulatedCalc = computeMockCalculations(simulated);
    const savings = Math.max(0.0, currentCalc.total_kg - simulatedCalc.total_kg);
    const yearlySavings = savings * 12;
    const trees = Math.round(yearlySavings / 22.0);
    
    return {
      current_profile: currentCalc,
      simulated_profile: simulatedCalc,
      simulation_feedback: {
        comparison_summary: `Your simulated configuration shows a reduction of ${Math.round(savings)} kg CO2 per month.`,
        projected_yearly_savings_kg: Math.round(yearlySavings),
        achievable_milestones: [
          `Equivalent to planting ${trees} trees per year`,
          `Reduces monthly greenhouse output to ${Math.round(simulatedCalc.total_kg)} kg`
        ],
        coach_verdict: "A solid simulated projection. Keep tweaking transit settings for ultimate efficiency.",
        confidence_score: 0.8
      }
    };
  }
};
