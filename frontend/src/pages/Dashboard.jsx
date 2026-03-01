import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  FolderKanban, 
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Calendar
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
  Cell
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
  { name: 'Completed', value: 12, color: '#5b8def' },
  { name: 'In Progress', value: 8, color: '#3d7bd4' },
  { name: 'Pending', value: 4, color: '#4ade80' },
];

const stats = [
  { label: 'Active Projects', value: '24', change: '+12%', icon: FolderKanban, color: 'from-[#5b8def] to-[#3d7bd4]' },
  { label: 'Team Members', value: '18', change: '+3', icon: Users, color: 'from-[#4ade80] to-[#a78bfa]' },
  { label: 'Tasks Done', value: '156', change: '+28%', icon: CheckCircle2, color: 'from-[#E07A5F] to-[#D4694F]' },
  { label: 'Hours Logged', value: '342', change: '+18h', icon: Clock, color: 'from-[#3d7bd4] to-[#5b8def]' },
];

const recentActivity = [
  { user: 'Sarah Chen', action: 'completed task', target: 'Design System Update', time: '2 min ago', avatar: 'SC' },
  { user: 'Mike Ross', action: 'commented on', target: 'API Documentation', time: '15 min ago', avatar: 'MR' },
  { user: 'Emma Davis', action: 'uploaded files to', target: 'Marketing Campaign', time: '1 hour ago', avatar: 'ED' },
  { user: 'James Lee', action: 'created new project', target: 'Mobile App v2.0', time: '3 hours ago', avatar: 'JL' },
];

export default function Dashboard() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-[#4C566A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          Welcome back, Alex
        </h1>
        <p className="text-[#a8a29e] text-lg">Here's what's happening with your team today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-8 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50 overflow-hidden group"
            >
              {/* Watercolor Effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${stat.color}`} />
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-[#a8a29e] text-sm mb-2">{stat.label}</p>
                  <p className="text-4xl lg:text-5xl font-bold text-[#4C566A]">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-6 text-sm">
                <span className="text-[#A3BE8C] flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </span>
                <span className="text-[#a8a29e]">from last week</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-8 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#4C566A]" style={{ fontFamily: 'Syne, sans-serif' }}>
              Team Activity
            </h2>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#5E81AC]" />
                <span className="text-[#8B8E7E]">Tasks</span>
              </span>
              <span className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#A3BE8C]" />
                <span className="text-[#8B8E7E]">Commits</span>
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5b8def" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5b8def" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
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
                    color: '#4C566A'
                  }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#5E81AC" strokeWidth={2} fill="url(#colorTasks)" />
                <Area type="monotone" dataKey="commits" stroke="#A3BE8C" strokeWidth={2} fill="url(#colorCommits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Status */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-8 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50"
        >
          <h2 className="text-2xl font-semibold text-[#4C566A] mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>
            Project Status
          </h2>
          <div className="h-56">
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
                    color: '#4C566A'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-8">
            {projectStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#8B8E7E] text-base">{item.name}</span>
                </div>
                <span className="text-[#4C566A] font-semibold text-base">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-8 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#4C566A]" style={{ fontFamily: 'Syne, sans-serif' }}>
              Recent Activity
            </h2>
            <button className="text-[#5E81AC] text-sm flex items-center gap-2 hover:gap-3 transition-all font-medium">
              View all <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-5">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-5 p-4 rounded-xl hover:bg-[#F1F3EE]/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5E81AC] to-[#88C0D0] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#4C566A] text-base leading-relaxed">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    <span className="text-[#8B8E7E]">{activity.action}</span>{' '}
                    <span className="text-[#5E81AC]">{activity.target}</span>
                  </p>
                  <p className="text-[#8B8E7E] text-sm mt-2">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Meetings */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-8 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#4C566A]" style={{ fontFamily: 'Syne, sans-serif' }}>
              Upcoming Meetings
            </h2>
            <Calendar className="w-6 h-6 text-[#5E81AC]" />
          </div>
          <div className="space-y-5">
            {[
              { title: 'Sprint Planning', time: '10:00 AM', participants: 5, color: 'bg-[#5E81AC]' },
              { title: 'Design Review', time: '2:30 PM', participants: 3, color: 'bg-[#A3BE8C]' },
              { title: 'Client Call', time: '4:00 PM', participants: 4, color: 'bg-[#E07A5F]' },
            ].map((meeting, index) => (
              <motion.div
                key={index}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-5 p-5 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 hover:border-[#5E81AC]/30 transition-colors"
              >
                <div className={`w-1 h-14 rounded-full ${meeting.color}`} />
                <div className="flex-1">
                  <h3 className="text-[#4C566A] font-semibold text-base">{meeting.title}</h3>
                  <p className="text-[#8B8E7E] text-sm mt-1">{meeting.time} • {meeting.participants} participants</p>
                </div>
                <button className="px-5 py-2 rounded-lg bg-[#5E81AC]/10 text-[#5E81AC] text-sm font-semibold hover:bg-[#5E81AC]/20 transition-colors flex-shrink-0">
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
