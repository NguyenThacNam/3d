import ResourcePage from '../components/ResourcePage';
import Badge from '../components/Badge';
import { AsyncSection } from '../../components/AsyncSection';
import { useAsync } from '../../hooks/useAsync';
import { classApi, studentApi } from '../../api/endpoints';
import type { Student } from '../../api/types';

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
            onCreate={(v) => studentApi.create({ name: v.name, email: v.email, class_id: toId(v.className), status: v.status })}
            onUpdate={(row, v) => studentApi.update(row.id, { name: v.name, email: v.email, class_id: toId(v.className), status: v.status })}
            onDelete={(row) => studentApi.remove(row.id)}
            toForm={(r) => ({ name: r.name, email: r.email, className: r.class_id ? String(r.class_id) : '', status: r.status })}
            onImport={(file) => studentApi.import(file)}
            onDownloadTemplate={() => studentApi.template()}
            columns={[
              { key: 'name', header: 'Họ tên', render: (r) => <span className="font-bold text-primary-900">{r.name}</span> },
              { key: 'email', header: 'Email', className: 'hidden md:table-cell' },
              { key: 'className', header: 'Lớp', render: (r) => (r.className ? <Badge tone="indigo">{r.className}</Badge> : '—') },
              { key: 'status', header: 'Trạng thái', render: (r) => (r.status === 'active' ? <Badge tone="green">Đang học</Badge> : <Badge tone="gray">Tạm nghỉ</Badge>) },
            ]}
            fields={[
              { name: 'name', label: 'Họ tên', placeholder: 'VD: Đỗ Minh Khôi', required: true },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'hs@truong.edu.vn', required: true },
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
