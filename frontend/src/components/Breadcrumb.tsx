import { Link } from 'react-router-dom';
import { ChevronRightIcon } from './Icon';

export interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-primary-600">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.to && !last ? (
                <Link
                  to={item.to}
                  className="font-semibold transition-colors hover:text-primary-900 cursor-pointer"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={last ? 'font-bold text-primary-900' : 'font-semibold'} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRightIcon className="h-4 w-4 text-primary-300" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
