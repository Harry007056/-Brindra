import { useState } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Send, Smile } from 'lucide-react';

export default function Chat() {
  const initialTarget = localStorage.getItem('chatTarget');
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Project Alpha', online: true },
    { id: 2, name: 'Team A', online: false },
  ]);
  const [activeConversation, setActiveConversation] = useState(
    initialTarget
      ? null
      : 1
  );

  // if a target is stored and not already in conversations, add it
  if (initialTarget && activeConversation === null) {
    const existing = conversations.find((c) => c.name === initialTarget);
    if (existing) {
      setActiveConversation(existing.id);
    } else {
      const newId = conversations.length + 1;
      setConversations((prev) => [...prev, { id: newId, name: initialTarget, online: true }]);
      setActiveConversation(newId);
    }
    localStorage.removeItem('chatTarget');
  }
  const [messages] = useState([
    { fromMe: true, text: 'Hello from me', time: '10:20 AM' },
    { fromMe: false, text: 'Reply from someone', time: '10:21 AM' },
    { fromMe: false, text: 'Can we review this after lunch?', time: '10:23 AM' },
    { fromMe: true, text: 'Yes, let us do 2:30 PM.', time: '10:24 AM' },
  ]);
  const [typing, setTyping] = useState(false);

  const activeChat = conversations.find((c) => c.id === activeConversation) || conversations[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-accent-warm-grey">Chat</h1>
        <p className="text-text-default">Quick conversations for projects and teams.</p>
      </motion.div>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="grid min-h-[70vh] grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]"
      >
        <aside className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-3 shadow-sm">
          <h2 className="px-2 pb-2 text-sm font-semibold uppercase tracking-wide text-text-default">Conversations</h2>
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveConversation(c.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                    activeConversation === c.id
                      ? 'bg-primary-soft-sky/25 text-[#4C566A] ring-1 ring-primary-soft-sky/40'
                      : 'text-accent-warm-grey hover:bg-background-light-sand'
                  }`}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${c.online ? 'bg-secondary-sage-green' : 'bg-slate-300'}`} />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#88C0D0]/20 p-4">
            <div>
              <h2 className="text-sm font-semibold text-accent-warm-grey">{activeChat.name}</h2>
              <p className="text-xs text-text-default">{activeChat.online ? 'Online' : 'Offline'}</p>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto bg-background-warm-off-white/60 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    m.fromMe
                      ? 'rounded-tr-sm bg-primary-dusty-blue text-background-warm-off-white'
                      : 'rounded-tl-sm bg-background-warm-off-white text-accent-warm-grey'
                  }`}
                >
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[11px] ${m.fromMe ? 'text-background-warm-off-white/80' : 'text-text-default'}`}>{m.time}</p>
                </div>
              </div>
            ))}
            {typing && <p className="text-xs text-text-default">Someone is typing...</p>}
          </div>

          <div className="border-t border-[#88C0D0]/20 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white p-2">
              <button className="rounded-lg p-2 text-primary-dusty-blue transition hover:bg-background-warm-off-white">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-primary-dusty-blue transition hover:bg-background-warm-off-white">
                <Smile className="h-4 w-4" />
              </button>
              <input
                className="flex-1 bg-transparent px-1 text-sm text-accent-warm-grey outline-none placeholder:text-text-default"
                placeholder="Type a message"
                onFocus={() => setTyping(true)}
                onBlur={() => setTyping(false)}
              />
              <button className="inline-flex items-center gap-1 rounded-lg bg-primary-dusty-blue px-3 py-2 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky">
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}
