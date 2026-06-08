import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon, ExpandIcon } from '../components/Icon';
import { learningApi } from '../api/endpoints';
import { assetUrl } from '../api/client';
import { useAsync } from '../hooks/useAsync';
import { AsyncSection } from '../components/AsyncSection';

export default function LessonPage() {
  const { courseId = '', lessonId = '' } = useParams();
  const state = useAsync(() => learningApi.course(courseId), [courseId]);
  const [loaded, setLoaded] = useState(false);

  const openInNewTab = (path: string) => window.open(assetUrl(path), '_blank', 'noopener');

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <AsyncSection state={state} loadingLabel="Đang tải bài học…">
        {(course) => {
          const idx = course.lessons.findIndex((l) => String(l.id) === lessonId);
          if (idx < 0) {
            return (
              <div className="rounded-2xl border border-primary-100 bg-white px-6 py-16 text-center text-primary-500">
                Không tìm thấy bài học.
              </div>
            );
          }
          const lesson = course.lessons[idx];
          const prev = idx > 0 ? course.lessons[idx - 1] : undefined;
          const next = idx < course.lessons.length - 1 ? course.lessons[idx + 1] : undefined;
          const exp = lesson.experiment;

          return (
            <>
              <Breadcrumb
                items={[
                  { label: 'Trang chủ', to: '/' },
                  { label: course.title, to: `/course/${course.id}` },
                  { label: lesson.title },
                ]}
              />

              <header className="mb-6 animate-fade-up">
                <span className="text-sm font-bold text-primary-500">Bài {lesson.order}</span>
                <h1 className="mt-1 font-display text-2xl font-bold text-primary-900 sm:text-3xl">{lesson.title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary-700 sm:text-base">{lesson.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500">
                  <ClockIcon className="h-4 w-4" /> {lesson.durationMin} phút
                </span>
              </header>

              <section className="relative overflow-hidden rounded-2xl border border-primary-100 bg-primary-900 shadow-lift">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </span>
                    <span className="ml-2 truncate">{exp?.name ?? 'Thí nghiệm 3D'}</span>
                  </div>
                  {exp && (
                    <button
                      onClick={() => openInNewTab(exp.htmlPath)}
                      title="Mở thí nghiệm trong tab mới"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-colors duration-200 hover:bg-white/20 cursor-pointer"
                    >
                      <ExpandIcon className="h-4 w-4" /> Mở tab mới
                    </button>
                  )}
                </div>

                <div className="relative aspect-video w-full">
                  {exp ? (
                    <>
                      {!loaded && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-primary-900 text-primary-200">
                          <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-accent-400" />
                          <p className="text-sm font-semibold">Đang tải thí nghiệm 3D…</p>
                        </div>
                      )}
                      <iframe
                        key={exp.htmlPath}
                        src={assetUrl(exp.htmlPath)}
                        title={exp.name}
                        onLoad={() => setLoaded(true)}
                        loading="lazy"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-primary-300">
                      Bài học này chưa có thí nghiệm 3D.
                    </div>
                  )}
                </div>
              </section>

              <p className="mt-3 text-center text-xs text-primary-500">
                Mẹo: Kéo chuột để xoay · Cuộn để phóng to/thu nhỏ mô hình 3D.
              </p>

              <nav className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {prev ? (
                  <Link to={`/course/${course.id}/lesson/${prev.id}`} className="group flex items-center gap-3 rounded-xl border border-primary-100 bg-white p-4 shadow-soft transition-shadow duration-200 hover:shadow-lift cursor-pointer">
                    <ArrowLeftIcon className="h-5 w-5 flex-none text-primary-400 transition-transform duration-200 group-hover:-translate-x-1" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary-500">Bài trước</p>
                      <p className="truncate font-bold text-primary-900">{prev.title}</p>
                    </div>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link to={`/course/${course.id}/lesson/${next.id}`} className="group flex items-center justify-end gap-3 rounded-xl border border-primary-100 bg-white p-4 text-right shadow-soft transition-shadow duration-200 hover:shadow-lift cursor-pointer">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary-500">Bài tiếp theo</p>
                      <p className="truncate font-bold text-primary-900">{next.title}</p>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 flex-none text-primary-400 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <Link to={`/course/${course.id}`} className="group flex items-center justify-end gap-3 rounded-xl border border-accent-500 bg-accent-500 p-4 text-right text-white shadow-soft transition-colors duration-200 hover:bg-accent-600 cursor-pointer">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white/80">Hoàn thành khóa học</p>
                      <p className="truncate font-bold">Quay lại danh sách bài</p>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 flex-none" />
                  </Link>
                )}
              </nav>
            </>
          );
        }}
      </AsyncSection>
    </div>
  );
}
