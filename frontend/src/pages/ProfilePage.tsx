import { useState } from 'react';
import PageHeader from '../admin/components/PageHeader';
import Badge from '../admin/components/Badge';
import { BuildingIcon, CheckIcon, MailIcon, UserIcon } from '../components/Icon';
import { useAuth } from '../auth/AuthContext';
import { profileApi } from '../api/endpoints';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [pw, setPw] = useState({ current_password: '', new_password: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  if (!user) return null;

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [k]: e.target.value }));
    setSaved(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const updated = await profileApi.update(form);
      setUser(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setBusy(false);
    }
  };

  const onPwChange = (k: keyof typeof pw) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw((s) => ({ ...s, [k]: e.target.value }));
    setPwSaved(false);
    setPwError(null);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    if (pw.new_password.length < 6) {
      setPwError('Mật khẩu mới tối thiểu 6 ký tự.');
      return;
    }
    if (pw.new_password !== pw.confirm) {
      setPwError('Mật khẩu nhập lại không khớp.');
      return;
    }
    setPwBusy(true);
    try {
      await profileApi.changePassword({
        current_password: pw.current_password,
        new_password: pw.new_password,
      });
      setPw({ current_password: '', new_password: '', confirm: '' });
      setPwSaved(true);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại');
    } finally {
      setPwBusy(false);
    }
  };

  const field =
    'w-full rounded-xl border border-primary-200 bg-white px-3.5 py-2.5 text-sm text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <PageHeader title="Hồ sơ cá nhân" subtitle="Quản lý thông tin tài khoản của bạn." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
        <div className="rounded-2xl border border-primary-100 bg-white p-6 text-center shadow-soft">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 font-display text-2xl font-bold text-white shadow-soft">
            {user.initials}
          </span>
          <h2 className="mt-4 font-display text-lg font-bold text-primary-900">{form.name}</h2>
          <div className="mt-2 flex justify-center">
            <Badge tone="indigo">{user.role}</Badge>
          </div>
          <dl className="mt-5 space-y-3 text-left">
            <div className="flex items-center gap-2.5 text-sm text-primary-700">
              <BuildingIcon className="h-4 w-4 flex-none text-primary-400" />
              <span className="truncate">{user.org}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-primary-700">
              <MailIcon className="h-4 w-4 flex-none text-primary-400" />
              <span className="truncate">{form.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-primary-700">
              <UserIcon className="h-4 w-4 flex-none text-primary-400" />
              <span>Tham gia từ {user.joined}</span>
            </div>
          </dl>
        </div>

        <form onSubmit={save} className="rounded-2xl border border-primary-100 bg-white p-6 shadow-soft">
          <h3 className="font-display text-base font-bold text-primary-900">Thông tin tài khoản</h3>
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="p-name" className="mb-1.5 block text-sm font-bold text-primary-800">Họ và tên</label>
              <input id="p-name" className={field} value={form.name} onChange={onChange('name')} required />
            </div>
            <div>
              <label htmlFor="p-email" className="mb-1.5 block text-sm font-bold text-primary-800">Email</label>
              <input id="p-email" type="email" className={field} value={form.email} onChange={onChange('email')} required />
            </div>
            <div>
              <label htmlFor="p-phone" className="mb-1.5 block text-sm font-bold text-primary-800">Số điện thoại</label>
              <input id="p-phone" className={field} value={form.phone} onChange={onChange('phone')} />
            </div>
            <div>
              <label htmlFor="p-username" className="mb-1.5 block text-sm font-bold text-primary-800">Tên đăng nhập</label>
              <input id="p-username" className={`${field} bg-primary-50 text-primary-500`} value={user.username || '—'} disabled />
            </div>
            <div>
              <label htmlFor="p-role" className="mb-1.5 block text-sm font-bold text-primary-800">Vai trò</label>
              <input id="p-role" className={`${field} bg-primary-50 text-primary-500`} value={user.role} disabled />
            </div>
            <div>
              <label htmlFor="p-org" className="mb-1.5 block text-sm font-bold text-primary-800">Đơn vị</label>
              <input id="p-org" className={`${field} bg-primary-50 text-primary-500`} value={user.org} disabled />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button type="submit" disabled={busy}
              className="rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-accent-600 disabled:opacity-60 cursor-pointer">
              {busy ? 'Đang lưu…' : 'Lưu thay đổi'}
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                <CheckIcon className="h-4 w-4" /> Đã lưu
              </span>
            )}
          </div>
        </form>

        <form onSubmit={changePassword} className="rounded-2xl border border-primary-100 bg-white p-6 shadow-soft lg:col-span-2">
          <h3 className="font-display text-base font-bold text-primary-900">Đổi mật khẩu</h3>
          <p className="mt-1 text-sm text-primary-500">Nhập mật khẩu hiện tại và mật khẩu mới (tối thiểu 6 ký tự).</p>
          {pwError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
              {pwError}
            </div>
          )}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="p-curpw" className="mb-1.5 block text-sm font-bold text-primary-800">Mật khẩu hiện tại</label>
              <input id="p-curpw" type="password" autoComplete="current-password" className={field} value={pw.current_password} onChange={onPwChange('current_password')} required />
            </div>
            <div>
              <label htmlFor="p-newpw" className="mb-1.5 block text-sm font-bold text-primary-800">Mật khẩu mới</label>
              <input id="p-newpw" type="password" autoComplete="new-password" className={field} value={pw.new_password} onChange={onPwChange('new_password')} required />
            </div>
            <div>
              <label htmlFor="p-confpw" className="mb-1.5 block text-sm font-bold text-primary-800">Nhập lại mật khẩu mới</label>
              <input id="p-confpw" type="password" autoComplete="new-password" className={field} value={pw.confirm} onChange={onPwChange('confirm')} required />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button type="submit" disabled={pwBusy}
              className="rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-accent-600 disabled:opacity-60 cursor-pointer">
              {pwBusy ? 'Đang đổi…' : 'Đổi mật khẩu'}
            </button>
            {pwSaved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                <CheckIcon className="h-4 w-4" /> Đã đổi mật khẩu
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
