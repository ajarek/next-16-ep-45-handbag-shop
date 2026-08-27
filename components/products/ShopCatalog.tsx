"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Product } from "@/lib/types"
import { ProductCard } from "./ProductCard"
import { SlidersHorizontal, SearchX, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ShopCatalogProps {
  /** Aktywna kategoria przekazana z adresu URL (?kategoria=...) */
  activeCategory: string
}

const categories = [
  { id: "all", label: "Wszystkie modele" },
  { id: "z-klapka", label: "Z klapką" },
  { id: "kubelkowe", label: "Kubełkowe" },
  { id: "na-ramie", label: "Na ramię" },
  { id: "listonoszki", label: "Listonoszki" },
  { id: "shoppery-tote", label: "Shopper & Tote" },
]

const tags = [
  { id: "all", label: "Wszystkie" },
  { id: "Bestseller", label: "Bestsellery" },
  { id: "Nowość", label: "Nowości" },
  { id: "Edycja limitowana", label: "Edycja limitowana" },
]

const sortOptions = [
  { id: "polecane", label: "Polecane" },
  { id: "cena-rosnaco", label: "Cena: od najniższej" },
  { id: "cena-malejaco", label: "Cena: od najwyższej" },
  { id: "oceny", label: "Najwyżej oceniane" },
]

// Polska odmiana rzeczownika: 1 model, 2-4 modele, 5+ modeli
function formatModelsCount(count: number): string {
  if (count === 1) return "1 model"
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 10 || lastTwoDigits >= 20)
  ) {
    return `${count} modele`
  }
  return `${count} modeli`
}

export function ShopCatalog({ activeCategory }: ShopCatalogProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [sortOption, setSortOption] = useState<string>("polecane")

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => {})
  }, [])

  const filteredProducts = useMemo(() => {
    const matchesCategory = (product: Product) =>
      activeCategory === "all" || product.category === activeCategory
    const matchesTag = (product: Product) =>
      selectedTag === "all" ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(selectedTag.toLowerCase()),
      )

    const filtered = products.filter(
      (product) => matchesCategory(product) && matchesTag(product),
    )

    switch (sortOption) {
      case "cena-rosnaco":
        return [...filtered].sort((a, b) => a.price - b.price)
      case "cena-malejaco":
        return [...filtered].sort((a, b) => b.price - a.price)
      case "oceny":
        return [...filtered].sort((a, b) => b.rating - a.rating)
      default:
        return filtered
    }
  }, [products, activeCategory, selectedTag, sortOption])

  const resetLocalFilters = () => {
    setSelectedTag("all")
    setSortOption("polecane")
  }

  return (
    <section className='py-16 bg-background text-foreground transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Pasek filtrów */}
        <div className='flex flex-col lg:flex-row items-center justify-between gap-4 mb-4 pb-6 border-b border-border'>
          {/* Filtry kategorii jako podlinki w adresie URL */}
          <div className='flex flex-wrap items-center justify-center sm:justify-start gap-2'>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={
                  category.id === "all"
                    ? "/shop"
                    : `/shop?kategoria=${category.id}`
                }
                scroll={false}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-foreground border border-border hover:bg-secondary"
                }`}
              >
                {category.label}
              </Link>
            ))}
          </div>

          {/* Szybki filtr tagów i sortowanie */}
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <SlidersHorizontal className='w-4 h-4 text-muted-foreground shrink-0' />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                aria-label='Filtruj według tagu'
                className='bg-card text-foreground border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring'
              >
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              aria-label='Sortuj produkty'
              className='bg-card text-foreground border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring'
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Licznik wyników */}
        <p className='mb-8 text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground'>
          Znaleziono:{" "}
          <span className='text-accent'>
            {formatModelsCount(filteredProducts.length)}
          </span>
        </p>

        {/* Siatka produktów */}
        <AnimatePresence mode='popLayout'>
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className='text-center py-20 flex flex-col items-center gap-3'>
              <span className='w-14 h-14 rounded-full bg-secondary flex items-center justify-center'>
                <SearchX className='w-6 h-6 text-muted-foreground' />
              </span>
              <p className='text-base text-muted-foreground'>
                Brak modeli spełniających wybrane kryteria.
              </p>
              <Link
                href='/shop'
                onClick={resetLocalFilters}
                className='inline-flex items-center gap-1.5 text-xs uppercase font-semibold tracking-wider text-accent hover:underline'
              >
                <span>Pokaż wszystkie produkty</span>
                <ArrowRight className='w-3.5 h-3.5' />
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
