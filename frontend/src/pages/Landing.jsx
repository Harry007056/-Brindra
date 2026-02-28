export default function Landing() {
  return (
    <div className="w-full bg-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-[#E0DDD4]/50 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#5b8def] to-[#3d7bd4] rounded-lg" />
          <span className="text-2xl font-bold text-[#4C566A]">Brindra</span>
        </div>

        <div className="flex items-center space-x-8">
          <button className="text-[#4C566A] hover:text-[#5b8def] transition">Home</button>
          <button className="text-[#4C566A] hover:text-[#5b8def] transition">Features</button>
          <button className="text-[#4C566A] hover:text-[#5b8def] transition">Pricing</button>
          <button className="text-[#4C566A] hover:text-[#5b8def] transition">About</button>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-[#4C566A] hover:text-[#5b8def] transition">Log In</button>
          <button className="px-6 py-2 bg-[#5E81AC] text-white rounded-full hover:bg-[#88C0D0] transition shadow-lg">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Image with Blur */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#F8F9F6] via-[#F1F3EE] to-white"
          style={{
            backgroundImage: 'url(data:image/svg+xml,%3Csvg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(94,129,172,0.1);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(163,190,140,0.1);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1200" height="800" fill="url(%23grad1)"/%3E%3Ccircle cx="200" cy="100" r="150" fill="%23A3BE8C" opacity="0.15"/%3E%3Ccircle cx="1000" cy="600" r="200" fill="%235E81AC" opacity="0.1"/%3E%3C/svg%3E)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-6xl md:text-7xl font-serif text-[#4C566A] mb-6 leading-tight">
            Collaborate.<br />
            <span className="text-[#5b8def]">Elevate.</span><br />
            Excel.
          </h1>

          <p className="text-[#8B8E7E] text-lg mb-8 max-w-2xl">
            Team collaboration reimagined. Seamless workspace for modern teams to create, communicate, and grow together.
          </p>

          {/* CTA Button with Glass Effect */}
          <div className="bg-white/40 backdrop-blur-lg rounded-full p-1 shadow-2xl mb-6">
            <button className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#5b8def] to-[#3d7bd4] text-white rounded-full hover:shadow-xl transition duration-300">
              <span className="text-xl">🚀</span>
              <span className="font-semibold">Start Free Trial Now</span>
              <span className="text-lg">→</span>
            </button>
          </div>

          {/* Subtext */}
          <p className="text-sm text-[#8B8E7E] space-y-1">
            <span className="block">✓ No credit card required • 14-day free trial</span>
            <span className="block">✓ Used by 10,000+ teams worldwide</span>
          </p>
        </div>

        {/* Floating Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#5b8def]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#A3BE8C]/10 rounded-full blur-3xl" />
      </section>

      {/* Features Preview Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-white to-[#F8F9F6]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-[#4C566A] text-center mb-16">Why Teams Choose Brindra</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '💬', title: 'Real-time Chat', desc: 'Instant messaging and collaboration channels' },
              { icon: '📁', title: 'Project Management', desc: 'Organize tasks with kanban boards and timelines' },
              { icon: '👥', title: 'Team Hub', desc: 'Centralized space for team members and roles' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition border border-[#E0DDD4]/50"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-[#4C566A] mb-2">{feature.title}</h3>
                <p className="text-[#8B8E7E]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-serif text-[#4C566A] mb-4">Ready to Transform Your Team?</h3>
          <button className="px-8 py-3 bg-[#5b8def] text-white rounded-full hover:bg-[#3d7bd4] transition shadow-lg">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-4 z-40">
        <button className="w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center text-2xl border border-[#E0DDD4]/50">
          💬
        </button>
        <button className="w-14 h-14 bg-[#5b8def] rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center text-white text-2xl">
          ↗️
        </button>
      </div>
    </div>
  );
}