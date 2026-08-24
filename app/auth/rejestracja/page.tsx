"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const rejestracjaSchema = z
  .object({
    nazwa: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
    email: z.string().email("Wprowadź poprawny adres e-mail"),
    haslo: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę"),
    potwierdzenieHasla: z.string(),
  })
  .refine((dane) => dane.haslo === dane.potwierdzenieHasla, {
    message: "Hasła nie są identyczne",
    path: ["potwierdzenieHasla"],
  });

const wymaganiaHasla = [
  { test: (h: string) => h.length >= 8, label: "Co najmniej 8 znaków" },
  { test: (h: string) => /[A-Z]/.test(h), label: "Wielka litera" },
  { test: (h: string) => /[0-9]/.test(h), label: "Cyfra" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { rejestracja, logowanieGoogle, zalogowany } = useAuth();
  const [ladujeGoogle, setLadujeGoogle] = useState(false);

  const [nazwa, setNazwa] = useState("");
  const [email, setEmail] = useState("");
  const [haslo, setHaslo] = useState("");
  const [potwierdzenieHasla, setPotwierdzenieHasla] = useState("");
  const [pokazHaslo, setPokazHaslo] = useState(false);
  const [bledy, setBledy] = useState<Record<string, string>>({});
  const [bladGlobalny, setBladGlobalny] = useState("");
  const [laduje, setLaduje] = useState(false);

  // Jeśli już zalogowany, przekieruj
  useEffect(() => {
    if (zalogowany) {
      router.push("/account");
    }
  }, [zalogowany, router]);

  if (zalogowany) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBledy({});
    setBladGlobalny("");

    const wynik = rejestracjaSchema.safeParse({
      nazwa,
      email,
      haslo,
      potwierdzenieHasla,
    });

    if (!wynik.success) {
      const noweBledy: Record<string, string> = {};
      wynik.error.issues.forEach((issue) => {
        const pole = issue.path[0] as string;
        noweBledy[pole] = issue.message;
      });
      setBledy(noweBledy);
      return;
    }

    setLaduje(true);

    try {
      await rejestracja(email, haslo, nazwa);
      router.push("/account");
    } catch (error: unknown) {
      const kod = (error as { code?: string }).code;
      if (kod === "auth/email-already-in-use") {
        setBladGlobalny("Konto z tym adresem e-mail już istnieje.");
      } else if (kod === "auth/weak-password") {
        setBladGlobalny("Hasło jest zbyt słabe.");
      } else {
        setBladGlobalny("Wystąpił błąd rejestracji. Spróbuj ponownie.");
      }
    } finally {
      setLaduje(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow flex items-center justify-center py-12 sm:py-20 bg-background text-foreground transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto px-4 sm:px-6"
        >
          {/* Nagłówek */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STWÓRZ KONTO</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
              Dołącz do LUXÉ
            </h1>
            <p className="text-sm text-muted-foreground font-light">
              Utwórz konto i ciesz się ekskluzywnymi benefitami
            </p>
          </div>

          {/* Korzyści */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Historia zamówień" },
              { label: "Lista życzeń" },
              { label: "Rabaty VIP" },
            ].map((korzysc) => (
              <div
                key={korzysc.label}
                className="p-3 rounded-xl bg-secondary border border-border/50 text-center"
              >
                <p className="text-[10px] text-muted-foreground font-medium">
                  {korzysc.label}
                </p>
              </div>
            ))}
          </div>

          {/* Formularz */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-5"
          >
            {bladGlobalny && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-xs text-rose-600 dark:text-rose-400 font-medium"
              >
                {bladGlobalny}
              </motion.div>
            )}

            {/* Imię */}
            <div className="space-y-1.5">
              <label
                htmlFor="nazwa"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Imię
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="nazwa"
                  type="text"
                  value={nazwa}
                  onChange={(e) => setNazwa(e.target.value)}
                  placeholder="Anna"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${
                    bledy.nazwa
                      ? "border-rose-500 focus:ring-rose-500/30"
                      : "border-border"
                  }`}
                />
              </div>
              {bledy.nazwa && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  {bledy.nazwa}
                </p>
              )}
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Adres e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anna@przykład.pl"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${
                    bledy.email
                      ? "border-rose-500 focus:ring-rose-500/30"
                      : "border-border"
                  }`}
                />
              </div>
              {bledy.email && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  {bledy.email}
                </p>
              )}
            </div>

            {/* Hasło */}
            <div className="space-y-1.5">
              <label
                htmlFor="haslo"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Hasło
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="haslo"
                  type={pokazHaslo ? "text" : "password"}
                  value={haslo}
                  onChange={(e) => setHaslo(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-12 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${
                    bledy.haslo
                      ? "border-rose-500 focus:ring-rose-500/30"
                      : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setPokazHaslo(!pokazHaslo)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={pokazHaslo ? "Ukryj hasło" : "Pokaż hasło"}
                >
                  {pokazHaslo ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {bledy.haslo && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  {bledy.haslo}
                </p>
              )}

              {/* Wymagania hasła */}
              <div className="flex flex-wrap gap-2 pt-1">
                {wymaganiaHasla.map((wym) => (
                  <div
                    key={wym.label}
                    className={`flex items-center gap-1 text-[10px] font-medium ${
                      wym.test(haslo)
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>{wym.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Potwierdzenie hasła */}
            <div className="space-y-1.5">
              <label
                htmlFor="potwierdzenie"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Potwierdź hasło
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="potwierdzenie"
                  type={pokazHaslo ? "text" : "password"}
                  value={potwierdzenieHasla}
                  onChange={(e) => setPotwierdzenieHasla(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${
                    bledy.potwierdzenieHasla
                      ? "border-rose-500 focus:ring-rose-500/30"
                      : "border-border"
                  }`}
                />
              </div>
              {bledy.potwierdzenieHasla && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  {bledy.potwierdzenieHasla}
                </p>
              )}
            </div>

            {/* Przycisk rejestracji */}
            <button
              type="submit"
              disabled={laduje}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
            >
              {laduje ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Rejestracja...
                </>
              ) : (
                <>
                  Stwórz konto
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground font-medium">
                lub
              </span>
            </div>
          </div>

          {/* Rejestracja przez Google */}
          <button
            onClick={async () => {
              setBladGlobalny("");
              setLadujeGoogle(true);
              try {
                await logowanieGoogle();
                router.push("/account");
              } catch (error: unknown) {
                const kod = (error as { code?: string }).code;
                if (kod === "auth/popup-closed-by-user") {
                  setBladGlobalny("Okno logowania zostało zamknięte.");
                } else if (kod === "auth/cancelled-popup-request") {
                  setBladGlobalny("Logowanie zostało anulowane.");
                } else {
                  setBladGlobalny("Wystąpił błąd logowania przez Google. Spróbuj ponownie.");
                }
              } finally {
                setLadujeGoogle(false);
              }
            }}
            disabled={ladujeGoogle}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {ladujeGoogle ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Logowanie...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Zarejestruj się przez Google
              </>
            )}
          </button>

          {/* Link do logowania */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Masz już konto?{" "}
              <Link
                href="/auth/login"
                className="text-accent font-semibold hover:underline"
              >
                Zaloguj się
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
