import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { AsyncSection } from '../../components/AsyncSection';
import { useAsync } from '../../hooks/useAsync';
import { classApi, studentApi, teacherApi } from '../../api/endpoints';
import type { Student } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';
import { ArrowRightIcon, GraduationIcon, LayersIcon, UserIcon, UsersIcon } from '../../components/Icon';

export default function SchoolDashboard() {
  const { user } = useAuth();
  const state = useAsync(
    () =>
      Promise.all([
        classApi.listAll(),
        teacherApi.listAll(),
        studentApi.list({ page: 1, pageSize: 8 }),
        classApi.available(),
      ]),
    [],
  );

  return (
    <div>
      <PageHeader title="Tổng quan trường" subtitle={`${user?.org ?? ''} — tình hình lớp học và người dùng.`} />
      <AsyncSection state={state}>
        {([classes, teachers, students, available]) => (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Lớp học" value={classes.length} icon={GraduationIcon} tone="indigo" />
              <StatCard label="Giáo viên" value={teachers.length} icon={UsersIcon} tone="green" />
              <StatCard label="Học sinh" value={students.total} icon={UserIcon} tone="sky" />
              <StatCard label="Khóa học khả dụng" value={available.length} icon={LayersIcon} tone="amber" hint="Do hệ thống phân bổ" />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-primary-900">Học sinh</h2>
              <Link to="/admin/school/students" className="inline-flex items-center gap-1 text-sm font-bold text-primary-600 transition-colors hover:text-primary-800 cursor-pointer">
                Quản lý <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4">
              <DataTable<Student>
                rows={students.items}
                rowKey={(r) => String(r.id)}
                empty="Chưa có học sinh."
                columns={[
                  { key: 'name', header: 'Họ tên', render: (r) => <span className="font-bold text-primary-900">{r.name}</span> },
                  { key: 'email', header: 'Email', className: 'hidden md:table-cell' },
                  { key: 'className', header: 'Lớp', render: (r) => (r.className ? <Badge tone="indigo">{r.className}</Badge> : '—') },
                  { key: 'status', header: 'Trạng thái', render: (r) => (r.status === 'active' ? <Badge tone="green">Đang học</Badge> : <Badge tone="gray">Tạm nghỉ</Badge>) },
                ]}
              />
            </div>
          </>
        )}
      </AsyncSection>
    </div>
  );
}
