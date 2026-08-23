"use client";

import React from "react";
import Link from "next/link";
import { useId } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Package,
  Truck,
  Mail,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { motion } from "framer-motion";

/* ─────────── strona ─────────── */

export default function OrderConfirmationPage() {
  const reactId = useId();

  // Generuj unikalny numer zamówienia na podstawie useId (stabilny, bezpieczny dla SSR)
  const numerZamowienia = React.useMemo(() => {
    const data = new Date();
    const rok = data.getFullYear();
    const dzien = String(data.getDate()).padStart(2, "0");
    const miesiac = String(data.getMonth() + 1).padStart(2, "0");
    // useId zwraca unikalny identyfikator — wycinamy cyfry i bierzemy 4 znaki
    const idPart = reactId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
    return `LUX-${rok}${miesiac}${dzien}-${idPart}`;
  }, [reactId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow flex items-center justify-center py-12 sm:py-20">
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Animacja sukcesu */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
            className="relative mx-auto"
          >
            {/* Pierścień zewnętrzny */}
            <div className="w-28 h-28 rounded-full bg-emerald-50 dark:bg-emerald-950/30 mx-auto flex items-center justify-center relative">
              {/* Pierścień animowany */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", damping: 12 }}
                className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", damping: 12 }}
                className="absolute inset-2 rounded-full border border-emerald-400/20"
              />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", damping: 10 }}
              >
                <CheckCircle2 className="w-14 h-14 text-emerald-500 dark:text-emerald-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Tekst potwierdzenia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-[0.25em] font-semibold border border-emerald-200/50 dark:border-emerald-800/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ZAMÓWIENIE PRZYJĘTE</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
              Dziękujemy za zamówienie!
            </h1>

            <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-sm mx-auto">
              Twoje zamówienie zostało przyjęte do realizacji. Wkrótce otrzymasz
              e-mail z potwierdzeniem i numerem przesyłki.
            </p>
          </motion.div>

          {/* Numer zamówienia */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-accent">
              <Package className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Numer zamówienia
              </span>
            </div>

            <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground tracking-wider">
              {numerZamowienia}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-secondary text-accent flex items-center justify-center border border-border/50">
                  <Mail className="w-4 h-4" />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  Potwierdzenie na e-mail
                </p>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-secondary text-accent flex items-center justify-center border border-border/50">
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  Przygotowanie: 1–2 dni
                </p>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-secondary text-accent flex items-center justify-center border border-border/50">
                  <Truck className="w-4 h-4" />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  Dostawa: 1–2 dni robocze
                </p>
              </div>
            </div>
          </motion.div>

          {/* Co dalej */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="p-5 rounded-2xl bg-secondary border border-border space-y-3"
          >
            <h3 className="font-serif text-sm font-semibold text-foreground">
              Co dalej?
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground text-left">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-background text-accent flex items-center justify-center shrink-0 text-[10px] font-bold border border-border/50 mt-0.5">
                  1
                </span>
                <span>
                  Na adres <strong className="text-foreground">{`{Twój e-mail}`}</strong> wyślemy
                  potwierdzenie z numerem śledzenia przesyłki.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-background text-accent flex items-center justify-center shrink-0 text-[10px] font-bold border border-border/50 mt-0.5">
                  2
                </span>
                <span>
                  Kurier dostarczy paczkę pod wskazany adres w ciągu 1–2 dni roboczych.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-background text-accent flex items-center justify-center shrink-0 text-[10px] font-bold border border-border/50 mt-0.5">
                  3
                </span>
                <span>
                  Masz 30 dni na bezpłatny zwrot — bez podania przyczyny.
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Przyciski CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
            >
              Kontynuuj zakupy
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-transparent hover:bg-secondary border border-border text-foreground font-semibold text-xs tracking-[0.15em] uppercase transition-colors flex items-center justify-center"
            >
              Strona główna
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
