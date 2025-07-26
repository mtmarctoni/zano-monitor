import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Zap, Shield, Database, Network, TrendingUp, Clock, Users } from "lucide-react"
import type { OnchainData } from "@/types/dashboard"
import { onchainService } from "@/services/onchainService"

interface OnchainMetricsProps {
  data: OnchainData
}

export function OnchainMetrics({ data }: OnchainMetricsProps) {
  const getAdoptionColor = (score: number) => {
    if (score >= 70) return "text-green-500"
    if (score >= 40) return "text-yellow-500"
    return "text-red-500"
  }

  const getAdoptionBadge = (score: number) => {
    if (score >= 70) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getNetworkStatusColor = (state: number) => {
    switch (state) {
      case 2:
        return "text-green-500"
      case 1:
        return "text-yellow-500"
      default:
        return "text-red-500"
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
          <Activity className="h-5 w-5 text-blue-600" />
          Blockchain Metrics
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-slate-600">Network Adoption Score</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  data.adoptionScore >= 70 ? "bg-green-500" : data.adoptionScore >= 40 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${data.adoptionScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-900">{data.adoptionScore.toFixed(0)}/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Status Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <Shield className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm text-green-700 font-medium">Network Status</p>
              <p className={`text-lg font-bold ${getNetworkStatusColor(data.networkState)}`}>
                {onchainService.getNetworkHealthStatus(data.networkState)}
              </p>
              <p className="text-xs text-green-600">Blockchain state</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <Database className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700 font-medium">Block Height</p>
              <p className="text-lg font-bold text-blue-800">{formatNumber(data.height)}</p>
              <p className="text-xs text-blue-600">Current block</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <Zap className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-700 font-medium">Hashrate</p>
              <p className="text-lg font-bold text-yellow-800">{onchainService.formatHashrate(data.hashrate)}</p>
              <p className="text-xs text-yellow-600">Network security</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <Network className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-sm text-purple-700 font-medium">Connections</p>
              <p className="text-lg font-bold text-purple-800">{data.synchronizedConnections}</p>
              <p className="text-xs text-purple-600">Peer nodes</p>
            </div>
          </div>
        </div>

        {/* Transaction Activity */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Transaction Activity
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-blue-700 font-medium">Daily Transactions</span>
                <span className="text-2xl font-bold text-blue-800">{formatNumber(data.dailyTransactions)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-blue-600">
                <span>Network usage indicator</span>
                <span className={data.dailyTransactions > 50 ? "text-green-600" : "text-orange-600"}>
                  {data.dailyTransactions > 50 ? "Active" : "Low Activity"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-700 font-medium">Daily Volume</span>
                <span className="text-2xl font-bold text-green-800">{formatNumber(data.dailyVolume)} ZANO</span>
              </div>
              <div className="flex justify-between items-center text-xs text-green-600">
                <span>Economic activity</span>
                <span>≈ ${(data.dailyVolume * 9.87).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network Performance */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Network Performance
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">Avg Block Time</p>
              <p className="text-lg font-bold text-slate-900">{formatTime(data.avgBlockTime)}</p>
              <p className="text-xs text-slate-500">Target: 60s</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">Mempool Size</p>
              <p className="text-lg font-bold text-slate-900">{data.txPoolSize}</p>
              <p className="text-xs text-slate-500">Pending transactions</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">Block Utilization</p>
              <p className="text-lg font-bold text-slate-900">{data.blockSizeUtilization.toFixed(1)}%</p>
              <p className="text-xs text-slate-500">Capacity usage</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">Last Block</p>
              <p className="text-lg font-bold text-slate-900">{formatTimestamp(data.lastBlockTimestamp)}</p>
              <p className="text-xs text-slate-500">Most recent</p>
            </div>
          </div>
        </div>

        {/* Economic Metrics */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Economic Metrics
          </h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Total Supply</span>
              <span className="text-sm font-bold text-slate-900">{formatNumber(data.totalCoins)} ZANO</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Block Reward</span>
              <span className="text-sm font-bold text-slate-900">{data.blockReward.toLocaleString()} ZANO</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Total Transactions</span>
              <span className="text-sm font-bold text-slate-900">{formatNumber(data.transactionCount)}</span>
            </div>
          </div>
        </div>

        {/* Growth Indicators */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">Growth Analysis</h4>
          <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Network Growth Rate</span>
              <span className={`text-lg font-bold ${data.networkGrowthRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                {data.networkGrowthRate >= 0 ? "+" : ""}
                {data.networkGrowthRate.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {data.networkGrowthRate >= 0 ? "Growing network activity" : "Declining network activity"}
            </p>
          </div>
        </div>

        {/* Network Health Summary */}
        <div className="text-xs text-slate-500 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <p className="font-medium mb-2 text-slate-700">Network Health Summary</p>
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
