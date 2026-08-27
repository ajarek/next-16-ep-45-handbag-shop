"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Truck,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Landmark,
  CheckCircle2,
  MapPin,
  Package,
  Clock,
  Lock,
  ArrowRight,
} from "lucide-react"
import { Navbar } from "@/components/navbar/Navbar"
import { Footer } from "@/components/footer/Footer"
import { useShop } from "@/context/ShopContext"
import { useAuth } from "@/context/AuthContext"
import { formatPrice } from "@/lib/utils"
import {
  shippingSchema,
  blikCodeSchema,
  type PaymentMethod,
} from "@/lib/validation/checkout"
import {
  zapiszZamowienie,
  type ZamowienieFirestore,
} from "@/lib/firebase/services"
import { motion, AnimatePresence } from "framer-motion"
import { CheckoutAuthModal } from "@/components/checkout/CheckoutAuthModal"

/* ─────────── stałe ─────────── */

const FREE_SHIPPING_THRESHOLD = 299
const SHIPPING_COST = 19

const metodyPlatnosci: {
  id: PaymentMethod
  nazwa: string
  opis: string
  ikona: React.ComponentType<{ className?: string }>
}[] = [
  {
    id: "blik",
    nazwa: "BLIK",
    opis: "Szybka płatność mobilna",
    ikona: Smartphone,
  },
  {
    id: "karta",
    nazwa: "Karta płatnicza",
    opis: "Visa / Mastercard",
    ikona: CreditCard,
  },
  {
    id: "payu",
    nazwa: "PayU",
    opis: "Przelew online / raty",
    ikona: Landmark,
  },
  {
    id: "apple_pay",
    nazwa: "Apple Pay",
    opis: "Płatność zbliżeniowa",
    ikona: Smartphone,
  },
]

const etapy = ["Dane dostawy", "Płatność", "Podsumowanie"]

/* ─────────── strona ─────────── */

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, showToast } = useShop()
  const { uzytkownik } = useAuth()

  const [etap, setEtap] = useState(0)
  const [ładuje, setŁaduje] = useState(false)
  const [pokazModalLogowania, setPokazModalLogowania] = useState(false)

  // Dane formularza
  const [daneDostawy, setDaneDostawy] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    telefon: "",
    ulica: "",
    kodPocztowy: "",
    miasto: "",
    uwagi: "",
  })
  const [błędyDostawy, setBłędyDostawy] = useState<Record<string, string>>({})

  const [metodaPlatnosci, setMetodaPlatnosci] = useState<PaymentMethod | "">("")
  const [kodBlik, setKodBlik] = useState("")
  const [błądBlik, setBłądBlik] = useState("")

  // Obliczenia
  const darmowaDostawa = cartTotal >= FREE_SHIPPING_THRESHOLD
  const kosztDostawy = darmowaDostawa ? 0 : SHIPPING_COST
  const suma = cartTotal + kosztDostawy
  const liczbaSztuk = cart.reduce((acc, i) => acc + i.quantity, 0)

  // Podpis z formularza (do podsumowania)
  const pelnyAdres = useMemo(() => {
    if (!daneDostawy.ulica) return ""
    return `${daneDostawy.ulica}, ${daneDostawy.kodPocztowy} ${daneDostawy.miasto}`
  }, [daneDostawy])

  /* ─── Nawigacja między etapami ─── */

  const walidujDaneDostawy = (): boolean => {
    const wynik = shippingSchema.safeParse(daneDostawy)
    if (!wynik.success) {
      const noweBłędy: Record<string, string> = {}
      wynik.error.issues.forEach((issue) => {
        const pole = issue.path[0] as string
        noweBłędy[pole] = issue.message
      })
      setBłędyDostawy(noweBłędy)
      return false
    }
    setBłędyDostawy({})
    return true
  }

  const dalej = () => {
    if (etap === 0 && !walidujDaneDostawy()) return
    if (etap === 1 && !metodaPlatnosci) {
      showToast("Wybierz metodę płatności", "info")
      return
    }
    if (etap === 1 && metodaPlatnosci === "blik") {
      const wynik = blikCodeSchema.safeParse({ kod: kodBlik })
      if (!wynik.success) {
        setBłądBlik(
          wynik.error.issues[0]?.message || "Wprowadź 6-cyfrowy kod BLIK",
        )
        return
      }
      setBłądBlik("")
    }
    if (etap < 2) setEtap(etap + 1)
  }

  const wstecz = () => {
    if (etap > 0) setEtap(etap - 1)
  }

  const wykonajZamowienie = async () => {
    setŁaduje(true)

    try {
      // Generuj numer zamówienia
      const data = new Date()
      const rok = data.getFullYear()
      const miesiac = String(data.getMonth() + 1).padStart(2, "0")
      const dzien = String(data.getDate()).padStart(2, "0")
      const randomPart = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()
      const numerZamowienia = `LUX-${rok}${miesiac}${dzien}-${randomPart}`

      // Przygotuj dane zamówienia
      const zamowienieDane: ZamowienieFirestore = {
        id: "",
        uzytkownikId: uzytkownik?.uid || "",
        produkty: cart.map((item) => ({
          produktId: item.product.id,
          nazwa: item.product.name,
          kolor: item.selectedColor.name,
          ilosc: item.quantity,
          cena: item.product.price,
          obrazek: item.product.images[0],
        })),
        dostawa: {
          imie: daneDostawy.imie,
          nazwisko: daneDostawy.nazwisko,
          email: daneDostawy.email,
          telefon: daneDostawy.telefon,
          ulica: daneDostawy.ulica,
          kodPocztowy: daneDostawy.kodPocztowy,
          miasto: daneDostawy.miasto,
          uwagi: daneDostawy.uwagi || "",
        },
        metodaPlatnosci: metodaPlatnosci as string,
        wartoscProduktow: cartTotal,
        kosztDostawy: kosztDostawy,
        razem: suma,
        status: "oczekujące",
        numerZamowienia,
        dataZlozenia: new Date().toISOString(),
      }

      // Zapisz do Firestore
      await zapiszZamowienie(zamowienieDane)

      // Wyczyść koszyk
      clearCart()

      // Przekieruj do potwierdzenia z numerem zamówienia
      router.push(`/checkout/potwierdzenie?nr=${numerZamowienia}`)
    } catch (error) {
      console.error("Błąd zapisywania zamówienia:", error)
      showToast(
        "Wystąpił błąd podczas zapisywania zamówienia. Spróbuj ponownie.",
        "info",
      )
      setŁaduje(false)
    }
  }

  const zatwierdz = () => {
    if (!uzytkownik) {
      setPokazModalLogowania(true)
      return
    }
    wykonajZamowienie()
  }

  /* ─── Pusty koszyk → przekierowanie ─── */

  if (cart.length === 0 && !ładuje) {
    return (
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <main className='grow flex items-center justify-center'>
          <div className='text-center space-y-6 py-20'>
            <div className='w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground'>
              <Package className='w-10 h-10 opacity-50' />
            </div>
            <h1 className='font-serif text-2xl sm:text-3xl text-foreground'>
              Twój koszyk jest pusty
            </h1>
            <p className='text-sm text-muted-foreground max-w-sm mx-auto'>
              Dodaj produkty do koszyka, aby przejść do realizacji zamówienia.
            </p>
            <Link
              href='/shop'
              className='inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity'
            >
              Przejdź do sklepu
              <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />

      <main className='grow'>
        {/* ── Nagłówek ── */}
        <section className='border-b border-border bg-surface transition-colors duration-300'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-4'>
            <nav className='flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground'>
              <Link href='/' className='hover:text-accent transition-colors'>
                Strona główna
              </Link>
              <ChevronRight className='w-3 h-3' />
              <Link
                href='/shop'
                className='hover:text-accent transition-colors'
              >
                Sklep
              </Link>
              <ChevronRight className='w-3 h-3' />
              <span className='text-accent font-semibold'>
                Realizacja zamówienia
              </span>
            </nav>

            <h1 className='font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-tight'>
              Realizacja{" "}
              <span className='italic font-normal text-accent'>zamówienia</span>
            </h1>
          </div>
        </section>

        {/* ── Pasek postępu ── */}
        <section className='border-b border-border bg-background transition-colors duration-300'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5'>
            <div className='flex items-center justify-between max-w-xl mx-auto'>
              {etapy.map((etykieta, idx) => (
                <React.Fragment key={etykieta}>
                  <div className='flex items-center gap-2.5'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        idx < etap
                          ? "bg-accent text-accent-foreground"
                          : idx === etap
                            ? "bg-primary text-primary-foreground ring-4 ring-accent/20"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {idx < etap ? (
                        <CheckCircle2 className='w-4 h-4' />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block transition-colors ${
                        idx <= etap
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {etykieta}
                    </span>
                  </div>
                  {idx < etapy.length - 1 && (
                    <div className='flex-1 mx-3 h-px bg-border relative'>
                      <div
                        className='absolute inset-y-0 left-0 bg-accent transition-all duration-500'
                        style={{ width: idx < etap ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ── Główna zawartość: formularz + podsumowanie ── */}
        <section className='py-8 sm:py-12 lg:py-16 bg-background text-foreground transition-colors duration-300'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>
              {/* Lewa kolumna — formularz */}
              <div className='lg:col-span-7'>
                <AnimatePresence mode='wait'>
                  {/* ── Etap 1: Dane dostawy ── */}
                  {etap === 0 && (
                    <motion.div
                      key='dostawa'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className='space-y-6'
                    >
                      <div className='space-y-1'>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50'>
                          <MapPin className='w-3.5 h-3.5' />
                          <span>ETAP 1 Z 3</span>
                        </div>
                        <h2 className='font-serif text-xl sm:text-2xl text-foreground tracking-tight'>
                          Dane dostawy
                        </h2>
                        <p className='text-xs text-muted-foreground font-light'>
                          Podaj adres, pod który wyślemy Twoje zamówienie.
                        </p>
                      </div>

                      <div className='p-6 rounded-2xl bg-card border border-border space-y-5'>
                        {/* Imię i Nazwisko */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          <PoleFormularza
                            etykieta='Imię'
                            id='imie'
                            placeholder='Anna'
                            wartosc={daneDostawy.imie}
                            onChange={(v) =>
                              setDaneDostawy({ ...daneDostawy, imie: v })
                            }
                            blad={błędyDostawy.imie}
                          />
                          <PoleFormularza
                            etykieta='Nazwisko'
                            id='nazwisko'
                            placeholder='Kowalska'
                            wartosc={daneDostawy.nazwisko}
                            onChange={(v) =>
                              setDaneDostawy({ ...daneDostawy, nazwisko: v })
                            }
                            blad={błędyDostawy.nazwisko}
                          />
                        </div>

                        {/* E-mail i Telefon */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          <PoleFormularza
                            etykieta='E-mail'
                            id='email'
                            type='email'
                            placeholder='anna@przykład.pl'
                            wartosc={daneDostawy.email}
                            onChange={(v) =>
                              setDaneDostawy({ ...daneDostawy, email: v })
                            }
                            blad={błędyDostawy.email}
                          />
                          <PoleFormularza
                            etykieta='Telefon'
                            id='telefon'
                            type='tel'
                            placeholder='+48 123 456 789'
                            wartosc={daneDostawy.telefon}
                            onChange={(v) =>
                              setDaneDostawy({ ...daneDostawy, telefon: v })
                            }
                            blad={błędyDostawy.telefon}
                          />
                        </div>

                        {/* Ulica */}
                        <PoleFormularza
                          etykieta='Ulica z numerem'
                          id='ulica'
                          placeholder='ul. Wielkopolska 2 / 2'
                          wartosc={daneDostawy.ulica}
                          onChange={(v) =>
                            setDaneDostawy({ ...daneDostawy, ulica: v })
                          }
                          blad={błędyDostawy.ulica}
                        />

                        {/* Kod pocztowy i Miasto */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          <PoleFormularza
                            etykieta='Kod pocztowy'
                            id='kodPocztowy'
                            placeholder='00-542'
                            wartosc={daneDostawy.kodPocztowy}
                            onChange={(v) =>
                              setDaneDostawy({ ...daneDostawy, kodPocztowy: v })
                            }
                            blad={błędyDostawy.kodPocztowy}
                          />
                          <PoleFormularza
                            etykieta='Miasto'
                            id='miasto'
                            placeholder='Warszawa'
                            wartosc={daneDostawy.miasto}
                            onChange={(v) =>
                              setDaneDostawy({ ...daneDostawy, miasto: v })
                            }
                            blad={błędyDostawy.miasto}
                          />
                        </div>

                        {/* Uwagi */}
                        <div className='space-y-1.5'>
                          <label
                            htmlFor='uwagi'
                            className='text-xs font-semibold text-foreground uppercase tracking-wider'
                          >
                            Uwagi do zamówienia{" "}
                            <span className='text-muted-foreground font-normal'>
                              (opcjonalnie)
                            </span>
                          </label>
                          <textarea
                            id='uwagi'
                            rows={3}
                            value={daneDostawy.uwagi}
                            onChange={(e) =>
                              setDaneDostawy({
                                ...daneDostawy,
                                uwagi: e.target.value,
                              })
                            }
                            placeholder='Np. kod do domofonu, preferowane godziny dostawy...'
                            className='w-full px-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow'
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Etap 2: Płatność ── */}
                  {etap === 1 && (
                    <motion.div
                      key='platnosc'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className='space-y-6'
                    >
                      <div className='space-y-1'>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50'>
                          <CreditCard className='w-3.5 h-3.5' />
                          <span>ETAP 2 Z 3</span>
                        </div>
                        <h2 className='font-serif text-xl sm:text-2xl text-foreground tracking-tight'>
                          Metoda płatności
                        </h2>
                        <p className='text-xs text-muted-foreground font-light'>
                          Wybierz wygodny sposób zapłaty za zamówienie.
                        </p>
                      </div>

                      <div className='space-y-3'>
                        {metodyPlatnosci.map((metoda) => {
                          const Icon = metoda.ikona
                          const wybrana = metodaPlatnosci === metoda.id
                          return (
                            <button
                              key={metoda.id}
                              onClick={() => setMetodaPlatnosci(metoda.id)}
                              className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-200 ${
                                wybrana
                                  ? "bg-card border-accent shadow-lg ring-2 ring-accent/20"
                                  : "bg-card border-border hover:border-accent/40 hover:shadow-md"
                              }`}
                            >
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  wybrana
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-secondary text-muted-foreground"
                                }`}
                              >
                                <Icon className='w-5 h-5' />
                              </div>
                              <div className='flex-1'>
                                <h4 className='font-serif text-sm sm:text-base font-semibold text-foreground'>
                                  {metoda.nazwa}
                                </h4>
                                <p className='text-xs text-muted-foreground'>
                                  {metoda.opis}
                                </p>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  wybrana
                                    ? "border-accent bg-accent"
                                    : "border-border"
                                }`}
                              >
                                {wybrana && (
                                  <div className='w-2 h-2 rounded-full bg-white' />
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Kod BLIK */}
                      <AnimatePresence>
                        {metodaPlatnosci === "blik" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className='overflow-hidden'
                          >
                            <div className='p-5 rounded-2xl bg-card border border-border space-y-3'>
                              <div className='flex items-center gap-2 text-accent'>
                                <Smartphone className='w-4 h-4' />
                                <span className='text-xs font-semibold uppercase tracking-wider'>
                                  Wprowadź kod BLIK
                                </span>
                              </div>
                              <input
                                type='text'
                                inputMode='numeric'
                                maxLength={6}
                                value={kodBlik}
                                onChange={(e) => {
                                  setKodBlik(e.target.value.replace(/\D/g, ""))
                                  setBłądBlik("")
                                }}
                                placeholder='000000'
                                className='w-full px-4 py-3.5 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border border-border text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-ring transition-shadow'
                              />
                              {błądBlik && (
                                <p className='text-xs text-rose-600 dark:text-rose-400 font-medium'>
                                  {błądBlik}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Bezpieczeństwo */}
                      <div className='flex items-center gap-3 p-4 rounded-xl bg-secondary border border-border/50'>
                        <Lock className='w-4 h-4 text-accent shrink-0' />
                        <p className='text-[11px] text-muted-foreground font-light'>
                          Wszystkie płatności są szyfrowane protokołem SSL. Nie
                          przechowujemy danych kart płatniczych.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Etap 3: Podsumowanie ── */}
                  {etap === 2 && (
                    <motion.div
                      key='podsumowanie'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className='space-y-6'
                    >
                      <div className='space-y-1'>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50'>
                          <CheckCircle2 className='w-3.5 h-3.5' />
                          <span>ETAP 3 Z 3</span>
                        </div>
                        <h2 className='font-serif text-xl sm:text-2xl text-foreground tracking-tight'>
                          Podsumowanie zamówienia
                        </h2>
                        <p className='text-xs text-muted-foreground font-light'>
                          Sprawdź dane przed potwierdzeniem płatności.
                        </p>
                      </div>

                      {/* Dane dostawy */}
                      <div className='p-5 rounded-2xl bg-card border border-border space-y-3'>
                        <div className='flex items-center justify-between'>
                          <h3 className='font-serif text-sm font-semibold text-foreground flex items-center gap-2'>
                            <MapPin className='w-4 h-4 text-accent' />
                            Dane dostawy
                          </h3>
                          <button
                            onClick={() => setEtap(0)}
                            className='text-xs text-accent hover:underline'
                          >
                            Edytuj
                          </button>
                        </div>
                        <div className='text-xs text-muted-foreground space-y-0.5'>
                          <p className='text-foreground font-medium'>
                            {daneDostawy.imie} {daneDostawy.nazwisko}
                          </p>
                          <p>{pelnyAdres}</p>
                          <p>
                            {daneDostawy.email} · {daneDostawy.telefon}
                          </p>
                          {daneDostawy.uwagi && (
                            <p className='italic pt-1'>
                              Uwagi: {daneDostawy.uwagi}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Metoda płatności */}
                      <div className='p-5 rounded-2xl bg-card border border-border space-y-3'>
                        <div className='flex items-center justify-between'>
                          <h3 className='font-serif text-sm font-semibold text-foreground flex items-center gap-2'>
                            <CreditCard className='w-4 h-4 text-accent' />
                            Metoda płatności
                          </h3>
                          <button
                            onClick={() => setEtap(1)}
                            className='text-xs text-accent hover:underline'
                          >
                            Edytuj
                          </button>
                        </div>
                        <p className='text-xs text-foreground font-medium'>
                          {
                            metodyPlatnosci.find(
                              (m) => m.id === metodaPlatnosci,
                            )?.nazwa
                          }
                          {metodaPlatnosci === "blik" && kodBlik && (
                            <span className='text-muted-foreground font-normal ml-2'>
                              · Kod: {kodBlik.slice(0, 3)}***
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Produkty */}
                      <div className='p-5 rounded-2xl bg-card border border-border space-y-4'>
                        <h3 className='font-serif text-sm font-semibold text-foreground flex items-center gap-2'>
                          <Package className='w-4 h-4 text-accent' />
                          Zamówione produkty ({liczbaSztuk})
                        </h3>
                        <div className='space-y-3'>
                          {cart.map((item) => (
                            <div
                              key={`${item.product.id}-${item.selectedColor.name}`}
                              className='flex items-center gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0'
                            >
                              <div className='relative w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0 border border-border'>
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                                  className='object-cover'
                                />
                              </div>
                              <div className='flex-1 min-w-0'>
                                <p className='font-serif text-xs font-medium text-foreground truncate'>
                                  {item.product.name}
                                </p>
                                <p className='text-[11px] text-muted-foreground'>
                                  {item.selectedColor.name} · Qty:{" "}
                                  {item.quantity}
                                </p>
                              </div>
                              <span className='text-xs font-medium text-foreground shrink-0'>
                                {formatPrice(
                                  item.product.price * item.quantity,
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info o koncie */}
                      {uzytkownik && (
                        <div className='p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50'>
                          <p className='text-[11px] text-emerald-700 dark:text-emerald-400 font-medium'>
                            Zamówienie zostanie powiązane z Twoim kontem.
                            Historia zamówień dostępna w sekcji „Moje konto”.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Przyciski nawigacyjne */}
                <div className='flex items-center justify-between mt-8'>
                  {etap > 0 ? (
                    <button
                      onClick={wstecz}
                      className='flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-foreground hover:bg-secondary transition-colors'
                    >
                      <ChevronLeft className='w-4 h-4' />
                      Wstecz
                    </button>
                  ) : (
                    <Link
                      href='/shop'
                      className='flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-foreground hover:bg-secondary transition-colors'
                    >
                      <ChevronLeft className='w-4 h-4' />
                      Wróć do sklepu
                    </Link>
                  )}

                  {etap < 2 ? (
                    <button
                      onClick={dalej}
                      className='flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity shadow-md'
                    >
                      Dalej
                      <ArrowRight className='w-4 h-4' />
                    </button>
                  ) : (
                    <button
                      onClick={zatwierdz}
                      disabled={ładuje}
                      className='flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-accent-foreground text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity shadow-md disabled:opacity-50'
                    >
                      {ładuje ? (
                        <>
                          <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                          Przetwarzanie...
                        </>
                      ) : (
                        <>
                          <Lock className='w-3.5 h-3.5' />
                          Płacę {formatPrice(suma)}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Prawa kolumna — stałe podsumowanie */}
              <div className='lg:col-span-5'>
                <div className='lg:sticky lg:top-28 space-y-5'>
                  {/* Podsumowanie koszyka */}
                  <div className='p-6 rounded-2xl bg-card border border-border space-y-4'>
                    <h3 className='font-serif text-sm font-semibold text-foreground flex items-center gap-2'>
                      <Package className='w-4 h-4 text-accent' />
                      Twoje zamówienie ({liczbaSztuk}{" "}
                      {liczbaSztuk === 1 ? "produkt" : "produkty"})
                    </h3>

                    <div className='space-y-3 max-h-64 overflow-y-auto'>
                      {cart.map((item) => (
                        <div
                          key={`${item.product.id}-${item.selectedColor.name}`}
                          className='flex items-center gap-3'
                        >
                          <div className='relative w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0 border border-border'>
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                              className='object-cover'
                            />
                            <span className='absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center'>
                              {item.quantity}
                            </span>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='text-xs font-medium text-foreground truncate'>
                              {item.product.name}
                            </p>
                            <p className='text-[10px] text-muted-foreground'>
                              {item.selectedColor.name}
                            </p>
                          </div>
                          <span className='text-xs font-medium text-foreground shrink-0'>
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className='border-t border-border pt-3 space-y-2 text-xs text-muted-foreground'>
                      <div className='flex justify-between'>
                        <span>Wartość produktów</span>
                        <span className='text-foreground'>
                          {formatPrice(cartTotal)}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='flex items-center gap-1'>
                          <Truck className='w-3 h-3' />
                          Dostawa kurierska
                        </span>
                        <span className='text-foreground'>
                          {darmowaDostawa ? (
                            <span className='text-emerald-600 dark:text-emerald-400 font-medium'>
                              Darmowa
                            </span>
                          ) : (
                            formatPrice(SHIPPING_COST)
                          )}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm font-semibold text-foreground pt-2 border-t border-border'>
                        <span>Do zapłaty</span>
                        <span>{formatPrice(suma)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Wyróżniki zaufania */}
                  <div className='p-5 rounded-2xl bg-secondary border border-border space-y-3'>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-xl bg-background text-accent flex items-center justify-center border border-border/50 shrink-0'>
                        <Truck className='w-4 h-4' />
                      </div>
                      <div>
                        <p className='text-xs font-semibold text-foreground'>
                          Darmowa dostawa
                        </p>
                        <p className='text-[10px] text-muted-foreground'>
                          Dla zamówień od 299 zł
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-xl bg-background text-accent flex items-center justify-center border border-border/50 shrink-0'>
                        <ShieldCheck className='w-4 h-4' />
                      </div>
                      <div>
                        <p className='text-xs font-semibold text-foreground'>
                          30 dni na zwrot
                        </p>
                        <p className='text-[10px] text-muted-foreground'>
                          Bez podania przyczyny
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-xl bg-background text-accent flex items-center justify-center border border-border/50 shrink-0'>
                        <Clock className='w-4 h-4' />
                      </div>
                      <div>
                        <p className='text-xs font-semibold text-foreground'>
                          Szybka wysyłka
                        </p>
                        <p className='text-[10px] text-muted-foreground'>
                          1–2 dni robocze
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Modal logowania */}
                  <CheckoutAuthModal
                    otwarty={pokazModalLogowania}
                    onClose={() => setPokazModalLogowania(false)}
                    poZalogowaniu={() => {
                      setPokazModalLogowania(false)
                      // Po zalogowaniu automatycznie zatwierdź zamówienie
                      wykonajZamowienie()
                    }}
                  />

                  {/* Logo LUXÉ */}
                  <div className='text-center pt-2'>
                    <div className='inline-flex items-center gap-2 text-accent'>
                      <Sparkles className='w-3.5 h-3.5' />
                      <span className='text-[10px] uppercase tracking-[0.3em] font-semibold'>
                        LUXÉ BAGS · Premium Checkout
                      </span>
                      <Sparkles className='w-3.5 h-3.5' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/* ─────────── Komponent pomocniczy: pole formularza ─────────── */

function PoleFormularza({
  etykieta,
  id,
  type = "text",
  placeholder,
  wartosc,
  onChange,
  blad,
}: {
  etykieta: string
  id: string
  type?: string
  placeholder: string
  wartosc: string
  onChange: (wartosc: string) => void
  blad?: string
}) {
  return (
    <div className='space-y-1.5'>
      <label
        htmlFor={id}
        className='text-xs font-semibold text-foreground uppercase tracking-wider'
      >
        {etykieta}
      </label>
      <input
        id={id}
        type={type}
        value={wartosc}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${
          blad ? "border-rose-500 focus:ring-rose-500/30" : "border-border"
        }`}
      />
      {blad && (
        <p className='text-[11px] text-rose-600 dark:text-rose-400 font-medium'>
          {blad}
        </p>
      )}
    </div>
  )
}
