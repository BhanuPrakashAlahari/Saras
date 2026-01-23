import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Briefcase, Sparkles } from 'lucide-react';
import type { Job, Match } from '../services/jobs';
import { jobsService } from '../services/jobs';
import { bookmarksService } from '../services/bookmarks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import JobCard from '../components/ui/job-card';
import { JobSkeleton } from '../components/jobs/JobSkeleton';

const Jobs = () => {
    const navigate = useNavigate();
    const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [activeTab, setActiveTab] = useState<'recommended' | 'all'>('recommended');
    const [loading, setLoading] = useState(true);
    const [match, setMatch] = useState<Match | null>(null);

    const jobs = activeTab === 'recommended' ? recommendedJobs : allJobs;
    const setJobs = activeTab === 'recommended' ? setRecommendedJobs : setAllJobs;

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async () => {
        try {
            setLoading(true);
            const data = await jobsService.getFeed() as { jobs: Job[], all: Job[] };
            setRecommendedJobs(data.jobs || []);
            setAllJobs(data.all || []);
        } catch (error) {
            console.error("Failed to load feed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (jobId: string, direction: 'left' | 'right') => {
        // Optimistic UI: Remove job immediately
        const currentJob = jobs.find(j => j.id === jobId);
        setJobs(prev => prev.filter(j => j.id !== jobId));

        // Show immediate feedback for right swipes
        if (direction === 'right') {
            toast.success("Connection request sent!", { id: 'swipe-toast' });
        }

        try {
            const result = await jobsService.swipe(jobId, direction);

            if (direction === 'right') {
                // Determine if it's a match from the result
                const isMatch = typeof result === 'object' && result !== null && 'id' in result && (result as Match).reveal_status;

                if (isMatch) {
                    // It's a match! Show the special match modal
                    setMatch(result as Match);
                    toast.success("It's a Match! 🔥", {
                        duration: 5000,
                        icon: '✨',
                        id: 'swipe-toast' // This will replace the "Sent" toast if it's still there
                    });
                }
            }
        } catch (error: any) {
            // Rollback if needed, or handle error (e.g. rate limit)
            if (error.response?.status === 429) {
                toast.error("Daily swipe limit reached!", { id: 'swipe-toast' });
                if (currentJob) setJobs(prev => [currentJob, ...prev]);
            } else {
                toast.error("Something went wrong. Please try again.", { id: 'swipe-toast' });
                if (currentJob) setJobs(prev => [currentJob, ...prev]);
            }
            console.error("Swipe failed:", error);
        }
    };

    const handleBookmark = async (jobId: string) => {
        // Optimistic UI: Remove job immediately to show next card
        const currentJob = jobs.find(j => j.id === jobId);
        setJobs(prev => prev.filter(j => j.id !== jobId));

        try {
            await bookmarksService.createBookmark(jobId, "Saved from Discovery");
            toast.success("Job bookmarked!", {
                icon: '🔖',
                position: 'bottom-center'
            });
        } catch (error) {
            // Rollback if failing
            if (currentJob) {
                setJobs(prev => [currentJob, ...prev]);
            }
            console.error("Failed to bookmark job:", error);
            toast.error("Failed to bookmark job");
        }
    };

    // Animation Hooks
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-8, 8]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
    const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9]);

    // Background color indicators based on swipe
    const bgLikeOpacity = useTransform(x, [0, 150], [0, 0.4]);
    const bgDislikeOpacity = useTransform(x, [-150, 0], [0.4, 0]);

    const handleDragEnd = (_: any, info: any) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        const currentJob = jobs[0];

        if (!currentJob) return;

        if (offset < -100 || velocity < -500) {
            handleSwipe(currentJob.id, 'left');
        } else if (offset > 100 || velocity > 500) {
            handleSwipe(currentJob.id, 'right');
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full bg-black text-white overflow-hidden relative flex flex-col items-center justify-center">
                {/* Ambient Background */}
                <div className="absolute inset-0 bg-neutral-950">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
                </div>

                <div className="relative w-full max-w-sm h-auto z-10 perspective-1000">
                    {/* Background Skeleton for Depth */}
                    <div className="absolute top-0 w-full h-[520px] bg-[#1A1A1A] rounded-[32px] border border-white/5 scale-[0.95] translate-y-4 opacity-30 shadow-2xl" />

                    {/* Main Skeleton */}
                    <JobSkeleton />
                </div>
            </div>
        );
    }

    const currentJob = jobs[0];
    const nextJob = jobs[1]; // Preview for the next card underneath

    const formatSalary = (range: number[]) => {
        if (!range || range.length !== 2) return '';
        // Format as K, e.g. 120k - 150k
        const min = Math.round(range[0] / 1000);
        const max = Math.round(range[1] / 1000);
        return `₹${min}k - ₹${max}k`;
    };

    return (
        <div className="h-screen w-full bg-black text-white overflow-hidden relative flex flex-col items-center justify-center">

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-neutral-950">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            </div>

            {/* Header Filters */}
            <div className="absolute top-8 left-0 right-0 z-40 flex justify-center px-4">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-1 rounded-2xl flex gap-1 shadow-2xl">
                    <button
                        onClick={() => setActiveTab('recommended')}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'recommended'
                            ? 'bg-white text-black shadow-lg'
                            : 'text-zinc-500 hover:text-white'
                            }`}
                    >
                        Recommended for you
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all'
                            ? 'bg-white text-black shadow-lg'
                            : 'text-zinc-500 hover:text-white'
                            }`}
                    >
                        Others
                    </button>
                </div>
            </div>

            {/* Match Modal */}
            <AnimatePresence>
                {match && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20"
                        >
                            <Sparkles className="w-10 h-10 text-black fill-current" />
                        </motion.div>

                        <h2 className="text-5xl font-black text-white mb-2 tracking-tight text-center">
                            It's a Match!
                        </h2>

                        <div className="bg-[#121212] border border-white/10 rounded-3xl p-8 w-full max-w-sm mb-8 relative overflow-hidden shadow-2xl">
                            <div className="flex flex-col items-center text-center">
                                <h3 className="text-2xl font-bold mb-1 text-white">{match.job.company.name}</h3>
                                <p className="text-zinc-500 mb-6 font-medium">wants to connect with you</p>

                                <div className="w-full p-4 bg-zinc-900/50 rounded-2xl border border-white/5 text-left">
                                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-2">Why we matched</p>
                                    <p className="text-sm text-zinc-300 leading-relaxed font-light">
                                        "{match.explainability_json.reason}"
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full max-w-sm gap-3">
                            <button
                                onClick={() => navigate('/matches')}
                                className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5"
                            >
                                Send a Message
                            </button>
                            <button
                                onClick={() => setMatch(null)}
                                className="w-full py-4 bg-[#121212] border border-white/10 text-white rounded-2xl font-medium hover:bg-zinc-900 transition-colors"
                            >
                                Back to Jobs
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Card Content */}
            <div className="relative w-full max-w-sm h-auto z-10 perspective-1000">
                {jobs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center p-6 text-center bg-[#0A0A0A] border border-white/10 rounded-[32px] h-[520px] shadow-2xl"
                    >
                        <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
                            <Briefcase className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">You're all caught up!</h2>
                        <p className="text-zinc-500 max-w-xs mx-auto mb-8">
                            {activeTab === 'recommended'
                                ? "Check back later for more tailored recommendations."
                                : "Check back later for more opportunities."}
                        </p>
                        <button
                            onClick={loadFeed}
                            className="px-8 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
                        >
                            Refresh Feed
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Background Cards for Depth */}
                        {nextJob && (
                            <div className="absolute top-0 w-full h-full bg-[#1A1A1A] rounded-[32px] border border-white/5 scale-[0.95] translate-y-4 opacity-50 shadow-2xl" />
                        )}

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentJob.id}
                                className="relative w-full h-auto cursor-grab active:cursor-grabbing preserve-3d"
                                style={{ x, rotate, opacity, scale }}
                                drag={match ? false : "x"}
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={handleDragEnd}
                                initial={{ scale: 0.95, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                            >
                                {/* Swipe Overlay Indicators */}
                                <motion.div style={{ opacity: bgLikeOpacity }} className="absolute inset-0 z-30 bg-gradient-to-r from-transparent to-emerald-500/30 pointer-events-none rounded-[32px] backdrop-blur-[1px]" />
                                <motion.div style={{ opacity: bgDislikeOpacity }} className="absolute inset-0 z-30 bg-gradient-to-l from-transparent to-red-500/30 pointer-events-none rounded-[32px] backdrop-blur-[1px]" />

                                <JobCard
                                    title={currentJob.problem_statement}
                                    company={currentJob.company?.name}
                                    rate={formatSalary(currentJob.constraints?.salary_range || [])}
                                    location={currentJob.constraints?.location || 'Remote'}
                                    type={currentJob.constraints?.employment_type || 'Full-time'}
                                    experience={`${currentJob.constraints?.experience_years || 0}+ years`}
                                    expectations={currentJob.expectations}
                                    skills={currentJob.skills_required}
                                    logoUrl={currentJob.company?.logo_url}
                                    coverImageUrl={currentJob.company?.cover_image_url}
                                    className="h-[520px]"
                                    onSave={() => handleBookmark(currentJob.id)}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
            </div>

            {/* Minimal Branding */}
            <div className="absolute bottom-10 text-center opacity-20 pointer-events-none">
                <p className="text-[10px] tracking-[0.3em] font-bold uppercase text-white">SABER DISCOVERY</p>
            </div>

        </div>
    );
};

export default Jobs;
