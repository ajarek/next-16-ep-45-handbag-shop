"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth"
import { auth, db } from "@/lib/firebase/config"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { setAuthCookie, clearAuthCookie } from "@/lib/auth/cookie"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  telefon?: string
  adres?: {
    ulica: string
    kodPocztowy: string
    miasto: string
  }
  dataRejestracji: string
  avatarUrl?: string
}

interface AuthContextType {
  uzytkownik: User | null
  profil: UserProfile | null
  laduje: boolean
  logowanie: (email: string, haslo: string) => Promise<void>
  logowanieGoogle: () => Promise<void>
  rejestracja: (email: string, haslo: string, nazwa: string) => Promise<void>
  wylogowanie: () => Promise<void>
  resetujHaslo: (email: string) => Promise<void>
  zaktualizujProfil: (
    uidOrDane: string | Partial<UserProfile>,
    maybeDane?: Partial<UserProfile>,
  ) => Promise<void>
  zalogowany: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [uzytkownik, setUzytkownik] = useState<User | null>(null)
  const [profil, setProfil] = useState<UserProfile | null>(null)
  const [laduje, setLaduje] = useState(true)

  // Pobieranie profilu użytkownika z Firestore
  const pobierzProfil = useCallback(async (uid: string) => {
    try {
      const docRef = doc(db, "uzytkownicy", uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile
      }
      return null
    } catch (error) {
      console.error("Błąd pobierania profilu:", error)
      return null
    }
  }, [])

  // Tworzenie profilu w Firestore po rejestracji
  const utworzProfil = useCallback(async (user: User, nazwa: string) => {
    const profilData: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: nazwa,
      dataRejestracji: new Date().toISOString(),
    }
    await setDoc(doc(db, "uzytkownicy", user.uid), {
      ...profilData,
      dataRejestracji: serverTimestamp(),
    })
    setProfil(profilData)
  }, [])

  // Nasłuchiwanie stanu autoryzacji + synchronizacja ciasteczka
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUzytkownik(user)
      if (user) {
        setAuthCookie(user.uid)
        const profilDane = await pobierzProfil(user.uid)
        setProfil(profilDane)
      } else {
        clearAuthCookie()
        setProfil(null)
      }
      setLaduje(false)
    })

    return () => unsubscribe()
  }, [pobierzProfil])

  // Logowanie emailem i hasłem
  const logowanie = useCallback(async (email: string, haslo: string) => {
    await signInWithEmailAndPassword(auth, email, haslo)
  }, [])

  // Logowanie przez Google
  const logowanieGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    const wynik = await signInWithPopup(auth, provider)
    const user = wynik.user

    // Sprawdź czy profil już istnieje — jeśli nie, utwórz
    const istniejacyProfil = await pobierzProfil(user.uid)
    if (!istniejacyProfil) {
      await utworzProfil(user, user.displayName || "Użytkownik Google")
    } else {
      setProfil(istniejacyProfil)
    }
  }, [pobierzProfil, utworzProfil])

  // Rejestracja
  const rejestracja = useCallback(
    async (email: string, haslo: string, nazwa: string) => {
      const wynik = await createUserWithEmailAndPassword(auth, email, haslo)
      await updateProfile(wynik.user, { displayName: nazwa })
      await utworzProfil(wynik.user, nazwa)
    },
    [utworzProfil],
  )

  // Wylogowanie
  const wylogowanie = useCallback(async () => {
    clearAuthCookie()
    await signOut(auth)
    setProfil(null)
  }, [])

  // Reset hasła
  const resetujHaslo = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }, [])

  // Aktualizacja profilu
  const zaktualizujProfil = useCallback(
    async (
      uidOrDane: string | Partial<UserProfile>,
      maybeDane?: Partial<UserProfile>,
    ) => {
      const uid = typeof uidOrDane === "string" ? uidOrDane : uzytkownik?.uid
      const dane = typeof uidOrDane === "string" ? maybeDane! : uidOrDane
      if (!uid || !dane) return

      // Aktualizuj Firebase Auth profile jeśli mamy dostęp do użytkownika
      if (uzytkownik && uzytkownik.uid === uid && dane.displayName) {
        await updateProfile(uzytkownik, { displayName: dane.displayName })
      }

      const docRef = doc(db, "uzytkownicy", uid)
      await setDoc(docRef, dane, { merge: true })

      if (uzytkownik && uzytkownik.uid === uid) {
        setProfil((prev) => (prev ? { ...prev, ...dane } : null))
      }
    },
    [uzytkownik],
  )

  return (
    <AuthContext.Provider
      value={{
        uzytkownik,
        profil,
        laduje,
        logowanie,
        logowanieGoogle,
        rejestracja,
        wylogowanie,
        resetujHaslo,
        zaktualizujProfil,
        zalogowany: !!uzytkownik,
        isAdmin:
          !!uzytkownik &&
          uzytkownik.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || ""),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth musi być użyte wewnątrz AuthProvider")
  }
  return context
}
