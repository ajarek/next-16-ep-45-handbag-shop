import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { CartDrawer } from "@/components/navbar/CartDrawer";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { FloatingContactButton } from "@/components/chat/FloatingContactButton";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUXÉ BAGS | Torebki, które podkreślają Twój styl",
  description:
    "Odkryj ekskluzywną kolekcję torebek z włoskiej skóry. Ponadczasowy minimalistyczny design, niezrównany kunszt rzemiosła i darmowa dostawa od 299 zł.",
  keywords: [
    "torebki luksusowe",
    "skórzane torebki damskie",
    "LuxeBag",
    "torebki kubełkowe",
    "torebki z klapką",
    "torebki na ramię",
    "listonoszki",
    "torby shopper",
  ],
  authors: [{ name: "LUXÉ BAGS" }],
  openGraph: {
    title: "LUXÉ BAGS | Torebki, które podkreślają Twój styl",
    description: "Ekskluzywna kolekcja torebek damskich w estetyce minimalistycznego luksusu.",
    type: "website",
    locale: "pl_PL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning data-scroll-behavior="smooth" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-accent selection:text-accent-foreground transition-colors duration-300 antialiased">
        <ShopProvider>
          {children}
          <CartDrawer />
          <QuickViewModal />
          <ToastContainer />
          <FloatingContactButton />
        </ShopProvider>
      </body>
    </html>
  );
}
