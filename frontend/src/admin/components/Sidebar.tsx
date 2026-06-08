import { Link, NavLink } from 'react-router-dom';
import type { ComponentType, SVGProps } from 'react';
import { CubeIcon, LogOutIcon } from '../../components/Icon';

export interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
}

interface SidebarProps {
  scopeLabel: string;
  items: NavItem[];
  onNavigate?: () => void;
}

export default function Sidebar({ scopeLabel, items, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-primary-900 text-primary-100">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white">
          <CubeIcon className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-base font-bold text-white">BKAP 3D Learning</p>
          <p className="text-xs font-semibold text-primary-300">{scopeLabel}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-primary-900 shadow-soft'
                    : 'text-primary-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 flex-none" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-white/10 px-3 py-3">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-primary-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <LogOutIcon className="h-5 w-5" /> Về trang học tập
        </Link>
      </div>
    </div>
  );
}
