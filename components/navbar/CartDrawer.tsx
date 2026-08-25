"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {useRouter} from "next/navigation";

export function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useShop();

  const FREE_SHIPPING_THRESHOLD = 299;
  const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Tło nakładki */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-background text-foreground shadow-2xl border-l border-border flex flex-col"
            >
              {/* Nagłówek koszyka */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                  <h3 className="font-serif text-lg font-semibold tracking-wide text-foreground">
                    Twój Koszyk ({cart.reduce((acc, i) => acc + i.quantity, 0)})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="Zamknij koszyk"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pasek postępu darmowej dostawy */}
              <div className="bg-secondary px-6 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs text-foreground font-medium mb-1.5">
                  <Truck className="w-4 h-4 text-accent" />
                  {missingForFreeShipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Gratulacje! Twoje zamówienie ma darmową dostawę.
                    </span>
                  ) : (
                    <span>
                      Brakuje jeszcze <span className="font-semibold">{formatPrice(missingForFreeShipping)}</span> do darmowej dostawy
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Lista produktów */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-border">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
                      <ShoppingBag className="w-8 h-8 opacity-60" />
                    </div>
                    <p className="font-serif text-lg text-foreground mb-1">Twój koszyk jest pusty</p>
                    <p className="text-xs text-muted-foreground max-w-xs mb-6">
                      Odkryj naszą nową kolekcję luksusowych torebek i znajdź swój wymarzony model.
                    </p>
                    <button
                      onClick={() => { setIsCartOpen(false); router.push("/shop"); }}
                      className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
                    >
                      Przejdź do zakupów
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={`${item.product.id}-${item.selectedColor.name}`} className="pt-4 first:pt-0 flex gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-serif text-sm font-medium text-foreground">
                                {item.product.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Kolor: <span className="font-medium text-foreground">{item.selectedColor.name}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedColor.name)}
                              className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                              aria-label="Usuń z koszyka"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center border border-border rounded-lg bg-background">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedColor.name,
                                    item.quantity - 1
                                  )
                                }
                                className="p-1.5 text-foreground hover:bg-secondary rounded-l-lg"
                                aria-label="Zmniejsz ilość"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedColor.name,
                                    item.quantity + 1
                                  )
                                }
                                className="p-1.5 text-foreground hover:bg-secondary rounded-r-lg"
                                aria-label="Zwiększ ilość"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-medium text-sm text-foreground">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stopka podsumowania koszyka */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-border bg-surface">
                  <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Wartość produktów</span>
                      <span className="text-foreground">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dostawa kurierska</span>
                      <span className="text-foreground">{missingForFreeShipping === 0 ? "Darmowa" : "19,00 zł"}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-foreground pt-2 border-t border-border">
                      <span>Do zapłaty</span>
                      <span>{formatPrice(cartTotal + (missingForFreeShipping === 0 ? 0 : 19))}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push("/checkout");
                    }}
                    className="w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-opacity hover:opacity-90 shadow-md"
                  >
                    <span>Przejdź do kasy</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full mt-2 py-1 text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Wyczyść koszyk
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
