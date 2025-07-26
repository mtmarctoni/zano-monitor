"use client"

import { RefreshCw, DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { PriceOverview } from "@/components/PriceOverview"
import { DevelopmentActivity } from "@/components/DevelopmentActivity"
import { ErrorDisplay } from "@/components/ErrorBoundary"
import { ConnectionStatus } from "@/components/ConnectionStatus"
import { useZanoData } from "@/hooks/useZanoData"
import { OnchainMetrics } from "@/components/OnchainMetrics"
import { SocialMetrics } from "@/components/SocialMetrics"

export default function Dashboard() {
  const { data, isLoading, error, lastUpdated, refreshData } = useZanoData()

  if (error) {
    return <ErrorDisplay error={error} onRetry={refreshData} />
  }

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-bg-secondary rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-bg-secondary rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-bg-secondary rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-bg-secondary rounded-lg"></div>
              <div className="h-96 bg-bg-secondary rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Zano Network Monitor</h1>
              <p className="text-text-secondary">
                Real-time monitoring of the Zano cryptocurrency network, development activity, and blockchain metrics
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-matrix-green text-black rounded-lg hover:bg-matrix-green-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <PriceOverview data={data} />

        {/* Development Activity and Onchain Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DevelopmentActivity data={data.github} />
          <OnchainMetrics data={data.onchain} />
        </div>

        {/* Social Metrics */}
        <div className="mt-8">
          <SocialMetrics />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-text-dim">
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