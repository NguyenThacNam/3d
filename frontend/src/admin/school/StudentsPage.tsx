import ResourcePage from '../components/ResourcePage';
import Badge from '../components/Badge';
import { AsyncSection } from '../../components/AsyncSection';
import { useAsync } from '../../hooks/useAsync';
import { classApi, studentApi } from '../../api/endpoints';
import type { Student } from '../../api/types';
import { KeyIcon } from '../../components/Icon';

async function resetStudentPassword(s: Student) {
  if (!window.confirm(`Đặt lại mật khẩu cho học sinh "${s.name}" về mặc định?`)) return;
  try {
    const res = await studentApi.resetPassword(s.id);
    window.alert(`Đã đặt lại mật khẩu cho ${s.name}.\nMật khẩu mới: ${res.password}\nHãy nhắc học sinh đăng nhập và đổi lại.`);
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'Đặt lại mật khẩu thất bại');
  }
}

export default function StudentsPage() {
  // Cần danh sách lớp để chọn khi tạo/sửa học sinh
  const classes = useAsync(() => classApi.listAll(), []);

  return (
    <AsyncSection state={classes} loadingLabel="Đang tải dữ liệu…">
      {(classList) => {
        const classOptions = [
          { value: '', label: '— Chưa xếp lớp —' },
          ...classList.map((c) => ({ value: String(c.id), label: c.name })),
        ];
        const toId = (v: string) => (v ? Number(v) : null);

        return (
          <ResourcePage<Student>
            title="Quản lý học sinh"
            subtitle="Danh sách học sinh. Có thể nhập hàng loạt từ Excel (tạo kèm tài khoản, mật khẩu mặc định 123456)."
            addLabel="Thêm học sinh"
            modalTitle="học sinh"
            load={(p) => studentApi.list(p)}
            onCreate={(v) => studentApi.create({ name: v.name, email: v.email || undefined, username: v.username || undefined, class_id: toId(v.className), status: v.status })}
            onUpdate={(row, v) => studentApi.update(row.id, { name: v.name, email: v.email || undefined, username: v.username || undefined, class_id: toId(v.className), status: v.status })}
            onDelete={(row) => studentApi.remove(row.id)}
            toForm={(r) => ({ name: r.name, email: r.email, username: r.username, className: r.class_id ? String(r.class_id) : '', status: r.status })}
            onImport={(file) => studentApi.import(file)}
            onDownloadTemplate={() => studentApi.template()}
            extraActions={(s) => (
              <button
                type="button"
                onClick={() => resetStudentPassword(s)}
                aria-label="Đặt lại mật khẩu"
                title="Đặt lại mật khẩu"
                className="grid h-8 w-8 place-items-center rounded-lg text-amber-500 transition-colors hover:bg-amber-50 hover:text-amber-600 cursor-pointer"
              >
                <KeyIcon className="h-4 w-4" />
              </button>
            )}
            columns={[
              { key: 'name', header: 'Họ tên', render: (r) => <span className="font-bold text-primary-900">{r.name}</span> },
              { key: 'username', header: 'Tên đăng nhập', render: (r) => <span className="font-mono text-xs text-primary-700">{r.username}</span> },
              { key: 'email', header: 'Email', className: 'hidden md:table-cell', render: (r) => r.email || '—' },
              { key: 'className', header: 'Lớp', render: (r) => (r.className ? <Badge tone="indigo">{r.className}</Badge> : '—') },
              { key: 'status', header: 'Trạng thái', render: (r) => (r.status === 'active' ? <Badge tone="green">Đang học</Badge> : <Badge tone="gray">Tạm nghỉ</Badge>) },
            ]}
            fields={[
              { name: 'name', label: 'Họ tên', placeholder: 'VD: Đỗ Minh Khôi', required: true },
              { name: 'username', label: 'Tên đăng nhập', placeholder: 'Để trống sẽ tự tạo từ họ tên' },
              { name: 'email', label: 'Email (không bắt buộc)', type: 'email', placeholder: 'hs@truong.edu.vn — có thể bỏ trống' },
              { name: 'className', label: 'Lớp', type: 'select', options: classOptions },
              { name: 'status', label: 'Trạng thái', type: 'select', options: [
                { value: 'active', label: 'Đang học' }, { value: 'inactive', label: 'Tạm nghỉ' },
              ] },
            ]}
          />
        );
      }}
    </AsyncSection>
  );
}
