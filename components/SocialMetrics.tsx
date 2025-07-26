import { useEffect, useState } from "react";
import { SocialService } from "@/services/socialService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, ThumbsUp, FileText, Twitter, Send } from "lucide-react";

interface RedditMetrics {
    subscribers: number;
    activeUsers: number;
    recentPosts: number;
    avgUpvotes: number;
    avgComments: number;
}

interface SocialMetricsData {
    reddit?: RedditMetrics;
    twitter?: any; // Placeholder for Twitter metrics
    telegram?: any; // Placeholder for Telegram metrics
}

export function SocialMetrics() {
    const [metrics, setMetrics] = useState<SocialMetricsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            const monitor = new SocialService();
            const redditMetrics = await monitor.getRedditMetrics();
            // Placeholder for fetching Twitter and Telegram metrics
            const twitterMetrics = null; // Replace with actual Twitter metrics fetching
            const telegramMetrics = null; // Replace with actual Telegram metrics fetching

            setMetrics({
                reddit: redditMetrics || undefined,
                twitter: twitterMetrics,
                telegram: telegramMetrics,
            });
            setLoading(false);
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <Card className="bg-bg-secondary border border-border">
                <CardContent className="p-6">
                    <p className="text-text-secondary text-center">Loading social metrics...</p>
                </CardContent>
            </Card>
        );
    }

    if (!metrics) {
        return (
            <Card className="bg-bg-secondary border border-border">
                <CardContent className="p-6">
                    <p className="text-text-secondary text-center">Failed to load social metrics.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Reddit Metrics */}
            {metrics.reddit && (
                <Card className="bg-bg-secondary border border-border hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="text-text-primary text-lg font-bold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-cyber-orange" />
                            Reddit Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-bg-tertiary rounded-lg border border-border">
                                <Users className="h-6 w-6 text-matrix-green" />
                                <div>
                                    <p className="text-sm text-text-secondary">Subscribers</p>
                                    <p className="text-xl font-bold text-text-primary">
                                        {metrics.reddit.subscribers.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-bg-tertiary rounded-lg border border-border">
                                <MessageSquare className="h-6 w-6 text-cyber-blue" />
                                <div>
                                    <p className="text-sm text-text-secondary">Active Users</p>
                                    <p className="text-xl font-bold text-text-primary">
                                        {metrics.reddit.activeUsers.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-bg-tertiary rounded-lg border border-border">
                                <FileText className="h-6 w-6 text-cyber-orange" />
                                <div>
                                    <p className="text-sm text-text-secondary">Recent Posts</p>
                                    <p className="text-xl font-bold text-text-primary">
                                        {metrics.reddit.recentPosts}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-bg-tertiary rounded-lg border border-border">
                                <ThumbsUp className="h-6 w-6 text-matrix-green" />
                                <div>
                                    <p className="text-sm text-text-secondary">Avg Upvotes</p>
                                    <p className="text-xl font-bold text-text-primary">
                                        {metrics.reddit.avgUpvotes.toFixed(1)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-bg-tertiary rounded-lg border border-border col-span-2">
                                <MessageSquare className="h-6 w-6 text-cyber-purple" />
                                <div>
                                    <p className="text-sm text-text-secondary">Avg Comments</p>
                                    <p className="text-xl font-bold text-text-primary">
                                        {metrics.reddit.avgComments.toFixed(1)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Twitter Metrics (Placeholder) */}
            {metrics.twitter && (
                <Card className="bg-bg-secondary border border-border hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="text-text-primary text-lg font-bold flex items-center gap-2">
                            <Twitter className="h-5 w-5 text-cyber-blue" />
                            Twitter Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-text-secondary">Twitter metrics coming soon...</p>
                    </CardContent>
                </Card>
            )}

            {/* Telegram Metrics (Placeholder) */}
            {metrics.telegram && (
                <Card className="bg-bg-secondary border border-border hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="text-text-primary text-lg font-bold flex items-center gap-2">
                            <Send className="h-5 w-5 text-cyber-purple" />
                            Telegram Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-text-secondary">Telegram metrics coming soon...</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}