import React from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className='bg-surface border-t border-border text-foreground pt-16 pb-12 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border'>
          {/* Kolumna 1: O marce */}
          <div className='lg:col-span-2 space-y-4'>
            <Link href='/' className='flex flex-col'>
              <span className='font-serif text-2xl sm:text-3xl tracking-[0.25em] font-semibold text-foreground uppercase'>
                LUXÉ
              </span>
              <span className='text-[10px] tracking-[0.45em] text-accent uppercase -mt-1 font-sans font-light'>
                BAGS
              </span>
            </Link>
            <p className='text-xs sm:text-sm text-muted-foreground max-w-sm font-light leading-relaxed'>
              Polska marka torebek tworzonych w duchu cichego luksusu. Ręcznie
              szyte z certyfikowanych włoskich skór w limitowanych edycjach dla
              kobiet ceniących ponadczasową elegancję.
            </p>
            <div className='flex items-center gap-3 pt-2'>
              <span className='inline-flex items-center gap-1.5 text-xs text-accent font-medium'>
                <Sparkles className='w-3.5 h-3.5' />
                <span>Kunszt • Tradycja • Nowoczesność</span>
              </span>
            </div>
          </div>

          {/* Kolumna 2: Kolekcje */}
          <div className='space-y-3'>
            <h4 className='font-serif text-sm font-semibold uppercase tracking-wider text-foreground'>
              Kolekcje
            </h4>
            <ul className='space-y-2 text-xs text-muted-foreground'>
              <li>
                <a
                  href='#kolekcje'
                  className='hover:text-accent transition-colors'
                >
                  Torebki kubełkowe
                </a>
              </li>
              <li>
                <a
                  href='#kolekcje'
                  className='hover:text-accent transition-colors'
                >
                  Torebki z klapką
                </a>
              </li>
              <li>
                <a
                  href='#kolekcje'
                  className='hover:text-accent transition-colors'
                >
                  Torebki na ramię
                </a>
              </li>
              <li>
                <a
                  href='#kolekcje'
                  className='hover:text-accent transition-colors'
                >
                  Listonoszki crossbody
                </a>
              </li>
              <li>
                <a
                  href='#kolekcje'
                  className='hover:text-accent transition-colors'
                >
                  Shoppery i torby tote
                </a>
              </li>
            </ul>
          </div>

          {/* Kolumna 3: Obsługa klienta */}
          <div className='space-y-3'>
            <h4 className='font-serif text-sm font-semibold uppercase tracking-wider text-foreground'>
              Obsługa Klienta
            </h4>
            <ul className='space-y-2 text-xs text-muted-foreground'>
              <li>
                <a
                  href='#kontakt'
                  className='hover:text-accent transition-colors'
                >
                  Dostawa i koszty wysyłki (0 zł)
                </a>
              </li>
              <li>
                <a
                  href='#kontakt'
                  className='hover:text-accent transition-colors'
                >
                  Zwroty i reklamacje (30 dni)
                </a>
              </li>
              <li>
                <a
                  href='#rzemioslo'
                  className='hover:text-accent transition-colors'
                >
                  Pielęgnacja skóry licowej
                </a>
              </li>
              <li>
                <a
                  href='#kontakt'
                  className='hover:text-accent transition-colors'
                >
                  Często zadawane pytania (FAQ)
                </a>
              </li>
              <li>
                <a
                  href='#kontakt'
                  className='hover:text-accent transition-colors'
                >
                  Kontakt z konsultantką
                </a>
              </li>
            </ul>
          </div>

          {/* Kolumna 4: Butik & Kontakt */}
          <div className='space-y-3'>
            <h4 className='font-serif text-sm font-semibold uppercase tracking-wider text-foreground'>
              Showroom & Butik
            </h4>
            <div className='space-y-2 text-xs text-muted-foreground'>
              <p className='flex items-start gap-2'>
                <MapPin className='w-3.5 h-3.5 text-accent shrink-0 mt-0.5' />
                <span>ul. Wielkopolska 2, 78-100 Kołobrzeg</span>
              </p>
              <p className='flex items-center gap-2'>
                <Phone className='w-3.5 h-3.5 text-accent shrink-0' />
                <span>+48 573 219 230</span>
              </p>
              <p className='flex items-center gap-2'>
                <Mail className='w-3.5 h-3.5 text-accent shrink-0' />
                <span>kontakt@luxebags.pl</span>
              </p>
              <p className='text-[11px] text-muted-foreground/80 pt-1'>
                Pn–Pt: 10:00–19:00 | Sob: 11:00–16:00
              </p>
            </div>
          </div>
        </div>

        {/* Dolny pasek praw autorskich i płatności */}
        <div className='pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground'>
          <p>
            © {new Date().getFullYear()} LUXÉ BAGS. Wszelkie prawa zastrzeżone.
          </p>

          <div className='flex items-center gap-2 text-[10px]'>
            <span className='px-2 py-1 bg-card rounded border border-border text-foreground'>
              BLIK
            </span>
            <span className='px-2 py-1 bg-card rounded border border-border text-foreground'>
              PayU
            </span>
            <span className='px-2 py-1 bg-card rounded border border-border text-foreground'>
              Apple Pay
            </span>
            <span className='px-2 py-1 bg-card rounded border border-border text-foreground'>
              Visa / Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
