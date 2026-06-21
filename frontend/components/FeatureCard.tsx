import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentClass: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  accentClass,
}: FeatureCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 glow-on-hover flex flex-col justify-between h-56">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClass} border border-current/20`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-base text-foreground mb-1">{title}</h3>
        <p className="text-xs text-foreground/70 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
