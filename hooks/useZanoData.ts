"use client"

import { useState, useEffect, useCallback } from "react"
import type { DashboardData } from "@/types/dashboard"
import { apiService } from "@/services/apiService"
import { API_CONFIG } from "@/config/api"

export function useZanoData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const loadData = useCallback(async () => {
    try {
      setError(null)
      console.log("Loading dashboard data...") // Debug log

      const apiData = await apiService.fetchAllData()
      console.log("API data received:", apiData) // Debug log

      setData({
        price: apiData.price,
        github: apiData.github,
        onchain: apiData.onchain,
      })

      setLastUpdated(new Date().toLocaleString())
      console.log("Dashboard data updated successfully") // Debug log
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : API_CONFIG.ERROR_MESSAGES.API_UNAVAILABLE
      setError(errorMessage)
      console.error("Error loading data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshData = useCallback(() => {
    setIsLoading(true)
    loadData()
  }, [loadData])

  useEffect(() => {
    loadData()

    // Use configured auto-refresh interval
    const interval = setInterval(loadData, apiService.getRefreshInterval())
    return () => clearInterval(interval)
  }, [loadData])

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    configuration: apiService.getConfiguration(),
  }
}
