import AssignBoard from '../components/AssignBoard';
import { AsyncSection } from '../../components/AsyncSection';
import { useAsync } from '../../hooks/useAsync';
import { classApi } from '../../api/endpoints';

export default function AssignToClassPage() {
  const state = useAsync(
    () => Promise.all([classApi.listAll(), classApi.available(), classApi.assignments()]),
    [],
  );

  return (
    <AsyncSection state={state} loadingLabel="Đang tải dữ liệu…">
      {([classes, available, assignments]) => (
        <AssignBoard
          title="Gán khóa học cho lớp"
          subtitle="Chọn một lớp, bật/tắt khóa học. Chỉ hiển thị khóa học đã được hệ thống phân bổ cho trường."
          entityLabel="Lớp học"
          entities={classes.map((c) => ({ id: String(c.id), name: c.name, meta: `Khối ${c.grade} · ${c.students} HS` }))}
          courses={available.map((c) => ({ id: c.id, title: c.title, subject: c.subject }))}
          initial={assignments}
          onSave={(id, courseIds) => classApi.setCourses(Number(id), courseIds)}
          emptyAvailable="Trường chưa được phân bổ khóa học nào. Liên hệ quản trị hệ thống."
        />
      )}
    </AsyncSection>
  );
}
