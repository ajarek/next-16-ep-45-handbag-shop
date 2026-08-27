"use client"

import React from "react"
import { useShop } from "@/context/ShopContext"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useShop()

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-full text-foreground hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      aria-label={
        theme === "dark" ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny"
      }
      title={theme === "dark" ? "Tryb jasny" : "Tryb ciemny"}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {theme === "dark" ? (
          <Sun className='w-5 h-5 text-accent' />
        ) : (
          <Moon className='w-5 h-5 text-foreground' />
        )}
      </motion.div>
    </button>
  )
}
