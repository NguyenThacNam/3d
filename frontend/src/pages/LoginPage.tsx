import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { CubeIcon } from '../components/Icon';
import type { RoleCode } from '../api/types';

// Sau đăng nhập, điều hướng theo vai trò
const HOME_BY_ROLE: Record<RoleCode, string> = {
  admin: '/admin/system',
  school: '/admin/school',
  teacher: '/',
  student: '/',
};

const DEMO = [
  { label: 'Hệ thống', email: 'admin@3dlearning.vn', password: 'admin123' },
  { label: 'Trường', email: 'admin@cva.edu.vn', password: '123456' },
  { label: 'Giáo viên', email: 'an.nv@cva.edu.vn', password: '123456' },
  { label: 'Học sinh', email: 'khoi.dm@hs.cva.edu.vn', password: '123456' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user = await login(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? HOME_BY_ROLE[user.roleCode], { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setBusy(false);
    }
  };

  const field =
    'w-full rounded-xl border border-primary-200 bg-white px-3.5 py-2.5 text-sm text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200';

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft">
            <CubeIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-primary-900">Đăng nhập BKAP 3D Learning</h1>
          <p className="mt-1 text-sm text-primary-600">Học khoa học bằng thí nghiệm 3D tương tác.</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-primary-100 bg-white p-6 shadow-soft">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-primary-800">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className={field} placeholder="email@truong.edu.vn" autoComplete="username" />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-primary-800">Mật khẩu</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className={field} placeholder="••••••" autoComplete="current-password" />
            </div>
          </div>
          <button type="submit" disabled={busy}
            className="mt-6 w-full rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-accent-600 disabled:opacity-60 cursor-pointer">
            {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>
        </form>

        {/* Tài khoản demo */}
        <div className="mt-5 rounded-2xl border border-primary-100 bg-white/70 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-400">Tài khoản demo (bấm để điền)</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO.map((d) => (
              <button key={d.email} type="button"
                onClick={() => { setEmail(d.email); setPassword(d.password); }}
                className="rounded-lg border border-primary-100 px-3 py-2 text-left text-xs transition-colors hover:bg-primary-50 cursor-pointer">
                <span className="block font-bold text-primary-800">{d.label}</span>
                <span className="block truncate text-primary-500">{d.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
