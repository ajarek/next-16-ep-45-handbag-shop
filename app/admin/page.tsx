"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Database,
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  Package,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";

interface LogWIadomosci {
  id: string;
  typ: "sukces" | "blad" | "info";
  wiadomosc: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { zalogowany, isAdmin, laduje: authLaduje } = useAuth();

  const [laduje, setLaduje] = useState(false);
  const [logi, setLogi] = useState<LogWIadomosci[]>([]);
  const [produktowImportowano, setProduktowImportowano] = useState(0);
  const [usunietoProduktow, setUsunietoProduktow] = useState(0);
  const logCounterRef = useRef(0);

  const dodajLog = useCallback((typ: LogWIadomosci["typ"], wiadomosc: string) => {
    logCounterRef.current += 1;
    const id = `log-${logCounterRef.current}`;
    setLogi((prev) => [...prev, { id, typ, wiadomosc }]);
  }, []);

  // Strażnik — przekieruj nie-adminów
  useEffect(() => {
    if (!authLaduje && (!zalogowany || !isAdmin)) {
      router.push("/");
    }
  }, [authLaduje, zalogowany, isAdmin, router]);

  if (authLaduje || !zalogowany || !isAdmin) return null;

  /* ─── Seed produktów ─── */

  const seedProduktow = async () => {
    setLaduje(true);
    setLogi([]);
    setProduktowImportowano(0);

    try {
      // Pobierz dane z public/data/products.json
      dodajLog("info", "Pobieranie danych z products.json...");
      const res = await fetch("/data/products.json");
      if (!res.ok) throw new Error("Nie udało się pobrać products.json");
      const produkty: Product[] = await res.json();
      dodajLog("info", `Znaleziono ${produkty.length} produktów w pliku JSON.`);

      // Importuj produkty do Firestore (po 10 w batchu)
      let importowano = 0;
      for (let i = 0; i < produkty.length; i += 10) {
        const batch = writeBatch(db);
        const porcja = produkty.slice(i, i + 10);

        for (const produkt of porcja) {
          const docRef = doc(db, "produkty", produkt.id);
          batch.set(docRef, {
            ...produkt,
            liczbaSprzedanych: 0,
            dataAktualizacji: serverTimestamp(),
          });
        }

        await batch.commit();
        importowano += porcja.length;
        setProduktowImportowano(importowano);
        dodajLog(
          "sukces",
          `Zaimportowano ${importowano}/${produkty.length} produktów.`
        );
      }

      dodajLog(
        "sukces",
        `Zakończono import ${produkty.length} produktów do Firestore!`
      );
    } catch (error) {
      dodajLog(
        "blad",
        `Błąd importu: ${error instanceof Error ? error.message : "Nieznany błąd"}`
      );
    } finally {
      setLaduje(false);
    }
  };

  /* ─── Wyczyść kolekcję ─── */

  const wyczyscKolekcje = async (nazwaKolekcji: string) => {
    setLaduje(true);
    setLogi([]);

    try {
      dodajLog("info", `Usuwanie wszystkich dokumentów z kolekcji „${nazwaKolekcji}"...`);
      const snapshot = await getDocs(collection(db, nazwaKolekcji));

      if (snapshot.empty) {
        dodajLog("info", `Kolekcja „${nazwaKolekcji}" jest pusta.`);
        setLaduje(false);
        return;
      }

      let usunieto = 0;
      // Usuwaj po 10 w batchu
      for (let i = 0; i < snapshot.docs.length; i += 10) {
        const batch = writeBatch(db);
        const porcja = snapshot.docs.slice(i, i + 10);

        for (const docSnap of porcja) {
          batch.delete(doc(db, nazwaKolekcji, docSnap.id));
        }

        await batch.commit();
        usunieto += porcja.length;
        setUsunietoProduktow(usunieto);
      }

      dodajLog(
        "sukces",
        `Usunięto ${usunieto} dokumentów z kolekcji „${nazwaKolekcji}".`
      );
    } catch (error) {
      dodajLog(
        "blad",
        `Błąd usuwania: ${error instanceof Error ? error.message : "Nieznany błąd"}`
      );
    } finally {
      setLaduje(false);
    }
  };

  /* ─── Render ─── */

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow bg-background text-foreground transition-colors duration-300">
        {/* Nagłówek */}
        <section className="border-b border-border bg-surface transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-4">
            <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <Link href="/" className="hover:text-accent transition-colors">
                Strona główna
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-accent font-semibold">Panel administracyjny</span>
            </nav>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-[11px] uppercase tracking-[0.25em] font-semibold border border-border/50">
                <Database className="w-3.5 h-3.5" />
                <span>FIREBASE ADMIN</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
                Panel administracyjny
              </h1>
              <p className="text-sm text-muted-foreground font-light max-w-xl">
                Zarządzaj danymi w Firestore. Importuj produkty, czyść kolekcje i monitoruj stan bazy.
              </p>
            </div>
          </div>
        </section>

        {/* Zawartość */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── Seed produktów ── */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-semibold text-foreground">
                    Import produktów
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Wgraj dane z products.json do Firestore
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Ta akcja odczyta plik{" "}
                <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-[11px] font-mono">
                  public/data/products.json
                </code>{" "}
                i zapisze wszystkie produkty w kolekcji{" "}
                <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-[11px] font-mono">
                  produkty
                </code>{" "}
                w Firestore. Istniejące produkty zostaną nadpisane.
              </p>

              <button
                onClick={seedProduktow}
                disabled={laduje}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-[0.1em] uppercase hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
              >
                {laduje ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Importowanie...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Importuj produkty
                  </>
                )}
              </button>

              {produktowImportowano > 0 && !laduje && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center">
                  Zaimportowano {produktowImportowano} produktów
                </p>
              )}
            </div>

            {/* ── Czyszczenie kolekcji ── */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-semibold text-foreground">
                    Czyszczenie kolekcji
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Usuń wszystkie dokumenty z wybranej kolekcji
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Nieodwracalna operacja. Usuwa wszystkie dokumenty z wybranej kolekcji w Firestore.
              </p>

              <div className="space-y-2">
                {["produkty", "zamowienia", "recenzje", "uzytkownicy", "listy_zyczen", "koszyki"].map(
                  (kolekcja) => (
                    <button
                      key={kolekcja}
                      onClick={() => wyczyscKolekcje(kolekcja)}
                      disabled={laduje}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-secondary border border-border/50 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
                    >
                      <span className="flex items-center gap-2">
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        {kolekcja}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Wyczyść
                      </span>
                    </button>
                  )
                )}
              </div>

              {usunietoProduktow > 0 && !laduje && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium text-center">
                  Usunięto {usunietoProduktow} dokumentów
                </p>
              )}
            </div>
          </div>

          {/* ── Logi ── */}
          {logi.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-5 rounded-2xl bg-card border border-border space-y-3"
            >
              <h3 className="font-serif text-sm font-semibold text-foreground flex items-center gap-2">
                <Database className="w-4 h-4 text-accent" />
                Log operacji
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-1.5">
                {logi.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                      log.typ === "sukces"
                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                        : log.typ === "blad"
                        ? "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {log.typ === "sukces" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    ) : log.typ === "blad" ? (
                      <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    ) : (
                      <Loader2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    )}
                    <span>{log.wiadomosc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
