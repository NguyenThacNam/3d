import { Link } from 'react-router-dom';
import ResourcePage from '../components/ResourcePage';
import Badge from '../components/Badge';
import { courseApi } from '../../api/endpoints';
import type { CourseAdmin } from '../../api/types';
import { ArrowRightIcon } from '../../components/Icon';

// Cấp lớp: gồm cấp học tổng quát + các khối cụ thể
const LEVEL_OPTIONS = [
  { value: 'Mầm non', label: 'Mầm non' },
  { value: 'Tiểu học', label: 'Tiểu học (chung)' },
  { value: 'Lớp 1', label: 'Lớp 1' },
  { value: 'Lớp 2', label: 'Lớp 2' },
  { value: 'Lớp 3', label: 'Lớp 3' },
  { value: 'Lớp 4', label: 'Lớp 4' },
  { value: 'Lớp 5', label: 'Lớp 5' },
  { value: 'THCS', label: 'THCS (chung)' },
  { value: 'Lớp 6', label: 'Lớp 6' },
  { value: 'Lớp 7', label: 'Lớp 7' },
  { value: 'Lớp 8', label: 'Lớp 8' },
  { value: 'Lớp 9', label: 'Lớp 9' },
  { value: 'THPT', label: 'THPT (chung)' },
  { value: 'Lớp 10', label: 'Lớp 10' },
  { value: 'Lớp 11', label: 'Lớp 11' },
  { value: 'Lớp 12', label: 'Lớp 12' },
];

export default function CoursesPage() {
  return (
    <ResourcePage<CourseAdmin>
      title="Quản lý khóa học"
      subtitle="Tạo và quản lý các khóa học cùng thí nghiệm 3D."
      addLabel="Thêm khóa học"
      modalTitle="khóa học"
      load={(p) => courseApi.list(p)}
      onCreate={(v) =>
        courseApi.create({ title: v.title, subject: v.subject, level: v.level, description: v.description, published: v.published === 'true' })
      }
      onUpdate={(row, v) =>
        courseApi.update(row.id, { title: v.title, subject: v.subject, level: v.level, description: v.description, published: v.published === 'true' })
      }
      onDelete={(row) => courseApi.remove(row.id)}
      toForm={(r) => ({ title: r.title, subject: r.subject, level: r.level, description: r.description, published: String(r.published) })}
      columns={[
        { key: 'title', header: 'Tên khóa học', render: (r) => <span className="font-bold text-primary-900">{r.title}</span> },
        { key: 'subject', header: 'Môn', render: (r) => <Badge tone="indigo">{r.subject}</Badge> },
        { key: 'description', header: 'Mô tả', className: 'hidden lg:table-cell', render: (r) => <span className="line-clamp-1 max-w-xs text-primary-600">{r.description || '—'}</span> },
        { key: 'level', header: 'Cấp', className: 'hidden sm:table-cell' },
        { key: 'lessons', header: 'Bài học', render: (r) => (
          <Link to={`/admin/system/courses/${r.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 font-bold text-primary-600 transition-colors hover:text-primary-800 cursor-pointer">
            {r.lessons} bài <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        ) },
        { key: 'published', header: 'Trạng thái', render: (r) => (r.published ? <Badge tone="green">Đã xuất bản</Badge> : <Badge tone="amber">Bản nháp</Badge>) },
      ]}
      fields={[
        { name: 'title', label: 'Tên khóa học', placeholder: 'VD: Vật lý & Thiên văn 3D', required: true },
        { name: 'subject', label: 'Môn học', placeholder: 'VD: Vật lý' },
        { name: 'description', label: 'Mô tả khóa học', type: 'textarea', placeholder: 'Mô tả ngắn gọn nội dung khóa học' },
        { name: 'level', label: 'Cấp lớp', type: 'select', options: LEVEL_OPTIONS },
        { name: 'published', label: 'Trạng thái', type: 'select', options: [
          { value: 'true', label: 'Đã xuất bản' }, { value: 'false', label: 'Bản nháp' },
        ] },
      ]}
    />
  );
}
