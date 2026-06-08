import CourseCard from '../components/CourseCard';
import { SparkIcon, CubeIcon } from '../components/Icon';
import { learningApi } from '../api/endpoints';
import { useAsync } from '../hooks/useAsync';
import { AsyncSection } from '../components/AsyncSection';
import { useAuth } from '../auth/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const state = useAsync(() => learningApi.courses(), []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* ===== Hero ===== */}
      <section className="relative mb-14 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-600 to-primary-800 px-6 py-14 text-white shadow-lift sm:px-12 sm:py-20">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_85%_15%,white,transparent_40%)]" />
        <CubeIcon className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 text-white/10" />
        <div className="relative max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold backdrop-blur-sm">
            <SparkIcon className="h-4 w-4" /> Xin chào, {user?.name ?? 'bạn'}!
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Khám phá khoa học trong <span className="text-accent-400">không gian 3D</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-100 sm:text-lg">
            Mỗi bài học đi kèm một thí nghiệm 3D mô phỏng trực quan — xoay, phóng to và tương tác trực tiếp
            ngay trên trình duyệt, không cần cài đặt.
          </p>
          <a href="#courses" className="mt-8 inline-block rounded-xl bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition-colors duration-200 hover:bg-accent-600 cursor-pointer">
            Bắt đầu học ngay
          </a>
        </div>
      </section>

      {/* ===== Danh sách khóa học ===== */}
      <section id="courses" className="scroll-mt-28">
        <div className="mb-7">
          <h2 className="font-display text-2xl font-bold text-primary-900 sm:text-3xl">Khóa học của bạn</h2>
          <p className="mt-1 text-sm text-primary-700">
            Các khóa học đã được gán cho lớp của bạn. Chọn một khóa để xem bài học.
          </p>
        </div>

        <AsyncSection state={state} loadingLabel="Đang tải khóa học…">
          {(courses) =>
            courses.length === 0 ? (
              <div className="rounded-2xl border border-primary-100 bg-white px-6 py-16 text-center text-primary-500">
                Chưa có khóa học nào được gán cho lớp của bạn.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course, i) => (
                  <CourseCard key={course.id} course={course} index={i} />
                ))}
              </div>
            )
          }
        </AsyncSection>
      </section>
    </div>
  );
}
