"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  ChevronDown,
  LogOut,
  Package,
  UserCircle,
  Database,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { AnnouncementBar } from "./AnnouncementBar";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenuDrawer } from "./MobileMenuDrawer";
import { SearchBarModal } from "./SearchBarModal";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const { wishlistCount, cartCount, setIsCartOpen, setIsSearchOpen } = useShop();
  const { zalogowany, profil, uzytkownik, wylogowanie, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWylogowanie = async () => {
    await wylogowanie();
    setIsAccountDropdownOpen(false);
  };

  const inicjaly =
    profil?.displayName?.charAt(0)?.toUpperCase() ||
    uzytkownik?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Pasek ogłoszeń u góry */}
      <AnnouncementBar />

      {/* Główny pasek nawigacji */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-background border-b border-border/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Lewa strona - Przycisk menu mobilnego + Logo */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-foreground hover:bg-secondary transition-colors"
                aria-label="Otwórz menu mobilne"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link href="/" className="flex flex-col group">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-semibold text-foreground group-hover:text-accent transition-colors uppercase">
                  LUXÉ
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-[0.45em] text-accent uppercase -mt-1 font-sans font-light">
                  BAGS
                </span>
              </Link>
            </div>

            {/* Środek - Linki nawigacyjne (Desktop) */}
            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground">
              <Link
                href="/#hero"
                className="hover:text-accent transition-colors py-2 relative"
              >
                Strona główna
              </Link>
              <Link
                href="/#kolekcje"
                className="hover:text-accent transition-colors py-2"
              >
                Kolekcje
              </Link>

              {/* Rozwijane menu Shop */}
              <div
                className="relative py-2"
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                onMouseLeave={() => setIsShopDropdownOpen(false)}
              >
                <Link
                  href="/shop"
                  className="flex items-center gap-1 hover:text-accent transition-colors focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isShopDropdownOpen}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isShopDropdownOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </Link>

                {isShopDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 p-3 bg-card shadow-xl rounded-2xl border border-border grid gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50 text-card-foreground">
                    <Link
                      href="/shop"
                      className="px-3 py-2 mb-1 pb-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-accent hover:bg-secondary transition-colors border-b border-border"
                    >
                      Wszystkie produkty
                    </Link>
                    <Link
                      href="/shop?kategoria=kubelkowe"
                      className="px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                    >
                      Torebki kubełkowe (12)
                    </Link>
                    <Link
                      href="/shop?kategoria=z-klapka"
                      className="px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                    >
                      Torebki z klapką (18)
                    </Link>
                    <Link
                      href="/shop?kategoria=na-ramie"
                      className="px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                    >
                      Torebki na ramię (24)
                    </Link>
                    <Link
                      href="/shop?kategoria=listonoszki"
                      className="px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                    >
                      Listonoszki (16)
                    </Link>
                    <Link
                      href="/shop?kategoria=shoppery-tote"
                      className="px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                    >
                      Shoppery i tote (17)
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/#bestsellery"
                className="hover:text-accent transition-colors py-2"
              >
                Nowości
              </Link>
              <Link
                href="/about-us"
                className="hover:text-accent transition-colors py-2"
              >
                O nas
              </Link>
              <Link
                href="/contact"
                className="hover:text-accent transition-colors py-2"
              >
                Kontakt
              </Link>
            </div>

            {/* Prawa strona - Wyszukiwarka, Konto, Ulubione, Koszyk, Motyw */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Pole wyszukiwania */}
              <div
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs text-muted-foreground cursor-pointer w-48 lg:w-56 transition-all"
              >
                <input
                  type="text"
                  placeholder="Szukaj torebek..."
                  readOnly
                  className="bg-transparent w-full focus:outline-none cursor-pointer text-foreground placeholder:text-muted-foreground text-xs"
                />
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>

              {/* Przycisk lupki na mobile */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
                aria-label="Szukaj"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Konto użytkownika — dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsAccountDropdownOpen(true)}
                onMouseLeave={() => setIsAccountDropdownOpen(false)}
              >
                {zalogowany ? (
                  <>
                    <button
                      onClick={() =>
                        setIsAccountDropdownOpen(!isAccountDropdownOpen)
                      }
                      className="p-2 rounded-full hover:bg-secondary transition-colors relative"
                      aria-label="Moje konto"
                      title="Moje konto"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                        {inicjaly}
                      </div>
                    </button>

                    {isAccountDropdownOpen && (
                      <div className="absolute top-full right-0 w-56 p-3 bg-card shadow-xl rounded-2xl border border-border animate-in fade-in slide-in-from-top-2 duration-200 z-50 text-card-foreground space-y-1">
                        <div className="px-3 pb-2 mb-2 border-b border-border">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {profil?.displayName || "Użytkownik"}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {uzytkownik?.email}
                          </p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                        >
                          <UserCircle className="w-4 h-4 text-accent" />
                          Moje konto
                        </Link>
                        <Link
                          href="/account?zakladka=zamowienia"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                        >
                          <Package className="w-4 h-4 text-accent" />
                          Zamówienia
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary transition-colors border-t border-border mt-1 pt-2"
                          >
                            <Database className="w-4 h-4 text-accent" />
                            Panel admina
                          </Link>
                        )}
                        <button
                          onClick={handleWylogowanie}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Wyloguj się
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
                    aria-label="Zaloguj się"
                    title="Moje konto"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </div>

              {/* Ulubione (Wishlist) */}
              <Link
                href={zalogowany ? "/account?zakladka=wishlist" : "/shop"}
                className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors relative"
                aria-label="Lista życzeń"
                title="Ulubione"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Koszyk */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors relative"
                aria-label="Koszyk"
                title="Koszyk"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Przełącznik trybu ciemnego/jasnego */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Wyszukiwarka i menu mobilne */}
      <SearchBarModal />
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
