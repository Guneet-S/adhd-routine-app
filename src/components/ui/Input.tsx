'use client';

import { ReactNode, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  label?: string;
}

export default function Input({ leftIcon, rightIcon, label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-600 mb-1">{label}</label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-4 text-slate-400 text-lg">{leftIcon}</span>
        )}
        <input
          {...props}
          className={`w-full min-h-[52px] rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 font-medium text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${leftIcon ? 'pl-11' : 'pl-4'} ${rightIcon ? 'pr-11' : 'pr-4'} py-3 ${className}`}
        />
        {rightIcon && (
          <span className="absolute right-4 text-slate-400 text-lg cursor-pointer">{rightIcon}</span>
        )}
      </div>
    </div>
  );
}
