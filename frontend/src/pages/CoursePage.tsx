import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { ArrowRightIcon, BookIcon, ClockIcon, PlayIcon } from '../components/Icon';
import { learningApi } from '../api/endpoints';
import { assetUrl } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import { AsyncSection } from '../components/AsyncSection';

export default function CoursePage() {
  const { courseId = '' } = useParams();
  const state = useAsync(() => learningApi.course(courseId), [courseId]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <AsyncSection state={state} loadingLabel="Đang tải khóa học…">
        {(course) => {
          const totalMin = course.lessons.reduce((s, l) => s + l.durationMin, 0);
          return (
            <>
              <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: course.title }]} />

              <section className={`relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br ${course.gradient} px-6 py-10 text-white shadow-lift sm:px-10`}>
                {course.coverUrl && (
                  <>
                    <img src={assetUrl(course.coverUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/45 to-primary-900/20" />
                  </>
                )}
                <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_90%_10%,white,transparent_45%)]" />
                <div className="relative animate-fade-up">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-primary-800">{course.subject}</span>
                    <span className="rounded-full bg-black/20 px-3 py-1 backdrop-blur-sm">{course.level}</span>
                  </div>
                  <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{course.title}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">{course.description}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-5 text-sm font-semibold">
                    <span className="inline-flex items-center gap-1.5"><BookIcon className="h-4 w-4" /> {course.lessons.length} bài học</span>
                    <span className="inline-flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> ~{totalMin} phút</span>
                  </div>
                </div>
              </section>

              <h2 className="mb-5 font-display text-xl font-bold text-primary-900">Nội dung khóa học</h2>
              <ol className="space-y-3">
                {course.lessons.map((lesson, i) => (
                  <li key={lesson.id}>
                    <Link
                      to={`/course/${course.id}/lesson/${lesson.id}`}
                      style={{ animationDelay: `${i * 60}ms` }}
                      className="group flex animate-fade-up items-center gap-4 rounded-2xl border border-primary-100 bg-white p-4 shadow-soft transition-shadow duration-200 hover:shadow-lift cursor-pointer sm:p-5"
                    >
                      <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-primary-50 font-display text-lg font-bold text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                        {lesson.order}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display text-base font-bold text-primary-900">{lesson.title}</h3>
                        <p className="mt-0.5 line-clamp-2 text-sm text-primary-700/90">{lesson.description}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs font-semibold text-primary-500">
                          <span className="inline-flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" /> {lesson.durationMin} phút</span>
                          <span className="inline-flex items-center gap-1"><PlayIcon className="h-3.5 w-3.5" /> Thí nghiệm 3D</span>
                        </div>
                      </div>
                      <ArrowRightIcon className="h-5 w-5 flex-none text-primary-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary-600" />
                    </Link>
                  </li>
                ))}
              </ol>
            </>
          );
        }}
      </AsyncSection>
    </div>
  );
}
