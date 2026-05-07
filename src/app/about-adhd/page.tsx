'use client';

import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import BottomNav from '@/components/layout/BottomNav';
import ChevronLeft from '@/components/icons/ChevronLeft';

const SECTIONS = [
  {
    emoji: '🧠',
    title: 'What is ADHD?',
    content:
      'ADHD (Attention Deficit Hyperactivity Disorder) is a brain difference — not a behaviour problem. Children with ADHD may find it harder to focus, follow multi-step instructions, or shift between tasks. Their brains are wired to seek stimulation and novelty, which means routine and structure are especially helpful.',
  },
  {
    emoji: '📋',
    title: 'Why routines help ADHD children',
    content:
      "Predictable routines reduce the mental energy needed to decide what comes next. When a child knows exactly what to expect, they spend less energy on anxiety and more on doing. Routines create a safe, calm framework where ADHD children can thrive.",
  },
  {
    emoji: '🐢',
    title: 'The small step strategy',
    content:
      'Break every task into the smallest possible step. Instead of "Get ready for school", try "Brush teeth", then "Put on shoes". Small wins build momentum. Each completed task releases dopamine — the feel-good chemical that ADHD brains need more of.',
  },
  {
    emoji: '🫁',
    title: 'Emotional regulation',
    content:
      'ADHD brains can feel emotions more intensely. When your child is overwhelmed, try the 3-step calm: (1) Pause — stop what you\'re doing. (2) Breathe — 3 slow deep breaths together. (3) Name it — "I feel frustrated." Naming emotions helps the brain settle.',
  },
  {
    emoji: '⭐',
    title: 'Celebrate every win',
    content:
      'Positive reinforcement is the most powerful tool for ADHD children. Celebrate every task — even small ones. Stars, streaks, and badges in this app are designed to make your child feel capable and proud. Never compare their progress to others.',
  },
  {
    emoji: '💙',
    title: 'A note for parents',
    content:
      'Parenting a child with ADHD takes patience and creativity. You are doing an incredible job. This app is here to make your daily routine a little calmer and more manageable — for both you and your child.',
  },
];

export default function AboutAdhdPage() {
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-10 bg-white flex items-center gap-3 px-4 py-3 border-b border-slate-100 shadow-sm">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-lg font-extrabold text-slate-700">About ADHD</h1>
        </header>

        <div className="px-4 pt-4 pb-28 space-y-3">
          {/* Hero */}
          <div className="bg-gradient-to-br from-violet-100 to-blue-50 rounded-2xl p-5 text-center">
            <div className="text-5xl mb-3">🧒✨</div>
            <p className="text-base font-extrabold text-slate-700">Every brain is unique.</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              ADHD children are creative, energetic, and deeply empathetic. They just need the right environment to shine.
            </p>
          </div>

          {/* Sections */}
          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{section.emoji}</span>
                <p className="text-sm font-extrabold text-slate-700">{section.title}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}
