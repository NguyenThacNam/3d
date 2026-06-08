import AssignBoard from '../components/AssignBoard';
import { AsyncSection } from '../../components/AsyncSection';
import { useAsync } from '../../hooks/useAsync';
import { courseApi, schoolApi } from '../../api/endpoints';

export default function AssignCoursesPage() {
  const state = useAsync(
    () => Promise.all([schoolApi.listAll(), courseApi.listAll(), schoolApi.assignments()]),
    [],
  );

  return (
    <AsyncSection state={state} loadingLabel="Đang tải dữ liệu phân bổ…">
      {([schools, courses, assignments]) => (
        <AssignBoard
          title="Gán khóa học cho trường"
          subtitle="Chọn một trường, sau đó bật/tắt các khóa học muốn phân bổ. Thay đổi được lưu ngay."
          entityLabel="Trường học"
          entities={schools.map((s) => ({ id: String(s.id), name: s.name, meta: `${s.classes} lớp · ${s.students} HS` }))}
          courses={courses.map((c) => ({ id: c.id, title: c.title, subject: c.subject }))}
          initial={assignments}
          onSave={(id, courseIds) => schoolApi.setCourses(Number(id), courseIds)}
        />
      )}
    </AsyncSection>
  );
}
