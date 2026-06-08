import ResourcePage from '../components/ResourcePage';
import Badge from '../components/Badge';
import { schoolApi } from '../../api/endpoints';
import type { School } from '../../api/types';

export default function SchoolsPage() {
  return (
    <ResourcePage<School>
      title="Quản lý trường học"
      subtitle="Thêm, sửa, xóa các trường tham gia nền tảng."
      addLabel="Thêm trường"
      modalTitle="trường học"
      load={(p) => schoolApi.list(p)}
      onCreate={(v) => schoolApi.create({ name: v.name, address: v.address, email: v.email })}
      onUpdate={(row, v) => schoolApi.update(row.id, { name: v.name, address: v.address, email: v.email })}
      onDelete={(row) => schoolApi.remove(row.id)}
      toForm={(r) => ({ name: r.name, address: r.address, email: r.email })}
      columns={[
        { key: 'name', header: 'Tên trường', render: (r) => <span className="font-bold text-primary-900">{r.name}</span> },
        { key: 'address', header: 'Địa chỉ', className: 'hidden md:table-cell' },
        { key: 'email', header: 'Email', className: 'hidden lg:table-cell' },
        { key: 'classes', header: 'Lớp', render: (r) => <Badge tone="indigo">{r.classes}</Badge> },
        { key: 'students', header: 'Học sinh', render: (r) => <Badge tone="green">{r.students}</Badge> },
      ]}
      fields={[
        { name: 'name', label: 'Tên trường', placeholder: 'VD: THPT Chu Văn An', required: true },
        { name: 'address', label: 'Địa chỉ', placeholder: 'Số nhà, đường, quận/huyện' },
        { name: 'email', label: 'Email liên hệ', type: 'email', placeholder: 'lienhe@truong.edu.vn' },
      ]}
    />
  );
}
