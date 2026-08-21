"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BestsellersSectionProps {
  activeCategoryFilter?: string | null;
  onClearCategoryFilter?: () => void;
}

export function BestsellersSection({
  activeCategoryFilter = null,
  onClearCategoryFilter,
}: BestsellersSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [manualCategory, setManualCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("all");

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => {});
  }, []);

  // Obliczenie aktywnej kategorii
  const currentCategory = manualCategory ?? (activeCategoryFilter ?? "all");

  const categories = [
    { id: "all", label: "Wszystkie modele" },
    { id: "z-klapka", label: "Z klapką" },
    { id: "kubelkowe", label: "Kubełkowe" },
    { id: "na-ramie", label: "Na ramię" },
    { id: "listonoszki", label: "Listonoszki" },
    { id: "shoppery-tote", label: "Shopper & Tote" },
  ];

  const tags = [
    { id: "all", label: "Wszystkie" },
    { id: "Bestseller", label: "Bestsellery" },
    { id: "Nowość", label: "Nowości" },
    { id: "Edycja limitowana", label: "Edycja limitowana" },
  ];

  const filteredProducts = products.filter((item) => {
    const matchesCat = currentCategory === "all" || item.category === currentCategory;
    const matchesTag =
      selectedTag === "all" || item.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));
    return matchesCat && matchesTag;
  });

  return (
    <section id="bestsellery" className="py-20 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek sekcji */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IKONY STYLU</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
            Bestsellery & Nowa Kolekcja
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Odkryj najchętniej wybierane modele torebek, uszyte ręcznie z certyfikowanych włoskich skór w limitowanych partiach.
          </p>
        </div>

        {/* Pasek filtrów kategorii */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          {/* Przyciski kategorii */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setManualCategory(cat.id);
                  if (onClearCategoryFilter && cat.id === "all") {
                    onClearCategoryFilter();
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 ${
                  currentCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-foreground border border-border hover:bg-secondary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Szybki filtr tagów */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-card text-foreground border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Siatka produktów */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-base text-muted-foreground mb-2">
                Brak modeli w wybranej kategorii.
              </p>
              <button
                onClick={() => {
                  setManualCategory("all");
                  setSelectedTag("all");
                  if (onClearCategoryFilter) onClearCategoryFilter();
                }}
                className="text-xs uppercase font-semibold tracking-wider text-accent hover:underline"
              >
                Pokaż wszystkie produkty
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
