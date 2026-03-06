import { useMemo, useState } from 'react';

const plans = {
  demo: {
    id: 'demo',
    name: 'Demo',
    priceLabel: 'Free',
    period: '7-day trial',
    pricePerMember: 0,
    memberRule: 'Up to 5 members',
    detail: 'Explore dashboard and project basics with guided onboarding before subscribing.',
    features: [
      'Dashboard overview',
      'Project list and basic milestone tracking',
      'Sample workspace data',
      'Guided onboarding flow',
    ],
    limitations: ['Limited to 5 team members', 'No private chat history export', 'No file module access'],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    priceLabel: '\u20B9420',
    period: 'per user / month',
    pricePerMember: 420,
    memberRule: 'Up to 15 members',
    detail: 'Core messaging and ownership tools for small teams running real projects.',
    features: ['Everything in Demo', 'Team members page', 'Project group chat', 'Basic notifications and alerts'],
    limitations: ['Up to 15 members', '5 GB storage', 'No advanced settings controls'],
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    priceLabel: '\u20B91,000',
    period: 'per user / month',
    pricePerMember: 1000,
    memberRule: 'Up to 75 members',
    detail: 'Advanced collaboration and file workflows for scaling teams.',
    features: [
      'Everything in Starter',
      'Files module',
      'Private 1-on-1 chat with history',
      'Team spaces and advanced collaboration views',
    ],
    limitations: ['Up to 75 members', 'Standard support SLA', 'No dedicated account manager'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    priceLabel: 'Custom',
    period: 'monthly billing',
    baseTotalPrice: 1000,
    baseMembers: 76,
    memberRule: 'Above 75 members',
    detail: 'Enterprise-grade controls and support with pricing based on team size.',
    features: [
      'Everything in Growth',
      'Full settings and governance',
      'Priority onboarding/support',
      'Custom policy and integration options',
    ],
    limitations: ['Contract-based terms', 'Scope based on agreement', 'Integration package based pricing'],
  },
};

const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function Payment({
  setActiveView,
  selectedPlanId = 'starter',
  activePlan = 'demo',
  canViewActivePlan = true,
  canPurchasePlan = true,
  onConfirmPlan,
}) {
  const plan = plans[selectedPlanId] || plans.starter;
  const isEnterprise = plan.id === 'enterprise';
  const [memberCount, setMemberCount] = useState(76);

  const payable = useMemo(() => {
    if (plan.pricePerMember <= 0) return 0;
    if (isEnterprise) {
      const baseMembers = plan.baseMembers || 76;
      const baseTotalPrice = plan.baseTotalPrice || 1000;
      return Math.round((baseTotalPrice * memberCount) / baseMembers);
    }
    return plan.pricePerMember;
  }, [isEnterprise, memberCount, plan.baseMembers, plan.baseTotalPrice, plan.pricePerMember]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-accent-warm-grey">Payment</h1>
        <p className="mt-2 text-sm text-text-default">
          Review your selected plan in detail and continue payment.
        </p>
        {canViewActivePlan && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary-dusty-blue">
            Active plan: {String(activePlan).toUpperCase()}
          </p>
        )}
        {!canPurchasePlan && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent-muted-coral">
            Only Team Leader or Manager can confirm plan purchases.
          </p>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-accent-warm-grey">{plan.name} Plan</h2>
          <p className="mt-1 text-sm text-text-default">{plan.detail}</p>
          <p className="mt-3 text-sm font-medium text-primary-dusty-blue">Member range: {plan.memberRule}</p>

          <div className="mt-4 rounded-xl bg-background-light-sand p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-warm-grey">Features</p>
            <ul className="mt-2 space-y-1 text-sm text-text-default">
              {plan.features.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-3 rounded-xl border border-[#88C0D0]/25 bg-background-warm-off-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-warm-grey">Limitations</p>
            <ul className="mt-2 space-y-1 text-sm text-text-default">
              {plan.limitations.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-accent-warm-grey">Order Summary</h3>
          <p className="mt-2 text-sm text-text-default">
            Plan: <span className="font-semibold">{plan.name}</span>
          </p>

          {isEnterprise && (
            <div className="mt-4 space-y-2 rounded-xl bg-background-light-sand p-3">
              <label htmlFor="enterprise-members" className="text-xs font-semibold uppercase tracking-wide text-accent-warm-grey">
                Members (Above 75)
              </label>
              <input
                id="enterprise-members"
                type="number"
                min={76}
                value={memberCount}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setMemberCount(Number.isFinite(next) ? Math.max(76, next) : 76);
                }}
                className="w-full rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2 text-sm text-accent-warm-grey outline-none"
              />
              <p className="text-xs text-text-default">\u20B91,000 total at 76 members (increases with members)</p>
            </div>
          )}

          <div className="mt-4 rounded-xl border border-[#88C0D0]/25 bg-background-light-sand p-3">
            <p className="text-xs uppercase tracking-wide text-text-default">Payable now</p>
            <p className="mt-1 text-2xl font-bold text-primary-dusty-blue">
              {payable > 0 ? `${formatInr(payable)} / month` : 'Free'}
            </p>
            <p className="mt-1 text-xs text-text-default">
              {isEnterprise ? `Members selected: ${memberCount}` : plan.period}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onConfirmPlan?.(plan.id)}
            disabled={!canPurchasePlan}
            className="mt-4 w-full rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-semibold text-background-warm-off-white hover:bg-primary-soft-sky disabled:cursor-not-allowed disabled:opacity-60"
          >
            {canPurchasePlan ? 'Confirm and Activate Plan' : 'Purchase Restricted'}
          </button>
          <button
            type="button"
            onClick={() => setActiveView?.('pricing')}
            className="mt-2 w-full rounded-xl border border-[#88C0D0]/40 bg-background-warm-off-white px-4 py-2.5 text-sm font-semibold text-primary-dusty-blue hover:bg-background-light-sand"
          >
            Back to Pricing
          </button>
        </aside>
      </section>
    </div>
  );
}
