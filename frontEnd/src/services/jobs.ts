import { api } from './api';

export interface Job {
    id: string;
    problem_statement: string;
    expectations?: string;
    skills_required?: string[];
    constraints?: {
        location: string;
        employment_type: string;
        salary_range: number[];
        experience_years: number;
        equity?: string;
        team_size?: number;
        work_mode?: string;
        notice_period_days?: number;
    };
    company: {
        name: string;
        logo_url?: string;
        cover_image_url?: string;
        website?: string;
        email?: string;
    };
}

export interface Message {
    id: string;
    match_id: string;
    sender_id: string;
    content: string;
    created_at: string;
}

export interface Match {
    id: string;
    candidate_id: string;
    job_id: string;
    reveal_status: boolean;
    explainability_json: {
        score?: number;
        match_quality?: string;
        reason: string;
    };
    created_at: string;
    candidate?: {
        name: string;
        photo_url?: string;
        intent_text?: string;
        skills?: string[];
    };
    job: Job;
    messages: Message[];
}

export interface Bookmark {
    id: string;
    user_id: string;
    job_id: string;
    notes?: string;
    created_at: string;
    job: Job;
}

export interface Application {
    id: string;
    user_id: string;
    job_id: string;
    status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected' | 'withdrawn';
    cover_note?: string;
    created_at: string;
    updated_at: string;
    job: Job;
}


export const jobsService = {
    getFeed: async () => {
        const response = await api.get<{ jobs: Job[], all: Job[] }>('/jobs/feed');
        return response.data;
    },

    swipe: async (jobId: string, direction: 'left' | 'right') => {
        const response = await api.post<Match | { success: boolean }>('/jobs/swipe', {
            job_id: jobId,
            direction
        });
        return response.data;
    }
};
