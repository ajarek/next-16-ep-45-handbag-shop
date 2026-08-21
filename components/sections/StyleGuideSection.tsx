"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { StyleItem } from "@/lib/types";
import { motion } from "framer-motion";

export function StyleGuideSection({ onSelectStyle }: { onSelectStyle?: (style: string) => void }) {
  const [styles, setStyles] = useState<StyleItem[]>([]);

  useEffect(() => {
    fetch("/data/styles.json")
      .then((res) => res.json())
      .then((data: StyleItem[]) => setStyles(data))
      .catch(() => {});
  }, []);

  return (
    <section id="style" className="py-20 bg-surface text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
              PRZEWODNIK STYLU
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
              Wybierz według stylu
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            Znajdź torebkę idealnie dopasowaną do Twojego rytmu dnia, garderoby i unikalnej osobowości.
          </p>
        </div>

        {/* Karty stylów */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {styles.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => {
                if (onSelectStyle) onSelectStyle(item.title);
                const el = document.getElementById("bestsellery");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group cursor-pointer relative h-80 rounded-2xl overflow-hidden shadow-md border border-border flex flex-col justify-end p-5"
            >
              {/* Zdjęcie tła */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
              />

              {/* Gradient przyciemniający */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

              {/* Zawartość karty */}
              <div className="relative z-10 space-y-1 text-white">
                <span className="text-[10px] font-semibold tracking-widest text-[#E5C9A5] uppercase">
                  {item.tag}
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg sm:text-xl font-medium tracking-wide">
                    {item.title}
                  </h3>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#E5C9A5] group-hover:text-stone-900 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-stone-300 line-clamp-1 font-light">
                  {item.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
