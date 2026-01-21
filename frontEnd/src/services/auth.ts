const API_URL = import.meta.env.VITE_API_URL || 'https://saber-api-backend.vercel.app/api';

export interface User {
    id: string;
    role: 'candidate' | 'recruiter' | 'admin';
    name: string;
    email: string;
    photo_url: string;
    created_at: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const authService = {
    async login(provider: string, code: string, redirectUri?: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/oauth/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                provider,
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to authenticate with ${provider}`);
        }

        return await response.json();
    },

    async linkProvider(provider: string, code: string, redirectUri?: string): Promise<{ status: string; message: string }> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(`${API_URL}/auth/link-provider`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                provider,
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to link ${provider}`);
        }

        return await response.json();
    },

    async me(): Promise<User> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user session');
        }

        return await response.json();
    },

    // Deprecated: Alias for backward compatibility if needed, but better to use generic login
    async googleLogin(code: string, redirectUri?: string): Promise<AuthResponse> {
        return this.login('google', code, redirectUri);
    }
};
