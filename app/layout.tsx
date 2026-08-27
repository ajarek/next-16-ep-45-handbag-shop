import type { Metadata } from "next"
import { Playfair_Display, Geist } from "next/font/google"
import "./globals.css"
import { ShopProvider } from "@/context/ShopContext"
import { AuthProvider } from "@/context/AuthContext"
import { CartDrawer } from "@/components/navbar/CartDrawer"
import { QuickViewModal } from "@/components/products/QuickViewModal"
import { ToastContainer } from "@/components/ui/ToastContainer"
import { FloatingContactButton } from "@/components/chat/FloatingContactButton"
import { cn } from "@/lib/utils"

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
})

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

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
    description:
      "Ekskluzywna kolekcja torebek damskich w estetyce minimalistycznego luksusu.",
    type: "website",
    locale: "pl_PL",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='pl'
      suppressHydrationWarning
      data-scroll-behavior='smooth'
      className={cn(playfair.variable, "font-sans", geist.variable)}
    >
      <body className='min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-accent selection:text-accent-foreground transition-colors duration-300 antialiased'>
        <AuthProvider>
          <ShopProvider>
            {children}
            <CartDrawer />
            <QuickViewModal />
            <ToastContainer />
            <FloatingContactButton />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
