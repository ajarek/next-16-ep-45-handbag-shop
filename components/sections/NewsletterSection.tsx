"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Gift } from "lucide-react";
import { newsletterSchema } from "@/lib/validation/newsletter";
import { useShop } from "@/context/ShopContext";
import { motion } from "framer-motion";

export function NewsletterSection() {
  const { showToast } = useShop();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Walidacja Zod
    const result = newsletterSchema.safeParse({ email, consent });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Wprowadź poprawne dane");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      showToast("Twój kod rabatowy: LUXE10 na pierwsze zakupy!", "success");
    }, 600);
  };

  return (
    <section id="newsletter" className="py-20 bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-secondary text-secondary-foreground border border-border shadow-xl overflow-hidden text-center"
        >
          {/* Ozdobne elementy tła */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
              <Gift className="w-3.5 h-3.5" />
              <span>KLUB LUXÉ PRIVÉ</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
              Dołącz do grona koneserek stylu
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
              Zapisz się do newslettera, aby otrzymać <strong className="font-semibold text-foreground">10% rabatu</strong> na pierwsze zamówienie, wcześniejszy dostęp do limitowanych kolekcji i ekskluzywne zaproszenia na wydarzenia.
            </p>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 p-6 rounded-2xl bg-card/90 backdrop-blur-md border border-emerald-500/30 text-center space-y-2 text-card-foreground"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Dziękujemy za dołączenie do Klubu LUXÉ!</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Twój kod rabatowy: <span className="font-mono font-bold text-sm bg-secondary px-3 py-1 rounded-lg text-foreground border border-border">LUXE10</span>
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="pt-6 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Wprowadź swój adres e-mail..."
                      className="w-full pl-4 pr-4 py-3.5 rounded-xl bg-card text-foreground placeholder:text-muted-foreground border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shrink-0 shadow-md hover:opacity-90 disabled:opacity-50"
                  >
                    <span>{isLoading ? "Zapisywanie..." : "ODBIERZ 10%"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="rounded text-accent focus:ring-ring"
                  />
                  <label htmlFor="consent" className="cursor-pointer text-[11px]">
                    Zgadzam się na otrzymywanie informacji handlowych i akceptuję regulamin.
                  </label>
                </div>

                {error && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
