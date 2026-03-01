const plans = [
  { name: 'Starter', price: '$0', desc: 'Small teams testing collaboration.', cta: 'Start Free' },
  { name: 'Growth', price: '$12', desc: 'For teams scaling projects and workflows.', cta: 'Choose Growth' },
  { name: 'Enterprise', price: 'Custom', desc: 'Advanced controls and dedicated support.', cta: 'Contact Sales' },
];

export default function Pricing() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-accent-warm-grey">Pricing</h1>
        <p className="mt-2 text-text-default">Simple plans with no hidden fees.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, idx) => (
          <article key={plan.name} className="rounded-xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-accent-warm-grey">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold text-primary-dusty-blue">{plan.price}</p>
            <p className="mt-2 text-sm text-text-default">{plan.desc}</p>
            <button
              className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold ${
                idx === 1
                  ? 'bg-primary-dusty-blue text-background-warm-off-white hover:bg-primary-soft-sky'
                  : 'border border-[#88C0D0]/40 bg-background-light-sand text-primary-dusty-blue hover:bg-background-warm-off-white'
              }`}
            >
              {plan.cta}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

