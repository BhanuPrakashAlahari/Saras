export const BookmarkSkeleton = () => {
    return (
        <div className="bg-[#121212] border border-white/5 rounded-3xl relative overflow-hidden shadow-xl animate-pulse">
            {/* Cover Image Skeleton */}
            <div className="h-24 w-full bg-zinc-900" />

            {/* Avatar Section Skeleton */}
            <div className="px-6 -mt-10 relative z-10 flex justify-between items-end mb-3">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full border-[6px] border-[#121212] bg-zinc-800" />
                </div>
                <div className="flex gap-2 -mb-2">
                    <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/5" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="px-6 pb-6 pt-2 space-y-4">
                {/* Header: Company & Title */}
                <div className="space-y-2">
                    <div className="h-5 bg-zinc-800 rounded w-1/3" />
                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                </div>

                {/* Chips Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-8 bg-zinc-800 rounded-xl" />
                    <div className="h-8 bg-zinc-800 rounded-xl" />
                </div>

                {/* Notes Skeleton */}
                <div className="h-16 bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-700/50" />

                {/* Footer */}
                <div className="mt-2 flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="h-4 bg-zinc-800 rounded w-24" />
                    <div className="h-8 bg-zinc-800 rounded-lg w-20" />
                </div>
            </div>
        </div>
    );
};
