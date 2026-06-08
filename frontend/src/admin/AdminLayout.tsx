import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar, { type NavItem } from './components/Sidebar';
import {
  BellIcon,
  BuildingIcon,
  GraduationIcon,
  GridIcon,
  LayersIcon,
  LinkIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
  UsersIcon,
  XIcon,
} from '../components/Icon';
import { useAuth } from '../auth/AuthContext';

type Scope = 'system' | 'school';

const NAV: Record<Scope, { label: string; items: NavItem[] }> = {
  system: {
    label: 'Quản trị hệ thống',
    items: [
      { to: '/admin/system', label: 'Tổng quan', icon: GridIcon, end: true },
      { to: '/admin/system/schools', label: 'Trường học', icon: BuildingIcon },
      { to: '/admin/system/courses', label: 'Khóa học', icon: LayersIcon },
      { to: '/admin/system/assign', label: 'Gán khóa học cho trường', icon: LinkIcon },
      { to: '/admin/system/profile', label: 'Hồ sơ', icon: UserIcon },
    ],
  },
  school: {
    label: 'Quản trị trường',
    items: [
      { to: '/admin/school', label: 'Tổng quan', icon: GridIcon, end: true },
      { to: '/admin/school/classes', label: 'Lớp học', icon: GraduationIcon },
      { to: '/admin/school/teachers', label: 'Giáo viên', icon: UsersIcon },
      { to: '/admin/school/students', label: 'Học sinh', icon: UserIcon },
      { to: '/admin/school/assign', label: 'Gán khóa học cho lớp', icon: LinkIcon },
      { to: '/admin/school/profile', label: 'Hồ sơ', icon: UserIcon },
    ],
  },
};

export default function AdminLayout({ scope }: { scope: Scope }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, label } = NAV[scope];
  const { pathname } = useLocation();
  const current =
    items.find((i) => (i.end ? pathname === i.to : pathname.startsWith(i.to) && i.to !== `/admin/${scope}`)) ?? items[0];

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar scopeLabel={label} items={items} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 animate-fade-up">
            <Sidebar scopeLabel={label} items={items} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-primary-100 bg-primary-50/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Mở menu"
                className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-primary-100 bg-white text-primary-700 transition-colors hover:bg-primary-50 cursor-pointer lg:hidden"
              >
                {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
              <p className="truncate font-display text-base font-bold text-primary-900">{current.label}</p>
            </div>

            <div className="flex flex-none items-center gap-2.5">
              <button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-primary-100 bg-white text-primary-600 transition-colors hover:bg-primary-50 cursor-pointer">
                <BellIcon className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent-500" />
              </button>
              <Link to={`/admin/${scope}/profile`} className="flex items-center gap-2.5 rounded-xl border border-primary-100 bg-white py-1.5 pl-1.5 pr-3 transition-colors hover:bg-primary-50 cursor-pointer">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-600 text-xs font-bold text-white">
                  {user?.initials ?? '··'}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-bold leading-tight text-primary-900">{user?.name}</span>
                  <span className="block text-xs leading-tight text-primary-500">{user?.role}</span>
                </span>
              </Link>
              <button onClick={onLogout} aria-label="Đăng xuất" title="Đăng xuất" className="grid h-10 w-10 place-items-center rounded-xl border border-primary-100 bg-white text-red-500 transition-colors hover:bg-red-50 cursor-pointer">
                <LogOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
