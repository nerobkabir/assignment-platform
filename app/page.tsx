import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080C14] text-white overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-teal-400/6 blur-[100px]" />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Header / Nav */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight">EduTrack</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
        </nav>

        <Link
          href="/auth"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
        >
          Get Started →
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-16">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered Learning Platform
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6">
            <span className="text-white">Smarter</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Assignments.
            </span>
            <br />
            <span className="text-slate-400">Better Outcomes.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Bridge the gap between instruction and evaluation. EduTrack empowers instructors to
            manage assignments with AI assistance while students track their growth in real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link
            href="/auth"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-2xl font-bold text-base transition-all duration-200 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1"
          >
            Start for Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-2xl font-semibold text-base transition-all duration-200"
          >
            View Demo
          </Link>
        </div>

        <div className="flex justify-center gap-12 mb-20">
          {[
            { value: '3', label: 'AI Features' },
            { value: '2', label: 'User Roles' },
            { value: '100%', label: 'Open Source' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto mb-24" id="features">
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-transparent to-transparent z-10 rounded-3xl" />
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <div className="flex-1 mx-4 h-5 rounded bg-white/5 flex items-center justify-center">
                <span className="text-xs text-slate-500">edutrack.vercel.app/dashboard/instructor</span>
              </div>
            </div>
            <div className="p-6 grid grid-cols-4 gap-4">
              {[
                { label: 'Assignments', val: '12', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
                { label: 'Submissions', val: '47', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20' },
                { label: 'Accepted', val: '31', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20' },
                { label: 'Pending', val: '9', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/20' },
              ].map((c) => (
                <div key={c.label} className={`rounded-2xl p-4 bg-gradient-to-br border ${c.color}`}>
                  <div className="text-2xl font-black text-white">{c.val}</div>
                  <div className="text-xs text-slate-400 mt-1">{c.label}</div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500/40 border-l-emerald-400 border-t-emerald-400 mx-auto flex items-center justify-center">
                    <span className="text-xs text-emerald-400 font-bold">66%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Acceptance Rate</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 h-32 flex items-end gap-2 pb-6">
                {[40, 70, 50, 90, 60, 80].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-teal-500/60 to-teal-400/30" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
                </svg>
              ),
              title: 'Assignment Management',
              desc: 'Create structured assignments with title, description, deadlines, and difficulty levels. Full CRUD control for instructors.',
              accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="18" cy="6" r="4" fill="currentColor" opacity="0.3"/><path d="M16 6h4M18 4v4"/>
                </svg>
              ),
              title: 'AI Smart Assistance',
              desc: 'Auto-generate feedback, enhance assignment descriptions, and get AI-powered note improvement suggestions.',
              accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              ),
              title: 'Learning Analytics',
              desc: 'Visualize submission distributions, track acceptance rates, and identify performance trends with Recharts.',
              accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15"
            >
              <div className={`inline-flex p-3 rounded-xl border mb-4 ${f.accent}`}>
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Demo credentials */}
        <div id="demo" className="max-w-xl mx-auto">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <span className="text-emerald-400 font-semibold text-sm">Demo Credentials</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-white/5 border border-white/8">
                <span className="text-xs text-slate-400 font-medium">👨‍🏫 Instructor</span>
                <span className="font-mono text-xs text-slate-200">instructor@demo.com / password123</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-white/5 border border-white/8">
                <span className="text-xs text-slate-400 font-medium">👨‍🎓 Student</span>
                <span className="font-mono text-xs text-slate-200">student@demo.com / password123</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        © 2026 EduTrack — Assignment & Learning Analytics Platform
      </footer>
    </div>
  );
}