"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/lib/types";
import { motion } from "framer-motion";

export function CategoriesSection({ onSelectCategory }: { onSelectCategory?: (slug: string) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/data/categories.json")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => {});
  }, []);

  return (
    <section id="kolekcje" className="py-16 sm:py-24 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek sekcji */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
              NASZE KOLEKCJE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
              Kupuj według kategorii
            </h2>
          </div>

          <a
            href="#bestsellery"
            className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs tracking-wider uppercase font-semibold text-foreground hover:text-accent transition-colors group"
          >
            <span>Zobacz wszystkie</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Siatka 5 kart kategorii */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(category.id);
                }
                const el = document.getElementById("bestsellery");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group cursor-pointer flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-card text-card-foreground border border-border shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
            >
              {/* Zdjęcie torebki */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-secondary mb-4 flex items-center justify-center p-2">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain p-2 group-hover:scale-108 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>

              {/* Informacje o kategorii i przycisk */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-medium text-foreground group-hover:text-accent transition-colors leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {category.count} modeli
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
