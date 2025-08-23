import { API_CONFIG } from "@/config/api";
import type {
  RedditAboutData,
  RedditPostsData,
  RedditPost,
} from "@/types/reddit";

export interface ZanoInfoResponse {}

export class SocialService {
  private redditUrl: string;

  constructor() {
    this.redditUrl = API_CONFIG.REDDIT.BASE_URL;
  }

  async getRedditMetrics() {
    try {
      const response = await fetch(
        this.redditUrl + API_CONFIG.REDDIT.ENDPOINTS.ABOUT
      );
      const data = await response.json();

      const postsResponse = await fetch(
        this.redditUrl + API_CONFIG.REDDIT.ENDPOINTS.NEW_POSTS
      );
      const posts = await postsResponse.json();

      const aboutData: RedditAboutData = data;
      const postsData: RedditPostsData = posts;

      return {
        subscribers: aboutData.data.subscribers,
        activeUsers: aboutData.data.active_user_count,
        recentPosts: postsData.data.children.length,
        avgUpvotes:
          postsData.data.children.reduce(
            (acc, post) => acc + post.data.ups,
            0
          ) / postsData.data.children.length,
        avgComments:
          postsData.data.children.reduce(
            (acc, post) => acc + post.data.num_comments,
            0
          ) / postsData.data.children.length,
      };
    } catch (error) {
      console.error("Error fetching Reddit metrics:", error);
      return null;
    }
  }
}
