type Tone = 'indigo' | 'green' | 'amber' | 'gray' | 'red';

const tones: Record<Tone, string> = {
  indigo: 'bg-primary-50 text-primary-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  gray: 'bg-slate-100 text-slate-600',
  red: 'bg-red-50 text-red-700',
};

export default function Badge({
  children,
  tone = 'gray',
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}
