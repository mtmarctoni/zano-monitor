import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | ReactNode
  subtitle?: string
  icon?: ReactNode
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function MetricCard({ title, value, subtitle, icon, trend = "neutral", className = "" }: MetricCardProps) {
  const trendColors = {
    up: "border-l-green-500",
    down: "border-l-red-500",
    neutral: "border-l-slate-400",
  }

  return (
    <Card className={`border-l-4 ${trendColors[trend]} hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
          {icon && <div className="ml-4 text-slate-400">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
