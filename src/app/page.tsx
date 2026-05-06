import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col">
      <div className="max-w-sm mx-auto w-full flex flex-col min-h-screen px-6">
        {/* Header */}
        <header className="flex items-center justify-between pt-8 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-lg">
              📅
            </div>
            <span className="text-base font-bold text-primary">RoutineKids</span>
          </div>
          <Image src="/gps_logo.png" alt="GPS" width={32} height={32} className="rounded-lg opacity-70" />
        </header>

        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center text-center py-8">
          {/* Illustration placeholder */}
          <div className="w-48 h-48 rounded-3xl bg-violet-100 flex items-center justify-center text-8xl mb-8 shadow-sm">
            👩‍👦
          </div>

          <h1 className="text-3xl font-extrabold text-slate-700 leading-tight mb-3">
            Swaagat Hai! ❤️
          </h1>
          <p className="text-base font-semibold text-primary mb-2">ADHD Routine App</p>
          <p className="text-sm text-slate-500 mb-10 leading-relaxed">
            Help your child build consistent daily routines — calm, simple, and rewarding.
          </p>

          {/* CTAs */}
          <div className="w-full space-y-3">
            <Link
              href="/login"
              className="block w-full text-center bg-primary text-white font-bold text-base rounded-full py-4 shadow-lg shadow-primary/25 hover:bg-primary-dark transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block w-full text-center bg-white text-primary font-bold text-base rounded-full py-4 border-2 border-primary hover:bg-violet-50 transition"
            >
              Create Account
            </Link>
          </div>

          {/* Feature icons */}
          <div className="flex gap-4 mt-10 w-full justify-around">
            {[
              { icon: '📋', title: 'Daily Routine', desc: 'Manage easily' },
              { icon: '⭐', title: 'Build Habits', desc: 'Stay consistent' },
              { icon: '📊', title: 'Track Progress', desc: 'See growth' },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-600">{f.title}</span>
                <span className="text-[9px] text-slate-400">{f.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-8 text-center">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <Image src="/gps_logo.png" alt="GPS" width={18} height={18} className="rounded" />
            <span className="text-xs text-slate-400">Powered by GPS</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
