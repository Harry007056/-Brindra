import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2, FolderKanban, MessageSquare, Rocket, Sparkles, Users } from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'Real-time Chat', description: 'Keep discussions focused with instant updates and clear team context.', color: 'from-[#5E81AC] to-[#88C0D0]' },
  { icon: FolderKanban, title: 'Project Management', description: 'Plan work in one place with shared project visibility across teams.', color: 'from-[#5E81AC] to-[#88C0D0]' },
  { icon: Users, title: 'Team Hub', description: 'Bring members, files, and workflows together in a single workspace.', color: 'from-[#A3BE8C] to-[#6B8E23]' },
];

const pricingPlans = [
  { name: 'Starter', price: '$0', desc: 'For small teams getting started.' },
  { name: 'Growth', price: '$12', desc: 'For teams scaling delivery and workflows.' },
  { name: 'Enterprise', price: 'Custom', desc: 'For large orgs with advanced needs.' },
];

const stats = [
  { label: 'Active Projects', value: '24' },
  { label: 'Team Members', value: '18' },
  { label: 'Tasks Done', value: '156' },
  { label: 'Hours Logged', value: '342' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function Landing({ onLoginClick, onRegisterClick }) {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -45]);
  const orbDriftX = useTransform(scrollYProgress, [0, 0.6], [0, 30]);
  const orbDriftY = useTransform(scrollYProgress, [0, 0.6], [0, -20]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.nav
        initial={{ y: -14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="sticky top-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white/95 px-4 py-3 shadow-sm backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="grid h-8 w-8 place-items-center rounded-lg bg-primary-dusty-blue text-background-warm-off-white"
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
          <span className="text-sm font-semibold text-accent-warm-grey">Brindra</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => scrollToSection('home')} className="rounded-lg px-3 py-1.5 text-sm text-accent-warm-grey hover:bg-background-light-sand">Home</button>
          <button onClick={() => scrollToSection('features')} className="rounded-lg px-3 py-1.5 text-sm text-accent-warm-grey hover:bg-background-light-sand">Features</button>
          <button onClick={() => scrollToSection('pricing')} className="rounded-lg px-3 py-1.5 text-sm text-accent-warm-grey hover:bg-background-light-sand">Pricing</button>
          <button onClick={() => scrollToSection('aboutus')} className="rounded-lg px-3 py-1.5 text-sm text-accent-warm-grey hover:bg-background-light-sand">About Us</button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onLoginClick} className="rounded-lg border border-[#88C0D0]/40 bg-background-warm-off-white px-3 py-1.5 text-sm font-medium text-primary-dusty-blue hover:bg-background-light-sand">
            Log In
          </button>
          <button onClick={onRegisterClick} className="rounded-lg bg-primary-dusty-blue px-3 py-1.5 text-sm font-medium text-background-warm-off-white hover:bg-primary-soft-sky">
            Sign Up
          </button>
        </div>
      </motion.nav>

      <section id="home" className="relative overflow-hidden rounded-3xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm lg:p-8">
        <motion.div
          style={{ x: orbDriftX, y: orbDriftY }}
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary-soft-sky/30 blur-3xl"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-secondary-sage-green/25 blur-3xl"
          animate={{ x: [0, 16, 0], y: [0, -12, 0], scale: [1, 0.94, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div style={{ y: heroY }} className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft-sky/20 px-3 py-1 text-xs font-semibold text-primary-dusty-blue">
              <Rocket className="h-3.5 w-3.5" />
              Team collaboration platform
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl font-bold leading-tight text-accent-warm-grey lg:text-5xl">
              Collaborate.
              <br />
              Elevate.
              <br />
              Excel.
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-4 max-w-xl text-base text-text-default">
              Team collaboration reimagined. A seamless workspace for modern teams to create, communicate, and ship faster.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-3">
              <motion.button
                onClick={onRegisterClick}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-semibold text-background-warm-off-white"
              >
                Start Free Trial
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </motion.button>
              <motion.button whileHover={{ y: -2 }} className="rounded-xl border border-[#88C0D0]/40 bg-background-warm-off-white px-4 py-2.5 text-sm font-semibold text-primary-dusty-blue hover:bg-background-light-sand">
                Watch Demo
              </motion.button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-4 space-y-1 text-xs text-text-default">
              <p className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-secondary-olive-accent" />
                No credit card required
              </p>
              <p className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-secondary-olive-accent" />
                Trusted by 10,000+ teams
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.16, duration: 0.45 }}
            whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
            className="rounded-2xl border border-[#88C0D0]/30 bg-background-warm-off-white p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-primary-dusty-blue">Live Team Snapshot</p>
            <motion.div variants={stagger} initial="hidden" animate="show" className="mt-4 grid grid-cols-2 gap-3">
              {stats.map((item) => (
                <motion.div key={item.label} variants={fadeUp} className="rounded-xl bg-background-light-sand p-3">
                  <p className="text-xs text-text-default">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-accent-warm-grey">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <div className="overflow-hidden rounded-full border border-[#D9E1D7] bg-background-warm-off-white py-2">
        <motion.div
          className="flex gap-6 whitespace-nowrap px-4 text-xs font-medium text-primary-dusty-blue"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="inline-flex gap-6">
              <span>Live Collaboration</span>
              <span>Project Visibility</span>
              <span>Team Alignment</span>
              <span>Real-time Decisions</span>
              <span>Calm Workflow</span>
            </span>
          ))}
        </motion.div>
      </div>

      <section id="features" className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-2xl font-semibold text-accent-warm-grey">
          Why Teams Choose Brindra
        </motion.h2>
        <motion.div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={fadeUp} whileHover={{ y: -6, scale: 1.01 }} className="rounded-xl border border-[#88C0D0]/25 bg-background-light-sand p-4">
                <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-r p-2 text-background-warm-off-white ${feature.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-accent-warm-grey">{feature.title}</h3>
                <p className="mt-1 text-sm text-text-default">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section id="pricing" className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-2xl font-semibold text-accent-warm-grey">
          Pricing
        </motion.h2>
        <p className="mt-1 text-sm text-text-default">Simple plans with transparent pricing.</p>
        <motion.div className="mt-4 grid gap-4 md:grid-cols-3" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`relative rounded-xl border p-4 ${
                idx === 1 ? 'border-primary-soft-sky/60 bg-primary-soft-sky/10' : 'border-[#88C0D0]/30 bg-background-light-sand'
              }`}
            >
              {idx === 1 && (
                <motion.span className="absolute -top-2 right-3 rounded-full bg-secondary-sage-green px-2.5 py-1 text-[10px] font-semibold text-accent-warm-grey" animate={{ y: [0, -2, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
                  Popular
                </motion.span>
              )}
              <h3 className="text-base font-semibold text-accent-warm-grey">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-primary-dusty-blue">{plan.price}</p>
              <p className="mt-2 text-sm text-text-default">{plan.desc}</p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onRegisterClick}
                className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  idx === 1
                    ? 'bg-primary-dusty-blue text-background-warm-off-white hover:bg-primary-soft-sky'
                    : 'border border-[#88C0D0]/40 bg-background-warm-off-white text-primary-dusty-blue hover:bg-background-light-sand'
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="aboutus" className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-2xl font-semibold text-accent-warm-grey">
          About Us
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.05 }}
          className="mt-2 text-text-default"
        >
          Brindra is built to make team collaboration calm, clear, and measurable. We focus on giving teams one workspace where communication, planning, and delivery stay aligned.
        </motion.p>
        <motion.div className="mt-4 grid gap-4 md:grid-cols-2" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="rounded-xl border border-[#88C0D0]/30 bg-background-light-sand p-4">
            <h3 className="text-base font-semibold text-accent-warm-grey">Our Mission</h3>
            <p className="mt-1 text-sm text-text-default">Help teams move faster with less noise.</p>
          </motion.div>
          <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="rounded-xl border border-[#88C0D0]/30 bg-background-light-sand p-4">
            <h3 className="text-base font-semibold text-accent-warm-grey">Our Values</h3>
            <p className="mt-1 text-sm text-text-default">Clarity, ownership, and practical collaboration.</p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
