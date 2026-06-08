import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import NotFound from './pages/NotFound';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './admin/AdminLayout';
import SystemDashboard from './admin/system/SystemDashboard';
import SchoolsPage from './admin/system/SchoolsPage';
import CoursesPage from './admin/system/CoursesPage';
import CourseLessonsPage from './admin/system/CourseLessonsPage';
import AssignCoursesPage from './admin/system/AssignCoursesPage';
import SchoolDashboard from './admin/school/SchoolDashboard';
import ClassesPage from './admin/school/ClassesPage';
import TeachersPage from './admin/school/TeachersPage';
import StudentsPage from './admin/school/StudentsPage';
import AssignToClassPage from './admin/school/AssignToClassPage';
import { RequireAuth, RequireRole } from './auth/guards';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function LearnLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* ===== Khu học tập (yêu cầu đăng nhập) ===== */}
        <Route
          element={
            <RequireAuth>
              <LearnLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ===== Quản trị hệ thống (role admin) ===== */}
        <Route
          path="/admin/system"
          element={
            <RequireRole roles={['admin']}>
              <AdminLayout scope="system" />
            </RequireRole>
          }
        >
          <Route index element={<SystemDashboard />} />
          <Route path="schools" element={<SchoolsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:courseId" element={<CourseLessonsPage />} />
          <Route path="assign" element={<AssignCoursesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* ===== Quản trị trường (role school) ===== */}
        <Route
          path="/admin/school"
          element={
            <RequireRole roles={['school']}>
              <AdminLayout scope="school" />
            </RequireRole>
          }
        >
          <Route index element={<SchoolDashboard />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="assign" element={<AssignToClassPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}
