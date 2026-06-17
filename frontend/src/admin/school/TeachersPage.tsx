import ResourcePage from '../components/ResourcePage';
import Badge from '../components/Badge';
import { teacherApi } from '../../api/endpoints';
import type { Teacher } from '../../api/types';

export default function TeachersPage() {
  return (
    <ResourcePage<Teacher>
      title="Quản lý giáo viên"
      subtitle="Danh sách giáo viên thuộc trường. Tạo mới sẽ kèm tài khoản đăng nhập (mật khẩu mặc định 123456)."
      addLabel="Thêm giáo viên"
      modalTitle="giáo viên"
      load={(p) => teacherApi.list(p)}
      onCreate={(v) => teacherApi.create({ name: v.name, email: v.email || undefined, username: v.username || undefined, subject: v.subject })}
      onUpdate={(row, v) => teacherApi.update(row.id, { name: v.name, email: v.email || undefined, username: v.username || undefined, subject: v.subject })}
      onDelete={(row) => teacherApi.remove(row.id)}
      toForm={(r) => ({ name: r.name, email: r.email, username: r.username, subject: r.subject })}
      columns={[
        { key: 'name', header: 'Họ tên', render: (r) => <span className="font-bold text-primary-900">{r.name}</span> },
        { key: 'username', header: 'Tên đăng nhập', render: (r) => <span className="font-mono text-xs text-primary-700">{r.username}</span> },
        { key: 'email', header: 'Email', className: 'hidden md:table-cell', render: (r) => r.email || '—' },
        { key: 'subject', header: 'Môn dạy', render: (r) => <Badge tone="indigo">{r.subject}</Badge> },
        { key: 'classes', header: 'Số lớp', render: (r) => <Badge tone="gray">{r.classes} lớp</Badge> },
      ]}
      fields={[
        { name: 'name', label: 'Họ tên', placeholder: 'VD: Nguyễn Văn An', required: true },
        { name: 'username', label: 'Tên đăng nhập', placeholder: 'Để trống sẽ tự tạo từ họ tên' },
        { name: 'email', label: 'Email (không bắt buộc)', type: 'email', placeholder: 'gv@truong.edu.vn — có thể bỏ trống' },
        { name: 'subject', label: 'Môn dạy', placeholder: 'VD: Vật lý' },
      ]}
    />
  );
}
