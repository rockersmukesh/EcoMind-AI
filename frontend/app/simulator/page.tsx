"use client";

import { useState, useEffect } from "react";
import Header from "@/components/shared/Header";
import { fetchSimulation, CarbonProfile, CalculationResult, SimulationResponse } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { 
  Car, Leaf, Sparkles, RefreshCw, Zap, ShoppingBag, 
  ChevronRight, Save, Award, Info 
} from "lucide-react";

const INITIAL_PROFILE: CarbonProfile = {
  transportation: { milesPerWeek: 120, vehicleType: "gas" },
  diet: { dietType: "low_meat" },
  energy: { kwhPerMonth: 450, source: "grid" },
  shopping: { newClothesPerMonth: 3, techUpgradesPerYear: 2 }
};

export default function SimulatorPage() {
  // Current Profile (User's standard profile)
  const [current, setCurrent] = useState<CarbonProfile>(INITIAL_PROFILE);
  // Simulated Profile (modifiable in playground)
  const [simulated, setSimulated] = useState<CarbonProfile>(INITIAL_PROFILE);

  const [currentCalc, setCurrentCalc] = useState<CalculationResult | null>(null);
  const [simulatedCalc, setSimulatedCalc] = useState<CalculationResult | null>(null);
  const [simulationFeedback, setSimulationFeedback] = useState<SimulationResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Trigger calculation updates when simulated or current profiles change
  const triggerSimulation = async () => {
    setLoading(true);
    try {
      const data = await fetchSimulation(current, simulated);
      setCurrentCalc(data.current_profile);
      setSimulatedCalc(data.simulated_profile);
      setSimulationFeedback(data.simulation_feedback);
    } catch (e) {
      console.error("Simulation run failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run initial calculations on mount
    const timer = setTimeout(() => {
      triggerSimulation();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSimulateChange = (section: keyof CarbonProfile, key: string, value: string | number) => {
    setSimulated(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setIsSaved(false);
  };

  const handleReset = () => {
    setSimulated(current);
    setIsSaved(false);
  };

  const handleApplyToCurrent = () => {
    setCurrent(simulated);
    setIsSaved(true);
    // Automatically re-run matching state
    setTimeout(() => triggerSimulation(), 100);
  };

  // Format data for Recharts display
  const chartData = currentCalc && simulatedCalc ? [
    {
      name: "Transportation",
      Current: currentCalc.transportation_kg,
      Simulated: simulatedCalc.transportation_kg,
    },
    {
      name: "Diet / Food",
      Current: currentCalc.diet_kg,
      Simulated: simulatedCalc.diet_kg,
    },
    {
      name: "Home Energy",
      Current: currentCalc.energy_kg,
      Simulated: simulatedCalc.energy_kg,
    },
    {
      name: "Shopping",
      Current: currentCalc.shopping_kg,
      Simulated: simulatedCalc.shopping_kg,
    },
  ] : [];

  const totalCurrent = currentCalc?.total_kg || 0;
  const totalSimulated = simulatedCalc?.total_kg || 0;
  const delta = totalCurrent - totalSimulated;
  const deltaPct = totalCurrent > 0 ? Math.round((delta / totalCurrent) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />
      
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Page Title & Intro */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <RefreshCw className="text-primary h-8 w-8 animate-spin-slow" />
              Carbon Twin <span className="text-primary">Simulator</span>
            </h1>
            <p className="mt-2 text-sm text-foreground/75 max-w-2xl">
              Experiment with lifestyle changes below to modify your digital Carbon Twin. 
              Gemini AI will analyze your simulated projections in real-time.
            </p>
          </div>
          
          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
            >
              Reset to Live Twin
            </button>
            <button
              onClick={triggerSimulation}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>Simulate</span>
            </button>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sliders / Simulator Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section 1: Transportation */}
            <div className="glass-card rounded-2xl p-6 glow-on-hover">
              <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                <Car className="text-primary h-5 w-5" />
                <h3 className="font-semibold text-base text-foreground">Transportation Habits</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground/75 mb-2">
                    Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(["gas", "hybrid", "ev", "public_transit", "walk_bike"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleSimulateChange("transportation", "vehicleType", type)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          simulated.transportation.vehicleType === type
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-border hover:bg-secondary text-foreground/70"
                        }`}
                      >
                        {type === "gas" && "Gasoline"}
                        {type === "hybrid" && "Hybrid"}
                        {type === "ev" && "Electric (EV)"}
                        {type === "public_transit" && "Transit"}
                        {type === "walk_bike" && "Walk/Bike"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-foreground/75">Weekly Travel Distance</span>
                    <span className="text-primary font-bold">{simulated.transportation.milesPerWeek} miles</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={simulated.transportation.milesPerWeek}
                    onChange={(e) => handleSimulateChange("transportation", "milesPerWeek", Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Diet & Food */}
            <div className="glass-card rounded-2xl p-6 glow-on-hover">
              <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                <Leaf className="text-primary h-5 w-5" />
                <h3 className="font-semibold text-base text-foreground">Dietary Strategy</h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground/75 mb-3">
                  Diet profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {(["vegan", "vegetarian", "pescatarian", "low_meat", "high_meat"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleSimulateChange("diet", "dietType", type)}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                        simulated.diet.dietType === type
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border hover:bg-secondary text-foreground/70"
                      }`}
                    >
                      {type === "vegan" && "Vegan"}
                      {type === "vegetarian" && "Vegetarian"}
                      {type === "pescatarian" && "Pescatarian"}
                      {type === "low_meat" && "Low Meat"}
                      {type === "high_meat" && "High Meat"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Household Energy */}
            <div className="glass-card rounded-2xl p-6 glow-on-hover">
              <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                <Zap className="text-primary h-5 w-5" />
                <h3 className="font-semibold text-base text-foreground">Utility & Household Energy</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground/75 mb-2">
                    Electricity Source
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["grid", "solar", "wind"] as const).map((source) => (
                      <button
                        key={source}
                        onClick={() => handleSimulateChange("energy", "source", source)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          simulated.energy.source === source
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-border hover:bg-secondary text-foreground/70"
                        }`}
                      >
                        {source === "grid" && "Standard Grid"}
                        {source === "solar" && "Solar Power"}
                        {source === "wind" && "Wind Power"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-foreground/75">Monthly Usage</span>
                    <span className="text-primary font-bold">{simulated.energy.kwhPerMonth} kWh</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="25"
                    value={simulated.energy.kwhPerMonth}
                    onChange={(e) => handleSimulateChange("energy", "kwhPerMonth", Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Shopping Habits */}
            <div className="glass-card rounded-2xl p-6 glow-on-hover">
              <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                <ShoppingBag className="text-primary h-5 w-5" />
                <h3 className="font-semibold text-base text-foreground">Shopping & Retail consumption</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-foreground/75">New Apparel Purchases</span>
                    <span className="text-primary font-bold">{simulated.shopping.newClothesPerMonth} items/month</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={simulated.shopping.newClothesPerMonth}
                    onChange={(e) => handleSimulateChange("shopping", "newClothesPerMonth", Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-foreground/75">Tech & Electronics Upgrades</span>
                    <span className="text-primary font-bold">{simulated.shopping.techUpgradesPerYear} upgrades/year</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={simulated.shopping.techUpgradesPerYear}
                    onChange={(e) => handleSimulateChange("shopping", "techUpgradesPerYear", Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Comparative Charts & Gemini AI Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Impact Metric Card */}
            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-primary relative overflow-hidden">
              <div className="absolute right-0 top-0 h-16 w-16 bg-primary/5 rounded-bl-full flex items-center justify-center text-primary/20">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-semibold text-foreground/75 mb-2">Projected Monthly Savings</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-primary tracking-tight">
                  {delta > 0 ? `-${Math.round(delta)}` : Math.round(delta)}
                </span>
                <span className="text-xs font-semibold text-foreground/60">kg CO₂ / month</span>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-xs font-semibold border-t border-border pt-4">
                <span className="text-foreground/75">Emissions reduction</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  delta >= 0 ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"
                }`}>
                  {delta >= 0 ? `-${deltaPct}%` : `+${Math.abs(deltaPct)}%`}
                </span>
              </div>
            </div>

            {/* Recharts Bar Comparison Chart */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-sm text-foreground mb-4">Emissions Breakdown (kg CO₂/mo)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                    <XAxis dataKey="name" stroke="#A0AEC0" fontSize={11} tickLine={false} />
                    <YAxis stroke="#A0AEC0" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderRadius: "8px" }}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar dataKey="Current" fill="#334155" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Simulated" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gemini AI Projections Panel */}
            <div className="glass-card rounded-2xl p-6 border-t-2 border-t-accent relative">
              <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-accent h-5 w-5" />
                  <h3 className="font-bold text-sm text-foreground">AI Carbon Twin Coach</h3>
                </div>
                {loading && (
                  <div className="flex items-center gap-1.5 text-xs text-accent">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                )}
              </div>

              {simulationFeedback ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1">
                      Comparison Summary
                    </h4>
                    <p className="text-foreground/90 leading-relaxed font-medium">
                      {simulationFeedback.comparison_summary}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                      Eco Milestones
                    </h4>
                    <ul className="space-y-1.5">
                      {simulationFeedback.achievable_milestones.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-foreground/80">
                          <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-secondary/40 rounded-xl p-4 border border-border">
                    <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      <span>Coach Verdict</span>
                    </h4>
                    <p className="text-xs text-foreground/80 italic leading-relaxed">
                      &quot;{simulationFeedback.coach_verdict}&quot;
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center text-foreground/60">
                  <Info className="h-8 w-8 mb-2" />
                  <p className="text-xs">Adjust sliders or parameters to prompt AI feedback.</p>
                </div>
              )}
            </div>

            {/* Apply simulated changes to current profile */}
            {delta > 0 && (
              <button
                onClick={handleApplyToCurrent}
                disabled={isSaved}
                className="w-full py-3 font-semibold rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-transparent"
              >
                <Save className="h-4 w-4" />
                <span>{isSaved ? "Saved to Carbon Twin" : "Commit to Carbon Twin"}</span>
              </button>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
