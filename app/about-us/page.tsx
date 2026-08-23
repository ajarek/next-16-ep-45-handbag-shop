"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Sparkles,
  Heart,
  Leaf,
  ShieldCheck,
  Scissors,
  Gem,
  Eye,
  Check,
  ArrowRight,
  Quote,
  Globe,
  Users,
  Award,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { motion } from "framer-motion";

/* ─────────────────────────── dane sekcji ─────────────────────────── */

const wartosci = [
  {
    icon: Gem,
    tytul: "Autentyczność",
    opis:
      "Każda torebka ma swoją historię. Projektujemy modele, które nie podążają za trendami — wyznaczają je. Ponadczasowa forma, która z biegiem lat zyskuje szlachetność.",
  },
  {
    icon: Scissors,
    tytul: "Rzemiosło",
    opis:
      "Nasi kaletnicy to mistrzowie z wieloletnim doświadczeniem. Każda torebka powstaje ręcznie — od pierwszego szwu po wykończenie krawędzi — z dbałością o każdy szczegół.",
  },
  {
    icon: Leaf,
    tytul: "Zrównoważony rozwój",
    opis:
      "Używamy wyłącznie certyfikowanej, garbowanej roślinnie włoskiej skóry. Minimalizujemy odpady, wybieramy lokalnych dostawców i kompensujemy ślad węglowy.",
  },
  {
    icon: Heart,
    tytul: "Pasja",
    opis:
      "Za każdą kolekcją stoi zespół ludzi, którzy kochają to, co robią. Projektowanie torebek to dla nas nie praca — to sztuka tworzenia przedmiotów, które towarzyszą w ważnych chwilach.",
  },
];

const proces = [
  {
    krok: "01",
    tytul: "Inspiracja i projekt",
    opis:
      "Każda kolekcja zaczyna się od moodboardu — zbieramy inspiracje z architektury, sztuki i natury. Następnie powstają szkice, a potem precyzyjne rysunki techniczne.",
    ikona: Eye,
  },
  {
    krok: "02",
    tytul: "Dobór skóry",
    opis:
      "Współpracujemy z renomowanymi toskańskimi garbarniami. Każda partia skóry jest starannie selekcjonowana pod kątem faktury, grubości i koloru.",
    ikona: Gem,
  },
  {
    krok: "03",
    tytul: "Ręczne szycie",
    opis:
      "Doświadczeni kaletnicy składają torebkę z ponad 50 indywidualnych elementów. Każdy szew jest podwójny, a krawędzie wielokrotnie szlifowane i malowane ręcznie.",
    ikona: Scissors,
  },
  {
    krok: "04",
    tytul: "Kontrola jakości",
    opis:
      "Przed opuszczeniem pracowni każda torebka przechodzi rygorystyczną kontrolę — sprawdzamy szwy, okucia, wykończenie skóry i ogólną harmonię formy.",
    ikona: ShieldCheck,
  },
];

const liczby = [
  { wartosc: "2018", label: "Rok założenia" },
  { wartosc: "8 500+", label: "Zadowolonych klientek" },
  {wartosc: "12", label: "Rzemieślników w zespole" },
  { wartosc: "100%", label: "Włoska skóra licowa" },
  { wartosc: "40h", label: "Pracy nad każdą torebką" },
  { wartosc: "0", label: "Torebek z materiałów syntetycznych" },
];

/* ─────────────────────────── strona ─────────────────────────── */

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow">
        {/* ── Nagłówek z okruszkową nawigacją ── */}
        <section className="border-b border-border bg-surface transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-4">
            <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <Link href="/" className="hover:text-accent transition-colors">
                Strona główna
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-accent font-semibold">O nas</span>
            </nav>

            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NASZA HISTORIA</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
                Tworzymy z pasją <br className="hidden sm:inline" />
                <span className="italic font-normal text-accent">od 2018 roku</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                LUXÉ BAGS to polska marka torebek tworzonych w duchu cichego luksusu.
                Poznaj naszą filozofię, ludzi i proces, który sprawia, że każda torebka
                jest wyjątkowa.
              </p>
            </div>
          </div>
        </section>

        {/* ── Sekcja: Nasza historia ── */}
        <section className="py-20 lg:py-28 bg-background text-foreground transition-colors duration-300 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Lewa kolumna — zdjęcie */}
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
                    alt="Pracownia LUXÉ BAGS — ręczne tworzenie torebek"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                {/* Pływający panel z informacją */}
                <div className="absolute -bottom-6 -right-4 sm:right-6 p-5 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl max-w-xs space-y-1 text-card-foreground">
                  <div className="flex items-center gap-2 text-accent">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Warszawa & Toskania
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-medium">
                    Projektujemy w Warszawie, szyjemy z najlepszych włoskich skór
                    w naszej pracowni na Mokotowie.
                  </p>
                </div>
              </motion.div>

              {/* Prawa kolumna — tekst */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-6 space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                  <Heart className="w-3.5 h-3.5" />
                  <span>ODKRYJ NASZ ŚWIAT</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight tracking-tight">
                  Początek drogi ku{" "}
                  <span className="italic font-normal text-accent">
                    cichemu luksusowi
                  </span>
                </h2>

                <div className="space-y-4 text-muted-foreground text-sm sm:text-base font-light leading-relaxed">
                  <p>
                    W 2018 roku dwie przyjaciółki — Ania i Kasia — postanowiły stworzyć
                    markę torebek, która będzie stanowić alternatywę dla masowej mody.
                    Chciały udowodnić, że prawdziwa elegancja nie potrzebuje głośnych
                    logotypów — wystarczy doskonała forma i materiały najwyższej jakości.
                  </p>
                  <p>
                    Pierwsza kolekcja liczyła zaledwie pięć modeli. Każda torebka była
                    szyta ręcznie w warszawskiej pracowni, z włoskiej skóry sprowadzanej
                    z rodzinnej garbarni w okolicach Florencji. Klientki pokochały te
                    modele za ich ponadczasowość i niezwykłą dbałość o detale.
                  </p>
                  <p>
                    Dziś LUXÉ BAGS to zespół dwunastu doświadczonych rzemieślników,
                    którzy łączą tradycyjne techniki kaletnicze z nowoczesnym
                    minimalistycznym wzornictwem. Wciąż wierzymy w to samo — że
                    piękno kryje się w prostocie i doskonałości wykonania.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Sekcja: Nasze wartości ── */}
        <section className="py-20 bg-surface text-foreground transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                <Star className="w-3.5 h-3.5" />
                <span>CO NAS WYRÓŻNIA</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
                Nasze wartości
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                Cztery filary, na których opieramy każdą kolekcję i każdą decyzję
                biznesową.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {wartosci.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    key={val.tytul}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group p-6 sm:p-8 rounded-3xl bg-card text-card-foreground border border-border shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 text-center space-y-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-secondary text-accent flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border border-border/50">
                      <Icon className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
                      {val.tytul}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                      {val.opis}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Sekcja: Proces tworzenia ── */}
        <section className="py-20 lg:py-28 bg-background text-foreground transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                <Scissors className="w-3.5 h-3.5" />
                <span>OD PROJEKTU PO GOTOWY PRODUKT</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
                Jak powstaje <span className="italic font-normal text-accent">każda torebka</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                Ponad 40 godzin precyzyjnej pracy ręcznej. Cztery etapy, w których każdy detal jest przemyślany.
              </p>
            </div>

            <div className="relative">
              {/* Linia łącząca kroki (desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                {proces.map((krok, idx) => {
                  const Icon = krok.ikona;
                  return (
                    <motion.div
                      key={krok.krok}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.12 }}
                      className="relative flex flex-col items-center text-center space-y-4 p-6 rounded-3xl bg-card text-card-foreground border border-border shadow-sm hover:shadow-lg transition-shadow"
                    >
                      {/* Numer kroku */}
                      <div className="relative z-10 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-lg font-semibold">
                        {krok.krok}
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-secondary text-accent flex items-center justify-center border border-border/50">
                        <Icon className="w-5 h-5 stroke-[1.5]" />
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground">
                        {krok.tytul}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                        {krok.opis}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Sekcja: W liczbach ── */}
        <section className="py-20 bg-surface text-foreground transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                <Award className="w-3.5 h-3.5" />
                <span>LICZBY MÓWIĄ SAME ZA SIEBIE</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
                LUXÉ BAGS w pigułce
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
              {liczby.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="flex flex-col items-center text-center p-5 rounded-2xl bg-card border border-border shadow-sm"
                >
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-accent">
                    {item.wartosc}
                  </span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground mt-1 font-light">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sekcja: Cytat założycielki ── */}
        <section className="py-20 lg:py-28 bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
          {/* Ozdobne elementy tła */}
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              <Quote className="w-12 h-12 text-accent/30 mx-auto" />

              <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground leading-relaxed tracking-tight italic">
                &ldquo;Chciałyśmy stworzyć torebki, które nie krzyczą luksusem, lecz
                go emanują. Modele, które z każdym noszeniem stają się bardziej
                osobiste — bo prawdziwa elegancja to ta, która nie potrzebuje słów.&rdquo;
              </blockquote>

              <div className="space-y-1 pt-4">
                <p className="font-serif text-base sm:text-lg font-semibold text-foreground">
                  Anna Kowalska
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground font-light">
                  Współzałożycielka &amp; Dyrektor Kreatywna LUXÉ BAGS
                </p>
              </div>

              <div className="flex items-center justify-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Sekcja: Nasz zespół (preview) ── */}
        <section className="py-20 bg-surface text-foreground transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Lewa kolumna — tekst */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                  <Users className="w-3.5 h-3.5" />
                  <span>LUDZIE ZA MARKĄ</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight tracking-tight">
                  Zespół, który{" "}
                  <span className="italic font-normal text-accent">kocha to, co robi</span>
                </h2>

                <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed">
                  Dwunastu doświadczonych rzemieślników, projektantów i pasjonatów
                  mody. Łączy nas jedno — wiara, że piękno kryje się w szczegółach.
                  Każdy z nas wnosi unikalne umiejętności, tworząc harmonijną całość.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    "Kaletnicy z 10-letnim doświadczeniem w branży luxury",
                    "Projektantka z dyplomem Central Saint Martins w Londynie",
                    "Specjalistka od skóry z certyfikatem włoskiego consortia",
                    "Zespół ds. zrównoważonego rozwoju i etycznego zaopatrzenia",
                  ].map((punkt, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-secondary text-accent flex items-center justify-center shrink-0 mt-0.5 border border-border/50">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground font-light">
                        {punkt}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Prawa kolumna — siatka zdjęć / kart zespołu */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { title: "Pracownia", desc: "Mokotów, Warszawa" },
                  { title: "Garbarnia", desc: "Florencja, Toskania" },
                  { title: "Projektowanie", desc: "Studio LUXÉ" },
                  { title: "Kontrola jakości", desc: "Każdy szczegół" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between ${
                      idx === 0 ? "row-span-2 aspect-square" : "aspect-[4/3]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary text-accent flex items-center justify-center border border-border/50">
                      <Gem className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Sekcja: CTA — Odkryj kolekcję ── */}
        <section className="py-20 bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-accent/5 via-transparent to-accent/5 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ODKRYJ KOLEKCJĘ</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
                Gotowa na{" "}
                <span className="italic font-normal text-accent">swój moment</span>?
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
                Przeglądaj naszą kolekcję torebek szytych ręcznie z certyfikowanych
                włoskich skór. Znajdź model, który będzie towarzyszył Ci w ważnych
                chwilach.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-200 shadow-lg hover:shadow-xl hover:opacity-90 flex items-center justify-center gap-2 group"
              >
                <span>PRZEGLĄDAJ SKLEP</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/#kontakt"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent hover:bg-secondary border border-border text-foreground font-semibold text-xs tracking-[0.2em] uppercase transition-colors flex items-center justify-center"
              >
                SKONTAKTUJ SIĘ Z NAMI
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Newsletter ── */}
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
