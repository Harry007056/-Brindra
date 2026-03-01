import { motion } from 'framer-motion';
import { Search, Mail, MoreVertical, MapPin, Github, Linkedin } from 'lucide-react';

const teamMembers = [
  { 
    id: 1, 
    name: 'Sarah Chen', 
    role: 'UI/UX Designer', 
    email: 'sarah@brindra.io',
    location: 'San Francisco, CA',
    avatar: 'SC',
    status: 'online',
    skills: ['Figma', 'Sketch', 'User Research'],
    color: 'from-[#E07A5F] to-[#E07A5F]'
  },
  { 
    id: 2, 
    name: 'Mike Ross', 
    role: 'Frontend Developer', 
    email: 'mike@brindra.io',
    location: 'New York, NY',
    avatar: 'MR',
    status: 'online',
    skills: ['React', 'TypeScript', 'CSS'],
    color: 'from-primary-dusty-blue to-primary-soft-sky'
  },
  { 
    id: 3, 
    name: 'Emma Davis', 
    role: 'Product Manager', 
    email: 'emma@brindra.io',
    location: 'Austin, TX',
    avatar: 'ED',
    status: 'away',
    skills: ['Agile', 'Jira', 'Strategy'],
    color: 'from-[#A3BE8C] to-[#6B8E23]'
  },
  { 
    id: 4, 
    name: 'James Lee', 
    role: 'Backend Developer', 
    email: 'james@brindra.io',
    location: 'Seattle, WA',
    avatar: 'JL',
    status: 'offline',
    skills: ['Node.js', 'Python', 'AWS'],
    color: 'from-[#5E81AC] to-[#88C0D0]'
  },
  { 
    id: 5, 
    name: 'Ana Garcia', 
    role: 'DevOps Engineer', 
    email: 'ana@brindra.io',
    location: 'London, UK',
    avatar: 'AG',
    status: 'online',
    skills: ['Docker', 'Kubernetes', 'CI/CD'],
    color: 'from-[#A3BE8C] to-[#6B8E23]'
  },
  { 
    id: 6, 
    name: 'David Park', 
    role: 'Data Analyst', 
    email: 'david@brindra.io',
    location: 'Toronto, CA',
    avatar: 'DP',
    status: 'online',
    skills: ['Python', 'SQL', 'Tableau'],
    color: 'from-[#5E81AC] to-[#88C0D0]'
  },
];

export default function TeamMembers({ setActiveView }) {
  const getStatusClass = (status) => {
    if (status === 'online') return 'bg-secondary-sage-green';
    if (status === 'away') return 'bg-accent-muted-coral';
    return 'bg-slate-300';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-accent-warm-grey">Team Members</h1>
          <p className="text-text-default">Manage your team and collaborate effectively.</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-dusty-blue" />
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${member.color}`} />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${member.color} text-sm font-semibold text-background-warm-off-white`}>
                    {member.avatar}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${getStatusClass(member.status)}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-accent-warm-grey">{member.name}</h3>
                  <p className="text-sm text-text-default">{member.role}</p>
                </div>
              </div>
              <button className="rounded-lg p-1.5 text-text-default transition hover:bg-background-light-sand hover:text-accent-warm-grey">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2 rounded-xl bg-background-light-sand p-3">
              <div className="flex items-center gap-2 text-sm text-text-default">
                <Mail className="h-4 w-4 text-primary-dusty-blue" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-default">
                <MapPin className="h-4 w-4 text-primary-dusty-blue" />
                <span>{member.location}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#88C0D0]/35 bg-[#F8F9F6] px-2.5 py-1 text-xs font-medium text-primary-dusty-blue"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-dusty-blue px-3 py-2 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky"
                onClick={() => {
                  localStorage.setItem('chatTarget', member.name);
                  setActiveView('chat');
                }}
              >
                <Mail className="h-4 w-4" />
                Message
              </button>
              <button className="rounded-lg border border-[#88C0D0]/35 p-2 text-primary-dusty-blue transition hover:bg-background-light-sand">
                <Github className="h-4 w-4" />
              </button>
              <button className="rounded-lg border border-[#88C0D0]/35 p-2 text-primary-dusty-blue transition hover:bg-background-light-sand">
                <Linkedin className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


