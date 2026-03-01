import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import { clsx } from 'clsx';

const conversations = [
  { id: 1, name: 'Sarah Chen', lastMessage: 'The designs are ready for review!', time: '2m ago', unread: 2, avatar: 'SC', online: true },
  { id: 2, name: 'Mike Ross', lastMessage: 'API endpoint is working now', time: '15m ago', unread: 0, avatar: 'MR', online: true },
  { id: 3, name: 'Emma Davis', lastMessage: "Let's schedule the meeting", time: '1h ago', unread: 0, avatar: 'ED', online: false },
  { id: 4, name: 'James Lee', lastMessage: 'Deployed the new version', time: '3h ago', unread: 0, avatar: 'JL', online: false },
  { id: 5, name: 'Ana Garcia', lastMessage: 'CI/CD pipeline is set up', time: 'Yesterday', unread: 0, avatar: 'AG', online: true },
];

const messages = [
  { id: 1, sender: 'Sarah Chen', text: "Hey! I've finished the design updates for the dashboard.", time: '10:30 AM', isMe: false, avatar: 'SC' },
  { id: 2, sender: 'Me', text: "That's great! Can you share the Figma link?", time: '10:32 AM', isMe: true, avatar: 'AK' },
  { id: 3, sender: 'Sarah Chen', text: "Sure, here it is: figma.com/file/xxx. I've also added comments on the key sections.", time: '10:35 AM', isMe: false, avatar: 'SC' },
  { id: 4, sender: 'Me', text: 'Looks amazing! Love the new color scheme. Can we schedule a review meeting for tomorrow?', time: '10:38 AM', isMe: true, avatar: 'AK' },
  { id: 5, sender: 'Sarah Chen', text: 'The designs are ready for review! Let me know what you think.', time: '10:40 AM', isMe: false, avatar: 'SC' },
];

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const activeConversation = conversations.find((conv) => conv.id === activeChat) || conversations[0];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-accent-warm-grey">Messages</h1>
        <p className="text-text-default">Chat with your team members in real-time.</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid min-h-[70vh] grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]"
      >
        <div className="overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white shadow-sm">
          <div className="border-b border-[#88C0D0]/20 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-dusty-blue" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
                className={clsx(
                  'mb-1 flex w-full items-start gap-3 rounded-xl p-3 text-left transition',
                  activeChat === conv.id
                    ? 'bg-primary-soft-sky/25 ring-1 ring-primary-soft-sky/40'
                    : 'hover:bg-background-light-sand'
                )}
              >
                <div className="relative">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-dusty-blue text-xs font-semibold text-background-warm-off-white">
                    {conv.avatar}
                  </div>
                  {conv.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-secondary-sage-green ring-2 ring-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-accent-warm-grey">{conv.name}</span>
                    <span className="text-xs text-text-default">{conv.time}</span>
                  </div>
                  <p className="truncate text-xs text-text-default">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary-dusty-blue px-1 text-[10px] font-semibold text-background-warm-off-white">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#88C0D0]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary-dusty-blue to-primary-soft-sky text-xs font-semibold text-background-warm-off-white">
                  {activeConversation.avatar}
                </div>
                {activeConversation.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-secondary-sage-green ring-2 ring-white" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-accent-warm-grey">{activeConversation.name}</h3>
                <p className="text-xs text-text-default">{activeConversation.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="rounded-lg p-2 text-primary-dusty-blue transition hover:bg-background-light-sand">
                <Phone className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-primary-dusty-blue transition hover:bg-background-light-sand">
                <Video className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-text-default transition hover:bg-background-light-sand hover:text-accent-warm-grey">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-background-warm-off-white/60 p-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={clsx('flex gap-2', msg.isMe ? 'justify-end' : 'justify-start')}
              >
                {!msg.isMe && (
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-primary-dusty-blue text-[10px] font-semibold text-background-warm-off-white">
                    {msg.avatar}
                  </div>
                )}
                <div
                  className={clsx(
                    'max-w-[75%] rounded-2xl px-3 py-2 shadow-sm',
                    msg.isMe ? 'rounded-tr-sm bg-primary-dusty-blue text-background-warm-off-white' : 'rounded-tl-sm bg-background-warm-off-white text-accent-warm-grey'
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={clsx('mt-1 text-[11px]', msg.isMe ? 'text-background-warm-off-white/80' : 'text-text-default')}>{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-[#88C0D0]/20 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white p-2">
              <button className="rounded-lg p-2 text-primary-dusty-blue transition hover:bg-background-warm-off-white">
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-accent-warm-grey outline-none placeholder:text-text-default"
              />
              <button className="rounded-lg p-2 text-primary-dusty-blue transition hover:bg-background-warm-off-white">
                <Smile className="h-4 w-4" />
              </button>
              <button className="rounded-lg bg-primary-dusty-blue p-2 text-background-warm-off-white transition hover:bg-primary-soft-sky">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
