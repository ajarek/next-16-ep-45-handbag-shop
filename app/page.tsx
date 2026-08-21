"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { CategoriesSection } from "@/components/categories/CategoriesSection";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { BestsellersSection } from "@/components/products/BestsellersSection";
import { StyleGuideSection } from "@/components/sections/StyleGuideSection";
import { CraftsmanshipSection } from "@/components/sections/CraftsmanshipSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { Footer } from "@/components/footer/Footer";

export default function HomePage() {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategoryFilter(categoryId);
  };

  const handleClearCategory = () => {
    setActiveCategoryFilter(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Pasek nawigacji */}
      <Navbar />

      {/* Główna treść strony */}
      <main className="grow">
        {/* Sekcja Hero z interaktywnym shaderem WebGL i torebką na kamieniu */}
        <HeroSection />

        {/* Sekcja 5 głównych kategorii torebek */}
        <CategoriesSection onSelectCategory={handleSelectCategory} />

        {/* Wyróżniki zaufania i korzyści */}
        <TrustBadges />

        {/* Sekcja bestsellerów i nowej kolekcji z filtrowaniem */}
        <BestsellersSection
          activeCategoryFilter={activeCategoryFilter}
          onClearCategoryFilter={handleClearCategory}
        />

        {/* Przewodnik stylów */}
        <StyleGuideSection />

        {/* Opowieść o kunszcie rzemiosła i włoskiej skórze */}
        <CraftsmanshipSection />

        {/* Opinie zadowolonych klientek */}
        <TestimonialsSection />

        {/* Ekskluzywny newsletter z kodem rabatowym */}
        <NewsletterSection />
      </main>

      {/* Stopka sklepu */}
      <Footer />
    </div>
  );
}
