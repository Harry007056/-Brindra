const values = [
  {
    title: 'Clarity by Default',
    desc: 'We design every workflow to reduce confusion and make next steps obvious.',
  },
  {
    title: 'Team Trust',
    desc: 'Shared visibility and accountability help teams work with confidence.',
  },
  {
    title: 'Progress You Can Measure',
    desc: 'From milestones to delivery, progress should always be visible and actionable.',
  },
];

const principles = [
  'Keep communication contextual and easy to follow.',
  'Enable leaders without blocking team autonomy.',
  'Make setup simple and daily work fast.',
  'Build for reliability in real-world team environments.',
];

export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-accent-warm-grey">About Us</h1>
        <p className="mt-2 text-text-default">
          Brindra helps teams stay aligned with thoughtful collaboration tools built around clarity and calm workflows.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-accent-warm-grey">Our Story</h2>
          <p className="mt-2 text-sm leading-6 text-text-default">
            We built Brindra after seeing teams lose momentum because project updates were scattered across chats, documents, and
            disconnected tools. Our focus is to bring communication, task ownership, and milestones into one clear workspace
            so teams can move faster with less friction.
          </p>
          <p className="mt-3 text-sm leading-6 text-text-default">
            Today, Brindra supports team leads, managers, and members with practical features that fit day-to-day execution,
            not just planning meetings.
          </p>
        </article>

        <article className="rounded-xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-accent-warm-grey">Our Mission</h2>
          <p className="mt-2 text-sm text-text-default">
            Make teamwork feel simple, transparent, and productive without noise.
          </p>
          <h3 className="mt-4 text-sm font-semibold text-accent-warm-grey">What We Build For</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-text-default">
            {principles.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-accent-warm-grey">Our Values</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="rounded-xl bg-background-light-sand p-4">
              <h3 className="text-sm font-semibold text-accent-warm-grey">{item.title}</h3>
              <p className="mt-1 text-sm text-text-default">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
