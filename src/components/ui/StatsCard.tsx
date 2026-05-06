import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  action?: ReactNode;
}

export default function StatsCard({ icon, value, label, action }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex flex-col items-center justify-center gap-1 min-w-0">
      <div className="text-2xl">{icon}</div>
      {value && <span className="text-base font-bold text-slate-700">{value}</span>}
      <span className="text-xs font-medium text-slate-500 text-center leading-tight">{label}</span>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
