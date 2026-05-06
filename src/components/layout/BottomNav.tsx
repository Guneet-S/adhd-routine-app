'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', icon: '🏠', label: 'Home' },
  { href: '/routine', icon: '📅', label: 'Routine' },
];

const NAV_ITEMS_RIGHT: NavItem[] = [
  { href: '/rewards', icon: '⭐', label: 'Rewards' },
  { href: '/more', icon: '•••', label: 'More' },
];

interface BottomNavProps {
  onAddTask?: () => void;
}

export default function BottomNav({ onAddTask }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] z-40">
      <div className="max-w-sm mx-auto flex items-center justify-around px-2 h-16 relative">
        {/* Left items */}
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
                active ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Center: floating + button */}
        <motion.button
          onClick={onAddTask}
          whileTap={{ scale: 0.92 }}
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-white text-3xl font-light z-50"
        >
          +
        </motion.button>

        {/* Spacer for center button */}
        <div className="w-14" />

        {/* Right items */}
        {NAV_ITEMS_RIGHT.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
                active ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
