import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authService } from '../services/auth';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle OAuth Callback
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
            handleOAuthCallback(code);
        }
    }, [location]);

    const handleOAuthCallback = async (code: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // Remove code from URL to prevent loop/re-use
            window.history.replaceState({}, document.title, window.location.pathname);

            const redirectUri = `${window.location.origin}/login`;
            const response = await authService.googleLogin(code, redirectUri);

            // Save session
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            navigate('/feed');
        } catch (err) {
            console.error(err);
            setError('Failed to sign in with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Fallback for manual login for now
        navigate('/feed');
    };

    const handleGoogleClick = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
            console.error("Missing Google Client ID");
            return;
        }

        const redirectUri = `${window.location.origin}/login`;
        const scope = 'email profile openid';
        const responseType = 'code';

        // const isLikelyDev = import.meta.env.VITE_API_URL?.includes('vercel') || false;
        const accessType = 'offline'; // Request refresh token

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&access_type=${accessType}&prompt=consent`;

        window.location.href = authUrl;
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white p-8">
            <header className="flex items-center justify-between mb-12">
                <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="text-sm font-medium tracking-wide text-white uppercase">Login</span>
                <div className="w-5" /> {/* Spacer for centering */}
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full"
            >
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tighter mb-2">Welcome back</h1>
                    <p className="text-zinc-500 font-light">Enter your details to access your feed.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                        <p className="text-zinc-500 text-sm">Authenticating...</p>
                    </div>
                ) : (
                    <>
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button className="w-full bg-white text-black font-medium py-3.5 rounded-xl hover:bg-zinc-200 transition-colors mt-4">
                                Sign In
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-800"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-black px-2 text-zinc-500">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleClick}
                                className="w-full bg-zinc-900 border border-zinc-800 text-white font-medium py-3.5 rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-zinc-500 text-sm">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-white hover:underline">
                                    Join SABER
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default Login;
