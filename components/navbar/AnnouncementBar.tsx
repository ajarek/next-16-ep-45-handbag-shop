import React from "react";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-secondary border-b border-border/60 text-secondary-foreground text-xs py-2 px-4 font-medium transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 sm:gap-10 text-center tracking-wide">
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-accent" />
          <span>Darmowa dostawa od 299 zł</span>
        </div>
        <span className="hidden sm:inline opacity-30">|</span>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 text-accent" />
          <span>30 dni na bezpłatny zwrot</span>
        </div>
        <span className="hidden md:inline opacity-30">|</span>
        <div className="hidden md:flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>100% oryginalne włoskie skóry</span>
        </div>
      </div>
    </div>
  );
}
