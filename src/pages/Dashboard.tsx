import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyticsService, type CandidateAnalytics } from '../services/analytics';
import { BarChart, Activity, Eye, FileText, CheckCircle2, XCircle, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-900 rounded-2xl border border-zinc-800" />
        ))}
    </div>
);

const CandidateDashboard = () => {
    const [stats, setStats] = useState<CandidateAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const data = await analyticsService.getCandidateAnalytics();
            setStats(data);
        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-amber-400 bg-amber-400/10';
            case 'reviewing': return 'text-blue-400 bg-blue-400/10';
            case 'interview': return 'text-purple-400 bg-purple-400/10';
            case 'accepted': return 'text-emerald-400 bg-emerald-400/10';
            case 'rejected': return 'text-red-400 bg-red-400/10';
            default: return 'text-zinc-400 bg-zinc-400/10';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'reviewing': return <Search className="w-4 h-4" />;
            case 'interview': return <Activity className="w-4 h-4" />;
            case 'accepted': return <CheckCircle2 className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <header className="flex items-center justify-between mb-8 mt-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-zinc-500 text-sm mt-1">Your activity & performance</p>
                </div>
            </header>

            {loading ? (
                <div className="space-y-6">
                    <LoadingSkeleton />
                    <div className="h-48 bg-zinc-900 rounded-2xl animate-pulse" />
                </div>
            ) : !stats ? (
                <div className="text-center py-20 text-zinc-500">
                    Failed to load analytics
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#121212] p-5 rounded-3xl border border-zinc-800">
                            <div className="flex items-center gap-3 mb-2 text-zinc-400">
                                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Matches</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.total_matches}</p>
                        </div>

                        <div className="bg-[#121212] p-5 rounded-3xl border border-zinc-800">
                            <div className="flex items-center gap-3 mb-2 text-zinc-400">
                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Applied</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.total_applications}</p>
                        </div>

                        <div className="bg-[#121212] p-5 rounded-3xl border border-zinc-800">
                            <div className="flex items-center gap-3 mb-2 text-zinc-400">
                                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                                    <BarChart className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Swipes</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.swipes_made}</p>
                        </div>

                        <div className="bg-[#121212] p-5 rounded-3xl border border-zinc-800">
                            <div className="flex items-center gap-3 mb-2 text-zinc-400">
                                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Views</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.profile_views}</p>
                        </div>
                    </div>

                    {/* Applications Breakdown */}
                    <div className="bg-[#121212] p-6 rounded-3xl border border-zinc-800">
                        <h3 className="text-lg font-bold mb-6">Application Status</h3>
                        <div className="space-y-4">
                            {stats.applications_breakdown.map((item) => (
                                <div key={item.status} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${getStatusColor(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                        </div>
                                        <span className="capitalize font-medium text-zinc-300">{item.status}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-24 bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.count / stats.total_applications) * 100}%` }}
                                                className={`h-full rounded-full ${getStatusColor(item.status).split(' ')[0].replace('text', 'bg')}`}
                                            />
                                        </div>
                                        <span className="font-bold text-white">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                            {stats.applications_breakdown.length === 0 && (
                                <p className="text-sm text-zinc-500 italic">No applications data available.</p>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/applied')}
                            className="w-full mt-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-sm font-medium rounded-xl transition-colors text-zinc-400 hover:text-white"
                        >
                            View All Applications
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default CandidateDashboard;
