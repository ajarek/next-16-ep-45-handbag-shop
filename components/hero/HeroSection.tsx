"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { HeroShader } from "@/components/webgl/HeroShader";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden py-12 lg:py-20 bg-background text-foreground transition-colors duration-300">
      {/* WebGL Shader z gradientem, siatką i interaktywnym spotlightem */}
      <HeroShader />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Lewa kolumna: Hasło, opis, przyciski CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NOWA KOLEKCJA</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] text-foreground leading-[1.12] tracking-tight">
              Torebki, które <br className="hidden sm:inline" />
              podkreślają <span className="italic font-normal text-accent">Twój styl</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Odkryj wyjątkowe modele na każdą okazję. Ponadczasowa elegancja, szlachetna włoska skóra i nowoczesny minimalistyczny design.
            </p>

            {/* Przyciski CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#kolekcje"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-200 shadow-lg hover:shadow-xl hover:opacity-90 flex items-center justify-center gap-2 group"
              >
                <span>ZOBACZ KOLEKCJĘ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#bestsellery"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent hover:bg-secondary border border-border text-foreground font-semibold text-xs tracking-[0.2em] uppercase transition-colors flex items-center justify-center"
              >
                BESTSELLERY
              </a>
            </div>

            {/* Subtelne wskaźniki zaufania */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">4.95 / 5</span>
              </div>
              <span>•</span>
              <span>Ponad 2 500 zadowolonych klientek</span>
            </div>
          </motion.div>

          {/* Prawa kolumna: Duże editorialowe zdjęcie torebki na kamieniu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            {/* Ozdobna ramka z poświatą */}
            <div className="relative w-full max-w-xl aspect-16/11 rounded-3xl overflow-hidden shadow-2xl border border-border bg-secondary group">
              <Image
                src="/images/hero-handbag.jpg"
                alt="Luksusowa torebka ze skóry Aurelia na kamiennym podeście"
                fill
                priority
                className="object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="eager"
              />

              {/* Subtelna nakładka gradientowa */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Pływająca karta opinii / detalu produktu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl text-xs text-card-foreground"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">Aurelia Top-Handle</span>
                </div>
                <p className="text-muted-foreground line-clamp-2">
                  „Niezwykle dopracowane detale, torebka zachwyca na żywo każdego dnia.”
                </p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-accent font-medium">
                  <span>100% Włoska skóra licowa</span>
                  <span>Zobacz model →</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
