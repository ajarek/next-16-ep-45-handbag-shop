"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { Navbar } from "@/components/navbar/Navbar"
import { Footer } from "@/components/footer/Footer"
import { useAuth } from "@/context/AuthContext"
import { motion } from "framer-motion"

export default function ResetHaslaPage() {
  const { resetujHaslo } = useAuth()

  const [email, setEmail] = useState("")
  const [wyslano, setWyslano] = useState(false)
  const [blad, setBlad] = useState("")
  const [laduje, setLaduje] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBlad("")
    setLaduje(true)

    try {
      await resetujHaslo(email)
      setWyslano(true)
    } catch (error: unknown) {
      const kod = (error as { code?: string }).code
      if (kod === "auth/user-not-found") {
        setBlad("Nie znaleziono konta z podanym adresem e-mail.")
      } else if (kod === "auth/invalid-email") {
        setBlad("Wprowadź poprawny adres e-mail.")
      } else {
        setBlad("Wystąpił błąd. Spróbuj ponownie.")
      }
    } finally {
      setLaduje(false)
    }
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />

      <main className='grow flex items-center justify-center py-12 sm:py-20 bg-background text-foreground transition-colors duration-300'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md mx-auto px-4 sm:px-6'
        >
          {/* Nagłówek */}
          <div className='text-center mb-8 space-y-3'>
            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50'>
              <Sparkles className='w-3.5 h-3.5' />
              <span>RESETOWANIE HASŁA</span>
            </div>
            <h1 className='font-serif text-3xl sm:text-4xl text-foreground tracking-tight'>
              {wyslano ? "Sprawdź e-mail" : "Zapomniałeś hasła?"}
            </h1>
            <p className='text-sm text-muted-foreground font-light'>
              {wyslano
                ? `Wysłaliśmy link do resetowania hasła na adres ${email}`
                : "Podaj adres e-mail powiązany z kontem, a wyślemy Ci link do resetowania hasła."}
            </p>
          </div>

          {/* Formularz / Potwierdzenie */}
          <div className='p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-5'>
            {wyslano ? (
              /* Potwierdzenie wysłania */
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='text-center space-y-4'
              >
                <div className='w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 mx-auto flex items-center justify-center'>
                  <CheckCircle2 className='w-8 h-8 text-emerald-500 dark:text-emerald-400' />
                </div>
                <div className='space-y-2'>
                  <p className='text-sm text-foreground font-medium'>
                    Link został wysłany!
                  </p>
                  <p className='text-xs text-muted-foreground font-light leading-relaxed'>
                    Sprawdź swoją skrzynkę e-mail i kliknij w link, aby ustawić
                    nowe hasło. Link wygaśnie za godzinę.
                  </p>
                </div>

                {/* Symulacja — w produkcji redirect do Gmail itp. */}
                <div className='p-3 rounded-xl bg-secondary border border-border/50'>
                  <p className='text-[10px] text-muted-foreground'>
                    Nie widzisz wiadomości? Sprawdź folder spam lub{" "}
                    <button
                      onClick={() => {
                        setWyslano(false)
                        setEmail("")
                      }}
                      className='text-accent hover:underline font-medium'
                    >
                      spróbuj ponownie
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Formularz */
              <form onSubmit={handleSubmit} className='space-y-5'>
                {blad && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className='p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-xs text-rose-600 dark:text-rose-400 font-medium'
                  >
                    {blad}
                  </motion.div>
                )}

                <div className='space-y-1.5'>
                  <label
                    htmlFor='email'
                    className='text-xs font-semibold text-foreground uppercase tracking-wider'
                  >
                    Adres e-mail
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                    <input
                      id='email'
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='anna@przykład.pl'
                      required
                      className='w-full pl-10 pr-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow'
                    />
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={laduje}
                  className='w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity shadow-md disabled:opacity-50'
                >
                  {laduje ? (
                    <>
                      <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                      Wysyłanie...
                    </>
                  ) : (
                    <>
                      Wyślij link resetujący
                      <ArrowRight className='w-4 h-4' />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Powrót do logowania */}
          <div className='mt-6 text-center'>
            <Link
              href='/auth/login'
              className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              Wróć do logowania
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
