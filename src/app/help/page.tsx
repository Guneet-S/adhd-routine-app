'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AuthGuard from '@/components/auth/AuthGuard';
import BottomNav from '@/components/layout/BottomNav';
import ChevronLeft from '@/components/icons/ChevronLeft';

const FAQS = [
  {
    q: 'How do I add a task for my child?',
    a: 'Tap the + button at the bottom of any screen. You can set the task name, emoji, category (Morning, Afternoon, Evening), and optionally a reminder time.',
  },
  {
    q: 'What is a streak?',
    a: 'A streak counts how many days in a row your child has completed at least one task. Keeping the streak alive motivates consistency!',
  },
  {
    q: 'How do stars work?',
    a: 'Each task your child completes earns 1 star. Stars accumulate over time and unlock badges on the Rewards page.',
  },
  {
    q: 'Can I change the language?',
    a: 'Yes! Go to More → Language to switch between English and Punjabi. The whole app updates instantly.',
  },
  {
    q: 'How do I edit or delete a task?',
    a: 'Go to More → Routine Builder. Each task has an edit (✏️) and delete (🗑️) button.',
  },
  {
    q: 'What is Auto Generate Routine?',
    a: 'On the Routine Builder page, tap "Auto Generate" to instantly create age-appropriate tasks for Morning, Afternoon, and Evening based on your child\'s age.',
  },
  {
    q: 'What is Focus Mode?',
    a: 'Focus Mode shows one task at a time in a large, clear display — perfect for children who feel overwhelmed by long lists.',
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          <h1 className="text-lg font-extrabold text-slate-700">Help</h1>
        </header>

        <div className="px-4 pt-4 pb-28 space-y-4">
          {/* How to set up routines */}
          <div className="bg-primary/10 rounded-2xl p-4">
            <p className="text-sm font-extrabold text-primary mb-2">How to set up routines</p>
            <ol className="space-y-1.5 text-xs text-slate-600">
              <li className="flex gap-2"><span className="font-bold text-primary">1.</span> Sign up and enter your child&apos;s name and age.</li>
              <li className="flex gap-2"><span className="font-bold text-primary">2.</span> Default tasks are created automatically based on age.</li>
              <li className="flex gap-2"><span className="font-bold text-primary">3.</span> Customise tasks via More → Routine Builder.</li>
              <li className="flex gap-2"><span className="font-bold text-primary">4.</span> Each morning, your child opens the app and taps tasks as they complete them.</li>
              <li className="flex gap-2"><span className="font-bold text-primary">5.</span> Watch the streak and stars grow!</li>
            </ol>
          </div>

          {/* ADHD Tips */}
          <div className="bg-violet-50 rounded-2xl p-4">
            <p className="text-sm font-extrabold text-slate-700 mb-3">ADHD Tips for Families</p>
            <div className="space-y-2">
              {[
                { icon: '🐢', text: 'Small steps count — celebrate every task completed.' },
                { icon: '🎯', text: 'One task at a time. Cover what\'s next to reduce overwhelm.' },
                { icon: '🌟', text: 'Celebrate small wins loudly. Positive reinforcement matters.' },
                { icon: '🔔', text: 'Use reminders to start routines at the same time each day.' },
                { icon: '🫁', text: 'If your child is overwhelmed, pause and take 3 deep breaths together.' },
              ].map((tip) => (
                <div key={tip.text} className="flex items-start gap-3 bg-white rounded-xl p-3">
                  <span className="text-xl shrink-0">{tip.icon}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <p className="text-sm font-extrabold text-slate-700 mb-2">Frequently Asked Questions</p>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left min-h-[52px]"
                  >
                    <span className="text-sm font-semibold text-slate-700 pr-4">{faq.q}</span>
                    <span className="text-slate-400 shrink-0 text-lg">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-700 mb-1">Still need help?</p>
            <p className="text-xs text-slate-500 mb-3">Our support team is happy to help.</p>
            <a
              href="mailto:support@adhdroutineapp.com"
              className="inline-block bg-primary text-white font-bold text-sm rounded-full px-6 py-2.5"
            >
              Contact Support
            </a>
          </div>
        </div>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}
