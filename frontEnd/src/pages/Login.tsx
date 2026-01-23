import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { authService } from '../services/auth';
import { useAuthStore } from '../store/useAuthStore';
// import { setCookie, getCookie } from '../utils/cookieUtils';


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasCalledAuth = useRef(false);
  const REDIRECT_URI = "https://saber-api-backend.vercel.app/api/auth/oauth/callback";

  // Handle OAuth Callback
  useEffect(() => {
    // Check for token immediately
    const token = localStorage.getItem('jwt_token');
    if (token) {
      navigate('/feed', { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const stateProvider = params.get('state');

    // Only attempt auth if we have a code and haven't tried yet
    if (code && !hasCalledAuth.current) {
      hasCalledAuth.current = true;

      const provider = stateProvider || localStorage.getItem('auth_provider') || 'google';
      localStorage.removeItem('auth_provider');

      // Clear the code from URL immediately to prevent subsequent renders/effects from seeing it
      // This is critical for preventing double-invocation in dev/strict mode
      navigate(window.location.pathname, { replace: true });

      handleOAuthCallback(code, provider);
    }
  }, [location.search]); // Only re-run if search params change

  const { setAuth } = useAuthStore();

  const handleOAuthCallback = async (code: string, provider: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Pass REDIRECT_URI to match the initial request
      const response = await authService.oauthCallback(provider, code, REDIRECT_URI);

      // Save session via store (which persists to localStorage automatically)
      setAuth(response.token, response.user);

      // Redirect based on onboarding signal
      if (response.user.onboarding) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/feed', { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
      // Reset ref so user can try again if they reload or get a new code
      hasCalledAuth.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleClick = () => {
  //   const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  //   const scope = 'openid email';
  //   const state = 'google';

  //   localStorage.setItem('auth_provider', state);

  //   // Strictly matching demo code URL structure (no prompt, explicit params)
  //   const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
  //   window.location.href = authUrl;
  // };

  const handleGithubClick = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const scope = 'read:user user:email public_repo';
    const state = 'github';

    localStorage.setItem('auth_provider', state);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(scope)}&state=${state}`;
    window.location.href = authUrl;
  };

  const handleLinkedinClick = () => {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const scope = 'openid profile email';
    const state = 'linkedin';

    localStorage.setItem('auth_provider', state);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?client_id=${clientId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
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

            <div className="flex justify-center gap-4 mt-6">
              {/*   <button
                type="button"
                onClick={handleGoogleClick}
                className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors"
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
              </button> */}

              <button
                type="button"
                onClick={handleGithubClick}
                className="w-12 h-12 rounded-full bg-[#24292e] border border-zinc-800 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleLinkedinClick}
                className="w-12 h-12 rounded-full bg-[#0077b5] border border-zinc-800 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </button>
            </div>

          </>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
