import type { ComponentType, SVGProps } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  hint?: string;
  tone?: 'indigo' | 'green' | 'sky' | 'amber';
}

const tones = {
  indigo: 'from-primary-500 to-primary-700',
  green: 'from-emerald-500 to-teal-600',
  sky: 'from-sky-500 to-indigo-600',
  amber: 'from-amber-400 to-orange-500',
};

export default function StatCard({ label, value, icon: Icon, hint, tone = 'indigo' }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-soft">
      <span className={`grid h-12 w-12 flex-none place-items-center rounded-xl bg-gradient-to-br ${tones[tone]} text-white shadow-soft`}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-bold leading-tight text-primary-900">{value}</p>
        <p className="truncate text-sm font-semibold text-primary-700">{label}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-primary-500">{hint}</p>}
      </div>
    </div>
  );
}
