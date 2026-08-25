"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function SearchBarModal() {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct } = useShop();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  const handleClose = () => {
    setIsSearchOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden z-10"
          >
            {/* Pasek wyszukiwania */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Szukaj torebek, stylów, kolorów (np. worek, klapka, taupe)..."
                className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground font-medium ml-2"
              >
                ESC
              </button>
            </div>

            {/* Wyniki wyszukiwania */}
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-border">
              {query.trim() === "" ? (
                <div className="text-center py-8">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Popularne wyszukiwania</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Torebki z klapką", "Torebki kubełkowe", "Shopper", "Skóra licowa", "Kość słoniowa"].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Znalezione produkty ({results.length})
                  </p>
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        handleClose();
                        setQuickViewProduct(product);
                      }}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0 border border-border">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-serif font-medium text-foreground group-hover:text-accent transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">{product.categoryName}</p>
                          <p className="text-xs font-semibold text-foreground mt-1">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        <span>Podgląd</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">
                    Brak wyników dla zapytania: &quot;<span className="font-semibold text-foreground">{query}</span>&quot;
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Spróbuj wpisać inną frazę lub kategorię.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
