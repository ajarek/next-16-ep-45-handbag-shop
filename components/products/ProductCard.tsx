"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Heart, Eye, ShoppingBag, Star } from "lucide-react"
import { Product, ColorOption } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { useShop } from "@/context/ShopContext"
import { motion } from "framer-motion"

export function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, toggleWishlist, addToCart, setQuickViewProduct } =
    useShop()
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product.colors[0],
  )
  const [isHovered, setIsHovered] = useState(false)

  const isFavorite = isInWishlist(product.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='group flex flex-col bg-card text-card-foreground rounded-2xl border border-border p-4 shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 relative'
    >
      {/* Zdjęcie produktu i nakładki akcji */}
      <div className='relative aspect-square w-full rounded-xl overflow-hidden bg-secondary mb-4'>
        {/* Tagi / Odznaki */}
        <div className='absolute top-2.5 left-2.5 z-10 flex flex-col gap-1'>
          {product.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                tag === "Bestseller"
                  ? "bg-primary text-primary-foreground"
                  : tag === "Nowość"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground border border-border"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Przycisk dodawania do ulubionych */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist(product.id)
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isFavorite
              ? "bg-accent text-accent-foreground"
              : "bg-background/80 text-foreground hover:bg-background"
          }`}
          aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Obrazek główny */}
        <Image
          src={
            isHovered && product.images[1]
              ? product.images[1]
              : product.images[0]
          }
          alt={product.name}
          fill
          className='object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          loading='eager'
        />

        {/* Przycisk szybkiego podglądu na hover */}
        <div className='absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2'>
          <button
            onClick={() => setQuickViewProduct(product)}
            className='flex-1 py-2 px-3 rounded-lg bg-background/95 backdrop-blur-md text-foreground text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md hover:bg-primary hover:text-primary-foreground transition-all'
          >
            <Eye className='w-3.5 h-3.5' />
            <span>Szybki podgląd</span>
          </button>
        </div>
      </div>

      {/* Szczegóły produktu */}
      <div className='flex-1 flex flex-col justify-between'>
        <div>
          {/* Kategoria i ocena */}
          <div className='flex items-center justify-between text-xs text-muted-foreground mb-1'>
            <span>{product.categoryName}</span>
            <div className='flex items-center gap-1'>
              <Star className='w-3 h-3 fill-amber-400 text-amber-400' />
              <span className='font-medium text-foreground'>
                {product.rating}
              </span>
              <span className='text-muted-foreground'>
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Nazwa produktu */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className='font-serif text-base font-medium text-foreground hover:text-accent transition-colors cursor-pointer line-clamp-1 mb-2'
          >
            {product.name}
          </h3>

          {/* Próbki kolorów */}
          <div className='flex items-center gap-1.5 mb-3'>
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color.hex }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColor.name === color.name
                    ? "ring-2 ring-accent ring-offset-1 dark:ring-offset-card border-transparent scale-110"
                    : "border-border opacity-80 hover:opacity-100"
                }`}
                title={color.name}
                aria-label={`Kolor: ${color.name}`}
              />
            ))}
            <span className='text-[10px] text-muted-foreground ml-1'>
              {selectedColor.name}
            </span>
          </div>
        </div>

        {/* Cena i przycisk dodawania do koszyka */}
        <div className='pt-2 border-t border-border/60 flex items-center justify-between gap-2'>
          <div>
            <span className='font-semibold text-base text-foreground'>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className='text-xs text-muted-foreground line-through ml-2'>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, selectedColor, 1)}
            className='p-2.5 rounded-xl bg-secondary hover:bg-primary text-foreground hover:text-primary-foreground transition-colors'
            title='Dodaj do koszyka'
            aria-label='Dodaj do koszyka'
          >
            <ShoppingBag className='w-4 h-4' />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
