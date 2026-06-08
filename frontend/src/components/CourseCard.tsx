import { Link } from 'react-router-dom';
import type { CourseSummary } from '../api/types';
import { assetUrl } from '../api/client';
import { ArrowRightIcon, BookIcon, CubeIcon } from './Icon';

export default function CourseCard({ course, index = 0 }: { course: CourseSummary; index?: number }) {
  return (
    <Link
      to={`/course/${course.id}`}
      style={{ animationDelay: `${index * 70}ms` }}
      className="group flex animate-fade-up flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-soft transition-shadow duration-200 hover:shadow-lift focus-visible:shadow-lift cursor-pointer"
    >
      <div className={`relative h-36 bg-gradient-to-br ${course.gradient}`}>
        {course.coverUrl && (
          <img
            src={assetUrl(course.coverUrl)}
            alt={`Ảnh nền khóa học ${course.title}`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
        {!course.coverUrl && (
          <CubeIcon className="absolute right-4 top-4 h-16 w-16 text-white/30 transition-transform duration-300 group-hover:rotate-12" />
        )}
        <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary-800">
          {course.subject}
        </span>
        <span className="absolute bottom-3 right-4 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {course.level}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-primary-900">{course.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-primary-700/90">
          {course.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-primary-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
            <BookIcon className="h-4 w-4" />
            {course.lessons} bài học
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 transition-colors group-hover:text-primary-900">
            Xem bài học
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
