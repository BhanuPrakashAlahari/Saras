import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col justify-center min-h-[calc(100vh-70px)] px-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8 text-left"
      >
        {/* Massive Brand Name */}
        <h1 className="text-[5rem] font-bold tracking-tighter text-white leading-none -ml-1">
          SABER
        </h1>

        <p className="text-2xl font-light text-zinc-400 leading-tight max-w-xs">
          The future of work is{" "}
          <span className="text-white font-normal">visual.</span>
        </p>

        <p className="text-zinc-400 text-lg leading-relaxed max-w-sm font-light">
          Experience a job board that feels like your favorite social feed. No
          clutter. Just opportunities.
        </p>

        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="group flex items-center gap-3 px-6 py-3.5 bg-white text-black text-sm font-medium rounded-full transition-all"
          >
            Start Exploring
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};
