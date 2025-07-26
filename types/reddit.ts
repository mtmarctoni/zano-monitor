export interface RedditAboutData {
    data: {
        subscribers: number;
        active_user_count: number;
    };
}

export interface RedditPost {
    data: {
        ups: number;
        num_comments: number;
    };
}

export interface RedditPostsData {
    data: {
        children: RedditPost[];
    };
}