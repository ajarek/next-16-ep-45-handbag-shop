"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react"
import { Product, ColorOption, CartItem } from "@/lib/types"
import { useLocalStorage } from "@/lib/hooks/useLocalStorage"
import { useAuth } from "@/context/AuthContext"
import {
  pobierzWishlist,
  dodajDoWishlist,
  usunZWishlist,
  syncWishlist,
} from "@/lib/firebase/services"

interface ToastNotification {
  id: string
  message: string
  type: "success" | "info"
}

interface ShopContextType {
  cart: CartItem[]
  addToCart: (
    product: Product,
    selectedColor?: ColorOption,
    quantity?: number,
  ) => void
  removeFromCart: (productId: string, colorName: string) => void
  updateQuantity: (
    productId: string,
    colorName: string,
    quantity: number,
  ) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void

  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  wishlistCount: number

  quickViewProduct: Product | null
  setQuickViewProduct: (product: Product | null) => void

  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void

  theme: "light" | "dark"
  toggleTheme: () => void

  toasts: ToastNotification[]
  showToast: (message: string, type?: "success" | "info") => void
  removeToast: (id: string) => void
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("luxebag_cart", [])
  const [wishlist, setWishlist] = useLocalStorage<string[]>(
    "luxebag_wishlist",
    [],
  )
  const [theme, setTheme] = useLocalStorage<"light" | "dark">(
    "luxebag_theme",
    "light",
  )

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const toastCounterRef = useRef(0)

  const { zalogowany, uzytkownik } = useAuth()

  // Synchronizacja motywu z klasą na tagu html
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  // Synchronizacja wishlist z Firestore po zalogowaniu
  useEffect(() => {
    if (!zalogowany || !uzytkownik) return

    const synchronizuj = async () => {
      try {
        const remoteWishlist = await pobierzWishlist(uzytkownik.uid)

        // Merge: lokalne + zdalne (bez duplikatów)
        const merged = Array.from(new Set([...wishlist, ...remoteWishlist]))

        // Zapisz merge do obu źródeł
        setWishlist(merged)
        await syncWishlist(uzytkownik.uid, merged)
      } catch (error) {
        console.error("Błąd synchronizacji wishlist:", error)
      }
    }

    synchronizuj()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zalogowany, uzytkownik?.uid])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const showToast = useCallback(
    (message: string, type: "success" | "info" = "success") => {
      toastCounterRef.current += 1
      const id = `toast-${Date.now()}-${toastCounterRef.current}`
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3500)
    },
    [],
  )

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }, [setTheme])

  const addToCart = useCallback(
    (product: Product, selectedColor?: ColorOption, quantity = 1) => {
      const color = selectedColor || product.colors[0]
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedColor.name === color.name,
        )

        if (existingIndex > -1) {
          const updated = [...prev]
          updated[existingIndex].quantity += quantity
          return updated
        }

        return [...prev, { product, selectedColor: color, quantity }]
      })

      showToast(`Dodano "${product.name}" (${color.name}) do koszyka.`)
      setIsCartOpen(true)
    },
    [setCart, showToast, setIsCartOpen],
  )

  const removeFromCart = useCallback(
    (productId: string, colorName: string) => {
      setCart((prev) =>
        prev.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.selectedColor.name === colorName
            ),
        ),
      )
      showToast("Usunięto produkt z koszyka.", "info")
    },
    [setCart, showToast],
  )

  const updateQuantity = useCallback(
    (productId: string, colorName: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, colorName)
        return
      }
      setCart((prev) =>
        prev.map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor.name === colorName
          ) {
            return { ...item, quantity }
          }
          return item
        }),
      )
    },
    [removeFromCart, setCart],
  )

  const clearCart = useCallback(() => {
    setCart([])
    showToast("Koszyk został wyczyszczony.", "info")
  }, [setCart, showToast])

  // Toggle wishlist z synchronizacją Firestore
  const toggleWishlist = useCallback(
    async (productId: string) => {
      const exists = wishlist.includes(productId)

      // Optimistic update (lokalnie)
      if (exists) {
        setWishlist((prev) => prev.filter((id) => id !== productId))
        showToast("Usunięto z listy życzeń.", "info")
      } else {
        setWishlist((prev) => [...prev, productId])
        showToast("Dodano do ulubionych!", "success")
      }

      // Synchronizacja z Firestore
      if (zalogowany && uzytkownik) {
        try {
          if (exists) {
            await usunZWishlist(uzytkownik.uid, productId)
          } else {
            await dodajDoWishlist(uzytkownik.uid, productId)
          }
        } catch (error) {
          console.error("Błąd synchronizacji wishlist z Firestore:", error)
        }
      }
    },
    [wishlist, setWishlist, showToast, zalogowany, uzytkownik],
  )

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  )

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart],
  )

  const cartTotal = useMemo(
    () =>
      cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cart],
  )

  const wishlistCount = wishlist.length

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        theme,
        toggleTheme,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider")
  }
  return context
}
