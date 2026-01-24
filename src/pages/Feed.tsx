import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Github, Linkedin, X, MapPin, DollarSign, Globe, Briefcase, User as UserIcon, Mail, CheckCircle, Calendar, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { feedService, type Article } from '../services/feed';


const ProfileModal = ({ onClose }: { onClose: () => void }) => {
    const { user } = useAuthStore();


    if (!user) return null;

    const accounts = user.oauth_accounts || [];
    // Handle constraints safely
    const constraints = user.constraints_json || {};

    const getProviderIcon = (provider: string) => {
        switch (provider) {
            case 'github': return <Github className="w-5 h-5" />;
            case 'linkedin': return <Linkedin className="w-5 h-5 text-[#0077b5]" />;
            case 'google': return <Mail className="w-5 h-5 text-red-500" />;
            default: return <Globe className="w-5 h-5" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-md bg-[#121212] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative max-h-[85vh] overflow-y-auto no-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ... (rest of the component until button) */}
                {/* I will scope the replacement to just the start and the button area to avoid rewriting everything. */}
                {/* Actually, let's just insert the hook and change the button onClick. */}
                {/* Header Image / Pattern */}
                <div className="h-32 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 relative">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-8 -mt-14 relative z-10">
                    {/* Avatar */}
                    <div className="flex justify-between items-end mb-4">
                        <div className="w-28 h-28 rounded-full border-[6px] border-[#121212] bg-zinc-800 overflow-hidden shadow-2xl relative">
                            {user.photo_url ? (
                                <img
                                    src={user.photo_url}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <div className={`w-full h-full flex items-center justify-center text-zinc-500 fallback-icon ${user.photo_url ? 'hidden' : ''}`}>
                                <UserIcon className="w-12 h-12" />
                            </div>
                        </div>

                        {/* Status Badge */}
                        {user.onboarding && (
                            <div className="mb-4 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-900/20 backdrop-blur-md uppercase tracking-wider">
                                Active
                            </div>
                        )}
                    </div>

                    {/* Name & Role */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">{user.name || 'User'}</h2>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                            <Mail className="w-4 h-4" />
                            <span className="font-medium tracking-wide">{user.email}</span>
                        </div>

                        <div className="inline-flex items-center">
                            <span className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full shadow-lg shadow-white/10 uppercase tracking-widest">
                                {user.role}
                            </span>
                        </div>
                    </div>

                    {/* Intent Section */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Intent</p>
                            <p className="text-white font-semibold text-lg">{user.intent_text || 'Opportunities'}</p>
                        </div>
                        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Why</p>
                            <p className="text-white font-semibold text-lg">{user.why_text || 'Networking'}</p>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 ml-1">Preferences</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300">Remote Only</span>
                                </div>
                                <span className="text-sm font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                    {constraints.remote_only ? 'Yes' : 'No'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300">Target Salary</span>
                                </div>
                                <span className="text-sm font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                    {constraints.preferred_salary ? `$${constraints.preferred_salary.toLocaleString()}` : 'N/A'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300">Location</span>
                                </div>
                                <span className="text-sm font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                    {constraints.location_preference || 'Any'}
                                </span>
                            </div>
                        </div>

                        {/* Dashboard Link */}
                        <button
                            onClick={() => {
                                onClose();
                                window.location.href = '/dashboard';
                            }}
                            className="w-full mt-4 py-3 bg-white text-black font-bold rounded-2xl shadow-lg hover:bg-zinc-200 transition-colors uppercase tracking-widest text-xs"
                        >
                            View Analytics Dashboard
                        </button>
                    </div>
                </div>

                {/* Connected Accounts */}
                <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 ml-1">Linked Accounts</h3>
                    <div className="space-y-2">
                        {accounts.map((acc: any) => (
                            <div key={acc.id} className="flex items-center p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                                <div className="p-2 bg-white/5 rounded-xl text-zinc-300 mr-3 border border-white/5">
                                    {getProviderIcon(acc.provider)}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-white capitalize">{acc.provider}</p>
                                    <p className="text-xs text-zinc-500 truncate font-mono mt-0.5 opacity-60">{acc.provider_user_id}</p>
                                </div>
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                        {accounts.length === 0 && (
                            <p className="text-sm text-zinc-600 italic px-2">No connected accounts found.</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>

    );
};

const Feed = () => {
    const [showProfile, setShowProfile] = useState(false);
    const { user } = useAuthStore();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeed = async () => {
            setLoading(true);

            // Check if there's cached data in sessionStorage
            const cached = sessionStorage.getItem('tech_feed_cache');
            if (cached) {
                try {
                    setArticles(JSON.parse(cached));
                    setLoading(false);
                    return;
                } catch (e) {
                    console.error("Cache parse error", e);
                }
            }

            const data = await feedService.getTechFeed();
            setArticles(data);

            if (data.length > 0) {
                sessionStorage.setItem('tech_feed_cache', JSON.stringify(data));
            }
            setLoading(false);
        };
        loadFeed();
    }, []);

    // Logic to resolve avatar from various sources
    const accounts = user?.oauth_accounts || [];
    const googleAccount = accounts.find(acc => acc.provider === 'google');
    const linkedinAccount = accounts.find(acc => acc.provider === 'linkedin');
    const githubAccount = accounts.find(acc => acc.provider === 'github');

    const avatarUrl =
        googleAccount?.raw_data_json?.picture ||
        linkedinAccount?.raw_data_json?.picture ||
        githubAccount?.raw_data_json?.avatar_url ||
        user?.photo_url;

    return (
        <div className="flex flex-col min-h-screen bg-black text-white p-4 pb-24">
            <header className="flex items-center justify-between mb-8 mt-2 px-1">
                <h1 className="text-3xl font-bold tracking-tight text-white">Feed</h1>

                {/* User Icon - Click to view profile */}
                <button
                    onClick={() => setShowProfile(true)}
                    className="w-10 h-10 rounded-full border border-white/10 p-[2px] hover:scale-105 transition-transform cursor-pointer relative group"
                >
                    <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800 relative z-10 flex items-center justify-center">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center text-zinc-400 fallback-icon ${avatarUrl ? 'hidden' : ''}`}>
                            <UserIcon className="w-5 h-5" />
                        </div>
                    </div>
                </button>
            </header>

            <AnimatePresence>
                {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
            </AnimatePresence>

            <div className="flex-1">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden h-[280px] animate-pulse flex flex-col">
                                <div className="h-40 bg-zinc-800/50 w-full" />
                                <div className="p-4 flex-1 flex flex-col space-y-3">
                                    <div className="h-4 bg-zinc-800/50 rounded w-3/4" />
                                    <div className="h-4 bg-zinc-800/50 rounded w-1/2" />
                                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center gap-2">
                                        <div className="h-3 bg-zinc-800/50 rounded w-6" />
                                        <div className="h-3 bg-zinc-800/50 rounded w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {articles.map((article, index) => (
                            <motion.a
                                key={index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group flex flex-col bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-white/5"
                            >
                                {/* Article Image */}
                                <div className="aspect-video relative overflow-hidden bg-zinc-900 w-full">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium border border-white/10 text-white flex items-center gap-1">
                                        <Globe className="w-3 h-3 text-zinc-400" />
                                        {article.source}
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-bold text-[15px] mb-3 leading-snug text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>

                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>

                                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-500 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            Read more <ExternalLink className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}

                {!loading && articles.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
                        <p className="text-zinc-500 mb-2">No articles found</p>
                        <p className="text-xs text-zinc-600">Check your connection or try again later</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;