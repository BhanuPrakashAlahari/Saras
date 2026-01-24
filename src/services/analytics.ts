import { api } from './api';

export interface ApplicationBreakdown {
    status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
    count: number;
}

export interface CandidateAnalytics {
    total_matches: number;
    total_applications: number;
    applications_breakdown: ApplicationBreakdown[];
    swipes_made: number;
    profile_views: number;
}

export const analyticsService = {
    getCandidateAnalytics: async (): Promise<CandidateAnalytics> => {
        const response = await api.get<CandidateAnalytics>('/analytics/candidate');
        return response.data;
    }
};
