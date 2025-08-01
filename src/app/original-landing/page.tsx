'use client'

import React from 'react'
import HeroSection from "@/original-landing/components/HeroSection"
import PainPointsSection from "@/original-landing/components/PainPointsSection"
import StopCarryingSection from "@/original-landing/components/StopCarryingSection"
import FeatureSection from "@/original-landing/components/FeatureSection"
import IssueTrackingSection from "@/original-landing/components/IssueTrackingSection"
import FoundationsSection from "@/original-landing/components/FoundationsSection"
import FAQSection from "@/original-landing/components/FAQSection"
import Footer from "@/original-landing/components/Footer"
import Header from "@/original-landing/components/Header"
import "@/original-landing/index.css"

export default function OriginalLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <PainPointsSection />
      <StopCarryingSection />
      <FoundationsSection />
      <FeatureSection />
      <IssueTrackingSection />
      <FAQSection />
      <Footer />
    </div>
  )
}