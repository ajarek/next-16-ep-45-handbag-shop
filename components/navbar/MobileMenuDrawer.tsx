"use client";

import React from "react";
import { X, Search, Heart, ShoppingBag, User, ChevronRight, Phone, Mail } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const { wishlistCount, cartCount, setIsCartOpen, setIsSearchOpen } = useShop();

  const navLinks = [
    { name: "Strona główna", href: "/#hero" },
    { name: "Kolekcje", href: "/#kolekcje" },
    { name: "Bestsellery", href: "/#bestsellery" },
    { name: "Nowości", href: "/#bestsellery" },
    { name: "Wybierz według stylu", href: "/#style" },
    { name: "Kunszt i Rzemiosło", href: "/#rzemioslo" },
    { name: "Opinie klientek", href: "/#opinie" },
    { name: "O nas", href: "/about-us" },
    { name: "Kontakt", href: "/contact" },
  ];

  // Podlinki sklepu — zgodne z rozwijanym menu Shop w nawigacji
  const shopLinks = [
    { name: "Wszystkie produkty", href: "/shop" },
    { name: "Torebki kubełkowe", href: "/shop?kategoria=kubelkowe" },
    { name: "Torebki z klapką", href: "/shop?kategoria=z-klapka" },
    { name: "Torebki na ramię", href: "/shop?kategoria=na-ramie" },
    { name: "Listonoszki", href: "/shop?kategoria=listonoszki" },
    { name: "Shoppery i tote", href: "/shop?kategoria=shoppery-tote" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Tło nakładki */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            {/* Płynne menu wysuwane z lewej strony */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-screen max-w-xs sm:max-w-sm bg-background text-foreground shadow-2xl border-r border-border flex flex-col justify-between"
            >
              {/* Góra menu - logo i zamknięcie */}
              <div>
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <Link href="/" onClick={onClose} className="flex flex-col">
                    <span className="font-serif text-2xl tracking-[0.25em] font-semibold text-foreground uppercase">
                      LUXÉ
                    </span>
                    <span className="text-[9px] tracking-[0.4em] text-accent uppercase -mt-1 font-sans font-light">
                      BAGS
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
                      aria-label="Zamknij menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Szybkie akcje wyszukiwania */}
                <div className="p-4 border-b border-border">
                  <button
                    onClick={() => {
                      onClose();
                      setIsSearchOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-secondary text-muted-foreground text-xs hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span>Szukaj torebek...</span>
                    </span>
                    <kbd className="text-[10px] bg-card px-1.5 py-0.5 rounded border border-border">SZUKAJ</kbd>
                  </button>
                </div>

                {/* Linki nawigacyjne */}
                <nav className="p-4 space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-foreground font-medium text-sm hover:bg-secondary hover:text-accent transition-colors"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-60" />
                    </a>
                  ))}
                </nav>

                {/* Podlinki sklepu */}
                <div className="px-4 pb-4">
                  <p className="px-4 pb-2 text-[10px] font-semibold tracking-[0.25em] text-muted-foreground uppercase border-t border-border pt-4">
                    Sklep
                  </p>
                  <div className="space-y-1">
                    {shopLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-foreground text-sm hover:bg-secondary hover:text-accent transition-colors"
                      >
                        <span>{link.name}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-60" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dół menu - akcje użytkownika */}
              <div className="p-6 border-t border-border bg-surface space-y-3">
                <div className="flex items-center justify-around py-2 border-b border-border">
                  <button
                    onClick={() => {
                      onClose();
                      setIsCartOpen(true);
                    }}
                    className="flex flex-col items-center gap-1 text-xs text-foreground relative p-1"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Koszyk</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-semibold">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <a
                    href="#bestsellery"
                    onClick={onClose}
                    className="flex flex-col items-center gap-1 text-xs text-foreground relative p-1"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Ulubione</span>
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-2 w-4 h-4 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center font-semibold">
                        {wishlistCount}
                      </span>
                    )}
                  </a>

                  <button
                    onClick={() => {
                      alert("Logowanie Firebase Auth.");
                    }}
                    className="flex flex-col items-center gap-1 text-xs text-foreground p-1"
                  >
                    <User className="w-5 h-5" />
                    <span>Konto</span>
                  </button>
                </div>

                <div className="text-[11px] text-muted-foreground space-y-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-accent" />
                    <span>+48 22 123 45 67 (Pn-Pt 9-18)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    <span>kontakt@luxebags.pl</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
