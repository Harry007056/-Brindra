import { useState } from 'react';

export default function Chat() {
  const [conversations] = useState([
    { id: 1, name: 'Project Alpha' },
    { id: 2, name: 'Team A' },
  ]);
  const [messages] = useState([
    { fromMe: true, text: 'Hello from me' },
    { fromMe: false, text: 'Reply from someone' },
  ]);
  const [typing, setTyping] = useState(false);

  return (
    <div className="flex h-screen">
      <aside className="w-1/3 bg-[#F8F9F6] backdrop-blur p-4 border-r border-[#E0DDD4]/50">
        <h2 className="font-semibold mb-2 text-[#4C566A]">Conversations</h2>
        <ul className="space-y-2">
          {conversations.map((c) => (
            <li key={c.id} className="p-2 rounded hover:bg-[#E0DDD4]/30 cursor-pointer text-[#8B8E7E] hover:text-[#4C566A]">
              {c.name}
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 flex flex-col bg-[#F8F9F6] p-4">
        <div className="flex-1 overflow-y-auto mb-2 scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={m.fromMe ? 'text-right' : 'text-left'}>
              <div
                className={
                  (m.fromMe ? 'bg-[#5E81AC] text-white' : 'bg-[#E0DDD4]/30 text-[#4C566A]') +
                  ' inline-block rounded-lg p-2 mb-1'
                }
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && <p className="text-sm text-[#8B8E7E]">Someone is typing...</p>}
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-[#8B8E7E] hover:text-[#5E81AC]">📎</button>
          <button className="text-[#8B8E7E] hover:text-[#5E81AC]">😊</button>
          <input
            className="flex-1 border border-[#E0DDD4]/50 rounded-lg p-2 bg-white text-[#4C566A] placeholder-[#8B8E7E] focus:border-[#5E81AC]"
            placeholder="Type a message"
            onFocus={() => setTyping(true)}
            onBlur={() => setTyping(false)}
          />
          <button className="bg-[#5E81AC] text-white p-2 rounded-lg hover:bg-[#88C0D0]">Send</button>
        </div>
      </main>
    </div>
  );
}