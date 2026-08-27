"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Loader2,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Smartphone,
  Landmark,
  Package,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  pobierzWszystkieZamowienia,
  type ZamowienieFirestore,
} from "@/lib/firebase/services"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"

/* ─────────── Typy ─────────── */

interface DzienTygodnia {
  nazwa: string
  przychod: number
  zamowienia: number
}

interface Miesiac {
  nazwa: string
  przychod: number
  zamowienia: number
}

interface TopProdukt {
  nazwa: string
  ilosc: number
  przychod: number
}

interface MetodaPlatnosci {
  nazwa: string
  ikona: React.ComponentType<{ className?: string }>
  liczba: number
  przychod: number
}

/* ─────────── Stałe ─────────── */

const NAZWY_DNI = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"]
const NAZWY_MIESIACY = [
  "Sty",
  "Lut",
  "Mar",
  "Kwi",
  "Maj",
  "Cze",
  "Lip",
  "Sie",
  "Wrz",
  "Paź",
  "Lis",
  "Gru",
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

/* ─────────── Komponent główny ─────────── */

export function AdminFinance() {
  const [zamowienia, setZamowienia] = useState<ZamowienieFirestore[]>([])
  const [laduje, setLaduje] = useState(true)
  const [blad, setBlad] = useState("")
  const [aktywnyWykres, setAktywnyWykres] = useState<"tydzien" | "miesiac">(
    "tydzien",
  )

  useEffect(() => {
    let anulowano = false
    const fetchDane = async () => {
      try {
        const dane = await pobierzWszystkieZamowienia()
        if (!anulowano) setZamowienia(dane)
      } catch {
        if (!anulowano) setBlad("Nie udało się pobrać danych zamówień.")
      } finally {
        if (!anulowano) setLaduje(false)
      }
    }
    fetchDane()
    return () => {
      anulowano = true
    }
  }, [])

  const pobierzDane = useCallback(async () => {
    setLaduje(true)
    setBlad("")
    try {
      const dane = await pobierzWszystkieZamowienia()
      setZamowienia(dane)
    } catch {
      setBlad("Nie udało się pobrać danych zamówień.")
    } finally {
      setLaduje(false)
    }
  }, [])

  /* ─── Obliczenia statystyczne ─── */

  const dane = useMemo(() => {
    const wszystkie = zamowienia

    const przychodLaczny = wszystkie.reduce((sum, z) => sum + z.razem, 0)
    const dostarczone = wszystkie.filter((z) => z.status === "dostarczone")
    const przychodDostarczone = dostarczone.reduce((sum, z) => sum + z.razem, 0)
    const srednia = wszystkie.length > 0 ? przychodLaczny / wszystkie.length : 0

    const teraz = new Date()
    const biezacyMiesiac = teraz.getMonth()
    const biezacyRok = teraz.getFullYear()

    const przychodBM = wszystkie
      .filter((z) => {
        const d = new Date(z.dataZlozenia)
        return d.getMonth() === biezacyMiesiac && d.getFullYear() === biezacyRok
      })
      .reduce((sum, z) => sum + z.razem, 0)

    const poprzedniMiesiac = biezacyMiesiac === 0 ? 11 : biezacyMiesiac - 1
    const poprzedniRok = biezacyMiesiac === 0 ? biezacyRok - 1 : biezacyRok
    const przychodPM = wszystkie
      .filter((z) => {
        const d = new Date(z.dataZlozenia)
        return (
          d.getMonth() === poprzedniMiesiac && d.getFullYear() === poprzedniRok
        )
      })
      .reduce((sum, z) => sum + z.razem, 0)

    const zmianaProc =
      przychodPM > 0
        ? ((przychodBM - przychodPM) / przychodPM) * 100
        : przychodBM > 0
          ? 100
          : 0

    const zamowieniaBM = wszystkie.filter((z) => {
      const d = new Date(z.dataZlozenia)
      return d.getMonth() === biezacyMiesiac && d.getFullYear() === biezacyRok
    }).length

    // ─── Wykres tygodniowy ───
    const tydzien: DzienTygodnia[] = []
    for (let i = 6; i >= 0; i--) {
      const data = new Date()
      data.setDate(data.getDate() - i)
      const dzien = data.getDay()
      const adjustedDay = dzien === 0 ? 6 : dzien - 1

      const zamDnia = wszystkie.filter((z) => {
        const d = new Date(z.dataZlozenia)
        return (
          d.getFullYear() === data.getFullYear() &&
          d.getMonth() === data.getMonth() &&
          d.getDate() === data.getDate()
        )
      })

      tydzien.push({
        nazwa: NAZWY_DNI[adjustedDay],
        przychod: zamDnia.reduce((sum, z) => sum + z.razem, 0),
        zamowienia: zamDnia.length,
      })
    }

    // ─── Wykres miesięczny ───
    const miesiace: Miesiac[] = []
    for (let i = 11; i >= 0; i--) {
      const data = new Date()
      data.setMonth(data.getMonth() - i)
      const m = data.getMonth()
      const r = data.getFullYear()

      const zamMies = wszystkie.filter((z) => {
        const d = new Date(z.dataZlozenia)
        return d.getMonth() === m && d.getFullYear() === r
      })

      miesiace.push({
        nazwa: NAZWY_MIESIACY[m],
        przychod: zamMies.reduce((sum, z) => sum + z.razem, 0),
        zamowienia: zamMies.length,
      })
    }

    // ─── Top produkty ───
    const produktMap = new Map<
      string,
      { nazwa: string; ilosc: number; przychod: number }
    >()
    for (const z of wszystkie) {
      for (const p of z.produkty) {
        const istnieje = produktMap.get(p.produktId)
        if (istnieje) {
          istnieje.ilosc += p.ilosc
          istnieje.przychod += p.cena * p.ilosc
        } else {
          produktMap.set(p.produktId, {
            nazwa: p.nazwa,
            ilosc: p.ilosc,
            przychod: p.cena * p.ilosc,
          })
        }
      }
    }
    const topProdukty: TopProdukt[] = Array.from(produktMap.values())
      .sort((a, b) => b.przychod - a.przychod)
      .slice(0, 5)

    // ─── Metody płatności ───
    const platnosciMap = new Map<string, { liczba: number; przychod: number }>()
    for (const z of wszystkie) {
      const istnieje = platnosciMap.get(z.metodaPlatnosci)
      if (istnieje) {
        istnieje.liczba += 1
        istnieje.przychod += z.razem
      } else {
        platnosciMap.set(z.metodaPlatnosci, { liczba: 1, przychod: z.razem })
      }
    }
    const metodyPlatnosci: MetodaPlatnosci[] = Array.from(
      platnosciMap.entries(),
    )
      .map(([klucz, wart]) => ({
        nazwa:
          klucz === "blik"
            ? "BLIK"
            : klucz === "karta"
              ? "Karta"
              : klucz === "payu"
                ? "PayU"
                : "Apple Pay",
        ikona: IKONY_PLATNOSCI[klucz] || CreditCard,
        liczba: wart.liczba,
        przychod: wart.przychod,
      }))
      .sort((a, b) => b.przychod - a.przychod)

    return {
      przychodLaczny,
      przychodDostarczone,
      srednia,
      przychodBM,
      zmianaProc,
      zamowieniaBM,
      tydzien,
      miesiace,
      topProdukty,
      metodyPlatnosci,
      liczbaZamowien: wszystkie.length,
    }
  }, [zamowienia])

  /* ─── Konfiguracje wykresów ─── */

  const wykresConfig: ChartConfig = useMemo(
    () => ({
      przychod: {
        label: "Przychód",
        color: "var(--color-accent)",
      },
    }),
    [],
  )

  if (laduje) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 className='w-6 h-6 text-accent animate-spin' />
      </div>
    )
  }

  if (blad) {
    return (
      <div className='p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-sm text-rose-600 dark:text-rose-400 font-medium text-center'>
        {blad}
        <button
          onClick={pobierzDane}
          className='ml-3 underline hover:no-underline'
        >
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* ─── Nagłówek ─── */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='space-y-1'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50'>
            <BarChart3 className='w-3.5 h-3.5' />
            <span>FINANSE</span>
          </div>
          <h2 className='font-serif text-xl sm:text-2xl text-foreground tracking-tight'>
            Przegląd finansowy
          </h2>
          <p className='text-xs text-muted-foreground font-light'>
            Analityka sprzedaży, trendy i kluczowe wskaźniki finansowe.
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

      {/* ─── Karty KPI ─── */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <KpiCard
          tytul='Przychód łączny'
          wartosc={formatPrice(dane.przychodLaczny)}
          opis={`${dane.liczbaZamowien} zamówień`}
          ikona={DollarSign}
          kolor='text-emerald-600 dark:text-emerald-400'
          bgKolor='bg-emerald-500/10'
        />
        <KpiCard
          tytul='Przychód bieżący miesiąc'
          wartosc={formatPrice(dane.przychodBM)}
          opis={`${dane.zamowieniaBM} zamówień`}
          ikona={Calendar}
          kolor='text-blue-600 dark:text-blue-400'
          bgKolor='bg-blue-500/10'
          zmiana={dane.zmianaProc}
        />
        <KpiCard
          tytul='Średnia wartość'
          wartosc={formatPrice(dane.srednia)}
          opis='na zamówienie'
          ikona={BarChart3}
          kolor='text-violet-600 dark:text-violet-400'
          bgKolor='bg-violet-500/10'
        />
        <KpiCard
          tytul='Przychód zrealizowany'
          wartosc={formatPrice(dane.przychodDostarczone)}
          opis='dostarczone zamówienia'
          ikona={TrendingUp}
          kolor='text-amber-600 dark:text-amber-400'
          bgKolor='bg-amber-500/10'
        />
      </div>

      {/* ─── Wykres ─── */}
      <div className='p-6 rounded-2xl bg-card border border-border space-y-6'>
        <div className='flex items-center justify-between'>
          <h3 className='font-serif text-base font-semibold text-foreground flex items-center gap-2'>
            <BarChart3 className='w-4 h-4 text-accent' />
            Trend sprzedaży
          </h3>
          <div className='flex items-center gap-1 p-1 rounded-xl bg-secondary border border-border/50'>
            <button
              onClick={() => setAktywnyWykres("tydzien")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                aktywnyWykres === "tydzien"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tydzień
            </button>
            <button
              onClick={() => setAktywnyWykres("miesiac")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                aktywnyWykres === "miesiac"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Miesiąc
            </button>
          </div>
        </div>

        {aktywnyWykres === "tydzien" ? (
          <ChartContainer config={wykresConfig} className='h-70 w-full'>
            <BarChart
              data={dane.tydzien}
              margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis
                dataKey='nazwa'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={11}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={10}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                }
                width={45}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      formatPrice(Number(value)),
                      "Przychód",
                    ]}
                    labelClassName='font-semibold'
                  />
                }
              />
              <Bar
                dataKey='przychod'
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                fill='var(--color-accent)'
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <ChartContainer config={wykresConfig} className='h-70 w-full'>
            <BarChart
              data={dane.miesiace}
              margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis
                dataKey='nazwa'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={10}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                }
                width={45}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      formatPrice(Number(value)),
                      "Przychód",
                    ]}
                    labelClassName='font-semibold'
                  />
                }
              />
              <Bar
                dataKey='przychod'
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                fill='var(--color-accent)'
              />
            </BarChart>
          </ChartContainer>
        )}
      </div>

      {/* ─── Dolna sekcja ─── */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Top produkty */}
        <div className='p-6 rounded-2xl bg-card border border-border space-y-4'>
          <h3 className='font-serif text-base font-semibold text-foreground flex items-center gap-2'>
            <Package className='w-4 h-4 text-accent' />
            Top produkty wg przychodu
          </h3>

          {dane.topProdukty.length === 0 ? (
            <p className='text-xs text-muted-foreground text-center py-6'>
              Brak danych o sprzedaży.
            </p>
          ) : (
            <div className='space-y-3'>
              {dane.topProdukty.map((produkt, idx) => {
                const maxPrzychod = dane.topProdukty[0]?.przychod || 1
                const szerokoscPaska = (produkt.przychod / maxPrzychod) * 100
                return (
                  <div key={idx} className='space-y-1.5'>
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex items-center gap-2 min-w-0'>
                        <span className='text-[10px] font-bold text-muted-foreground w-4 text-center'>
                          {idx + 1}
                        </span>
                        <span className='text-xs font-medium text-foreground truncate'>
                          {produkt.nazwa}
                        </span>
                      </div>
                      <div className='flex items-center gap-3 shrink-0'>
                        <span className='text-[10px] text-muted-foreground'>
                          {produkt.ilosc} szt.
                        </span>
                        <span className='text-xs font-semibold text-foreground'>
                          {formatPrice(produkt.przychod)}
                        </span>
                      </div>
                    </div>
                    <div className='h-1.5 rounded-full bg-secondary overflow-hidden'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${szerokoscPaska}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className='h-full rounded-full bg-linear-to-r from-accent/60 to-accent'
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Metody płatności */}
        <div className='p-6 rounded-2xl bg-card border border-border space-y-4'>
          <h3 className='font-serif text-base font-semibold text-foreground flex items-center gap-2'>
            <PieChart className='w-4 h-4 text-accent' />
            Metody płatności
          </h3>

          {dane.metodyPlatnosci.length === 0 ? (
            <p className='text-xs text-muted-foreground text-center py-6'>
              Brak danych o płatnościach.
            </p>
          ) : (
            <div className='space-y-4'>
              <div className='flex items-center justify-center'>
                <WykresKolowy metody={dane.metodyPlatnosci} />
              </div>

              <div className='space-y-3'>
                {dane.metodyPlatnosci.map((metoda, idx) => {
                  const Icon = metoda.ikona
                  const calkowityPrzychod = dane.metodyPlatnosci.reduce(
                    (sum, m) => sum + m.przychod,
                    0,
                  )
                  const procent =
                    calkowityPrzychod > 0
                      ? (metoda.przychod / calkowityPrzychod) * 100
                      : 0

                  return (
                    <div
                      key={idx}
                      className='flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50'
                    >
                      <div className='w-8 h-8 rounded-lg bg-background flex items-center justify-center'>
                        <Icon className='w-4 h-4 text-muted-foreground' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between'>
                          <span className='text-xs font-medium text-foreground'>
                            {metoda.nazwa}
                          </span>
                          <span className='text-xs font-semibold text-foreground'>
                            {formatPrice(metoda.przychod)}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 mt-1'>
                          <div className='flex-1 h-1 rounded-full bg-background overflow-hidden'>
                            <div
                              className='h-full rounded-full bg-accent/60'
                              style={{ width: `${procent}%` }}
                            />
                          </div>
                          <span className='text-[10px] text-muted-foreground'>
                            {metoda.liczba} · {procent.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Podsumowanie ─── */}
      <div className='p-5 rounded-2xl bg-card border border-border'>
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <Calendar className='w-3.5 h-3.5' />
          <span>
            Dane obejmują {dane.liczbaZamowien} zamówień. Ostatnia aktualizacja:{" "}
            {new Date().toLocaleDateString("pl-PL", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Karta KPI ─────────── */

function KpiCard({
  tytul,
  wartosc,
  opis,
  ikona: Icon,
  kolor,
  bgKolor,
  zmiana,
}: {
  tytul: string
  wartosc: string
  opis: string
  ikona: React.ComponentType<{ className?: string }>
  kolor: string
  bgKolor: string
  zmiana?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='p-5 rounded-2xl bg-card border border-border space-y-3'
    >
      <div className='flex items-center justify-between'>
        <div
          className={`w-9 h-9 rounded-xl ${bgKolor} flex items-center justify-center`}
        >
          <Icon className={`w-4.5 h-4.5 ${kolor}`} />
        </div>
        {zmiana !== undefined && zmiana !== 0 && (
          <div
            className={`flex items-center gap-0.5 text-[11px] font-semibold ${
              zmiana > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {zmiana > 0 ? (
              <ArrowUpRight className='w-3.5 h-3.5' />
            ) : (
              <ArrowDownRight className='w-3.5 h-3.5' />
            )}
            {Math.abs(zmiana).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <p className='text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1'>
          {tytul}
        </p>
        <p className='font-serif text-xl font-bold text-foreground'>
          {wartosc}
        </p>
        <p className='text-[11px] text-muted-foreground mt-0.5'>{opis}</p>
      </div>
    </motion.div>
  )
}

/* ─────────── Wykres kołowy SVG ─────────── */

function WykresKolowy({
  metody,
}: {
  metody: {
    nazwa: string
    przychod: number
    ikona: React.ComponentType<{ className?: string }>
  }[]
}) {
  const calkowity = metody.reduce((sum, m) => sum + m.przychod, 0)
  const rozmiar = 120
  const promien = rozmiar / 2 - 10
  const srodek = rozmiar / 2

  const kolory = ["var(--color-accent)", "#8b5cf6", "#10b981", "#f59e0b"]

  if (calkowity === 0) {
    return (
      <div
        className='rounded-full border-4 border-dashed border-border'
        style={{ width: rozmiar, height: rozmiar }}
      />
    )
  }

  let cumul = 0
  const sciezki: React.ReactNode[] = []

  metody.forEach((metoda, idx) => {
    const poczatek = cumul
    const fraction = metoda.przychod / calkowity
    cumul += fraction

    const poczatekKat = poczatek * 2 * Math.PI - Math.PI / 2
    const koniecKat = cumul * 2 * Math.PI - Math.PI / 2

    const x1 = srodek + promien * Math.cos(poczatekKat)
    const y1 = srodek + promien * Math.sin(poczatekKat)
    const x2 = srodek + promien * Math.cos(koniecKat)
    const y2 = srodek + promien * Math.sin(koniecKat)

    const duzyLuk = fraction > 0.5 ? 1 : 0

    sciezki.push(
      <path
        key={idx}
        d={`M ${srodek} ${srodek} L ${x1} ${y1} A ${promien} ${promien} 0 ${duzyLuk} 1 ${x2} ${y2} Z`}
        fill={kolory[idx % kolory.length]}
        opacity={0.85}
      />,
    )
  })

  return (
    <svg width={rozmiar} height={rozmiar} viewBox={`0 0 ${rozmiar} ${rozmiar}`}>
      {sciezki}
      <circle
        cx={srodek}
        cy={srodek}
        r={promien * 0.55}
        className='fill-card'
      />
      <text
        x={srodek}
        y={srodek - 4}
        textAnchor='middle'
        className='fill-foreground'
        fontSize='8'
        fontWeight='700'
      >
        {calkowity >= 1000
          ? `${(calkowity / 1000).toFixed(1)}k`
          : calkowity.toFixed(0)}
      </text>
      <text
        x={srodek}
        y={srodek + 8}
        textAnchor='middle'
        className='fill-muted-foreground'
        fontSize='4'
      >
        zł łącznie
      </text>
    </svg>
  )
}
