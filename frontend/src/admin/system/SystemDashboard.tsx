import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { AsyncSection } from '../../components/AsyncSection';
import { useAsync } from '../../hooks/useAsync';
import { courseApi, schoolApi } from '../../api/endpoints';
import type { School } from '../../api/types';
import { ArrowRightIcon, BuildingIcon, GraduationIcon, LayersIcon, UsersIcon } from '../../components/Icon';

export default function SystemDashboard() {
  const state = useAsync(() => Promise.all([schoolApi.listAll(), courseApi.listAll()]), []);

  return (
    <div>
      <PageHeader title="Tổng quan hệ thống" subtitle="Theo dõi nhanh tình hình toàn nền tảng BKAP 3D Learning." />
      <AsyncSection state={state}>
        {([schools, courses]) => {
          const totalStudents = schools.reduce((s, x) => s + x.students, 0);
          const totalClasses = schools.reduce((s, x) => s + x.classes, 0);
          return (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Trường học" value={schools.length} icon={BuildingIcon} tone="indigo" hint="Đang hoạt động" />
                <StatCard label="Khóa học" value={courses.length} icon={LayersIcon} tone="green" hint={`${courses.filter((c) => c.published).length} đã xuất bản`} />
                <StatCard label="Lớp học" value={totalClasses} icon={GraduationIcon} tone="sky" />
                <StatCard label="Học sinh" value={totalStudents.toLocaleString('vi-VN')} icon={UsersIcon} tone="amber" />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-primary-900">Trường học</h2>
                <Link to="/admin/system/schools" className="inline-flex items-center gap-1 text-sm font-bold text-primary-600 transition-colors hover:text-primary-800 cursor-pointer">
                  Quản lý <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-4">
                <DataTable<School>
                  rows={schools}
                  rowKey={(r) => String(r.id)}
                  columns={[
                    { key: 'name', header: 'Tên trường', render: (r) => <span className="font-bold text-primary-900">{r.name}</span> },
                    { key: 'address', header: 'Địa chỉ', className: 'hidden md:table-cell' },
                    { key: 'classes', header: 'Số lớp', render: (r) => <Badge tone="indigo">{r.classes} lớp</Badge> },
                    { key: 'students', header: 'Học sinh', render: (r) => <Badge tone="green">{r.students}</Badge> },
                  ]}
                />
              </div>
            </>
          );
        }}
      </AsyncSection>
    </div>
  );
}
