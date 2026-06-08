import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/Icon';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <p className="font-display text-6xl font-bold text-primary-300">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-primary-900">
        Không tìm thấy nội dung
      </h1>
      <p className="mt-2 text-sm text-primary-700">
        Khóa học hoặc bài học này có thể chưa được gán cho lớp của bạn, hoặc đường dẫn không đúng.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors duration-200 hover:bg-primary-700 cursor-pointer"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Về trang chủ
      </Link>
    </div>
  );
}
