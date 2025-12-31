import { TrendingUp, BarChart3, Users, Database } from "lucide-react"

const stats = [
  {
    title: "Data Points Processed",
    value: "1,258,472",
    icon: Database,
    change: "+12.4%",
  },
  {
    title: "Active Researchers",
    value: "428",
    icon: Users,
    change: "+8.2%",
  },
  {
    title: "Success Rate",
    value: "99.7%",
    icon: TrendingUp,
    change: "+0.3%",
  },
  {
    title: "Blockchain Transactions",
    value: "892,456",
    icon: BarChart3,
    change: "+15.7%",
  },
]

const institutions = ["Harvard University", "MIT", "Stanford", "NIH", "Pfizer", "Novartis"]

export function Statistics() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Trusted by Leading Research Institutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Our platform processes millions of docking simulations with unprecedented accuracy and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>

              <div className="mb-2">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </div>

              <div className="mt-4">
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-border">
          <p className="text-center text-muted-foreground mb-8">Trusted by leading research institutions</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {institutions.map((institution) => (
              <div key={institution} className="text-center p-4 hover:scale-105 transition-transform">
                <span className="text-lg font-semibold text-muted-foreground/70 hover:text-foreground transition-colors">
                  {institution}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
