"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import {
  Package,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Truck,
  Clock,
  CheckCircle2,
  MapPin,
  CreditCard,
  Smartphone,
  Landmark,
  Loader2,
  ArrowUpDown,
  RefreshCw,
  User,
  Mail,
  Phone,
  MessageSquare,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import {
  pobierzWszystkieZamowienia,
  zaktualizujStatusZamowienia,
  usunZamowienie,
  type ZamowienieFirestore,
} from "@/lib/firebase/services"
import { formatPrice } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

/* ─────────── Stałe ─────────── */

type Status = ZamowienieFirestore["status"]

const STATUSY: { id: Status; nazwa: string; kolor: string; bg: string }[] = [
  {
    id: "oczekujące",
    nazwa: "Oczekujące",
    kolor: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50",
  },
  {
    id: "w realizacji",
    nazwa: "W realizacji",
    kolor: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50",
  },
  {
    id: "wysłane",
    nazwa: "Wysłane",
    kolor: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50",
  },
  {
    id: "dostarczone",
    nazwa: "Dostarczone",
    kolor: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50",
  },
]

const IKONY_PLATNOSCI: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  blik: Smartphone,
  karta: CreditCard,
  payu: Landmark,
  apple_pay: Smartphone,
}

/* ─────────── Komponent ─────────── */

export function AdminOrders() {
  const [zamowienia, setZamowienia] = useState<ZamowienieFirestore[]>([])
  const [laduje, setLaduje] = useState(true)
  const [blad, setBlad] = useState("")
  const [szukaj, setSzukaj] = useState("")
  const [filtrStatusu, setFiltrStatusu] = useState<Status | "wszystkie">(
    "wszystkie",
  )
  const [rozwiniete, setRozwiniete] = useState<Set<string>>(new Set())
  const [aktualizujace, setAktualizujace] = useState<Set<string>>(new Set())
  const [usuwajace, setUsuwajace] = useState<string | null>(null)
  const [potwierdzenieUsuniecia, setPotwierdzenieUsuniecia] = useState<ZamowienieFirestore | null>(null)

  const pobierzDane = useCallback(async () => {
    setLaduje(true)
    setBlad("")
    try {
      const dane = await pobierzWszystkieZamowienia()
      setZamowienia(dane)
    } catch {
      setBlad("Nie udało się pobrać zamówień.")
    } finally {
      setLaduje(false)
    }
  }, [])

  useEffect(() => {
    let anulowano = false
    const fetchDane = async () => {
      try {
        const dane = await pobierzWszystkieZamowienia()
        if (!anulowano) setZamowienia(dane)
      } catch {
        if (!anulowano) setBlad("Nie udało się pobrać zamówień.")
      } finally {
        if (!anulowano) setLaduje(false)
      }
    }
    fetchDane()
    return () => {
      anulowano = true
    }
  }, [])

  /* ─── Statystyki ─── */
  const statystyki = useMemo(() => {
    const stats: Record<Status | "razem", number> = {
      oczekujące: 0,
      "w realizacji": 0,
      wysłane: 0,
      dostarczone: 0,
      razem: zamowienia.length,
    }
    for (const z of zamowienia) {
      stats[z.status] = (stats[z.status] || 0) + 1
    }
    return stats
  }, [zamowienia])

  /* ─── Filtrowanie ─── */
  const przefiltrowane = useMemo(() => {
    let wynik = zamowienia

    if (filtrStatusu !== "wszystkie") {
      wynik = wynik.filter((z) => z.status === filtrStatusu)
    }

    if (szukaj.trim()) {
      const q = szukaj.toLowerCase()
      wynik = wynik.filter(
        (z) =>
          z.numerZamowienia.toLowerCase().includes(q) ||
          z.dostawa.imie.toLowerCase().includes(q) ||
          z.dostawa.nazwisko.toLowerCase().includes(q) ||
          z.dostawa.email.toLowerCase().includes(q),
      )
    }

    return wynik
  }, [zamowienia, filtrStatusu, szukaj])

  /* ─── Usuwanie zamówienia ─── */
  const usunijZamowienie = async (zamowienie: ZamowienieFirestore) => {
    setPotwierdzenieUsuniecia(null)
    setUsuwajace(zamowienie.id)
    try {
      await usunZamowienie(zamowienie)
      setZamowienia((prev) => prev.filter((z) => z.id !== zamowienie.id))
    } catch {
      setBlad("Nie udało się usunąć zamówienia.")
    } finally {
      setUsuwajace(null)
    }
  }

  /* ─── Zmiana statusu ─── */
  const zmienStatus = async (zamowienieId: string, nowyStatus: Status) => {
    setAktualizujace((prev) => new Set(prev).add(zamowienieId))
    try {
      await zaktualizujStatusZamowienia(zamowienieId, nowyStatus)
      setZamowienia((prev) =>
        prev.map((z) =>
          z.id === zamowienieId ? { ...z, status: nowyStatus } : z,
        ),
      )
    } catch {
      setBlad("Nie udało się zaktualizować statusu.")
    } finally {
      setAktualizujace((prev) => {
        const next = new Set(prev)
        next.delete(zamowienieId)
        return next
      })
    }
  }

  /* ─── Rozwiń/Zwiń ─── */
  const toggleRozwin = (id: string) => {
    setRozwiniete((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  /* ─── Formatowanie daty ─── */
  const formatujDate = (dataISO: string) => {
    try {
      return new Date(dataISO).toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dataISO
    }
  }

  return (
    <div className='space-y-6'>
      {/* ─── Nagłówek sekcji ─── */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='space-y-1'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50'>
            <Package className='w-3.5 h-3.5' />
            <span>ZAMÓWIENIA</span>
          </div>
          <h2 className='font-serif text-xl sm:text-2xl text-foreground tracking-tight'>
            Zarządzanie zamówieniami
          </h2>
          <p className='text-xs text-muted-foreground font-light'>
            Przeglądaj i aktualizuj statusy zamówień klientów.
          </p>
        </div>

        <button
          onClick={pobierzDane}
          disabled={laduje}
          className='flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-colors disabled:opacity-50'
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${laduje ? "animate-spin" : ""}`}
          />
          Odśwież
        </button>
      </div>

      {/* ─── Karty statystyk ─── */}
      <div className='grid grid-cols-2 sm:grid-cols-5 gap-3'>
        <StatCard
          etykieta='Wszystkie'
          wartosc={statystyki.razem}
          ikona={Package}
          kolor='text-foreground'
        />
        {STATUSY.map((s) => (
          <StatCard
            key={s.id}
            etykieta={s.nazwa}
            wartosc={statystyki[s.id]}
            ikona={
              s.id === "oczekujące"
                ? Clock
                : s.id === "w realizacji"
                  ? Loader2
                  : s.id === "wysłane"
                    ? Truck
                    : CheckCircle2
            }
            kolor={s.kolor}
          />
        ))}
      </div>

      {/* ─── Pasek wyszukiwania i filtrowania ─── */}
      <div className='flex flex-col sm:flex-row gap-3'>
        {/* Wyszukiwarka */}
        <div className='relative flex-1'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
          <input
            type='text'
            value={szukaj}
            onChange={(e) => setSzukaj(e.target.value)}
            placeholder='Szukaj po numerze, imieniu, e-mailu...'
            className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow'
          />
        </div>

        {/* Filtr statusu */}
        <div className='relative'>
          <Filter className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none' />
          <select
            value={filtrStatusu}
            onChange={(e) =>
              setFiltrStatusu(e.target.value as Status | "wszystkie")
            }
            className='appearance-none pl-10 pr-10 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer'
          >
            <option value='wszystkie'>Wszystkie statusy</option>
            {STATUSY.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nazwa}
              </option>
            ))}
          </select>
          <ChevronDown className='absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none' />
        </div>
      </div>

      {/* ─── Błąd ─── */}
      {blad && (
        <div className='p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-xs text-rose-600 dark:text-rose-400 font-medium'>
          {blad}
        </div>
      )}

      {/* ─── Ładowanie ─── */}
      {laduje && (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-6 h-6 text-accent animate-spin' />
        </div>
      )}

      {/* ─── Brak zamówień ─── */}
      {!laduje && przefiltrowane.length === 0 && (
        <div className='text-center py-12 space-y-3'>
          <Package className='w-10 h-10 text-muted-foreground/40 mx-auto' />
          <p className='text-sm text-muted-foreground'>
            {szukaj || filtrStatusu !== "wszystkie"
              ? "Brak zamówień pasujących do filtrów."
              : "Brak zamówień w systemie."}
          </p>
        </div>
      )}

      {/* ─── Lista zamówień ─── */}
      {!laduje && przefiltrowane.length > 0 && (
        <div className='space-y-3'>
          {przefiltrowane.map((zamowienie) => (
            <ZamowienieCard
              key={zamowienie.id}
              zamowienie={zamowienie}
              rozwiniete={rozwiniete.has(zamowienie.id)}
              naRozwinieciu={() => toggleRozwin(zamowienie.id)}
              naZmianeStatusu={zmienStatus}
              naUsuniecie={setPotwierdzenieUsuniecia}
              aktualizujace={aktualizujace.has(zamowienie.id)}
              usuwajace={usuwajace === zamowienie.id}
              formatujDate={formatujDate}
            />
          ))}
        </div>
      )}

      {/* ─── Modal potwierdzenia usunięcia ─── */}
      <AnimatePresence>
        {potwierdzenieUsuniecia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Tło overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setPotwierdzenieUsuniecia(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-foreground">
                    Usuń zamówienie
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Ta operacja jest nieodwracalna
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground font-light">
                Czy na pewno chcesz usunąć zamówienie
                <span className="font-mono font-medium text-foreground"> {" "}{potwierdzenieUsuniecia.numerZamowienia}</span>?
                Liczba sprzedanych produktów zostanie automatycznie zmniejszona.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPotwierdzenieUsuniecia(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-secondary border border-border text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={() => usunijZamowienie(potwierdzenieUsuniecia)}
                  disabled={usuwajace !== null}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                  {usuwajace ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Usuwanie...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Usuń zamówienie
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Podsumowanie ─── */}
      {!laduje && przefiltrowane.length > 0 && (
        <div className='flex items-center justify-between text-[11px] text-muted-foreground pt-2'>
          <span>
            Wyświetlanie {przefiltrowane.length} z {zamowienia.length} zamówień
          </span>
          <span className='flex items-center gap-1'>
            <ArrowUpDown className='w-3 h-3' />
            Sortuj od najnowszych
          </span>
        </div>
      )}
    </div>
  )
}

/* ─────────── Karta statystyk ─────────── */

function StatCard({
  etykieta,
  wartosc,
  ikona: Icon,
  kolor,
}: {
  etykieta: string
  wartosc: number
  ikona: React.ComponentType<{ className?: string }>
  kolor: string
}) {
  return (
    <div className='p-4 rounded-2xl bg-card border border-border space-y-2'>
      <div className='flex items-center gap-2'>
        <Icon className={`w-4 h-4 ${kolor}`} />
        <span className='text-[10px] text-muted-foreground uppercase tracking-wider font-medium'>
          {etykieta}
        </span>
      </div>
      <p className={`font-serif text-2xl font-bold ${kolor}`}>{wartosc}</p>
    </div>
  )
}

/* ─────────── Karta zamówienia ─────────── */

function ZamowienieCard({
  zamowienie,
  rozwiniete,
  naRozwinieciu,
  naZmianeStatusu,
  naUsuniecie,
  aktualizujace,
  usuwajace,
  formatujDate,
}: {
  zamowienie: ZamowienieFirestore
  rozwiniete: boolean
  naRozwinieciu: () => void
  naZmianeStatusu: (id: string, status: Status) => Promise<void>
  naUsuniecie: (zamowienie: ZamowienieFirestore) => void
  aktualizujace: boolean
  usuwajace: boolean
  formatujDate: (iso: string) => string
}) {
  const statusInfo = STATUSY.find((s) => s.id === zamowienie.status)
  const PlatnoscIcon = IKONY_PLATNOSCI[zamowienie.metodaPlatnosci] || CreditCard
  const liczbaProduktow = zamowienie.produkty.reduce(
    (acc, p) => acc + p.ilosc,
    0,
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-2xl bg-card border border-border overflow-hidden'
    >
      {/* ─── Nagłówek karty ─── */}
      <div
        role='button'
        tabIndex={0}
        onClick={naRozwinieciu}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            naRozwinieciu()
          }
        }}
        className='w-full p-4 sm:p-5 text-left flex items-center gap-4 hover:bg-secondary/30 transition-colors cursor-pointer'
      >
        {/* Numer zamówienia */}
        <div className='flex-1 min-w-0 space-y-1'>
          <div className='flex items-center gap-2'>
            <p className='font-mono text-sm font-bold text-foreground tracking-wider truncate'>
              {zamowienie.numerZamowienia}
            </p>
            {aktualizujace && (
              <Loader2 className='w-3.5 h-3.5 text-accent animate-spin shrink-0' />
            )}
          </div>
          <p className='text-[11px] text-muted-foreground'>
            {zamowienie.dostawa.imie} {zamowienie.dostawa.nazwisko} ·{" "}
            {formatujDate(zamowienie.dataZlozenia)}
          </p>
        </div>

        {/* Liczba produktów */}
        <div className='hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground'>
          <Package className='w-3.5 h-3.5' />
          <span>{liczbaProduktow} szt.</span>
        </div>

        {/* Kwota */}
        <p className='text-sm font-semibold text-foreground shrink-0'>
          {formatPrice(zamowienie.razem)}
        </p>

        {/* Przycisk usuwania */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            naUsuniecie(zamowienie)
          }}
          disabled={usuwajace}
          className='shrink-0 p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50'
          title='Usuń zamówienie'
        >
          {usuwajace ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Trash2 className='w-4 h-4' />
          )}
        </button>

        {/* Status badge */}
        <span
          className={`hidden sm:inline-flex px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${statusInfo?.bg} ${statusInfo?.kolor}`}
        >
          {statusInfo?.nazwa}
        </span>

        {/* Ikona rozwijania */}
        {rozwiniete ? (
          <ChevronUp className='w-4 h-4 text-muted-foreground shrink-0' />
        ) : (
          <ChevronDown className='w-4 h-4 text-muted-foreground shrink-0' />
        )}
      </div>

      {/* ─── Rozwinięta zawartość ─── */}
      <AnimatePresence>
        {rozwiniete && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='overflow-hidden'
          >
            <div className='px-4 sm:px-5 pb-5 space-y-5 border-t border-border'>
              {/* ─── Zmiana statusu ─── */}
              <div className='pt-4 space-y-2'>
                <p className='text-[11px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1.5'>
                  <ArrowUpDown className='w-3 h-3' />
                  Zmień status
                </p>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                  {STATUSY.map((s) => {
                    const SIcon =
                      s.id === "oczekujące"
                        ? Clock
                        : s.id === "w realizacji"
                          ? Loader2
                          : s.id === "wysłane"
                            ? Truck
                            : CheckCircle2
                    const aktywny = zamowienie.status === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => naZmianeStatusu(zamowienie.id, s.id)}
                        disabled={aktywny || aktualizujace}
                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          aktywny
                            ? `${s.bg} ${s.kolor} ring-2 ring-current/20`
                            : "bg-background border-border text-muted-foreground hover:border-accent/40 hover:text-foreground disabled:opacity-50"
                        }`}
                      >
                        <SIcon className='w-3.5 h-3.5' />
                        <span className='hidden sm:inline'>{s.nazwa}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ─── Dane zamówienia w siatce ─── */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {/* Produkty */}
                <div className='space-y-3'>
                  <h4 className='text-xs font-semibold text-foreground flex items-center gap-1.5'>
                    <Package className='w-3.5 h-3.5 text-accent' />
                    Produkty ({zamowienie.produkty.length})
                  </h4>
                  <div className='space-y-2'>
                    {zamowienie.produkty.map((produkt, idx) => (
                      <div
                        key={idx}
                        className='flex items-center gap-2.5 p-2 rounded-lg bg-secondary/50'
                      >
                        <div className='relative w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0 border border-border'>
                          <Image
                            src={produkt.obrazek}
                            alt={produkt.nazwa}
                            fill
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                            className='object-cover'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-[11px] font-medium text-foreground truncate'>
                            {produkt.nazwa}
                          </p>
                          <p className='text-[10px] text-muted-foreground'>
                            {produkt.kolor} · Qty: {produkt.ilosc}
                          </p>
                        </div>
                        <span className='text-[11px] font-medium text-foreground shrink-0'>
                          {formatPrice(produkt.cena * produkt.ilosc)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dane dostawy */}
                <div className='space-y-3'>
                  <h4 className='text-xs font-semibold text-foreground flex items-center gap-1.5'>
                    <MapPin className='w-3.5 h-3.5 text-accent' />
                    Dane dostawy
                  </h4>
                  <div className='p-3 rounded-xl bg-secondary/50 space-y-2'>
                    <div className='flex items-center gap-2 text-[11px]'>
                      <User className='w-3 h-3 text-muted-foreground shrink-0' />
                      <span className='text-foreground font-medium'>
                        {zamowienie.dostawa.imie} {zamowienie.dostawa.nazwisko}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-[11px]'>
                      <Mail className='w-3 h-3 text-muted-foreground shrink-0' />
                      <span className='text-muted-foreground'>
                        {zamowienie.dostawa.email}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-[11px]'>
                      <Phone className='w-3 h-3 text-muted-foreground shrink-0' />
                      <span className='text-muted-foreground'>
                        {zamowienie.dostawa.telefon}
                      </span>
                    </div>
                    <div className='flex items-start gap-2 text-[11px]'>
                      <MapPin className='w-3 h-3 text-muted-foreground shrink-0 mt-0.5' />
                      <span className='text-muted-foreground'>
                        {zamowienie.dostawa.ulica},{" "}
                        {zamowienie.dostawa.kodPocztowy}{" "}
                        {zamowienie.dostawa.miasto}
                      </span>
                    </div>
                    {zamowienie.dostawa.uwagi && (
                      <div className='flex items-start gap-2 text-[11px]'>
                        <MessageSquare className='w-3 h-3 text-muted-foreground shrink-0 mt-0.5' />
                        <span className='text-muted-foreground italic'>
                          {zamowienie.dostawa.uwagi}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Podsumowanie płatności */}
                <div className='space-y-3'>
                  <h4 className='text-xs font-semibold text-foreground flex items-center gap-1.5'>
                    <CreditCard className='w-3.5 h-3.5 text-accent' />
                    Podsumowanie
                  </h4>
                  <div className='p-3 rounded-xl bg-secondary/50 space-y-2'>
                    <div className='flex items-center gap-2 text-[11px]'>
                      <PlatnoscIcon className='w-3 h-3 text-muted-foreground shrink-0' />
                      <span className='text-muted-foreground capitalize'>
                        {zamowienie.metodaPlatnosci === "blik"
                          ? "BLIK"
                          : zamowienie.metodaPlatnosci === "karta"
                            ? "Karta płatnicza"
                            : zamowienie.metodaPlatnosci === "payu"
                              ? "PayU"
                              : "Apple Pay"}
                      </span>
                    </div>
                    <div className='border-t border-border/50 pt-2 space-y-1.5'>
                      <div className='flex justify-between text-[11px]'>
                        <span className='text-muted-foreground'>Produkty</span>
                        <span className='text-foreground'>
                          {formatPrice(zamowienie.wartoscProduktow)}
                        </span>
                      </div>
                      <div className='flex justify-between text-[11px]'>
                        <span className='text-muted-foreground'>Dostawa</span>
                        <span className='text-foreground'>
                          {zamowienie.kosztDostawy === 0 ? (
                            <span className='text-emerald-600 dark:text-emerald-400 font-medium'>
                              Darmowa
                            </span>
                          ) : (
                            formatPrice(zamowienie.kosztDostawy)
                          )}
                        </span>
                      </div>
                      <div className='flex justify-between text-[11px] font-semibold pt-1.5 border-t border-border/50'>
                        <span className='text-foreground'>Razem</span>
                        <span className='text-accent'>
                          {formatPrice(zamowienie.razem)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
