import ResourcePage from '../components/ResourcePage';
import Badge from '../components/Badge';
import { AsyncSection } from '../../components/AsyncSection';
import { useAsync } from '../../hooks/useAsync';
import { classApi, teacherApi } from '../../api/endpoints';
import type { ClassRow } from '../../api/types';

export default function ClassesPage() {
  // Cần danh sách giáo viên để chọn chủ nhiệm
  const teachers = useAsync(() => teacherApi.listAll(), []);

  return (
    <AsyncSection state={teachers} loadingLabel="Đang tải dữ liệu…">
      {(teacherList) => {
        const teacherOptions = [
          { value: '', label: '— Chưa phân công —' },
          ...teacherList.map((t) => ({ value: String(t.id), label: t.name })),
        ];
        const toId = (v: string) => (v ? Number(v) : null);

        return (
          <ResourcePage<ClassRow>
            title="Quản lý lớp học"
            subtitle="Tạo lớp và phân công giáo viên chủ nhiệm."
            addLabel="Thêm lớp"
            modalTitle="lớp học"
            load={(p) => classApi.list(p)}
            onCreate={(v) => classApi.create({ name: v.name, grade: v.grade, teacher_profile_id: toId(v.teacher) })}
            onUpdate={(row, v) => classApi.update(row.id, { name: v.name, grade: v.grade, teacher_profile_id: toId(v.teacher) })}
            onDelete={(row) => classApi.remove(row.id)}
            toForm={(r) => ({ name: r.name, grade: r.grade, teacher: r.teacher_profile_id ? String(r.teacher_profile_id) : '' })}
            columns={[
              { key: 'name', header: 'Tên lớp', render: (r) => <span className="font-bold text-primary-900">{r.name}</span> },
              { key: 'grade', header: 'Khối', render: (r) => <Badge tone="indigo">Khối {r.grade}</Badge> },
              { key: 'teacher', header: 'GV chủ nhiệm', className: 'hidden sm:table-cell', render: (r) => r.teacher || '—' },
              { key: 'students', header: 'Sĩ số', render: (r) => <Badge tone="green">{r.students}</Badge> },
            ]}
            fields={[
              { name: 'name', label: 'Tên lớp', placeholder: 'VD: Lớp 10A1', required: true },
              { name: 'grade', label: 'Khối', type: 'select', options: [
                { value: '10', label: 'Khối 10' }, { value: '11', label: 'Khối 11' }, { value: '12', label: 'Khối 12' },
              ] },
              { name: 'teacher', label: 'Giáo viên chủ nhiệm', type: 'select', options: teacherOptions },
            ]}
          />
        );
      }}
    </AsyncSection>
  );
}
