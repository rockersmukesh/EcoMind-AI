"use client";

import { useState, useEffect } from "react";
import Header from "@/components/shared/Header";
import { fetchRecommendations, CarbonProfile, CalculationResult, CoachResponse } from "@/lib/api";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

import { 
  Leaf, TrendingDown, Target, CheckCircle2, Circle, AlertCircle,
  ArrowUpRight, Award, Plus, Calendar, Compass, ShieldCheck, RefreshCw
} from "lucide-react";
import Link from "next/link";

interface Challenge {
  id: string;
  title: string;
  category: string;
  points: number;
  completed: boolean;
  daysLeft: number;
}

const INITIAL_PROFILE: CarbonProfile = {
  transportation: { milesPerWeek: 120, vehicleType: "gas" },
  diet: { dietType: "low_meat" },
  energy: { kwhPerMonth: 450, source: "grid" },
  shopping: { newClothesPerMonth: 3, techUpgradesPerYear: 2 }
};

const INITIAL_CHALLENGES: Challenge[] = [
  { id: "1", title: "Walk or bike for short trips (< 2 miles)", category: "Transportation", points: 80, completed: false, daysLeft: 4 },
  { id: "2", title: "Introduce Meatless Mondays", category: "Diet", points: 50, completed: true, daysLeft: 0 },
  { id: "3", title: "Unplug idle electronics & standby items", category: "Energy", points: 30, completed: false, daysLeft: 6 },
  { id: "4", title: "Avoid fast-fashion purchases this month", category: "Shopping", points: 100, completed: false, daysLeft: 12 }
];

// Historical trends mock data
const HISTORICAL_TRENDS = [
  { name: "Jan", Emissions: 580 },
  { name: "Feb", Emissions: 550 },
  { name: "Mar", Emissions: 510 },
  { name: "Apr", Emissions: 490 },
  { name: "May", Emissions: 465 },
  { name: "Jun", Emissions: 457 } // current month calculations matches INITIAL_PROFILE
];

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

export default function DashboardPage() {
  const [profile] = useState<CarbonProfile>(INITIAL_PROFILE);
  const [data, setData] = useState<{ calculated_profile: CalculationResult, ai_coach_response: CoachResponse } | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  const loadDashboardData = async () => {
    try {
      const recommendations = await fetchRecommendations(profile);
      setData(recommendations);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleChallenge = (id: string) => {
    setChallenges(prev => prev.map(ch => 
      ch.id === id ? { ...ch, completed: !ch.completed } : ch
    ));
  };

  const totalEmissions = data?.calculated_profile.total_kg || 457.29;
  const ecoScore = data?.ai_coach_response.eco_score_estimate || 72;

  // Pie chart structured breakdown
  const pieData = data ? [
    { name: "Transit", value: data.calculated_profile.transportation_kg },
    { name: "Diet", value: data.calculated_profile.diet_kg },
    { name: "Home Energy", value: data.calculated_profile.energy_kg },
    { name: "Shopping", value: data.calculated_profile.shopping_kg }
  ] : [];

  // Equivalent parameters
  const yearlyFootprintTons = ((totalEmissions * 12) / 1000).toFixed(1);
  const treesNeeded = Math.round((totalEmissions * 12) / 22.0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        
        {/* User Greeting & Stats summary */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Sustainability <span className="text-primary">Dashboard</span>
            </h1>
            <p className="mt-2 text-sm text-foreground/75">
              Welcome back, pilot! Monitor your footprint metrics, track active weekly challenges, and review insights.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href="/simulator"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <Compass className="h-4 w-4" />
              <span>Simulate Changes</span>
            </Link>
          </div>
        </div>

        {/* Top Overview Cards (4 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1: Total Footprint */}
          <div className="glass-card rounded-2xl p-6 glow-on-hover relative">
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider block mb-1">
              Monthly Emissions
            </span>
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {Math.round(totalEmissions)} <span className="text-sm font-normal text-foreground/60">kg CO₂</span>
            </span>
            <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1 mt-3">
              <TrendingDown className="h-3 w-3" />
              <span>-12% from previous month</span>
            </span>
          </div>

          {/* Card 2: Yearly Tons Equivalent */}
          <div className="glass-card rounded-2xl p-6 glow-on-hover relative">
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider block mb-1">
              Annualized Carbon
            </span>
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {yearlyFootprintTons} <span className="text-sm font-normal text-foreground/60">Metric Tons</span>
            </span>
            <span className="text-[10px] text-foreground/60 block mt-3">
              National individual average is ~16 Tons
            </span>
          </div>

          {/* Card 3: Tree absorption equivalent */}
          <div className="glass-card rounded-2xl p-6 glow-on-hover relative">
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider block mb-1">
              Tree Offset Requirement
            </span>
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {treesNeeded} <span className="text-sm font-normal text-foreground/60">Trees/Yr</span>
            </span>
            <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-3">
              <Leaf className="h-3 w-3" />
              <span>To fully offset personal annual load</span>
            </span>
          </div>

          {/* Card 4: Eco Score */}
          <div className="glass-card rounded-2xl p-6 glow-on-hover relative">
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider block mb-1">
              Eco Score Level
            </span>
            <span className="text-3xl font-extrabold text-primary tracking-tight">
              {ecoScore} <span className="text-sm font-normal text-foreground/60">/ 100</span>
            </span>
            <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-3">
              <Award className="h-3.5 w-3.5" />
              <span>Classified as: Eco Guardian</span>
            </span>
          </div>

        </div>

        {/* Charts & Trends Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-stretch">
          
          {/* Trend line graph (7 cols) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground mb-1">Footprint Trends</h3>
              <p className="text-xs text-foreground/60 mb-4">Historical record over the last 6 months</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HISTORICAL_TRENDS}>
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="name" stroke="#A0AEC0" fontSize={11} tickLine={false} />
                  <YAxis stroke="#A0AEC0" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderRadius: "8px" }}
                  />
                  <Area type="monotone" dataKey="Emissions" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorEmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categorical Distribution Pie Chart (5 cols) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground mb-1">Carbon Breakdown</h3>
              <p className="text-xs text-foreground/60 mb-4">Emissions share per sector</p>
            </div>
            
            {data ? (
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                {/* Pie Chart element */}
                <div className="h-44 w-44 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Absolute Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-foreground">{Math.round(totalEmissions)}</span>
                    <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest">kg total</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="space-y-2.5 w-full sm:w-auto">
                  {pieData.map((d, index) => {
                    const percentage = Math.round((d.value / totalEmissions) * 100);
                    return (
                      <div key={index} className="flex items-center justify-between gap-6 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                          <span className="text-foreground/80 font-medium">{d.name}</span>
                        </div>
                        <span className="font-bold text-foreground">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>

        </div>

        {/* Challenges & Action Hub Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Challenges (7 cols) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Target className="text-primary h-5 w-5" />
                Active Challenges
              </h3>
              <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Join New</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {challenges.map((ch) => (
                <div 
                  key={ch.id}
                  onClick={() => toggleChallenge(ch.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    ch.completed 
                      ? "bg-primary/5 border-primary/20 opacity-75"
                      : "bg-secondary/30 border-border hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {ch.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-foreground/40 shrink-0" />
                    )}
                    <div>
                      <p className={`text-xs font-semibold ${ch.completed ? "line-through text-foreground/50" : "text-foreground"}`}>
                        {ch.title}
                      </p>
                      <span className="text-[10px] font-bold text-foreground/45">
                        {ch.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-primary">
                      +{ch.points} pts
                    </span>
                    {!ch.completed && (
                      <span className="text-[9px] font-semibold bg-secondary px-2 py-0.5 rounded-full border border-border text-foreground/60 flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" />
                        <span>{ch.daysLeft}d left</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Coach Suggestion Cards (5 cols) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6">
            <h3 className="font-bold text-base text-foreground mb-4 border-b border-border pb-3 flex items-center gap-2">
              <ShieldCheck className="text-accent h-5 w-5" />
              Sustainability Tip
            </h3>
            
            {data?.ai_coach_response.recommendations?.[0] ? (
              <div className="space-y-4">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <h4 className="font-bold text-xs text-primary mb-1">RECOMMENDED ACTION</h4>
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    {data.ai_coach_response.recommendations[0].action}
                  </p>
                  <p className="text-[11px] text-foreground/75 leading-relaxed mt-2">
                    {data.ai_coach_response.recommendations[0].explanation}
                  </p>
                </div>
                
                <div className="flex justify-between items-center text-xs font-semibold pt-2 border-t border-border">
                  <span className="text-foreground/70">Estimated savings</span>
                  <span className="text-primary font-bold">
                    -{Math.round(data.ai_coach_response.recommendations[0].estimated_annual_savings_kg)} kg CO₂/yr
                  </span>
                </div>
                
                <Link
                  href="/coach"
                  className="w-full py-2.5 text-xs font-bold rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors flex items-center justify-center gap-1 border border-border mt-2"
                >
                  <span>Consult Coach Details</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center text-foreground/50">
                <AlertCircle className="h-6 w-6 animate-pulse" />
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
