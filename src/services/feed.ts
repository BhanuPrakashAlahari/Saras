import { api } from './api';

export interface Article {
    title: string;
    url: string;
    publishedAt: string;
    source: string;
    image: string;
}

export interface FeedResponse {
    count: number;
    articles: Article[];
}

const API_URL = 'https://tech-feed-beta.vercel.app/api/tech';

export const feedService = {
    getTechFeed: async (): Promise<Article[]> => {
        try {
            const response = await api.get<FeedResponse>(API_URL);
            return response.data.articles;
        } catch (error) {
            console.error("Failed to fetch tech feed:", error);
            return [];
        }
    }
};
