import { z } from "zod"
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Navbar } from "@/components/navbar/Navbar"
import { Footer } from "@/components/footer/Footer"
import { ShopCatalog } from "@/components/products/ShopCatalog"
import { TrustBadges } from "@/components/sections/TrustBadges"
import { NewsletterSection } from "@/components/sections/NewsletterSection"

// Walidacja parametru ?kategoria= — nieznane wartości wracają do "all"
const kategoriaSchema = z
  .enum([
    "all",
    "z-klapka",
    "kubelkowe",
    "na-ramie",
    "listonoszki",
    "shoppery-tote",
  ])
  .default("all")
  .catch("all")

export const metadata: Metadata = {
  title: "Sklep | LUXÉ BAGS",
  description:
    "Cała kolekcja torebek LUXÉ BAGS z włoskiej skóry. Filtruj według kategorii, tagów i sortuj według ceny lub ocen.",
}

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { kategoria } = await searchParams
  const activeCategory = kategoriaSchema.parse(kategoria)

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Pasek nawigacji */}
      <Navbar />

      {/* Główna treść strony */}
      <main className='grow'>
        {/* Nagłówek sklepu z nawigacją okruszkową */}
        <section className='border-b border-border bg-surface transition-colors duration-300'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-4'>
            <nav className='flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground'>
              <Link href='/' className='hover:text-accent transition-colors'>
                Strona główna
              </Link>
              <ChevronRight className='w-3 h-3' />
              <span className='text-accent font-semibold'>Sklep</span>
            </nav>

            <div className='space-y-3 max-w-2xl'>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50'>
                <span>KOLEKCJA LUXÉ</span>
              </div>
              <h1 className='font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight'>
                Wszystkie torebki
              </h1>
              <p className='text-sm sm:text-base text-muted-foreground font-light leading-relaxed'>
                Przeglądaj pełną kolekcję torebek szytych ręcznie z
                certyfikowanych włoskich skór. Wybierz kategorię, odfiltruj
                nowości lub bestsellery i posortuj według preferencji.
              </p>
            </div>
          </div>
        </section>

        {/* Katalog produktów z filtrowaniem i sortowaniem */}
        <ShopCatalog activeCategory={activeCategory} />

        {/* Wyróżniki zaufania */}
        <TrustBadges />

        {/* Ekskluzywny newsletter z kodem rabatowym */}
        <NewsletterSection />
      </main>

      {/* Stopka sklepu */}
      <Footer />
    </div>
  )
}
