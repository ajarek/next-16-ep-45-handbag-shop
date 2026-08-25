import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  limit,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "./config";
import type { Product, CartItem } from "@/lib/types";

/* ─────────── Typy ─────────── */

export interface ZamowienieFirestore {
  id: string;
  uzytkownikId?: string;
  produkty: {
    produktId: string;
    nazwa: string;
    kolor: string;
    ilosc: number;
    cena: number;
    obrazek: string;
  }[];
  dostawa: {
    imie: string;
    nazwisko: string;
    email: string;
    telefon: string;
    ulica: string;
    kodPocztowy: string;
    miasto: string;
    uwagi?: string;
  };
  metodaPlatnosci: string;
  wartoscProduktow: number;
  kosztDostawy: number;
  razem: number;
  status: "oczekujące" | "w realizacji" | "wysłane" | "dostarczone";
  numerZamowienia: string;
  data?: ReturnType<typeof serverTimestamp>;
  dataZlozenia: string;
}

export interface ProduktFirestore extends Product {
  dataAktualizacji?: ReturnType<typeof serverTimestamp>;
  liczbaSprzedanych?: number;
  // Pola counted w subkolekcji recenzji
}

export interface RecenzjaFirestore {
  id: string;
  uzytkownikId: string;
  autor: string;
  produktId: string;
  ocena: number;
  komentarz: string;
  data: string;
  zweryfikowany: boolean;
}

/* ─────────── Produkty ─────────── */

export async function pobierzProdukty(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "produkty"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

export async function pobierzProdukt(id: string): Promise<Product | null> {
  const docRef = doc(db, "produkty", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Product;
}

export async function pobierzProduktyWGalerii(
  limitIlosci: number = 20
): Promise<Product[]> {
  const q = query(
    collection(db, "produkty"),
    where("featured", "==", true),
    limit(limitIlosci)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Product)
    .sort((a, b) => b.rating - a.rating);
}

export async function importujProdukty(products: Product[]): Promise<void> {
  for (const product of products) {
    const docRef = doc(db, "produkty", product.id);
    await setDoc(docRef, {
      ...product,
      liczbaSprzedanych: 0,
      dataAktualizacji: serverTimestamp(),
    });
  }
}

/* ─────────── Zamówienia ─────────── */

/** Usuwa wartości undefined z obiektu (Firestore ich nie akceptuje) */
function usunUndefined<T extends Record<string, unknown>>(obiekt: T): T {
  return Object.fromEntries(
    Object.entries(obiekt).filter(([, wartosc]) => wartosc !== undefined)
  ) as T;
}

export async function zapiszZamowienie(zamowienie: ZamowienieFirestore): Promise<string> {
  const docRef = doc(collection(db, "zamowienia"));
  await setDoc(docRef, usunUndefined({
    ...zamowienie,
    id: docRef.id,
    data: serverTimestamp(),
  }));

  // Aktualizuj liczbę sprzedanych dla każdego produktu
  for (const produkt of zamowienie.produkty) {
    const produktRef = doc(db, "produkty", produkt.produktId);
    await updateDoc(produktRef, {
      liczbaSprzedanych: increment(produkt.ilosc),
    }).catch(() => {
      // Produkt może nie istnieć w Firestore — ignorujemy
    });
  }

  return docRef.id;
}

export async function pobierzZamowieniaUzytkownika(
  uzytkownikId: string
): Promise<ZamowienieFirestore[]> {
  const q = query(
    collection(db, "zamowienia"),
    where("uzytkownikId", "==", uzytkownikId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }) as ZamowienieFirestore)
    .sort((a, b) =>
      new Date(b.dataZlozenia).getTime() - new Date(a.dataZlozenia).getTime()
    );
}

export async function pobierzZamowienie(
  zamowienieId: string
): Promise<ZamowienieFirestore | null> {
  const docRef = doc(db, "zamowienia", zamowienieId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as ZamowienieFirestore;
}

/** Pobierz wszystkie zamówienia (panel admin) — posortowane od najnowszych */
export async function pobierzWszystkieZamowienia(): Promise<ZamowienieFirestore[]> {
  const q = query(
    collection(db, "zamowienia"),
    orderBy("data", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as ZamowienieFirestore
  );
}

/** Aktualizuj status zamówienia (panel admin) */
export async function zaktualizujStatusZamowienia(
  zamowienieId: string,
  nowyStatus: ZamowienieFirestore["status"]
): Promise<void> {
  const docRef = doc(db, "zamowienia", zamowienieId);
  await updateDoc(docRef, {
    status: nowyStatus,
    dataAktualizacjiStatusu: serverTimestamp(),
  });
}

/* ─────────── Lista życzeń (Wishlist) ─────────── */

export async function pobierzWishlist(uzytkownikId: string): Promise<string[]> {
  const docRef = doc(db, "listy_zyczen", uzytkownikId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return [];
  return (docSnap.data().produktIds as string[]) || [];
}

export async function dodajDoWishlist(
  uzytkownikId: string,
  produktId: string
): Promise<void> {
  const docRef = doc(db, "listy_zyczen", uzytkownikId);
  await setDoc(
    docRef,
    {
      produktIds: arrayUnion(produktId),
      uzytkownikId,
      dataAktualizacji: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function usunZWishlist(
  uzytkownikId: string,
  produktId: string
): Promise<void> {
  const docRef = doc(db, "listy_zyczen", uzytkownikId);
  await updateDoc(docRef, {
    produktIds: arrayRemove(produktId),
    dataAktualizacji: serverTimestamp(),
  });
}

export async function syncWishlist(
  uzytkownikId: string,
  produktIds: string[]
): Promise<void> {
  const docRef = doc(db, "listy_zyczen", uzytkownikId);
  await setDoc(
    docRef,
    {
      produktIds,
      uzytkownikId,
      dataAktualizacji: serverTimestamp(),
    },
    { merge: true }
  );
}

/* ─────────── Recenzje ─────────── */

export async function dodajRecenzje(recenzja: Omit<RecenzjaFirestore, "id">): Promise<string> {
  const docRef = doc(collection(db, "recenzje"));
  await setDoc(docRef, {
    ...recenzja,
    id: docRef.id,
    data: new Date().toISOString(),
  });

  // Aktualizuj średnią ocenę produktu
  const produktRef = doc(db, "produkty", recenzja.produktId);
  const produktSnap = await getDoc(produktRef);
  if (produktSnap.exists()) {
    const dane = produktSnap.data();
    const obecnaLiczba = (dane.reviewsCount as number) || 0;
    const obecnaOcena = (dane.rating as number) || 0;
    const nowaLiczba = obecnaLiczba + 1;
    const nowaOcena =
      (obecnaOcena * obecnaLiczba + recenzja.ocena) / nowaLiczba;

    await updateDoc(produktRef, {
      rating: Math.round(nowaOcena * 100) / 100,
      reviewsCount: nowaLiczba,
    });
  }

  return docRef.id;
}

export async function pobierzRecenzjeProduktu(
  produktId: string
): Promise<RecenzjaFirestore[]> {
  const q = query(
    collection(db, "recenzje"),
    where("produktId", "==", produktId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }) as RecenzjaFirestore)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

/* ─────────── Koszyk (serwer) ─────────── */

export async function zapiszKoszyk(
  uzytkownikId: string,
  koszyk: CartItem[]
): Promise<void> {
  const docRef = doc(db, "koszyki", uzytkownikId);
  await setDoc(
    docRef,
    {
      uzytkownikId,
      produkty: koszyk.map((item) => ({
        produktId: item.product.id,
        nazwa: item.product.name,
        kolor: item.selectedColor.name,
        kolorHex: item.selectedColor.hex,
        ilosc: item.quantity,
        cena: item.product.price,
        obrazek: item.product.images[0],
      })),
      dataAktualizacji: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function pobierzKoszyk(
  uzytkownikId: string
): Promise<CartItem[]> {
  const docRef = doc(db, "koszyki", uzytkownikId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return [];

  // Mapujemy z powrotem do CartItem[] — wymaga pobrania pełnych danych produktu
  // W praktyce dane te są wCache'owane na kliencie
  return [];
}

/* ─────────── Statystyki (admin) ─────────── */

export async function pobierzStatystyki(): Promise<{
  liczbaUzytkownikow: number;
  liczbaZamowien: number;
  liczbaProduktow: number;
  sumaPrzychodow: number;
}> {
  const [uzytkownicy, zamowienia, produkty] = await Promise.all([
    getDocs(collection(db, "uzytkownicy")),
    getDocs(collection(db, "zamowienia")),
    getDocs(collection(db, "produkty")),
  ]);

  let sumaPrzychodow = 0;
  zamowienia.docs.forEach((zamDoc) => {
    const daneZam = zamDoc.data();
    if (daneZam.status === "dostarczone") {
      sumaPrzychodow += daneZam.razem || 0;
    }
  });

  return {
    liczbaUzytkownikow: uzytkownicy.size,
    liczbaZamowien: zamowienia.size,
    liczbaProduktow: produkty.size,
    sumaPrzychodow,
  };
}
