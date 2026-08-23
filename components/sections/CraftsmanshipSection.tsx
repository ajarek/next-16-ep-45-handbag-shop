"use client";

import React from "react";
import Image from "next/image";
import { Check, Sparkles, Feather } from "lucide-react";
import { motion } from "framer-motion";

export function CraftsmanshipSection() {
  const highlights = [
    {
      title: "Toskańskie garbarnie z tradycją",
      desc: "Używamy wyłącznie certyfikowanej, garbowanej roślinnie włoskiej skóry licowej o naturalnej strukturze.",
    },
    {
      title: "Ręcznie malowane krawędzie",
      desc: "Każdy brzeg torebki jest wielokrotnie szlifowany i precyzyjnie zabezpieczany przez mistrzów kaletnictwa.",
    },
    {
      title: "Pozłacane okucia jubileryjne",
      desc: "Elementy metalowe pokryte 24-karatową warstwą złota, zabezpieczone przed utlenianiem i zarysowaniami.",
    },
  ];

  return (
    <section id="rzemioslo" className="py-20 lg:py-28 bg-background text-foreground transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Lewa kolumna: Zdjęcia w kompozycji editorialowej */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-border bg-secondary">
              <Image
                src="/images/hero-handbag.jpg"
                alt="Ręczne wykonanie torebki LuxeBag"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="eager"
              />
            </div>

            {/* Pływający detal rzemieślniczy */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 p-5 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl max-w-xs space-y-1 text-card-foreground">
              <div className="flex items-center gap-2 text-accent">
                <Feather className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Czyste Rzemiosło</span>
              </div>
              <p className="text-xs text-foreground font-medium">
                Ponad 40 godzin precyzyjnej pracy ręcznej nad każdym pojedynczym egzemplarzem.
              </p>
            </div>
          </motion.div>

          {/* Prawa kolumna: Tekst i atrybuty jakości */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KUNSZT I JAKOŚĆ</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight tracking-tight">
              Sztuka tworzenia <br />
              <span className="italic font-normal text-accent">ponadczasowego luksusu</span>
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed">
              W LUXÉ BAGS nie wierzymy w chwilowe trendy. Tworzymy torebki, które z każdym rokiem zyskują na szlachetności, stając się nieodłącznym elementem Twojej garderoby. Łączymy rzemieślnicze techniki szycia z nowoczesną, ergonomiczną formą.
            </p>

            {/* Lista wyróżników */}
            <div className="space-y-4 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-secondary text-accent flex items-center justify-center shrink-0 mt-0.5 border border-border/50">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm sm:text-base font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Metryki */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">100%</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Włoska skóra</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">2 lata</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Gwarancji</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">30 dni</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Na bezpłatny zwrot</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
