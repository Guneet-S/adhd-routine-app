'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
}

export default function Checkbox({ checked, onChange, size = 32 }: CheckboxProps) {
  return (
    // 44px tap target wrapper — visual indicator stays at `size`
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.85 }}
      className="w-11 h-11 flex items-center justify-center shrink-0"
      aria-checked={checked}
      role="checkbox"
    >
      <div
        style={{ width: size, height: size }}
        className={`rounded-lg border-2 flex items-center justify-center transition-colors ${
          checked ? 'bg-primary border-primary' : 'bg-white border-slate-300'
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              width={size * 0.55}
              height={size * 0.55}
              viewBox="0 0 20 20"
              fill="none"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
                d="M4 10l4.5 4.5L16 6"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
