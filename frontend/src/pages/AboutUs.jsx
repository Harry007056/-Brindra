export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-accent-warm-grey">About Us</h1>
        <p className="mt-2 text-text-default">
          Brindra helps teams stay aligned with thoughtful collaboration tools built around clarity and calm workflows.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-accent-warm-grey">Our Mission</h2>
          <p className="mt-2 text-sm text-text-default">
            Make teamwork feel simple, transparent, and productive without noise.
          </p>
        </article>
        <article className="rounded-xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-accent-warm-grey">Our Values</h2>
          <p className="mt-2 text-sm text-text-default">
            Clarity, trust, and measurable progress in every project.
          </p>
        </article>
      </section>
    </div>
  );
}

