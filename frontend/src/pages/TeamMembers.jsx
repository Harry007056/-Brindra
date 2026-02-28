import { motion } from 'framer-motion';
import { Search, Mail, MoreVertical, MapPin, Calendar, Github, Linkedin } from 'lucide-react';

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
    color: 'from-[#E07A5F] to-[#D4694F]'
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
    color: 'from-[#5b8def] to-[#3d7bd4]'
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
    color: 'from-[#4ade80] to-[#a78bfa]'
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
    color: 'from-[#3d7bd4] to-[#5b8def]'
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
    color: 'from-[#4ade80] to-[#a78bfa]'
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
    color: 'from-[#3d7bd4] to-[#5b8def]'
  },
];

export default function TeamMembers() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#4C566A] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Team Members
          </h1>
          <p className="text-[#8B8E7E]">Manage your team and collaborate effectively.</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B8E7E]" />
          <input 
            type="text"
            placeholder="Search team members..."
            className="w-full sm:w-72 pl-12 pr-4 py-3 rounded-xl bg-[#F8F9F6] border border-[#E0DDD4]/50 text-[#4C566A] placeholder-[#8B8E7E] focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>
      </motion.div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50 hover:border-[#5b8def]/30 transition-all duration-300 group"
          >
            {/* Top Section */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-[#4C566A] font-bold text-lg shadow-lg`}>
                    {member.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#E0DDD4] ${
                    member.status === 'online' ? 'bg-[#4ade80]' :
                    member.status === 'away' ? 'bg-[#fbbf24]' : 'bg-[#8B8E7E]'
                  }`} />
                </div>
                <div>
                  <h3 className="text-[#4C566A] font-semibold text-lg">{member.name}</h3>
                  <p className="text-[#5E81AC] text-sm">{member.role}</p>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-[#F1F3EE]/50 text-[#8B8E7E] hover:text-[#4C566A] transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-[#8B8E7E] text-sm">
                <Mail className="w-4 h-4" />
                {member.email}
              </div>
              <div className="flex items-center gap-2 text-[#8B8E7E] text-sm">
                <MapPin className="w-4 h-4" />
                {member.location}
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {member.skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1 rounded-lg bg-[#E0DDD4]/50 text-[#8B8E7E] text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-[#E0DDD4]/50">
              <button className="flex-1 py-2 rounded-lg bg-[#5E81AC]/20 text-[#5E81AC] text-sm font-medium hover:bg-[#5E81AC]/30 transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Message
              </button>
              <button className="p-2 rounded-lg bg-[#E0DDD4]/50 text-[#8B8E7E] hover:text-[#4C566A] hover:bg-[#E0DDD4]/50 transition-colors">
                <Github className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-[#E0DDD4]/50 text-[#8B8E7E] hover:text-[#4C566A] hover:bg-[#E0DDD4]/50 transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
