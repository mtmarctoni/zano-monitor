import { Wifi, WifiOff, Clock } from "lucide-react"

interface ConnectionStatusProps {
  isConnected: boolean
  lastUpdated: string
  isLoading: boolean
}

export function ConnectionStatus({ isConnected, lastUpdated, isLoading }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {isLoading ? (
        <>
          <Clock className="h-4 w-4 text-blue-500 animate-spin" />
          <span className="text-blue-600">Updating...</span>
        </>
      ) : isConnected ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-green-600">Live Data</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-red-600">Offline Mode</span>
        </>
      )}
      {lastUpdated && <span className="text-slate-500">• Last updated: {lastUpdated}</span>}
    </div>
  )
}
