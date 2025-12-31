import { Brain, Shield, RefreshCw, Lock, BarChart3, Cloud } from "lucide-react"

const features = [
  {
    name: "AI-Powered Classification",
    description:
      "Automatically categorize docking results using Gemini AI, tagging proteins, binding strengths, and therapeutic areas.",
    icon: Brain,
  },
  {
    name: "Blockchain Verification",
    description: "Every data point is verified on Solana blockchain, ensuring tamper-proof integrity and traceability.",
    icon: Shield,
  },
  {
    name: "Real-time Processing",
    description: "Process docking files instantly with our automated pipeline, from upload to analysis.",
    icon: RefreshCw,
  },
  {
    name: "Secure Storage",
    description: "Data stored on decentralized IPFS with military-grade encryption and access controls.",
    icon: Lock,
  },
  {
    name: "Advanced Analytics",
    description: "Visualize binding patterns, protein interactions, and research trends with interactive dashboards.",
    icon: BarChart3,
  },
  {
    name: "Collaborative Workspace",
    description: "Share datasets securely with team members, track changes, and manage research projects.",
    icon: Cloud,
  },
]

export function Features() {
  return (
    <div id="features" className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Everything You Need for Modern Drug Discovery
          </h2>
          <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
            Our platform combines cutting-edge AI, blockchain technology, and collaborative tools to accelerate your
            research.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="group relative bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="mb-4">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.name}</h3>

              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>

              <div className="mt-4">
                <span className="text-sm font-medium text-primary group-hover:text-accent transition-colors">
                  Learn more →
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-br from-card to-secondary rounded-2xl p-8 border border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Seamless Integration</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Works with all major docking software including AutoDock Vina, Schrödinger Glide, GROMACS, and more.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Vina", "Glide", "GROMACS", "AutoDock", "OpenMM"].map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 bg-background/50 rounded-full text-sm font-medium text-foreground border border-border"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-background/50 rounded-xl p-6 backdrop-blur-sm border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">Processing Pipeline</div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-foreground">Live</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">File Upload</span>
                    <span className="text-sm text-green-500">✓ Complete</span>
                  </div>
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">AI Analysis</span>
                    <span className="text-sm text-primary">In Progress</span>
                  </div>
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3 animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Blockchain Storage</span>
                    <span className="text-sm text-muted-foreground">Pending</span>
                  </div>
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-1/3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
