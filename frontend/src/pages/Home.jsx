import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home({ onRegisterClick }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.section
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-[#D9E1D7] bg-background-warm-off-white p-8 shadow-sm"
      >
        <h1 className="text-4xl font-bold text-accent-warm-grey">Welcome to Brindra</h1>
        <p className="mt-3 max-w-2xl text-text-default">
          Build, communicate, and deliver with one calm workspace designed for modern teams.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={onRegisterClick}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-semibold text-background-warm-off-white hover:bg-primary-soft-sky"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-1 text-xs text-text-default">
          <p className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary-olive-accent" />
            No credit card required
          </p>
          <p className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary-olive-accent" />
            Setup in under 5 minutes
          </p>
        </div>
      </motion.section>
    </div>
  );
}
