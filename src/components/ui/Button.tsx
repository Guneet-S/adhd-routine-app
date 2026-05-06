'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'google';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold text-base min-h-[52px] px-6 transition-colors cursor-pointer select-none';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark',
    secondary: 'bg-primary-light text-primary hover:bg-violet-100',
    ghost: 'bg-transparent text-primary border-2 border-primary hover:bg-primary-light',
    google:
      'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
}
