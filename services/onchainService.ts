import type { OnchainData } from "@/types/dashboard"
import { API_CONFIG } from "@/config/api"

export interface ZanoInfoResponse {
  alias_count: number
  alt_blocks_count: number
  block_reward: number
  current_blocks_median: number
  current_max_allowed_block_size: number
  current_network_hashrate_350: number
  current_network_hashrate_50: number
  daemon_network_state: number
  default_fee: number
  height: number
  incoming_connections_count: number
  last_block_hash: string
  last_block_size: number
  last_block_timestamp: number
  last_block_total_reward: number
  outgoing_connections_count: number
  pos_difficulty: string
  pow_difficulty: number
  status: string
  synchronized_connections_count: number
  total_coins: string
  transactions_cnt_per_day: number
  transactions_volume_per_day: number
  tx_count: number
  tx_count_in_last_block: number
  tx_pool_size: number
  white_peerlist_size: number
  grey_peerlist_size: number
}

export interface ZanoBlocksResponse {
  id: number
  jsonrpc: string
  result: {
    blocks: Array<{
      timestamp: number
      tx_count: number
      block_cumulative_size: number
      height: number
    }>
  }
}

export class OnchainService {
  private static instance: OnchainService

  static getInstance(): OnchainService {
    if (!OnchainService.instance) {
      OnchainService.instance = new OnchainService()
    }
    return OnchainService.instance
  }

  private getHeaders(): HeadersInit {
    return {
      ...API_CONFIG.REQUEST.DEFAULT_HEADERS,
      Accept: "application/json",
    }
  }

  private async makeRequest(url: string): Promise<Response> {
    console.log("Making request to:", url) // Debug log

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.ONCHAIN.TIMEOUT)

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal,
        next: { revalidate: API_CONFIG.ONCHAIN.CACHE_TTL },
      })

      clearTimeout(timeoutId)

      console.log("Response status:", response.status) // Debug log

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText) // Debug log
        throw new Error(`API request failed: ${response.status} - ${errorText}`)
      }

      return response
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("Request error:", error) // Debug log

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(API_CONFIG.ERROR_MESSAGES.TIMEOUT)
      }
      throw error
    }
  }

  private calculateAdoptionScore(data: ZanoInfoResponse, recentBlocks?: any[]): number {
    // Calculate adoption score based on multiple factors (0-100)
    let score = 0

    // Network health (30 points)
    if (data.daemon_network_state === 2) score += 15 // Fully synced
    if (data.synchronized_connections_count > 10) score += 10
    if (data.incoming_connections_count > 5) score += 5

    // Transaction activity (40 points)
    if (data.transactions_cnt_per_day > 100) score += 20
    else if (data.transactions_cnt_per_day > 50) score += 15
    else if (data.transactions_cnt_per_day > 10) score += 10
    else if (data.transactions_cnt_per_day > 0) score += 5

    if (data.transactions_volume_per_day > 1000000000000)
      score += 20 // > 1000 ZANO
    else if (data.transactions_volume_per_day > 100000000000)
      score += 15 // > 100 ZANO
    else if (data.transactions_volume_per_day > 10000000000)
      score += 10 // > 10 ZANO
    else if (data.transactions_volume_per_day > 0) score += 5

    // Network security (20 points)
    if (data.current_network_hashrate_350 > 10000000000) score += 10
    else if (data.current_network_hashrate_350 > 1000000000) score += 7
    else if (data.current_network_hashrate_350 > 100000000) score += 5

    if (data.tx_pool_size < 100)
      score += 5 // Low mempool indicates good processing
    else if (data.tx_pool_size < 500) score += 3
    else if (data.tx_pool_size < 1000) score += 1

    // Block utilization (10 points)
    if (recentBlocks && recentBlocks.length > 0) {
      const avgBlockSize =
        recentBlocks.reduce((sum, block) => sum + (block.block_cumulative_size || 0), 0) / recentBlocks.length
      const utilization = avgBlockSize / data.current_max_allowed_block_size
      if (utilization > 0.5) score += 10
      else if (utilization > 0.3) score += 7
      else if (utilization > 0.1) score += 5
      else if (utilization > 0.01) score += 3
    }

    return Math.min(100, Math.max(0, score))
  }

  private calculateNetworkGrowthRate(recentBlocks: any[]): number {
    if (!recentBlocks || recentBlocks.length < 2) return 0

    // Calculate transaction growth rate over recent blocks
    const oldBlocks = recentBlocks.slice(0, Math.floor(recentBlocks.length / 2))
    const newBlocks = recentBlocks.slice(Math.floor(recentBlocks.length / 2))

    const oldAvgTxs = oldBlocks.reduce((sum, block) => sum + (block.tx_count || 0), 0) / oldBlocks.length
    const newAvgTxs = newBlocks.reduce((sum, block) => sum + (block.tx_count || 0), 0) / newBlocks.length

    if (oldAvgTxs === 0) return newAvgTxs > 0 ? 100 : 0
    return ((newAvgTxs - oldAvgTxs) / oldAvgTxs) * 100
  }

  private calculateAvgBlockTime(recentBlocks: any[]): number {
    if (!recentBlocks || recentBlocks.length < 2) return 60 // Default 1 minute

    const timestamps = recentBlocks
      .map((block) => block.timestamp)
      .filter((t) => t)
      .sort((a, b) => a - b)
    if (timestamps.length < 2) return 60

    const intervals = []
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1])
    }

    return intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
  }

  async fetchNetworkInfo(): Promise<ZanoInfoResponse> {
    try {
      // Use the correct endpoint format from the documentation
      const url = `${API_CONFIG.ONCHAIN.BASE_URL}/get_info/4294967295`
      const response = await this.makeRequest(url)
      const result = await response.json()
      const data = result.result

      console.log("Network info response:", data) // Debug log

      if (!data || data.status !== "OK") {
        throw new Error(`Invalid response: ${data?.status || "No status"}`)
      }

      return data
    } catch (error) {
      console.error("Error fetching network info:", error)
      throw new Error(
        `Failed to fetch network information: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  async fetchRecentBlocks(count = 50): Promise<any[]> {
    try {
      // Use the correct endpoint format from the documentation
      const url = `${API_CONFIG.ONCHAIN.BASE_URL}/get_blocks_details/0/${count}`
      const response = await this.makeRequest(url)
      const data: ZanoBlocksResponse = await response.json()

      console.log("Blocks response:", data) // Debug log

      if (!data.result || !data.result.blocks) {
        console.warn("No blocks data in response")
        return []
      }

      return data.result.blocks
    } catch (error) {
      console.error("Error fetching recent blocks:", error)
      return [] // Return empty array instead of throwing
    }
  }

  async fetchTotalCoins(): Promise<number> {
    try {
      const url = `${API_CONFIG.ONCHAIN.BASE_URL}/get_total_coins`
      const response = await this.makeRequest(url)
      const totalCoinsText = await response.text()

      console.log("Total coins response:", totalCoinsText) // Debug log

      const totalCoins = Number.parseInt(totalCoinsText.trim())
      if (isNaN(totalCoins)) {
        throw new Error(`Invalid total coins response: ${totalCoinsText}`)
      }

      return totalCoins / Math.pow(10, API_CONFIG.ZANO.DECIMALS)
    } catch (error) {
      console.error("Error fetching total coins:", error)
      return 0 // Return 0 instead of throwing
    }
  }

  async fetchAllData(): Promise<OnchainData> {
    try {
      console.log("Starting onchain data fetch...") // Debug log

      // Fetch network info first (most critical)
      const networkInfo = await this.fetchNetworkInfo()
      console.log("Network info fetched successfully") // Debug log

      // Fetch other data in parallel, but don't fail if they error
      const [recentBlocksResult, totalCoinsResult] = await Promise.allSettled([
        this.fetchRecentBlocks(30),
        this.fetchTotalCoins(),
      ])

      const blocks = recentBlocksResult.status === "fulfilled" ? recentBlocksResult.value : []
      const coins = totalCoinsResult.status === "fulfilled" ? totalCoinsResult.value : 0

      console.log("Additional data fetched:", { blocksCount: blocks.length, coins }) // Debug log

      // Calculate derived metrics
      const avgBlockTime = this.calculateAvgBlockTime(blocks)
      const networkGrowthRate = this.calculateNetworkGrowthRate(blocks)
      const adoptionScore = this.calculateAdoptionScore(networkInfo, blocks)

      // Calculate block size utilization
      const avgBlockSize =
        blocks.length > 0
          ? blocks.reduce((sum, block) => sum + (block.block_cumulative_size || 0), 0) / blocks.length
          : 0
      const blockSizeUtilization =
        networkInfo.current_max_allowed_block_size > 0
          ? (avgBlockSize / networkInfo.current_max_allowed_block_size) * 100
          : 0

      const result: OnchainData = {
        // Network Health Metrics
        height: networkInfo.height || 0,
        hashrate: networkInfo.current_network_hashrate_350 || 0,
        difficulty: networkInfo.pow_difficulty || 0,
        networkState: networkInfo.daemon_network_state || 0,

        // Adoption Metrics
        totalCoins:
          coins ||
          (networkInfo.total_coins
            ? Number.parseInt(networkInfo.total_coins) / Math.pow(10, API_CONFIG.ZANO.DECIMALS)
            : 0),
        transactionCount: networkInfo.tx_count || 0,
        dailyTransactions: networkInfo.transactions_cnt_per_day || 0,
        dailyVolume: (networkInfo.transactions_volume_per_day || 0) / Math.pow(10, API_CONFIG.ZANO.DECIMALS),

        // Network Activity
        txPoolSize: networkInfo.tx_pool_size || 0,
        blockReward: (networkInfo.block_reward || 0) / Math.pow(10, API_CONFIG.ZANO.DECIMALS),
        lastBlockTimestamp: networkInfo.last_block_timestamp || 0,
        avgBlockTime,

        // Network Connectivity
        incomingConnections: networkInfo.incoming_connections_count || 0,
        outgoingConnections: networkInfo.outgoing_connections_count || 0,
        synchronizedConnections: networkInfo.synchronized_connections_count || 0,

        // Growth Indicators
        blockSizeUtilization,
        networkGrowthRate,
        adoptionScore,
      }

      console.log("Onchain data calculated successfully:", result) // Debug log
      return result
    } catch (error) {
      console.error("Error in fetchAllData:", error)
      throw new Error(`Failed to fetch blockchain data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Utility methods
  getNetworkHealthStatus(networkState: number): string {
    switch (networkState) {
      case 0:
        return "Disconnected"
      case 1:
        return "Synchronizing"
      case 2:
        return "Synchronized"
      default:
        return "Unknown"
    }
  }

  getAdoptionLevel(score: number): "high" | "medium" | "low" {
    if (score >= 70) return "high"
    if (score >= 40) return "medium"
    return "low"
  }

  formatHashrate(hashrate: number): string {
    if (hashrate >= 1e12) return `${(hashrate / 1e12).toFixed(2)} TH/s`
    if (hashrate >= 1e9) return `${(hashrate / 1e9).toFixed(2)} GH/s`
    if (hashrate >= 1e6) return `${(hashrate / 1e6).toFixed(2)} MH/s`
    if (hashrate >= 1e3) return `${(hashrate / 1e3).toFixed(2)} KH/s`
    return `${hashrate.toFixed(2)} H/s`
  }
}

// Export a default instance
export const onchainService = OnchainService.getInstance()
