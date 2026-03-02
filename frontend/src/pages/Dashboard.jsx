import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const activityData = [
  { name: 'Mon', tasks: 24, commits: 12 },
  { name: 'Tue', tasks: 31, commits: 18 },
  { name: 'Wed', tasks: 28, commits: 15 },
  { name: 'Thu', tasks: 35, commits: 22 },
  { name: 'Fri', tasks: 42, commits: 28 },
  { name: 'Sat', tasks: 18, commits: 8 },
  { name: 'Sun', tasks: 12, commits: 5 },
];

const projectStatus = [
  { name: 'Completed', value: 12, color: '#88C0D0' },
  { name: 'In Progress', value: 8, color: '#5E81AC' },
  { name: 'Pending', value: 4, color: '#A3BE8C' },
];

const stats = [
  { label: 'Active Projects', value: '24', change: '+12%', icon: FolderKanban, color: 'from-primary-dusty-blue to-primary-soft-sky' },
  { label: 'Team Members', value: '18', change: '+3', icon: Users, color: 'from-[#A3BE8C] to-[#6B8E23]' },
  { label: 'Tasks Done', value: '156', change: '+28%', icon: CheckCircle2, color: 'from-[#E07A5F] to-[#E07A5F]' },
  { label: 'Hours Logged', value: '342', change: '+18h', icon: Clock, color: 'from-[#5E81AC] to-[#88C0D0]' },
];

const recentActivity = [
  { user: 'Sarah Chen', action: 'completed task', target: 'Design System Update', time: '2 min ago', avatar: 'SC' },
  { user: 'Mike Ross', action: 'commented on', target: 'API Documentation', time: '15 min ago', avatar: 'MR' },
  { user: 'Emma Davis', action: 'uploaded files to', target: 'Marketing Campaign', time: '1 hour ago', avatar: 'ED' },
  { user: 'James Lee', action: 'created new project', target: 'Mobile App v2.0', time: '3 hours ago', avatar: 'JL' },
];

export default function Dashboard({ userName }) {
  const displayName = String(userName || '').trim() || 'there';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-accent-warm-grey">Welcome back, {displayName}</h1>
        <p className="text-text-default">Here's what's happening with your team today.</p>
      </motion.div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`} />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-default">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-accent-warm-grey">{stat.value}</p>
                </div>
                <div className="rounded-xl bg-background-light-sand p-2 text-primary-dusty-blue">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 font-medium text-secondary-olive-accent">
                  <TrendingUp className="h-4 w-4" />
                  {stat.change}
                </span>
                <span className="text-text-default">from last week</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-accent-warm-grey">Team Activity</h2>
            <div className="flex items-center gap-4 text-xs text-text-default">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-dusty-blue" />
                Tasks
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary-sage-green" />
                Commits
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#88C0D0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#88C0D0" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A3BE8C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A3BE8C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0DDD4" />
                <XAxis dataKey="name" stroke="#8B8E7E" fontSize={12} />
                <YAxis stroke="#8B8E7E" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F8F9F6',
                    border: '1px solid #E0DDD4',
                    borderRadius: '12px',
                    color: '#4C566A',
                  }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#5E81AC" strokeWidth={2} fill="url(#colorTasks)" />
                <Area type="monotone" dataKey="commits" stroke="#A3BE8C" strokeWidth={2} fill="url(#colorCommits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-accent-warm-grey">Project Status</h2>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F8F9F6',
                    border: '1px solid #E0DDD4',
                    borderRadius: '12px',
                    color: '#4C566A',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {projectStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg bg-background-light-sand px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-accent-warm-grey">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-accent-warm-grey">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-accent-warm-grey">Recent Activity</h2>
            <button className="inline-flex items-center gap-1 text-sm font-medium text-primary-dusty-blue hover:text-primary-soft-sky">
              View all <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.user + activity.time}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3 rounded-xl bg-background-light-sand p-3"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-dusty-blue text-sm font-semibold text-background-warm-off-white">
                  {activity.avatar}
                </div>
                <div>
                  <p className="text-sm text-accent-warm-grey">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    <span className="text-text-default">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-text-default">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-accent-warm-grey">Upcoming Meetings</h2>
            <Calendar className="h-5 w-5 text-primary-dusty-blue" />
          </div>
          <div className="space-y-3">
            {[
              { title: 'Sprint Planning', time: '10:00 AM', participants: 5, color: 'bg-primary-dusty-blue' },
              { title: 'Design Review', time: '2:30 PM', participants: 3, color: 'bg-[#A3BE8C]' },
              { title: 'Client Call', time: '4:00 PM', participants: 4, color: 'bg-[#E07A5F]' },
            ].map((meeting, index) => (
              <motion.div
                key={meeting.title}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between rounded-xl bg-background-light-sand p-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-1.5 rounded-full ${meeting.color}`} />
                  <div>
                    <h3 className="text-sm font-semibold text-accent-warm-grey">{meeting.title}</h3>
                    <p className="text-xs text-text-default">
                      {meeting.time} &bull; {meeting.participants} participants
                    </p>
                  </div>
                </div>
                <button className="rounded-md bg-primary-dusty-blue px-3 py-1.5 text-xs font-medium text-background-warm-off-white hover:bg-primary-soft-sky">
                  Join
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

