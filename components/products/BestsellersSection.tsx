"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BestsellersSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => {});
  }, []);

  // Tylko trzy najchętniej wybierane modele
  const bestsellers = useMemo(() => {
    const withBestsellerTag = products.filter((product) =>
      product.tags.some((tag) => tag.toLowerCase().includes("bestseller"))
    );
    const source = withBestsellerTag.length >= 3 ? withBestsellerTag : products.filter((p) => p.featured);
    return source.slice(0, 3);
  }, [products]);

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
            Trzy najchętniej wybierane modele uszyte ręcznie z certyfikowanych włoskich skór w limitowanych partiach.
          </p>
        </div>

        {/* Siatka trzech wyróżnionych produktów */}
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Przejście do pełnego sklepu z filtrowaniem */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-[0.15em] uppercase hover:bg-accent transition-colors duration-200"
          >
            <span>Zobacz cały sklep</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
