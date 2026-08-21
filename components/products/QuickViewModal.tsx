"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Star, Heart, ShoppingBag, Plus, Minus, Check, ShieldCheck, Truck } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/lib/utils";
import { ColorOption, Product } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

function QuickViewModalContent({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart, isInWishlist, toggleWishlist } = useShop();
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const isFavorite = isInWishlist(product.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Tło nakładki */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Kontener modala */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl bg-card text-card-foreground rounded-3xl shadow-2xl border border-border overflow-hidden z-10"
      >
        {/* Przycisk zamknięcia */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/80 text-foreground hover:bg-secondary backdrop-blur-md transition-colors"
          aria-label="Zamknij podgląd"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Galeria zdjęć */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-secondary/70 border-b md:border-b-0 md:border-r border-border">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-background/50 mb-4">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Miniaturki */}
            {product.images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-accent scale-105 shadow-sm"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Miniatura ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dane i konfiguracja */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="uppercase tracking-widest text-accent font-semibold">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold text-foreground">
                    {product.rating}
                  </span>
                  <span className="text-muted-foreground">({product.reviewsCount} opinii)</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-medium leading-tight mb-3">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-semibold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Wybór koloru */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Kolor: <span className="font-normal text-muted-foreground">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                        selectedColor.name === color.name
                          ? "ring-2 ring-accent ring-offset-2 dark:ring-offset-card border-transparent"
                          : "border-border opacity-80"
                      }`}
                      title={color.name}
                      aria-label={`Kolor: ${color.name}`}
                    >
                      {selectedColor.name === color.name && (
                        <Check className="w-3.5 h-3.5 text-stone-900" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specyfikacja */}
              <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-border text-muted-foreground">
                <div>
                  <span className="text-muted-foreground/70">Materiał: </span>
                  <span className="font-medium text-foreground">{product.material}</span>
                </div>
                <div>
                  <span className="text-muted-foreground/70">Wymiary: </span>
                  <span className="font-medium text-foreground">{product.dimensions}</span>
                </div>
              </div>
            </div>

            {/* Ilość i przyciski akcji */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-xl bg-background p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-foreground hover:bg-secondary rounded-lg"
                    aria-label="Mniej"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-semibold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-foreground hover:bg-secondary rounded-lg"
                    aria-label="Więcej"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, selectedColor, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:opacity-90"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Dodaj do koszyka</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border border-border transition-colors ${
                    isFavorite
                      ? "bg-accent text-accent-foreground border-transparent"
                      : "bg-background text-foreground hover:bg-secondary"
                  }`}
                  aria-label="Ulubione"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-accent" />
                  <span>Wysyłka w 24h</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>2 lata gwarancji rzemieślniczej</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useShop();

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <QuickViewModalContent
          key={quickViewProduct.id}
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </AnimatePresence>
  );
}
