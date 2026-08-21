"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, Award } from "lucide-react";
import { motion } from "framer-motion";

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: "Darmowa dostawa",
      subtitle: "od 299 zł w całym kraju",
    },
    {
      icon: RotateCcw,
      title: "30 dni na zwrot",
      subtitle: "bez podania przyczyny",
    },
    {
      icon: ShieldCheck,
      title: "Bezpieczne płatności",
      subtitle: "szyfrowane transakcje SSL",
    },
    {
      icon: Award,
      title: "Gwarancja jakości",
      subtitle: "tylko oryginalne produkty",
    },
  ];

  return (
    <section className="py-12 border-y border-border bg-surface text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex items-center gap-3.5 sm:gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary text-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 border border-border/50">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm sm:text-base font-medium text-foreground">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {badge.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
