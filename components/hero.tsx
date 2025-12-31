import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Shield, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-6 py-2.5 mb-8 border border-primary/20 shadow-sm animate-scale-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Powered by AI & Blockchain</span>
            <Shield className="h-4 w-4 text-accent" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 text-balance leading-tight tracking-tight">
            <span className="block mb-2">Molecular Docking</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Data Intelligence
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
            Transform your drug discovery workflow with AI-powered data management, blockchain verification, and
            intelligent insights for accelerated research.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:shadow-xl group px-8 h-12 text-base transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="group px-8 h-12 text-base hover:bg-muted transition-all duration-200 bg-transparent"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              { value: "1M+", label: "Simulations Processed", color: "from-primary to-accent" },
              { value: "99.9%", label: "Data Integrity", color: "from-accent to-primary" },
              { value: "10x", label: "Faster Analysis", color: "from-primary to-accent" },
              { value: "24/7", label: "AI Support", color: "from-accent to-primary" },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                >
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-40 left-10 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-glow" />
        <div
          className="absolute top-60 right-10 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </div>
  )
}
