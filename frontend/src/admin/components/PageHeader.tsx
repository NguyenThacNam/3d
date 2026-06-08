export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-primary-700">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
