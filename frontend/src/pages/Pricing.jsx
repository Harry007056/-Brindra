import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';

const fallbackPlans = [
  {
    id: 'demo',
    name: 'Demo',
    price: 'Free',
    period: '7-day trial',
    desc: 'Explore core features with a guided demo workspace.',
    detail: 'Validate workflow fit, test collaboration basics, and understand team adoption before paid rollout.',
    cta: 'Start Demo Free',
    bestFor: 'Evaluation and pilot testing',
    features: [
      'Dashboard overview',
      'Project list and basic milestone tracking',
      'Sample workspace data',
      'Guided onboarding flow',
    ],
    limitations: [
      'Limited to 5 team members',
      'No private chat history export',
      'No file module access',
    ],
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '₹420',
    period: 'per user / month',
    desc: 'Small teams testing collaboration in real projects.',
    detail: 'Run live projects with core messaging and ownership while keeping cost predictable for early teams.',
    cta: 'Get Started',
    bestFor: 'Small internal teams',
    features: [
      'Everything in Demo',
      'Team members page',
      'Project group chat',
      'Basic notifications and alerts',
    ],
    limitations: [
      'Up to 15 members',
      'Limited file storage (5 GB workspace)',
      'No advanced settings controls',
    ],
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '₹1,000',
    period: 'per user / month',
    desc: 'For teams scaling projects, communication, and workflows.',
    detail: 'Unlock faster coordination with richer collaboration modules and better visibility across active work.',
    cta: 'Choose Growth',
    bestFor: 'Growing teams and delivery squads',
    features: [
      'Everything in Starter',
      'Files module (upload, share, download, delete)',
      'Private 1-on-1 chat with history',
      'Team spaces and advanced collaboration views',
    ],
    limitations: [
      'Up to 75 members',
      'Standard support SLA',
      'No dedicated account manager',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual contract',
    desc: 'Advanced controls, scale, and dedicated support.',
    detail: 'Built for complex organizations needing governance, onboarding support, and high-confidence operations.',
    cta: 'Contact Sales',
    bestFor: 'Large organizations',
    features: [
      'Everything in Growth',
      'Full settings and role governance',
      'Priority support and onboarding',
      'Custom security and policy controls',
    ],
    limitations: [
      'Contract-based pricing',
      'Implementation scope based on agreement',
      'Custom integrations by package',
    ],
    popular: false,
  },
];

const comparisonRows = [
  { label: 'Team member limit', demo: '5', starter: '15', growth: '75', enterprise: 'Custom' },
  { label: 'Group messaging', demo: 'Basic', starter: 'Yes', growth: 'Yes', enterprise: 'Yes' },
  { label: 'Private 1-on-1 chat', demo: 'No', starter: 'Limited', growth: 'Full', enterprise: 'Full' },
  { label: 'File management', demo: 'No', starter: 'Basic', growth: 'Advanced', enterprise: 'Advanced' },
  { label: 'Admin controls', demo: 'No', starter: 'Basic', growth: 'Standard', enterprise: 'Advanced' },
];

const addOns = [
  { title: 'Extra Storage', desc: 'Add more workspace storage for file-heavy teams.' },
  { title: 'Priority Support', desc: 'Faster response times and guided issue resolution.' },
  { title: 'Custom Onboarding', desc: 'Role-based onboarding sessions for larger teams.' },
];

const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function Pricing({
  setActiveView,
  activePlan = 'demo',
  canViewActivePlan = true,
  canPurchasePlan = true,
  isAuthenticated = false,
  onPlanSelect,
  onPlanCheckout,
}) {
  const navigate = useNavigate();
  const [dynamicPlans, setDynamicPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enterpriseMembers, setEnterpriseMembers] = useState(76);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/plans');
        setDynamicPlans(Array.isArray(response.data) ? response.data : fallbackPlans);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
        setError('Using fallback plans (API unavailable)');
        setDynamicPlans(fallbackPlans);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const plans = dynamicPlans.length > 0 ? dynamicPlans : fallbackPlans;
  const enterprisePrice = useMemo(() => {
    const enterprisePlan = plans.find((plan) => plan.id === 'enterprise');
    const baseMembers = Number(enterprisePlan?.baseMembers) || 76;
    const baseTotalPrice = Number(enterprisePlan?.baseTotalPrice) || 1000;
    const total = Math.round((baseTotalPrice * enterpriseMembers) / baseMembers);
    return `${formatInr(total)} / month`;
  }, [enterpriseMembers, plans]);

  const handleSelectPlan = (planId) => {
    if (isAuthenticated && !canPurchasePlan) return;
    const customMembers = planId === 'enterprise' ? enterpriseMembers : null;

    if (onPlanCheckout) {
      onPlanCheckout(planId, customMembers);
      return;
    }

    if (!onPlanSelect && !setActiveView) {
      const params = new URLSearchParams({ plan: planId });
      if (customMembers) params.set('members', String(customMembers));
      navigate(`/payment?${params.toString()}`);
      return;
    }

    onPlanSelect?.(planId, customMembers);
    setActiveView?.(isAuthenticated ? 'dashboard' : 'register');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-accent-muted-coral/40 bg-accent-muted-coral/10 p-3 text-sm text-accent-warm-grey"
        >
          {error}
        </motion.div>
      )}
      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-accent-warm-grey">Pricing</h1>
        <p className="mt-2 text-text-default">
          Flexible plans with clear monthly context, detailed features, and transparent limitations.
        </p>
        {canViewActivePlan && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary-dusty-blue">
            Current plan: {String(activePlan).toUpperCase()}
          </p>
        )}
        {isAuthenticated && !canPurchasePlan && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent-muted-coral">
            Only Team Leader or Manager can purchase a plan.
          </p>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`relative rounded-xl border p-5 shadow-sm ${
              plan.id === activePlan
                ? 'border-primary-soft-sky/60 bg-primary-soft-sky/10'
                : 'border-[#D9E1D7] bg-background-warm-off-white'
            }`}
          >
            {plan.popular && (
              <span className="absolute right-3 top-2 rounded-full bg-secondary-sage-green px-2.5 py-1 text-[10px] font-semibold text-accent-warm-grey">
                Popular
              </span>
            )}
            <h2 className="text-lg font-semibold text-accent-warm-grey">{plan.name}</h2>
            {plan.id === 'enterprise' ? (
              <>
                <p className="mt-2 text-3xl font-bold text-primary-dusty-blue">{enterprisePrice}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-text-default">monthly billing</p>
                <div className="mt-3 rounded-lg bg-background-light-sand p-3">
                  <label htmlFor="enterprise-members" className="text-xs font-semibold uppercase tracking-wide text-accent-warm-grey">
                    Team Members
                  </label>
                  <input
                    id="enterprise-members"
                    type="number"
                    min={76}
                    value={enterpriseMembers}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      setEnterpriseMembers(Number.isFinite(next) ? Math.max(76, next) : 76);
                    }}
                    className="mt-2 w-full rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2 text-sm text-accent-warm-grey outline-none"
                  />
                  <p className="mt-2 text-xs text-text-default">Base price is ₹1,000 at 76 members. Cost increases as members increase.</p>
                </div>
              </>
            ) : (
              <>
                <p className="mt-2 text-3xl font-bold text-primary-dusty-blue">{plan.price}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-text-default">{plan.period}</p>
              </>
            )}
            <p className="mt-2 text-sm text-text-default">{plan.desc}</p>
            <p className="mt-2 text-xs text-text-default">{plan.detail}</p>
            <p className="mt-2 text-xs font-medium text-primary-dusty-blue">Best for: {plan.bestFor}</p>

            <div className="mt-3 rounded-lg bg-background-light-sand p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-warm-grey">Features</p>
              <ul className="mt-2 space-y-1.5 text-xs text-text-default">
                {plan.features.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-3 rounded-lg border border-[#88C0D0]/25 bg-background-warm-off-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-warm-grey">Limitations</p>
              <ul className="mt-2 space-y-1.5 text-xs text-text-default">
                {plan.limitations.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan(plan.id)}
              disabled={isAuthenticated && !canPurchasePlan}
              className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold ${
                plan.popular
                  ? 'bg-primary-dusty-blue text-background-warm-off-white hover:bg-primary-soft-sky'
                  : 'border border-[#88C0D0]/40 bg-background-light-sand text-primary-dusty-blue hover:bg-background-warm-off-white'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {isAuthenticated && !canPurchasePlan ? 'Purchase Restricted' : plan.cta || 'Proceed to Payment'}
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-accent-warm-grey">Plan Comparison</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#D9E1D7] text-xs uppercase tracking-wide text-text-default">
                <th className="px-3 py-2">Capability</th>
                <th className="px-3 py-2">Demo</th>
                <th className="px-3 py-2">Starter</th>
                <th className="px-3 py-2">Growth</th>
                <th className="px-3 py-2">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-[#D9E1D7]/60 text-text-default">
                  <td className="px-3 py-2 font-medium text-accent-warm-grey">{row.label}</td>
                  <td className="px-3 py-2">{row.demo}</td>
                  <td className="px-3 py-2">{row.starter}</td>
                  <td className="px-3 py-2">{row.growth}</td>
                  <td className="px-3 py-2">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-accent-warm-grey">Optional Add-ons</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {addOns.map((item) => (
            <article key={item.title} className="rounded-xl border border-[#88C0D0]/25 bg-background-light-sand p-4">
              <h3 className="text-sm font-semibold text-accent-warm-grey">{item.title}</h3>
              <p className="mt-1 text-sm text-text-default">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
