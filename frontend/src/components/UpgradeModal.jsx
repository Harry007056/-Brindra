import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pricing from '../pages/Pricing';
import { usePlan } from '../contexts/PlanProvider';
import { toast } from 'react-toastify';

export default function UpgradeModal({ isOpen, onClose, requiredPlan }) {
  const navigate = useNavigate();
  const { activePlan } = usePlan();
  const [showPricing, setShowPricing] = useState(false);

  if (!isOpen) return null;

  const goPricing = () => {
    setShowPricing(true);
    toast.info('Upgrade your plan to unlock this feature');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-background-warm-off-white border border-[#D9E1D7] shadow-2xl"
          >
            {!showPricing ? (
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-muted-coral/20 p-2">
                      <X className="h-5 w-5 text-accent-muted-coral" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-accent-warm-grey">Upgrade Required</h2>
                      <p className="text-sm text-text-default">
                        Your current <span className="font-semibold text-primary-dusty-blue">{activePlan?.toUpperCase()}</span> plan doesn&apos;t include this feature.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-text-default transition hover:bg-background-light-sand"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-background-light-sand p-4">
                    <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-text-default">Required Plan</h3>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-dusty-blue/20" />
                      <div>
                        <p className="font-semibold text-accent-warm-grey">{requiredPlan}</p>
                        <p className="text-xs text-text-default">or higher</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onClose}
                      className="rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-4 py-3 text-sm font-medium text-primary-dusty-blue transition hover:bg-background-light-sand"
                    >
                      Maybe Later
                    </button>
                    <button
                      onClick={goPricing}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-3 text-sm font-semibold text-background-warm-off-white transition hover:bg-primary-soft-sky"
                    >
                      Upgrade Plan
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-0">
                <div className="flex items-center justify-between border-b border-[#D9E1D7]/50 bg-background-light-sand px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowPricing(false)}
                      className="rounded-lg p-1.5 text-text-default transition hover:bg-background-warm-off-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <h2 className="text-lg font-bold text-accent-warm-grey">Choose Your Plan</h2>
                  </div>
                </div>
                <div className="p-6">
                  <Pricing />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

