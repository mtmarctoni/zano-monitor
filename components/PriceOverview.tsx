import { DollarSign, BarChart3, TrendingUp } from "lucide-react"
import { MetricCard } from "@/components/MetricCard"
import { formatPrice, formatLargeNumber, formatPercentage, getPercentageColor, getTrendIcon } from "@/utils/formatters"

interface PriceOverviewProps {
    data: {
        price: {
            current: number
            change24h: number
            change7d: number
            marketCap: number
            volume24h: number
        }
        onchain: {
            adoptionScore: number
        }
    }
}

export function PriceOverview({ data }: PriceOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                title="ZANO Price"
                value={formatPrice(data.price.current)}
                subtitle={
                    <span className={getPercentageColor(data.price.change24h)}>
                        {formatPercentage(data.price.change24h)} (24h)
                    </span>
                }
                icon={<DollarSign className="h-6 w-6 text-matrix-green" />}
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
                icon={<BarChart3 className="h-6 w-6 text-cyber-blue" />}
                trend={getTrendIcon(data.price.change7d)}
            />

            <MetricCard
                title="24h Volume"
                value={formatLargeNumber(data.price.volume24h)}
                subtitle="Trading activity"
                icon={<TrendingUp className="h-6 w-6 text-cyber-orange" />}
                trend="neutral"
            />

            <MetricCard
                title="Network Score"
                value={`${data.onchain.adoptionScore}/100`}
                subtitle="Adoption & health"
                icon={<TrendingUp className="h-6 w-6 text-cyber-purple" />}
                trend={data.onchain.adoptionScore >= 70 ? "up" : data.onchain.adoptionScore >= 40 ? "neutral" : "down"}
            />
        </div>
    )
}