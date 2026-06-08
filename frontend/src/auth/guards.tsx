import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spinner } from '../components/AsyncSection';
import type { RoleCode } from '../api/types';

/** Yêu cầu đã đăng nhập; nếu chưa → chuyển tới /login. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner label="Đang kiểm tra phiên đăng nhập…" />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}

/** Yêu cầu đúng vai trò; sai → về trang phù hợp. */
export function RequireRole({ roles, children }: { roles: RoleCode[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner label="Đang kiểm tra quyền truy cập…" />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.roleCode)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
