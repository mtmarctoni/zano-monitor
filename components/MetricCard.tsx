import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | ReactNode
  subtitle?: string | ReactNode
  icon?: ReactNode
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function MetricCard({ title, value, subtitle, icon, trend = "neutral", className = "" }: MetricCardProps) {
  const trendColors = {
    up: "border-l-matrix-green",
    down: "border-l-cyber-red",
    neutral: "border-l-cyber-orange",
  }

  return (
    <Card
      className={`border-l-4 ${trendColors[trend]} bg-bg-secondary hover:shadow-lg transition-shadow duration-200 ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
            <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
            {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
          </div>
          {icon && <div className="ml-4 text-text-dim">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}