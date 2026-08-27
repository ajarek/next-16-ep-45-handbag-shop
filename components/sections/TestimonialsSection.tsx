"use client"

import React, { useState, useEffect } from "react"
import { Star, CheckCircle, Quote } from "lucide-react"
import { Review } from "@/lib/types"
import { motion } from "framer-motion"

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetch("/data/reviews.json")
      .then((res) => res.json())
      .then((data: Review[]) => setReviews(data))
      .catch(() => {})
  }, [])

  return (
    <section
      id='opinie'
      className='py-20 bg-surface text-foreground transition-colors duration-300'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Nagłówek */}
        <div className='text-center max-w-2xl mx-auto mb-14 space-y-2'>
          <span className='text-[11px] font-semibold tracking-[0.25em] text-accent uppercase'>
            SŁOWA NASZYCH KLIENTEK
          </span>
          <h2 className='font-serif text-3xl sm:text-4xl text-foreground tracking-tight'>
            Opinie i doświadczenia
          </h2>
          <p className='text-xs sm:text-sm text-muted-foreground font-light'>
            Zobacz, jak nasze torebki stają się nieodłączną częścią codzienności
            wyjątkowych kobiet.
          </p>
        </div>

        {/* Karty opinii */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8'>
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className='flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-card text-card-foreground border border-border shadow-sm hover:shadow-lg transition-shadow relative'
            >
              <Quote className='w-8 h-8 text-border absolute top-6 right-6 pointer-events-none opacity-60' />

              <div>
                {/* Gwiazdki */}
                <div className='flex items-center gap-1 text-amber-500 mb-4'>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className='w-4 h-4 fill-current' />
                  ))}
                </div>

                {/* Komentarz */}
                <p className='text-xs sm:text-sm text-foreground leading-relaxed italic mb-6'>
                  „{rev.comment}”
                </p>
              </div>

              {/* Informacja o autorce i produkcie */}
              <div className='pt-4 border-t border-border/60 flex items-center justify-between'>
                <div>
                  <div className='flex items-center gap-1.5'>
                    <h4 className='font-serif text-sm font-semibold text-foreground'>
                      {rev.author}
                    </h4>
                    {rev.verified && (
                      <span title='Zweryfikowany zakup' className='inline-flex'>
                        <CheckCircle className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400' />
                      </span>
                    )}
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    {rev.city} • <span>{rev.date}</span>
                  </p>
                </div>

                <span className='text-[10px] uppercase font-semibold text-accent bg-secondary px-2 py-1 rounded-md max-w-30 truncate'>
                  {rev.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
