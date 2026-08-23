"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { useShop } from "@/context/ShopContext";
import { contactMessageSchema } from "@/lib/validation/newsletter";
import { motion, AnimatePresence } from "framer-motion";

/* ───────────── dane kontaktowe ───────────── */

const daneKontaktowe = [
  {
    ikona: Phone,
    tytul: "Telefon",
    wartosc: "+48 573219230",
    opis: "Pn–Pt: 10:00–19:00",
    href: "tel:+48573219230",
  },
  {
    ikona: Mail,
    tytul: "E-mail",
    wartosc: "kontakt@luxebags.pl",
    opis: "Odpowiadamy w ciągu 24h",
    href: "mailto:kontakt@luxebags.pl",
  },
  {
    ikona: MapPin,
    tytul: "Showroom",
    wartosc: "ul. Wielkopolska 2",
    opis: "78-100 Kołobrzeg",
    href: "https://maps.google.com/?q=ul.+Wielkopolska+2+Kołobrzeg",
  },
  {
    ikona: Clock,
    tytul: "Godziny otwarcia",
    wartosc: "Pn–Pt: 10:00–19:00",
    opis: "Sob: 11:00–16:00",
    href: null,
  },
];

/* ───────────── FAQ ───────────── */

const faq = [
  {
    pytanie: "Jak złożyć zamówienie?",
    odpowiedz:
      "Wybrany produkt dodaj do koszyka, przejdź do realizacji zamówienia, podaj dane dostawy i wybierz formę płatności. Cały proces trwa kilka minut.",
  },
  {
    pytanie: "Czy oferujecie darmową dostawę?",
    odpowiedz:
      "Tak — oferujemy bezpłatną dostawę kurierską na terenie całej Polski dla zamówień powyżej 299 zł. Poniżej tej kwoty koszt wysyłki wynosi 15 zł.",
  },
  {
    pytanie: "Jaki jest czas realizacji zamówienia?",
    odpowiedz:
      "Standardowo wysyłamy zamówienia w ciągu 1–2 dni roboczych. Produkty na zamówienie indywidualne mogą wymagać 5–7 dni roboczych.",
  },
  {
    pytanie: "Czy mogę zwrócić torebkę?",
    odpowiedz:
      "Oczywiście. Masz 30 dni na zwrot towaru bez podania przyczyny. Torebka musi być w oryginalnym opakowaniu, bez śladów użytkowania.",
  },
  {
    pytanie: "Jak dbać o skórzaną torebkę?",
    odpowiedz:
      "Unikaj długotrwałego kontaktu z wodą. Stosuj impregnat do skóry licowej co kilka miesięcy. Przechowuj torebkę w dołączonym worku z mikrofibry.",
  },
  {
    pytanie: "Czy mogę odwiedzić showroom?",
    odpowiedz:
      "Tak! Nasz showroom przy ul. Wielkopolskiej 2 w Kołobrzegu jest otwarty od poniedziałku do piątku w godzinach 10:00–19:00 oraz w soboty 11:00–16:00.",
  },
];

/* ───────────── komponent FAQ ───────────── */

function FaqItem({ item, idx }: { item: (typeof faq)[number]; idx: number }) {
  const [otwarte, setOtwarte] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.08 }}
      className="border border-border rounded-2xl bg-card overflow-hidden"
    >
      <button
        onClick={() => setOtwarte((p) => !p)}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left group"
        aria-expanded={otwarte}
      >
        <span className="font-serif text-sm sm:text-base font-semibold text-foreground group-hover:text-accent transition-colors">
          {item.pytanie}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
            otwarte ? "rotate-180 text-accent" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {otwarte && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              {item.odpowiedz}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ───────────── strona ───────────── */

export default function ContactPage() {
  const { showToast } = useShop();

  const [imie, setImie] = useState("");
  const [email, setEmail] = useState("");
  const [wiadomosc, setWiadomosc] = useState("");
  const [błąd, setBłąd] = useState<string | null>(null);
  const [sukces, setSukces] = useState(false);
  const [ładuje, setŁaduje] = useState(false);

  const wyslij = (e: React.FormEvent) => {
    e.preventDefault();
    setBłąd(null);

    const wynik = contactMessageSchema.safeParse({
      name: imie,
      email,
      message: wiadomosc,
    });

    if (!wynik.success) {
      setBłąd(wynik.error.issues[0]?.message || "Wprowadź poprawne dane");
      return;
    }

    setŁaduje(true);
    setTimeout(() => {
      setŁaduje(false);
      setSukces(true);
      showToast("Wiadomość wysłana! Odpowiemy w ciągu 24 godzin.", "success");
    }, 800);
  };

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
              <span className="text-accent font-semibold">Kontakt</span>
            </nav>

            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>JESTEŚMY TU DLA CIEBIE</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
                Skontaktuj się{" "}
                <br className="hidden sm:inline" />
                <span className="italic font-normal text-accent">z nami</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                Masz pytanie dotyczące zamówienia, pielęgnacji skóry lub chcesz
                umówić się na wizytę w showroomie? Jesteśmy do Twojej dyspozycji.
              </p>
            </div>
          </div>
        </section>

        {/* ── Karty danych kontaktowych ── */}
        <section className="py-12 bg-background text-foreground transition-colors duration-300 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {daneKontaktowe.map((dane, idx) => {
                const Icon = dane.ikona;
                const Wrapper = dane.href ? "a" : "div";
                return (
                  <motion.div
                    key={dane.tytul}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <Wrapper
                      {...(dane.href
                        ? { href: dane.href, target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex items-start gap-4 p-5 rounded-2xl bg-card text-card-foreground border border-border shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 h-full"
                    >
                      <div className="w-11 h-11 rounded-xl bg-secondary text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border border-border/50">
                        <Icon className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-sm font-semibold text-foreground">
                          {dane.tytul}
                        </h3>
                        <p className="text-xs sm:text-sm text-foreground font-medium mt-0.5 truncate">
                          {dane.wartosc}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {dane.opis}
                        </p>
                      </div>
                    </Wrapper>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Formularz + mapka (2 kolumny) ── */}
        <section className="py-20 lg:py-28 bg-background text-foreground transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Lewa kolumna — formularz */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 space-y-6"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                    <Send className="w-3.5 h-3.5" />
                    <span>NAPISZ DO NAS</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
                    Wyślij wiadomość
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground font-light">
                    Wypełnij formularz, a nasza konsultantka odpowie w ciągu 24
                    godzin.
                  </p>
                </div>

                {sukces ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-3xl bg-card border border-emerald-500/30 text-center space-y-3 text-card-foreground"
                  >
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-serif text-lg">Wiadomość wysłana!</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe —
                      zazwyczaj w ciągu kilku godzin.
                    </p>
                    <button
                      onClick={() => {
                        setSukces(false);
                        setImie("");
                        setEmail("");
                        setWiadomosc("");
                      }}
                      className="mt-2 px-6 py-2.5 rounded-xl bg-secondary text-foreground text-xs font-semibold tracking-wider uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Wyślij kolejną wiadomość
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={wyslij} className="space-y-5">
                    {/* Imię */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="imie"
                        className="text-xs font-semibold text-foreground uppercase tracking-wider"
                      >
                        Imię i nazwisko
                      </label>
                      <input
                        id="imie"
                        type="text"
                        value={imie}
                        onChange={(e) => setImie(e.target.value)}
                        placeholder="np. Anna Kowalska"
                        className="w-full px-4 py-3.5 rounded-xl bg-card text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      />
                    </div>

                    {/* E-mail */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs font-semibold text-foreground uppercase tracking-wider"
                      >
                        Adres e-mail
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="anna@przykład.pl"
                        className="w-full px-4 py-3.5 rounded-xl bg-card text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      />
                    </div>

                    {/* Wiadomość */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="wiadomosc"
                        className="text-xs font-semibold text-foreground uppercase tracking-wider"
                      >
                        Wiadomość
                      </label>
                      <textarea
                        id="wiadomosc"
                        value={wiadomosc}
                        onChange={(e) => setWiadomosc(e.target.value)}
                        rows={5}
                        placeholder="Twoja wiadomość...np. pytanie o dostępność modelu, pielęgnację skóry, lub wizytę w showroomie."
                        className="w-full px-4 py-3.5 rounded-xl bg-card text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
                      />
                    </div>

                    {błąd && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {błąd}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={ładuje}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:opacity-90 disabled:opacity-50"
                    >
                      <span>{ładuje ? "Wysyłanie..." : "WYŚLIJ WIADOMOŚĆ"}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Prawa kolumna — mapa / showroom */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-5 space-y-6"
              >
                {/* Miniatura mapy */}
                <div className="rounded-3xl overflow-hidden border border-border shadow-lg bg-secondary aspect-4/3 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.6!2d21.02!3d52.22!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDEzJzEyLjAiTiAyMcKwMDEnMTIuMCJF!5e0!3m2!1spl!2spl!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa dojazdu do showroomu LUXÉ BAGS"
                    className="absolute inset-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  />
                  {/* Nakładka z adresem */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary text-accent flex items-center justify-center shrink-0 border border-border/50">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-foreground">
                          LUXÉ BAGS Showroom
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          ul. Wielkopolska 2, 78-100 Kołobrzeg
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          78-100 Kołobrzeg · 5 min piechotą
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informacja o wizycie */}
                <div className="p-6 rounded-2xl bg-secondary border border-border space-y-3">
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Wizyta w showroomie
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                    Odwiedź nas osobiście, aby zobaczyć i dotknąć każdą torebkę z
                    bliska. Nasi konsultanci pomogą dobrać idealny model i kolor.
                    Nie musisz się umawiać — wpadaj śmiało!
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-3 py-1.5 rounded-lg bg-card text-[11px] font-medium text-foreground border border-border">
                      ☕ Kawa na powitanie
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-card text-[11px] font-medium text-foreground border border-border">
                      🎁 Pakowanie na prezent
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-card text-[11px] font-medium text-foreground border border-border">
                      🔧 Drobne naprawy na miejscu
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 bg-surface text-foreground transition-colors duration-300">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>POMOC & FAQ</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
                Często zadawane pytania
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-light">
                Nie znalazłaś odpowiedzi? Napisz do nas — chętnie pomożemy.
              </p>
            </div>

            <div className="space-y-3">
              {faq.map((item, idx) => (
                <FaqItem key={idx} item={item} idx={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ── */}
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
