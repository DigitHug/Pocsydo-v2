import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface KpiCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  variant: "coral" | "violet" | "cyan" | "navy"
  trend?: {
    value: number
    isPositive: boolean
  }
}

const variantStyles = {
  coral: {
    background: "bg-gradient-coral",
    textColor: "text-coral-foreground",
    iconBackground: "bg-white/20",
  },
  violet: {
    background: "bg-gradient-violet", 
    textColor: "text-violet-foreground",
    iconBackground: "bg-white/20",
  },
  cyan: {
    background: "bg-gradient-cyan",
    textColor: "text-cyan-foreground", 
    iconBackground: "bg-white/20",
  },
  navy: {
    background: "bg-gradient-navy",
    textColor: "text-navy-foreground",
    iconBackground: "bg-white/20",
  },
}

export function KpiCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant,
  trend 
}: KpiCardProps) {
  const styles = variantStyles[variant]
  
  return (
    <Card className={`${styles.background} ${styles.textColor} border-0 shadow-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-90">
              {title}
            </p>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tight">
                {value}
              </h3>
              <p className="text-sm opacity-80">
                {subtitle}
              </p>
              {trend && (
                <div className="flex items-center gap-1 text-xs">
                  <span className={trend.isPositive ? "text-green-200" : "text-red-200"}>
                    {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className={`${styles.iconBackground} p-3 rounded-xl backdrop-blur-sm`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </Card>
  )
}