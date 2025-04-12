'use client'




import Navbar from '@/components/landingPage/navbar'
import FeaturesGrid from '@/components/landingPage/features-grid'
import HeroSection from '@/components/landingPage/hero-section'
import ProductDemo from '@/components/landingPage/product-demo'
import Testimonials from '@/components/landingPage/testimonials'
import HowItWorks from '@/components/landingPage/how-it-works'
import FinalCTA from '@/components/landingPage/final-cta'
import Footer from '@/components/landingPage/footer'


export default function Home() {
  return (
    <main className="min-h-screen">
         <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </main>
  )
}
