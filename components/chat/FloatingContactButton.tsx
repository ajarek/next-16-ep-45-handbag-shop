"use client"

import React, { useState } from "react"
import { MessageSquare, X, Send, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useShop } from "@/context/ShopContext"

export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Dzień dobry! Jestem doradcą LUXÉ BAGS. W czym mogę pomóc przy wyborze Twojej idealnej torebki?",
    },
  ])
  const { showToast } = useShop()

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const userText = message
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }])
    setMessage("")

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Dziękujemy za kontakt! Nasza stylistka przygotuje odpowiedź i skontaktuje się z Tobą w ciągu kilku minut.",
        },
      ])
      showToast("Wiadomość została wysłana do konsultanta.", "info")
    }, 800)
  }

  const handleQuickQuestion = (question: string) => {
    setChatHistory((prev) => [...prev, { sender: "user", text: question }])
    setTimeout(() => {
      let reply = "Chętnie odpowiem na to pytanie!"
      if (question.includes("dostaw")) {
        reply =
          "Wszystkie zamówienia powyżej 299 zł wysyłamy kurierem gratis w 24h!"
      } else if (question.includes("zwrot")) {
        reply = "Masz 30 dni na bezpłatny zwrot bez podawania przyczyny."
      } else if (question.includes("skóry")) {
        reply =
          "Nasze torebki są tworzone w 100% z włoskich skór garbowanych roślinnie w Toskanii."
      }
      setChatHistory((prev) => [...prev, { sender: "bot", text: reply }])
    }, 600)
  }

  return (
    <div id='kontakt' className='fixed bottom-6 right-6 z-40'>
      {/* Pływające okno czatu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className='mb-4 w-80 sm:w-96 rounded-3xl bg-card text-card-foreground shadow-2xl border border-border overflow-hidden flex flex-col'
          >
            {/* Nagłówek okna czatu */}
            <div className='p-4 bg-primary text-primary-foreground flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-full bg-primary-foreground/15 flex items-center justify-center text-accent'>
                  <Sparkles className='w-5 h-5' />
                </div>
                <div>
                  <h4 className='font-serif text-sm font-semibold'>
                    Concierge LUXÉ
                  </h4>
                  <p className='text-[10px] text-emerald-400 font-medium flex items-center gap-1'>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                    Dostępna online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1 rounded-full hover:bg-primary-foreground/10 transition-colors text-primary-foreground/70 hover:text-primary-foreground'
                aria-label='Zamknij czat'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Historia rozmowy */}
            <div className='p-4 h-64 overflow-y-auto space-y-3 text-xs bg-surface'>
              {chatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex ${item.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      item.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-card text-card-foreground border border-border rounded-tl-none shadow-sm"
                    }`}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Szybkie pytania */}
            <div className='px-3 py-2 bg-card border-t border-border flex gap-1.5 overflow-x-auto text-[10px]'>
              <button
                onClick={() => handleQuickQuestion("Darmowa dostawa?")}
                className='whitespace-nowrap px-2.5 py-1 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors'
              >
                🚚 Dostawa
              </button>
              <button
                onClick={() => handleQuickQuestion("Jak dokonać zwrotu?")}
                className='whitespace-nowrap px-2.5 py-1 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors'
              >
                🔄 Zwroty 30 dni
              </button>
              <button
                onClick={() =>
                  handleQuickQuestion("Z jakiej skóry są torebki?")
                }
                className='whitespace-nowrap px-2.5 py-1 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors'
              >
                ✨ Włoska skóra
              </button>
            </div>

            {/* Formularz wprowadzania wiadomości */}
            <form
              onSubmit={handleSendMessage}
              className='p-3 border-t border-border flex items-center gap-2 bg-card'
            >
              <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Napisz wiadomość...'
                className='flex-1 text-xs px-3 py-2 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring'
              />
              <button
                type='submit'
                className='p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity'
                aria-label='Wyślij wiadomość'
              >
                <Send className='w-4 h-4' />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pływający okrągły przycisk dymku czatu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none ring-4 ring-border/50'
        aria-label='Otwórz czat z konsultantem'
      >
        {isOpen ? (
          <X className='w-6 h-6' />
        ) : (
          <MessageSquare className='w-6 h-6' />
        )}
      </button>
    </div>
  )
}
