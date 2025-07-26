import type { PriceData } from "@/types/dashboard"
import { API_CONFIG, getApiUrl, getRateLimit } from "@/config/api"

export interface CoinGeckoResponse {
  market_data: {
    current_price: { usd: number }
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    market_cap: { usd: number }
    total_volume: { usd: number }
  }
  last_updated: string
}

export class MarketService {
  private static instance: MarketService
  private apiKey?: string
  private baseUrl: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey
    this.baseUrl = apiKey ? API_CONFIG.COINGECKO.PRO_BASE_URL : API_CONFIG.COINGECKO.BASE_URL
  }

  static getInstance(apiKey?: string): MarketService {
    if (!MarketService.instance) {
      MarketService.instance = new MarketService(apiKey)
    }
    return MarketService.instance
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      ...API_CONFIG.REQUEST.DEFAULT_HEADERS,
    }

    if (this.apiKey) {
      headers["X-CG-Pro-API-Key"] = this.apiKey
    }

    return headers
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<Response> {
    const url = getApiUrl("COINGECKO", endpoint, params)
    const fullUrl = url.replace(API_CONFIG.COINGECKO.BASE_URL, this.baseUrl)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.COINGECKO.TIMEOUT)

    try {
      const response = await fetch(fullUrl, {
        headers: this.getHeaders(),
        signal: controller.signal,
        next: { revalidate: API_CONFIG.COINGECKO.CACHE_TTL },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(API_CONFIG.ERROR_MESSAGES.API_RATE_LIMIT)
        }
        throw new Error(`${API_CONFIG.ERROR_MESSAGES.API_UNAVAILABLE}: ${response.status}`)
      }

      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(API_CONFIG.ERROR_MESSAGES.TIMEOUT)
      }
      throw error
    }
  }

  async fetchCoinData(coinId: string = API_CONFIG.ZANO.COIN_ID): Promise<PriceData> {
    try {
      const endpoint = API_CONFIG.COINGECKO.ENDPOINTS.COIN_DATA
      const response = await this.makeRequest(
        `${endpoint}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        { id: coinId },
      )

      const data: CoinGeckoResponse = await response.json()

      if (!data.market_data) {
        throw new Error(API_CONFIG.ERROR_MESSAGES.INVALID_RESPONSE)
      }

      return {
        current: data.market_data.current_price.usd,
        change24h: data.market_data.price_change_percentage_24h || 0,
        change7d: data.market_data.price_change_percentage_7d || 0,
        change30d: data.market_data.price_change_percentage_30d || 0,
        marketCap: data.market_data.market_cap.usd,
        volume24h: data.market_data.total_volume.usd,
        lastUpdated: data.last_updated,
      }
    } catch (error) {
      console.error("Error fetching coin data:", error)
      throw new Error(`Failed to fetch market data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async fetchMarketChart(coinId: string = API_CONFIG.ZANO.COIN_ID, days = 7): Promise<number[][]> {
    try {
      const endpoint = API_CONFIG.COINGECKO.ENDPOINTS.MARKET_CHART
      const response = await this.makeRequest(`${endpoint}?vs_currency=usd&days=${days}&interval=daily`, { id: coinId })

      const data = await response.json()
      return data.prices || []
    } catch (error) {
      console.error("Error fetching market chart:", error)
      throw new Error(`Failed to fetch chart data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async fetchMultipleCoins(coinIds: string[]): Promise<Record<string, PriceData>> {
    try {
      const promises = coinIds.map((coinId) => this.fetchCoinData(coinId))
      const results = await Promise.allSettled(promises)

      const data: Record<string, PriceData> = {}

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          data[coinIds[index]] = result.value
        }
      })

      return data
    } catch (error) {
      console.error("Error fetching multiple coins:", error)
      throw error
    }
  }

  // Get current rate limit info
  getRateLimitInfo() {
    return {
      limit: getRateLimit("COINGECKO", !!this.apiKey),
      hasApiKey: !!this.apiKey,
      tier: this.apiKey ? "pro" : "free",
    }
  }
}

// Export a default instance
export const marketService = MarketService.getInstance(process.env.COINGECKO_API_KEY)
