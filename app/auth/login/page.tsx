"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar/Navbar"
import { Footer } from "@/components/footer/Footer"
import { useAuth } from "@/context/AuthContext"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const { logowanie, logowanieGoogle, zalogowany } = useAuth()
  const [ladujeGoogle, setLadujeGoogle] = useState(false)

  const [email, setEmail] = useState("")
  const [haslo, setHaslo] = useState("")
  const [pokazHaslo, setPokazHaslo] = useState(false)
  const [blad, setBlad] = useState("")
  const [laduje, setLaduje] = useState(false)

  // Jeśli już zalogowany, przekieruj
  useEffect(() => {
    if (zalogowany) {
      router.push("/account")
    }
  }, [zalogowany, router])

  if (zalogowany) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBlad("")
    setLaduje(true)

    try {
      await logowanie(email, haslo)
      router.push("/account")
    } catch (error: unknown) {
      const kod = (error as { code?: string }).code
      if (kod === "auth/user-not-found") {
        setBlad("Nie znaleziono konta z podanym adresem e-mail.")
      } else if (kod === "auth/wrong-password") {
        setBlad("Nieprawidłowe hasło. Spróbuj ponownie.")
      } else if (kod === "auth/invalid-email") {
        setBlad("Wprowadź poprawny adres e-mail.")
      } else if (kod === "auth/too-many-requests") {
        setBlad("Zbyt wiele prób logowania. Spróbuj ponownie później.")
      } else {
        setBlad("Wystąpił błąd logowania. Spróbuj ponownie.")
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
              <span>ZALOGUJ SIĘ</span>
            </div>
            <h1 className='font-serif text-3xl sm:text-4xl text-foreground tracking-tight'>
              Witaj ponownie
            </h1>
            <p className='text-sm text-muted-foreground font-light'>
              Zaloguj się do swojego konta LUXÉ BAGS
            </p>
          </div>

          {/* Formularz */}
          <form
            onSubmit={handleSubmit}
            className='p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-5'
          >
            {blad && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className='p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-xs text-rose-600 dark:text-rose-400 font-medium'
              >
                {blad}
              </motion.div>
            )}

            {/* E-mail */}
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

            {/* Hasło */}
            <div className='space-y-1.5'>
              <label
                htmlFor='haslo'
                className='text-xs font-semibold text-foreground uppercase tracking-wider'
              >
                Hasło
              </label>
              <div className='relative'>
                <Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <input
                  id='haslo'
                  type={pokazHaslo ? "text" : "password"}
                  value={haslo}
                  onChange={(e) => setHaslo(e.target.value)}
                  placeholder='••••••••'
                  required
                  className='w-full pl-10 pr-12 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow'
                />
                <button
                  type='button'
                  onClick={() => setPokazHaslo(!pokazHaslo)}
                  className='absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  aria-label={pokazHaslo ? "Ukryj hasło" : "Pokaż hasło"}
                >
                  {pokazHaslo ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>

            {/* Zapomniałeś hasła */}
            <div className='flex justify-end'>
              <Link
                href='/auth/reset-hasla'
                className='text-xs text-accent hover:underline font-medium'
              >
                Zapomniałeś hasła?
              </Link>
            </div>

            {/* Przycisk logowania */}
            <button
              type='submit'
              disabled={laduje}
              className='w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity shadow-md disabled:opacity-50'
            >
              {laduje ? (
                <>
                  <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                  Logowanie...
                </>
              ) : (
                <>
                  Zaloguj się
                  <ArrowRight className='w-4 h-4' />
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-border' />
            </div>
            <div className='relative flex justify-center text-xs'>
              <span className='bg-background px-3 text-muted-foreground font-medium'>
                lub
              </span>
            </div>
          </div>

          {/* Logowanie przez Google */}
          <button
            onClick={async () => {
              setBlad("")
              setLadujeGoogle(true)
              try {
                await logowanieGoogle()
                router.push("/account")
              } catch (error: unknown) {
                const kod = (error as { code?: string }).code
                if (kod === "auth/popup-closed-by-user") {
                  setBlad("Okno logowania zostało zamknięte.")
                } else if (kod === "auth/cancelled-popup-request") {
                  setBlad("Logowanie zostało anulowane.")
                } else {
                  setBlad(
                    "Wystąpił błąd logowania przez Google. Spróbuj ponownie.",
                  )
                }
              } finally {
                setLadujeGoogle(false)
              }
            }}
            disabled={ladujeGoogle}
            className='w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-colors disabled:opacity-50'
          >
            {ladujeGoogle ? (
              <>
                <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                Logowanie...
              </>
            ) : (
              <>
                <svg className='w-4 h-4' viewBox='0 0 24 24'>
                  <path
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z'
                    fill='#4285F4'
                  />
                  <path
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    fill='#34A853'
                  />
                  <path
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    fill='#EA4335'
                  />
                </svg>
                Zaloguj przez Google
              </>
            )}
          </button>

          {/* Link do rejestracji */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              Nie masz konta?{" "}
              <Link
                href='/auth/rejestracja'
                className='text-accent font-semibold hover:underline'
              >
                Zarejestruj się
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
