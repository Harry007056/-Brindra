import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api';

const PlanContext = createContext();

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within PlanProvider');
  }
  return context;
};

const planFeatureMatrix = {
  demo: {
    files: false,
    privateChat: false,
    advancedAnalytics: false,
  },
  starter: {
    files: false,
    privateChat: true,
    advancedAnalytics: false,
  },
  growth: {
    files: true,
    privateChat: true,
    advancedAnalytics: true,
  },
  enterprise: {
    files: true,
    privateChat: true,
    advancedAnalytics: true,
  },
};

const getMinPlanForFeature = (feature) => {
  const planOrder = ['demo', 'starter', 'growth', 'enterprise'];
  const featureIndex = {
    files: 2, // growth
    privateChat: 1, // starter
    advancedAnalytics: 2, // growth
  }[feature] || 3;
  return planOrder[featureIndex];
};

export default function PlanProvider({ children }) {
  const [activePlan, setActivePlanState] = useState('demo');
  const [loading, setLoading] = useState(true);

  // Load active plan from localStorage on init
  useEffect(() => {
    const savedPlan = localStorage.getItem('activePlan');
    if (savedPlan) {
      setActivePlanState(savedPlan);
    } else {
      // Optional: Fetch from backend if authenticated
      // api.get('/api/user/plan').then(res => setActivePlanState(res.data.planId || 'demo'));
    }
    setLoading(false);
  }, []);

  const setActivePlan = (planId) => {
    if (!planId || typeof planId !== 'string') return;

    setActivePlanState(planId);
    localStorage.setItem('activePlan', planId);
    
    toast.success(`Activated ${planId.toUpperCase()} plan`, {
      position: 'top-right',
      autoClose: 2000,
    });

    // Optional future backend sync:
    // api.patch('/api/plans/activate', { planId }).catch(console.error);
  };

  const value = {
    activePlan,
    setActivePlan,
    loading,
    hasFeature: (feature) => {
      const minPlan = getMinPlanForFeature(feature);
      const planOrder = ['demo', 'starter', 'growth', 'enterprise'];
      const currentIndex = planOrder.indexOf(activePlan);
      const minIndex = planOrder.indexOf(minPlan);
      return currentIndex >= minIndex;
    },
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

