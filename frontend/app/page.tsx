import Link from "next/link";
import { Leaf, Sparkles, Target, Compass, ArrowRight, Shield } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const FEATURES = [
  {
    icon: <Compass className="h-5 w-5" />,
    title: "Carbon Twin Simulator",
    description:
      "Toggle lifestyle parameters (transit type, energy source, clothes/month) to simulate future emissions reductions in real-time.",
    accentClass: "bg-primary/10 text-primary",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Gemini AI Coach",
    description:
      "Consult a highly personalized conversational AI Coach that analyzes statistics to deliver low-cost, high-impact recommendations.",
    accentClass: "bg-accent/10 text-accent",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Challenges & Gamification",
    description:
      "Participate in weekly sustainability challenges, gain eco-points, improve your Eco Score Level, and track achievements.",
    accentClass: "bg-primary/10 text-primary",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0 opacity-30">
        <div className="absolute -top-40 left-1/4 h-[400px] w-[600px] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute -top-45 right-1/4 h-[400px] w-[500px] rounded-full bg-accent/20 blur-[100px]"></div>
      </div>

      {/* Header navbar inside landing */}
      <header className="w-full border-b border-border bg-background/50 backdrop-blur-md relative z-10">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="tracking-tight font-sans font-bold text-lg">
              EcoMind <span className="text-primary">AI</span>
            </span>
          </div>

          <div>
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
            >
              <span>Launch App</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl w-full text-center py-20 sm:py-28">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary border border-primary/20 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Sustainability Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
            Meet your digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Carbon Twin
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-foreground/75 max-w-2xl mx-auto">
            Create a real-time digital mirror of your lifestyle habits. Simulate target changes, 
            receive Google Gemini coaching, and gamify personal sustainability to reduce footprint output.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <span>Launch Carbon Twin</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/rockersmukesh/EcoMind-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3 text-sm font-semibold rounded-xl border border-border bg-card hover:bg-secondary transition-colors text-center"
            >
              Read Documentation
            </a>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="mx-auto max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accentClass={feature.accentClass}
            />
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground/50 font-medium">
          <div className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5" />
            <span>Built securely under architectural guidelines.</span>
          </div>
          <span>&copy; 2026 EcoMind AI. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
