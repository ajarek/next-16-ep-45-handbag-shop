# LUXÉ BAGS – Sklep Internetowy z Torebkami Luksusowymi

Projekt ekskluzywnego sklepu internetowego z torebkami damskimi w estetyce minimalistycznego luksusu (*quiet luxury*). Zbudowany w oparciu o Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript oraz interaktywny WebGL shader.

---

## Główne Funkcjonalności

- **Estetyka Minimalistycznego Luksusu**: Paleta barw oparta na bieli, kremach i ciepłych beżach, z elegancką typografią szeryfową (`Playfair Display`) i nowoczesnym krojem bezszeryfowym (`Plus Jakarta Sans`).
- **Interaktywny Shader WebGL w Hero**: Płynne gradienty, subtelna siatka (*grid*) oraz efekt świetlny (*spotlight*) podążający za kursorem myszy z płynną amortyzacją ruchu.
- **Pasek Ogłoszeń & Nawigacja (Navbar)**:
  - Informacja o darmowej dostawie od 299 zł i 30 dniach na zwrot.
  - Szybka wyszukiwarka na żywo (Live Search modal).
  - Przełącznik trybu jasnego i ciemnego z płynną animacją.
  - Liczniki koszyka i ulubionych.
- **Mobilne Menu Drawer**: Płynnie wysuwane menu z lewej strony ekranu (zgodnie z wytycznymi projektu).
- **Kolekcje & Kategorie**: 5 interaktywnych kart kategorii ze zdjęciami, liczbą modeli i animacją hover.
- **Wyróżniki Zaufania (Trust Badges)**: Darmowa dostawa, 30 dni na zwrot, Bezpieczne płatności, Gwarancja jakości.
- **Bestsellery & Nowa Kolekcja**: Filtrowanie według kategorii i tagów, próbki kolorystyczne, szybki podgląd (Quick View Modal) oraz dodawanie do koszyka i listy życzeń.
- **Wysuwany Koszyk (Cart Drawer)**: Podgląd produktów, kalkulator kwoty brakującej do darmowej dostawy, modyfikacja ilości i podsumowanie zamówienia.
- **Przewodnik Stylu**: Minimalistyczne, Eleganckie, Codzienne, Na wieczór, Do pracy.
- **Kunszt i Rzemiosło**: Opowieść o tradycji toskańskich garbarni, ręcznym szyciu i pozłacanych okuciach.
- **Opinie Klientek**: Autentyczne recenzje ze zweryfikowanymi zakupami.
- **Klub VIP / Newsletter**: Zapis do newslettera z walidacją Zod i natychmiastowym kodem rabatowym `LUXE10` (-10%).
- **Pływający Concierge / Czat**: Interaktywny widget kontaktu w prawym dolnym rogu ekranu.

---

## Stos Technologiczny

- **Framework**: [Next.js 16.3.2 App Router](https://nextjs.org/)
- **UI / Core**: React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4, Glassmorphism, CSS Custom Properties
- **Animacje**: Framer Motion & WebGL Fragment Shaders
- **Ikony**: Lucide React
- **Walidacja**: Zod
- **Struktura Danych**: `public/data/` (JSON) oraz `public/images/`

---

## Uruchomienie Projektu

1. Zainstaluj zależności:
   ```bash
   npm install
   ```

2. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```

3. Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

4. Kontrola jakości i budowanie:
   ```bash
   npx tsc --noEmit   # Sprawdzanie typów
   npm run lint       # Linter ESLint
   npm run build      # Produkcyjna kompilacja
   ```
