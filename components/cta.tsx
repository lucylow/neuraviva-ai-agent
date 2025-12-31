import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Shield } from "lucide-react"
import Link from "next/link"

const features = [
  "AI-powered data classification",
  "Blockchain verification on Solana",
  "Real-time processing pipeline",
  "Team collaboration tools",
  "Advanced analytics dashboard",
  "24/7 technical support",
]

export function CTA() {
  return (
    <div className="bg-gradient-to-br from-primary/20 via-background to-accent/20 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-border">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Secure & Compliant</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Ready to Transform Your Research?
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
            Join hundreds of research teams accelerating drug discovery with our AI-powered data management platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-foreground">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent group">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">14-day</div>
              <div className="text-sm text-muted-foreground">Free Trial</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">No credit card</div>
              <div className="text-sm text-muted-foreground">Required</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">$0</div>
              <div className="text-sm text-muted-foreground">Setup Fee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
