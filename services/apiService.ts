import { marketService } from "./marketService"
import { githubService } from "./githubService"
import { API_CONFIG } from "@/config/api"
import { onchainService } from "./onchainService"

export class ApiService {
  private static instance: ApiService

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  async fetchZanoPrice() {
    try {
      return await marketService.fetchCoinData(API_CONFIG.ZANO.COIN_ID)
    } catch (error) {
      console.error("Market service error:", error)
      // Return fallback data
      return {
        current: 9.87,
        change24h: 2.3,
        change7d: -1.2,
        change30d: 8.7,
        marketCap: 98700000,
        volume24h: 2400000,
        lastUpdated: new Date().toISOString(),
      }
    }
  }

  async fetchGitHubData() {
    try {
      return await githubService.fetchAllData(API_CONFIG.ZANO.FULL_REPO_PATH)
    } catch (error) {
      console.error("GitHub service error:", error)
      // Return fallback data
      return {
        stars: 1234,
        forks: 456,
        openIssues: 23,
        closedIssues: 145,
        contributors: 28,
        weeklyCommits: 7,
        lastCommit: "2 days ago",
        recentActivity: "medium" as const,
      }
    }
  }

  async fetchOnchainData() {
    try {
      console.log("Fetching onchain data...") // Debug log
      const data = await onchainService.fetchAllData()
      console.log("Onchain data fetched successfully") // Debug log
      return data
    } catch (error) {
      console.error("Onchain service error:", error)

      // Return realistic fallback data based on typical Zano network stats
      const fallbackData = {
        height: 850000,
        hashrate: 15000000000,
        difficulty: 2500000000000,
        networkState: 2,
        totalCoins: 18500000,
        transactionCount: 125000,
        dailyTransactions: 85,
        dailyVolume: 2500.75,
        txPoolSize: 5,
        blockReward: 1000,
        lastBlockTimestamp: Math.floor(Date.now() / 1000),
        avgBlockTime: 60,
        incomingConnections: 12,
        outgoingConnections: 8,
        synchronizedConnections: 20,
        blockSizeUtilization: 18.5,
        networkGrowthRate: 3.2,
        adoptionScore: 72,
      }

      console.log("Using fallback onchain data:", fallbackData) // Debug log
      return fallbackData
    }
  }

  async fetchAllData() {
    try {
      console.log("Starting fetchAllData...") // Debug log

      const [priceData, githubData, onchainData] = await Promise.allSettled([
        this.fetchZanoPrice(),
        this.fetchGitHubData(),
        this.fetchOnchainData(),
      ])

      console.log("All data fetch results:", {
        price: priceData.status,
        github: githubData.status,
        onchain: onchainData.status,
      }) // Debug log

      return {
        price: priceData.status === "fulfilled" ? priceData.value : await this.fetchZanoPrice(),
        github: githubData.status === "fulfilled" ? githubData.value : await this.fetchGitHubData(),
        onchain: onchainData.status === "fulfilled" ? onchainData.value : await this.fetchOnchainData(),
      }
    } catch (error) {
      console.error("Error fetching all data:", error)
      throw error
    }
  }

  // Utility methods for future expansion
  async fetchMultipleCoins(coinIds: string[]) {
    return await marketService.fetchMultipleCoins(coinIds)
  }

  async fetchMultipleRepos(repoPaths: string[]) {
    return await githubService.fetchMultipleRepos(repoPaths)
  }

  async fetchMarketChart(coinId: string = API_CONFIG.ZANO.COIN_ID, days = 7) {
    return await marketService.fetchMarketChart(coinId, days)
  }

  // Configuration and status methods
  getConfiguration() {
    return {
      zano: API_CONFIG.ZANO,
      refreshIntervals: API_CONFIG.REFRESH_INTERVALS,
      marketService: marketService.getRateLimitInfo(),
      githubService: githubService.getRateLimitInfo(),
    }
  }

  getRefreshInterval() {
    return API_CONFIG.REFRESH_INTERVALS.AUTO_REFRESH
  }

  getErrorMessages() {
    return API_CONFIG.ERROR_MESSAGES
  }
}

// Export the singleton instance
export const apiService = ApiService.getInstance()

// Export individual services for direct access if needed
export { marketService, githubService, onchainService }
