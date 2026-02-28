import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile,
  MoreVertical,
  Phone,
  Video,
  Circle
} from 'lucide-react';
import { clsx } from 'clsx';

const conversations = [
  { id: 1, name: 'Sarah Chen', lastMessage: 'The designs are ready for review!', time: '2m ago', unread: 2, avatar: 'SC', online: true },
  { id: 2, name: 'Mike Ross', lastMessage: 'API endpoint is working now', time: '15m ago', unread: 0, avatar: 'MR', online: true },
  { id: 3, name: 'Emma Davis', lastMessage: 'Let\'s schedule the meeting', time: '1h ago', unread: 0, avatar: 'ED', online: false },
  { id: 4, name: 'James Lee', lastMessage: 'Deployed the new version', time: '3h ago', unread: 0, avatar: 'JL', online: false },
  { id: 5, name: 'Ana Garcia', lastMessage: 'CI/CD pipeline is set up', time: 'Yesterday', unread: 0, avatar: 'AG', online: true },
];

const messages = [
  { id: 1, sender: 'Sarah Chen', text: 'Hey! I\'ve finished the design updates for the dashboard.', time: '10:30 AM', isMe: false, avatar: 'SC' },
  { id: 2, sender: 'Me', text: 'That\'s great! Can you share the Figma link?', time: '10:32 AM', isMe: true, avatar: 'AK' },
  { id: 3, sender: 'Sarah Chen', text: 'Sure, here it is: figma.com/file/xxx. I\'ve also added comments on the key sections.', time: '10:35 AM', isMe: false, avatar: 'SC' },
  { id: 4, sender: 'Me', text: 'Looks amazing! Love the new color scheme. Can we schedule a review meeting for tomorrow?', time: '10:38 AM', isMe: true, avatar: 'AK' },
  { id: 5, sender: 'Sarah Chen', text: 'The designs are ready for review! Let me know what you think.', time: '10:40 AM', isMe: false, avatar: 'SC' },
];

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-[#4C566A] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Messages
        </h1>
        <p className="text-[#8B8E7E]">Chat with your team members in real-time.</p>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="h-[calc(100vh-220px)] rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50 overflow-hidden flex"
      >
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r border-[#E0DDD4]/50 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-[#E0DDD4]/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8E7E]" />
              <input 
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 text-[#4C566A] placeholder-[#8B8E7E] text-sm focus:outline-none focus:border-[#5E81AC] transition-colors"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
                className={clsx(
                  'w-full p-4 flex items-start gap-3 hover:bg-[#F1F3EE]/50 transition-colors border-b border-[#E0DDD4]/20',
                  activeChat === conv.id && 'bg-[#E0DDD4]/30'
                )}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5E81AC] to-[#88C0D0] flex items-center justify-center text-white font-semibold">
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#A3BE8C] border-2 border-[#F8F9F6]" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#4C566A] font-medium truncate">{conv.name}</span>
                    <span className="text-[#8B8E7E] text-xs">{conv.time}</span>
                  </div>
                  <p className={clsx(
                    'text-sm truncate',
                    conv.unread > 0 ? 'text-[#4C566A] font-medium' : 'text-[#8B8E7E]'
                  )}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#5E81AC] text-white text-xs font-medium">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#E0DDD4]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5E81AC] to-[#88C0D0] flex items-center justify-center text-white font-semibold text-sm">
                SC
              </div>
              <div>
                <h3 className="text-[#4C566A] font-medium">Sarah Chen</h3>
                <p className="text-[#A3BE8C] text-xs">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-[#F1F3EE]/50 text-[#8B8E7E] hover:text-[#4C566A] transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-[#F1F3EE]/50 text-[#8B8E7E] hover:text-[#4C566A] transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-[#F1F3EE]/50 text-[#8B8E7E] hover:text-[#4C566A] transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={clsx(
                  'flex gap-3',
                  msg.isMe ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5E81AC] to-[#88C0D0] flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                  {msg.avatar}
                </div>
                <div className={clsx(
                  'max-w-md px-4 py-3 rounded-2xl',
                  msg.isMe 
                    ? 'bg-gradient-to-r from-[#5E81AC] to-[#88C0D0] text-white rounded-br-md'
                    : 'bg-[#E0DDD4]/30 text-[#4C566A] rounded-bl-md'
                )}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={clsx(
                    'text-xs mt-1',
                    msg.isMe ? 'text-white/70' : 'text-[#8B8E7E]'
                  )}>
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#E0DDD4]/50">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-[#F1F3EE]/50 text-[#8B8E7E] hover:text-[#4C566A] transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 text-[#4C566A] placeholder-[#8B8E7E] focus:outline-none focus:border-[#5E81AC] transition-colors"
              />
              <button className="p-2 rounded-lg hover:bg-[#F1F3EE]/50 text-[#8B8E7E] hover:text-[#4C566A] transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl bg-gradient-to-r from-[#5E81AC] to-[#88C0D0] text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
