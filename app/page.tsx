"use client"

import { RefreshCw, DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { MetricCard } from "@/components/MetricCard"
import { DevelopmentActivity } from "@/components/DevelopmentActivity"
import { ErrorDisplay } from "@/components/ErrorBoundary"
import { ConnectionStatus } from "@/components/ConnectionStatus"
import { useZanoData } from "@/hooks/useZanoData"
import { formatPrice, formatLargeNumber, formatPercentage, getPercentageColor, getTrendIcon } from "@/utils/formatters"
import { OnchainMetrics } from "@/components/OnchainMetrics"

export default function Dashboard() {
  const { data, isLoading, error, lastUpdated, refreshData } = useZanoData()

  if (error) {
    return <ErrorDisplay error={error} onRetry={refreshData} />
  }

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-slate-200 rounded-lg"></div>
              <div className="h-96 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Zano Network Monitor</h1>
              <p className="text-slate-600">
                Real-time monitoring of the Zano cryptocurrency network, development activity, and blockchain metrics
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Updating..." : "Refresh"}
              </button>
            </div>
          </div>
          <div className="mt-2">
            <ConnectionStatus isConnected={!error} lastUpdated={lastUpdated} isLoading={isLoading} />
          </div>
        </div>

        {/* Price Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="ZANO Price"
            value={formatPrice(data.price.current)}
            subtitle={
              <span className={getPercentageColor(data.price.change24h)}>
                {formatPercentage(data.price.change24h)} (24h)
              </span>
            }
            icon={<DollarSign className="h-6 w-6" />}
            trend={getTrendIcon(data.price.change24h)}
          />

          <MetricCard
            title="Market Cap"
            value={formatLargeNumber(data.price.marketCap)}
            subtitle={
              <span className={getPercentageColor(data.price.change7d)}>
                {formatPercentage(data.price.change7d)} (7d)
              </span>
            }
            icon={<BarChart3 className="h-6 w-6" />}
            trend={getTrendIcon(data.price.change7d)}
          />

          <MetricCard
            title="24h Volume"
            value={formatLargeNumber(data.price.volume24h)}
            subtitle="Trading activity"
            icon={<TrendingUp className="h-6 w-6" />}
            trend="neutral"
          />

          <MetricCard
            title="Network Score"
            value={`${data.onchain.adoptionScore}/100`}
            subtitle="Adoption & health"
            icon={<TrendingUp className="h-6 w-6" />}
            trend={data.onchain.adoptionScore >= 70 ? "up" : data.onchain.adoptionScore >= 40 ? "neutral" : "down"}
          />
        </div>

        {/* Development Activity and Onchain Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DevelopmentActivity data={data.github} />
          <OnchainMetrics data={data.onchain} />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            This dashboard provides real-time monitoring of the Zano cryptocurrency network using live data from
            CoinGecko, GitHub, and the Zano blockchain explorer.
          </p>
          <p className="mt-1">
            Data updates automatically. Market data from CoinGecko • Development data from GitHub • Blockchain data from
            Zano Explorer
          </p>
        </div>
      </div>
    </div>
  )
}
