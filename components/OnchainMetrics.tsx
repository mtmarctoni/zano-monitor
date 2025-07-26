import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Zap, Shield, Database, Network, TrendingUp, Clock, Users } from "lucide-react"
import type { OnchainData } from "@/types/dashboard"
import { onchainService } from "@/services/onchainService"

interface OnchainMetricsProps {
  data: OnchainData
}

export function OnchainMetrics({ data }: OnchainMetricsProps) {
  const getAdoptionColor = (score: number) => {
    if (score >= 70) return "text-matrix-green"
    if (score >= 40) return "text-cyber-orange"
    return "text-cyber-red"
  }

  const getAdoptionBadge = (score: number) => {
    if (score >= 70) return "bg-matrix-green-dim text-matrix-green-dark border-matrix-green"
    if (score >= 40) return "bg-cyber-orange/20 text-cyber-orange border-cyber-orange"
    return "bg-cyber-red/20 text-cyber-red border-cyber-red"
  }

  const getNetworkStatusColor = (state: number) => {
    switch (state) {
      case 2:
        return "text-matrix-green"
      case 1:
        return "text-cyber-orange"
      default:
        return "text-cyber-red"
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`
    return `${(seconds / 3600).toFixed(1)}h`
  }

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-text-secondary" />
          Blockchain Metrics
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-text-secondary">Network Adoption Score</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${data.adoptionScore >= 70 ? "bg-matrix-green" : data.adoptionScore >= 40 ? "bg-cyber-orange" : "bg-cyber-red"
                  }`}
                style={{ width: `${data.adoptionScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-text-primary">{data.adoptionScore.toFixed(0)}/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Status Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
            <Shield className="h-6 w-6 text-matrix-green" />
            <div>
              <p className="text-sm text-text-secondary font-medium">Network Status</p>
              <p className={`text-lg font-bold ${getNetworkStatusColor(data.networkState)}`}>
                {onchainService.getNetworkHealthStatus(data.networkState)}
              </p>
              <p className="text-xs text-text-secondary">Blockchain state</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
            <Database className="h-6 w-6 text-cyber-blue" />
            <div>
              <p className="text-sm text-text-secondary font-medium">Block Height</p>
              <p className="text-lg font-bold text-text-primary">{formatNumber(data.height)}</p>
              <p className="text-xs text-text-secondary">Current block</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
            <Zap className="h-6 w-6 text-cyber-orange" />
            <div>
              <p className="text-sm text-text-secondary font-medium">Hashrate</p>
              <p className="text-lg font-bold text-text-primary">{onchainService.formatHashrate(data.hashrate)}</p>
              <p className="text-xs text-text-secondary">Network security</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
            <Network className="h-6 w-6 text-cyber-purple" />
            <div>
              <p className="text-sm text-text-secondary font-medium">Connections</p>
              <p className="text-lg font-bold text-text-primary">{data.synchronizedConnections}</p>
              <p className="text-xs text-text-secondary">Peer nodes</p>
            </div>
          </div>
        </div>

        {/* Transaction Activity */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Transaction Activity
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-bg-secondary rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-secondary font-medium">Daily Transactions</span>
                <span className="text-2xl font-bold text-text-primary">{formatNumber(data.dailyTransactions)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-text-secondary">
                <span>Network usage indicator</span>
                <span className={data.dailyTransactions > 50 ? "text-matrix-green" : "text-cyber-orange"}>
                  {data.dailyTransactions > 50 ? "Active" : "Low Activity"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-bg-secondary rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-secondary font-medium">Daily Volume</span>
                <span className="text-2xl font-bold text-text-primary">{formatNumber(data.dailyVolume)} ZANO</span>
              </div>
              <div className="flex justify-between items-center text-xs text-text-secondary">
                <span>Economic activity</span>
                <span>≈ ${(data.dailyVolume * 9.87).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network Performance */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Network Performance
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-bg-secondary rounded-lg border border-border">
              <p className="text-sm text-text-secondary">Avg Block Time</p>
              <p className="text-lg font-bold text-text-primary">{formatTime(data.avgBlockTime)}</p>
              <p className="text-xs text-text-secondary">Target: 60s</p>
            </div>

            <div className="p-3 bg-bg-secondary rounded-lg border border-border">
              <p className="text-sm text-text-secondary">Mempool Size</p>
              <p className="text-lg font-bold text-text-primary">{data.txPoolSize}</p>
              <p className="text-xs text-text-secondary">Pending transactions</p>
            </div>

            <div className="p-3 bg-bg-secondary rounded-lg border border-border">
              <p className="text-sm text-text-secondary">Block Utilization</p>
              <p className="text-lg font-bold text-text-primary">{data.blockSizeUtilization.toFixed(1)}%</p>
              <p className="text-xs text-text-secondary">Capacity usage</p>
            </div>

            <div className="p-3 bg-bg-secondary rounded-lg border border-border">
              <p className="text-sm text-text-secondary">Last Block</p>
              <p className="text-lg font-bold text-text-primary">{formatTimestamp(data.lastBlockTimestamp)}</p>
              <p className="text-xs text-text-secondary">Most recent</p>
            </div>
          </div>
        </div>

        {/* Economic Metrics */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary flex items-center gap-2">
            <Users className="h-4 w-4" />
            Economic Metrics
          </h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center p-3 bg-bg-secondary rounded-lg border border-border">
              <span className="text-sm text-text-secondary">Total Supply</span>
              <span className="text-sm font-bold text-text-primary">{formatNumber(data.totalCoins)} ZANO</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-bg-secondary rounded-lg border border-border">
              <span className="text-sm text-text-secondary">Block Reward</span>
              <span className="text-sm font-bold text-text-primary">{data.blockReward.toLocaleString()} ZANO</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-bg-secondary rounded-lg border border-border">
              <span className="text-sm text-text-secondary">Total Transactions</span>
              <span className="text-sm font-bold text-text-primary">{formatNumber(data.transactionCount)}</span>
            </div>
          </div>
        </div>

        {/* Growth Indicators */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary">Growth Analysis</h4>
          <div className="p-4 bg-bg-secondary rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-secondary">Network Growth Rate</span>
              <span className={`text-lg font-bold ${data.networkGrowthRate >= 0 ? "text-matrix-green" : "text-cyber-red"}`}>
                {data.networkGrowthRate >= 0 ? "+" : ""}
                {data.networkGrowthRate.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              {data.networkGrowthRate >= 0 ? "Growing network activity" : "Declining network activity"}
            </p>
          </div>
        </div>

        {/* Network Health Summary */}
        <div className="text-xs text-text-secondary bg-bg-secondary p-4 rounded-lg border border-border">
          <p className="font-medium mb-2 text-text-primary">Network Health Summary</p>
          <div className="space-y-1">
            <p>
              • Network is {onchainService.getNetworkHealthStatus(data.networkState).toLowerCase()} with{" "}
              {data.synchronizedConnections} peer connections
            </p>
            <p>
              • Processing {data.dailyTransactions} transactions daily with {formatNumber(data.dailyVolume)} ZANO volume
            </p>
            <p>
              • Block production averaging {formatTime(data.avgBlockTime)} with {data.blockSizeUtilization.toFixed(1)}%
              capacity utilization
            </p>
            <p>
              • Overall adoption score: {data.adoptionScore}/100 ({onchainService.getAdoptionLevel(data.adoptionScore)}{" "}
              adoption)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}