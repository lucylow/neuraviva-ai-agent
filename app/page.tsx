import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { DemoChat } from "@/components/demo-chat"
import { LiveData } from "@/components/live-data"
import { Statistics } from "@/components/statistics"
import { CTA } from "@/components/cta"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Statistics />
        <Features />
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <DemoChat />
            <LiveData />
          </div>
        </div>
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
