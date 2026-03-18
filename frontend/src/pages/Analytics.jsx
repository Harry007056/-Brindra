import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Activity, Users, TrendingUp, CalendarDays } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const metrics = [
  { label: 'Active Projects', value: 24, change: '+12%', color: 'from-[#5E81AC] to-[#88C0D0]', icon: TrendingUp },
  { label: 'Team Members', value: 18, change: '+3%', color: 'from-[#A3BE8C] to-[#6B8E23]', icon: Users },
  { label: 'Tasks Completed', value: 156, change: '+28%', color: 'from-[#BF616A] to-[#D08770]', icon: Activity },
  { label: 'Avg Completion', value: '92%', change: '+4%', color: 'from-[#8FBCBB] to-[#88C0D0]', icon: BarChart3 },
];

export default function Analytics() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="p-6 space-y-8"
    >
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent-warm-grey">Analytics</h1>
          <p className="text-text-default mt-1">Team performance and project insights</p>
        </div>
        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-dusty-blue text-background-warm-off-white rounded-xl font-medium hover:bg-primary-soft-sky shadow-lg hover:shadow-xl transition-all"
        >
          <CalendarDays className="h-4 w-4" />
          Export Report
        </motion.button>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              variants={fadeUp}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-background-warm-off-white rounded-2xl border border-[#88C0D0]/25 p-6 shadow-sm hover:shadow-lg hover:border-primary-soft-sky/50 transition-all overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className="relative flex items-start justify-between">
                <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm group-hover:bg-primary-soft-sky/20 transition-all">
                  <Icon className="h-6 w-6 text-primary-dusty-blue opacity-80 group-hover:text-background-warm-off-white" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm ${metric.change.startsWith('+') ? 'text-secondary-olive-accent' : 'text-accent-muted-coral'}`}>
                  {metric.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-accent-warm-grey [text-shadow:0_1px_0_rgb(0_0_0_0.1)]">{metric.value}</p>
                <p className="mt-1 text-sm text-text-default font-medium">{metric.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Activity */}
      <motion.section variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-warm-off-white rounded-2xl border border-[#88C0D0]/25 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-accent-warm-grey mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { time: '2h ago', action: 'Priya completed "API Rate Limiting"', project: 'Backend Sprint' },
              { time: '5h ago', action: 'Aman assigned 3 tasks', project: 'Q3 Design System' },
              { time: '1d ago', action: 'You reviewed 4 PRs', project: 'Mobile Auth Flow' },
              { time: '2d ago', action: 'Team milestone reached', project: 'Client Delivery' },
            ].map((item) => (
              <div key={item.time} className="flex items-start gap-3 p-3 rounded-xl hover:bg-background-light-sand transition-colors group">
                <div className="w-2 h-2 bg-primary-dusty-blue rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main group-hover:text-primary-dusty-blue">{item.action}</p>
                  <p className="text-xs text-text-default mt-1">{item.project}</p>
                </div>
                <span className="text-xs font-mono text-text-muted whitespace-nowrap flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-soft-sky/5 to-secondary-sage-green/5 rounded-2xl border border-[#88C0D0]/25 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-accent-warm-grey mb-6">Project Velocity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm text-text-default font-medium">Sprint Velocity</span>
              <span className="text-2xl font-bold text-primary-dusty-blue">18 pts/wk</span>
            </div>
            <div className="w-full bg-background-light-sand rounded-full h-3">
              <div className="bg-gradient-to-r from-secondary-olive-accent to-primary-dusty-blue h-3 rounded-full" style={{ width: '78%' }} />
            </div>
            <div className="text-xs text-text-default grid grid-cols-3 gap-2 mt-2">
              <span>Week -2: 15</span>
              <span>Week -1: 17</span>
              <span>Current: 18</span>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

