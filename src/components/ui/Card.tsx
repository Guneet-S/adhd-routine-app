import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${padding ? 'p-4' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
