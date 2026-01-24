import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface UpgradeModalProps {
    onClose: () => void;
}

export const UpgradeModal = ({ onClose }: UpgradeModalProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md bg-[#121212] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative"
            >
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-10 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Daily Quota Exceeded</h2>
                    <p className="text-zinc-400 text-base leading-relaxed">
                        swipe limit exceeded reach tommorow payment feature will be implememnted soon
                    </p>
                </div>
            </motion.div>
        </motion.div >
    );
};
