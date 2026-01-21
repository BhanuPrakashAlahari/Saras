import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
    const [startZoom, setStartZoom] = useState(false);

    useEffect(() => {
        // Start the zoom effect after a short delay (e.g., loading time)
        const timer = setTimeout(() => {
            setStartZoom(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-600 overflow-hidden">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                    startZoom
                        ? { scale: 100, opacity: 0 } // Zoom in hugely, then fade out
                        : { scale: 1, opacity: 1 }   // Normal state
                }
                transition={
                    startZoom
                        ? { duration: 0.8, ease: "easeInOut" } // Fast zoom
                        : { duration: 0.8, ease: "easeOut" }   // Gentle entry
                }
                onAnimationComplete={() => {
                    if (startZoom) {
                        onComplete();
                    }
                }}
                className="flex items-center justify-center"
            >
                <span className="text-white font-bold text-9xl select-none font-sans">
                    S
                </span>
            </motion.div>
        </div>
    );
};
