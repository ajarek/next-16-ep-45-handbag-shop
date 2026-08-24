"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  LogOut,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Save,
  X,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import {
  pobierzZamowieniaUzytkownika,
  pobierzWishlist,
  type ZamowienieFirestore,
} from "@/lib/firebase/services";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Zakladka = "profil" | "zamowienia" | "wishlist";

const statusKolor: Record<string, string> = {
  oczekujące: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  "w realizacji": "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  wysłane: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400",
  dostarczone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
};

const statusIkona: Record<string, React.ReactNode> = {
  oczekujące: <Clock className="w-3 h-3" />,
  "w realizacji": <Package className="w-3 h-3" />,
  wysłane: <Truck className="w-3 h-3" />,
  dostarczone: <CheckCircle2 className="w-3 h-3" />,
};

export default function AccountPage() {
  const router = useRouter();
  const { uzytkownik, profil, laduje: authLaduje, wylogowanie, zaktualizujProfil } = useAuth();
  const { wishlist, showToast } = useShop();

  const [zakladka, setZakladka] = useState<Zakladka>("profil");
  const [zamowienia, setZamowienia] = useState<ZamowienieFirestore[]>([]);

  const [laduje, setLaduje] = useState(true);
  const [edycja, setEdycja] = useState(false);
  const [daneEdycji, setDaneEdycji] = useState(() => ({
    displayName: profil?.displayName || "",
    telefon: profil?.telefon || "",
    ulica: profil?.adres?.ulica || "",
    kodPocztowy: profil?.adres?.kodPocztowy || "",
    miasto: profil?.adres?.miasto || "",
  }));

  // Przekierowanie jeśli nie zalogowany
  useEffect(() => {
    if (!authLaduje && !uzytkownik) {
      router.push("/auth/login");
    }
  }, [authLaduje, uzytkownik, router]);

  // Pobieranie danych
  useEffect(() => {
    if (!uzytkownik) return;

    const pobierz = async () => {
      setLaduje(true);
      try {
        const [zam] = await Promise.all([
          pobierzZamowieniaUzytkownika(uzytkownik.uid),
          pobierzWishlist(uzytkownik.uid),
        ]);
        setZamowienia(zam);
      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      } finally {
        setLaduje(false);
      }
    };

    pobierz();
  }, [uzytkownik]);



  const handleZapiszProfil = async () => {
    if (!uzytkownik) return;

    try {
      await zaktualizujProfil(uzytkownik.uid, {
        displayName: daneEdycji.displayName,
        telefon: daneEdycji.telefon,
        adres: {
          ulica: daneEdycji.ulica,
          kodPocztowy: daneEdycji.kodPocztowy,
          miasto: daneEdycji.miasto,
        },
      });
      setEdycja(false);
      showToast("Profil został zaktualizowany!");
      window.location.reload();
    } catch {
      showToast("Wystąpił błąd podczas aktualizacji profilu.", "info");
    }
  };

  const handleWylogowanie = async () => {
    await wylogowanie();
    router.push("/");
  };

  if (authLaduje || !uzytkownik) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  const dataRejestracji = profil?.dataRejestracji
    ? new Date(profil.dataRejestracji).toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Nieznana";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow bg-background text-foreground transition-colors duration-300">
        {/* Nagłówek */}
        <section className="border-b border-border bg-surface transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-4">
            <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <Link href="/" className="hover:text-accent transition-colors">
                Strona główna
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-accent font-semibold">Moje konto</span>
            </nav>

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-serif font-semibold">
                {profil?.displayName?.charAt(0)?.toUpperCase() ||
                  uzytkownik.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>
              <div className="space-y-1">
                <h1 className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
                  {profil?.displayName || "Użytkownik"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {uzytkownik.email} · Konto od {dataRejestracji}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Zakładki + zawartość */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Lewa kolumna — zakładki */}
            <div className="lg:col-span-3">
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {(
                  [
                    { id: "profil" as Zakladka, label: "Profil", ikona: User },
                    {
                      id: "zamowienia" as Zakladka,
                      label: "Zamówienia",
                      ikona: Package,
                    },
                    {
                      id: "wishlist" as Zakladka,
                      label: "Lista życzeń",
                      ikona: Heart,
                    },
                  ] as const
                ).map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setZakladka(z.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      zakladka === z.id
                        ? "bg-accent text-accent-foreground shadow-md"
                        : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
                    }`}
                  >
                    <z.ikona className="w-4 h-4" />
                    {z.label}
                  </button>
                ))}

                {/* Wylogowanie */}
                <button
                  onClick={handleWylogowanie}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" />
                  Wyloguj się
                </button>
              </div>
            </div>

            {/* Prawa kolumna — zawartość */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {/* ── Profil ── */}
                {zakladka === "profil" && (
                  <motion.div
                    key="profil"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-xl sm:text-2xl text-foreground tracking-tight">
                        Dane osobowe
                      </h2>
                      {!edycja ? (
                        <button
                          onClick={() => setEdycja(true)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edytuj
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEdycja(false)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Anuluj
                          </button>
                          <button
                            onClick={handleZapiszProfil}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Zapisz
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-6 rounded-2xl bg-card border border-border space-y-5">
                      {/* E-mail (nieedytowalny) */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border/50">
                        <Mail className="w-4 h-4 text-accent shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                            E-mail
                          </p>
                          <p className="text-sm text-foreground font-medium">
                            {uzytkownik.email}
                          </p>
                        </div>
                      </div>

                      {/* Imię */}
                      <PoleProfilu
                        ikona={<User className="w-4 h-4" />}
                        etykieta="Imię i nazwisko"
                        wartosc={daneEdycji.displayName}
                        onChange={(v) =>
                          setDaneEdycji({ ...daneEdycji, displayName: v })
                        }
                        edycja={edycja}
                        placeholder="Anna Kowalska"
                      />

                      {/* Telefon */}
                      <PoleProfilu
                        ikona={<Phone className="w-4 h-4" />}
                        etykieta="Telefon"
                        wartosc={daneEdycji.telefon}
                        onChange={(v) =>
                          setDaneEdycji({ ...daneEdycji, telefon: v })
                        }
                        edycja={edycja}
                        placeholder="+48 123 456 789"
                      />

                      {/* Adres */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-accent">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            Adres domyślny
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <PoleProfilu
                            etykieta="Ulica"
                            wartosc={daneEdycji.ulica}
                            onChange={(v) =>
                              setDaneEdycji({ ...daneEdycji, ulica: v })
                            }
                            edycja={edycja}
                            placeholder="ul. Wielkopolska 2"
                          />
                          <PoleProfilu
                            etykieta="Kod pocztowy"
                            wartosc={daneEdycji.kodPocztowy}
                            onChange={(v) =>
                              setDaneEdycji({ ...daneEdycji, kodPocztowy: v })
                            }
                            edycja={edycja}
                            placeholder="00-542"
                          />
                          <PoleProfilu
                            etykieta="Miasto"
                            wartosc={daneEdycji.miasto}
                            onChange={(v) =>
                              setDaneEdycji({ ...daneEdycji, miasto: v })
                            }
                            edycja={edycja}
                            placeholder="Warszawa"
                          />
                        </div>
                      </div>

                      {/* Data rejestracji */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border/50">
                        <Calendar className="w-4 h-4 text-accent shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                            Członek od
                          </p>
                          <p className="text-sm text-foreground font-medium">
                            {dataRejestracji}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Zamówienia ── */}
                {zakladka === "zamowienia" && (
                  <motion.div
                    key="zamowienia"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <h2 className="font-serif text-xl sm:text-2xl text-foreground tracking-tight">
                      Historia zamówień
                    </h2>

                    {laduje ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : zamowienia.length === 0 ? (
                      <div className="text-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                          <ShoppingBag className="w-8 h-8 opacity-50" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-serif text-lg text-foreground">
                            Brak zamówień
                          </p>
                          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            Twoje zamówienia pojawią się tutaj po dokonaniu
                            zakupu.
                          </p>
                        </div>
                        <Link
                          href="/shop"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                        >
                          Przejdź do sklepu
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {zamowienia.map((zamowienie) => (
                          <div
                            key={zamowienie.id}
                            className="p-5 rounded-2xl bg-card border border-border space-y-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                  Zamówienie
                                </p>
                                <p className="font-mono text-sm font-bold text-foreground">
                                  {zamowienie.numerZamowienia}
                                </p>
                              </div>
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                  statusKolor[zamowienie.status]
                                }`}
                              >
                                {statusIkona[zamowienie.status]}
                                {zamowienie.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(
                                  zamowienie.dataZlozenia
                                ).toLocaleDateString("pl-PL")}
                              </span>
                              <span>·</span>
                              <span>
                                {zamowienie.produkty.length}{" "}
                                {zamowienie.produkty.length === 1
                                  ? "produkt"
                                  : "produkty"}
                              </span>
                            </div>

                            {/* Podsumowanie produktów */}
                            <div className="space-y-2">
                              {zamowienie.produkty.map((produkt, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3"
                                >
                                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0 border border-border">
                                    <Image
                                      src={produkt.obrazek}
                                      alt={produkt.nazwa}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-foreground truncate">
                                      {produkt.nazwa}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {produkt.kolor} · Ilość: {produkt.ilosc}
                                    </p>
                                  </div>
                                  <span className="text-xs font-medium text-foreground shrink-0">
                                    {formatPrice(produkt.cena * produkt.ilosc)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border">
                              <span className="text-xs text-muted-foreground">
                                RAZEM
                              </span>
                              <span className="text-sm font-bold text-foreground">
                                {formatPrice(zamowienie.razem)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Lista życzeń ── */}
                {zakladka === "wishlist" && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <h2 className="font-serif text-xl sm:text-2xl text-foreground tracking-tight">
                      Lista życzeń
                    </h2>

                    {wishlist.length === 0 ? (
                      <div className="text-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                          <Heart className="w-8 h-8 opacity-50" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-serif text-lg text-foreground">
                            Lista jest pusta
                          </p>
                          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            Dodaj produkty do ulubionych, aby móc szybko do nich
                            wrócić.
                          </p>
                        </div>
                        <Link
                          href="/shop"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                        >
                          Przeglądaj produkty
                        </Link>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-card border border-border">
                        <p className="text-xs text-muted-foreground mb-4">
                          {wishlist.length}{" "}
                          {wishlist.length === 1
                            ? "produkt"
                            : wishlist.length < 5
                              ? "produkty"
                              : "produktów"}{" "}
                          na liście życzeń
                        </p>
                        <p className="text-xs text-muted-foreground font-light">
                          Lista życzeń jest synchronizowana z Twoim kontem. Możesz
                          przeglądać i usuwać produkty ze strony produktu lub
                          koszyka.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ─────────── Komponent pomocniczy ─────────── */

function PoleProfilu({
  ikona,
  etykieta,
  wartosc,
  onChange,
  edycja,
  placeholder,
}: {
  ikona?: React.ReactNode;
  etykieta: string;
  wartosc: string;
  onChange?: (wartosc: string) => void;
  edycja: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      {ikona && (
        <div className="flex items-center gap-2 text-accent">
          {ikona}
          <span className="text-xs font-semibold uppercase tracking-wider">
            {etykieta}
          </span>
        </div>
      )}
      {!ikona && (
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
          {etykieta}
        </label>
      )}
      {edycja ? (
        <input
          type="text"
          value={wartosc}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
      ) : (
        <div className="px-4 py-3 rounded-xl bg-secondary border border-border/50">
          <p className="text-sm text-foreground">
            {wartosc || (
              <span className="text-muted-foreground font-light">
                Nie podano
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
