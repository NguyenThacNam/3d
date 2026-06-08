import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingIcon, ChevronDownIcon, CubeIcon, GridIcon, LogOutIcon, UserIcon } from './Icon';
import { useAuth } from '../auth/AuthContext';

const navLink =
  'rounded-lg px-3 py-2 text-sm font-semibold text-primary-700 transition-colors duration-200 hover:bg-primary-50 hover:text-primary-900 cursor-pointer';
const menuItem =
  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 hover:text-primary-900 cursor-pointer';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed inset-x-3 top-3 z-50 md:inset-x-4 md:top-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-soft backdrop-blur-md md:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="BKAP 3D Learning trang chủ">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft">
            <CubeIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold leading-none">BKAP&nbsp;3D&nbsp;Learning</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link to="/" className={navLink}>Trang chủ</Link>
          <Link to="/profile" className={navLink}>Hồ sơ</Link>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
              className="flex items-center gap-2 rounded-full bg-primary-50 py-1 pl-1 pr-2.5 transition-colors hover:bg-primary-100 cursor-pointer"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {user?.initials ?? '··'}
              </span>
              <span className="hidden max-w-[120px] truncate text-xs font-semibold text-primary-700 sm:block">
                {user?.name ?? ''}
              </span>
              <ChevronDownIcon className={`h-4 w-4 text-primary-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div role="menu" className="absolute right-0 top-full mt-2 w-60 animate-fade-up rounded-xl border border-primary-100 bg-white p-1.5 shadow-lift">
                <Link to="/profile" onClick={() => setOpen(false)} className={menuItem} role="menuitem">
                  <UserIcon className="h-4 w-4 text-primary-400" /> Hồ sơ cá nhân
                </Link>

                {user?.roleCode === 'admin' && (
                  <Link to="/admin/system" onClick={() => setOpen(false)} className={menuItem} role="menuitem">
                    <GridIcon className="h-4 w-4 text-primary-400" /> Quản trị hệ thống
                  </Link>
                )}
                {user?.roleCode === 'school' && (
                  <Link to="/admin/school" onClick={() => setOpen(false)} className={menuItem} role="menuitem">
                    <BuildingIcon className="h-4 w-4 text-primary-400" /> Quản trị trường
                  </Link>
                )}

                <div className="my-1.5 border-t border-primary-100" />
                <button onClick={onLogout} className={`${menuItem} text-red-600 hover:bg-red-50 hover:text-red-700`} role="menuitem">
                  <LogOutIcon className="h-4 w-4" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
