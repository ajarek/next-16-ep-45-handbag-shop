import { z } from "zod";

/* ─────────── Etap 1: Dane dostawy ─────────── */

export const shippingSchema = z.object({
  imie: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  nazwisko: z.string().min(2, "Nazwisko musi mieć co najmniej 2 znaki"),
  email: z.string().email("Wprowadź poprawny adres e-mail"),
  telefon: z
    .string()
    .min(9, "Numer telefonu musi mieć co najmniej 9 cyfr")
    .regex(/^[\d\s+\-()]+$/, "Wprowadź poprawny numer telefonu"),
  ulica: z.string().min(3, "Wprowadź nazwę ulicy z numerem"),
  kodPocztowy: z
    .string()
    .regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX"),
  miasto: z.string().min(2, "Wprowadź nazwę miasta"),
  uwagi: z.string().optional(),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

/* ─────────── Etap 2: Metoda płatności ─────────── */

export const paymentMethodSchema = z.enum(["blik", "karta", "payu", "apple_pay"]);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

/* ─────────── Etap 3: Kod BLIK (opcjonalny) ─────────── */

export const blikCodeSchema = z.object({
  kod: z
    .string()
    .length(6, "Kod BLIK musi składać się z 6 cyfr")
    .regex(/^\d{6}$/, "Kod BLIK musi składać się wyłącznie z cyfr"),
});

export type BlikCodeData = z.infer<typeof blikCodeSchema>;

/* ─────────── Pełne zamówienie ─────────── */

export interface Zamowienie {
  id: string;
  produkty: {
    nazwa: string;
    kolor: string;
    ilosc: number;
    cena: number;
    obrazek: string;
  }[];
  dostawa: ShippingFormData;
  metodaPlatnosci: PaymentMethod;
  wartoscProduktow: number;
  kosztDostawy: number;
  razem: number;
  dataZlozenia: string;
  status: "oczekujące" | "w realizacji" | "wysłane" | "dostarczone";
}
