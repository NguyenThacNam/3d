import { api } from './client';
import type {
  ApiLesson,
  AssignmentsMap,
  ClassRow,
  CourseAdmin,
  CourseDetail,
  CourseSummary,
  Page,
  PageParams,
  Profile,
  School,
  Student,
  StudentImportResult,
  Teacher,
  TokenResponse,
} from './types';

// Dựng query string phân trang
function qs(p: PageParams): string {
  const u = new URLSearchParams({ page: String(p.page), page_size: String(p.pageSize) });
  if (p.q) u.set('q', p.q);
  return u.toString();
}
const ALL: PageParams = { page: 1, pageSize: 1000 };

export const authApi = {
  login: (identifier: string, password: string) =>
    api.post<TokenResponse>('/auth/login', { identifier, password }),
  me: () => api.get<Profile>('/auth/me'),
};

export const profileApi = {
  get: () => api.get<Profile>('/profile'),
  update: (data: { name?: string; email?: string; phone?: string }) =>
    api.put<Profile>('/profile', data),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.put<void>('/profile/password', data),
};

export const learningApi = {
  courses: () => api.get<CourseSummary[]>('/learning/courses'),
  course: (id: string | number) => api.get<CourseDetail>(`/learning/courses/${id}`),
};

export const schoolApi = {
  list: (p: PageParams) => api.get<Page<School>>(`/schools?${qs(p)}`),
  listAll: async () => (await api.get<Page<School>>(`/schools?${qs(ALL)}`)).items,
  create: (d: Partial<School>) => api.post<School>('/schools', d),
  update: (id: number, d: Partial<School>) => api.put<School>(`/schools/${id}`, d),
  remove: (id: number) => api.del(`/schools/${id}`),
  assignments: () => api.get<AssignmentsMap>('/schools/assignments'),
  setCourses: (id: number, courseIds: number[]) =>
    api.put<number[]>(`/schools/${id}/courses`, { course_ids: courseIds }),
};

export const courseApi = {
  list: (p: PageParams) => api.get<Page<CourseAdmin>>(`/courses?${qs(p)}`),
  listAll: async () => (await api.get<Page<CourseAdmin>>(`/courses?${qs(ALL)}`)).items,
  create: (d: Partial<CourseAdmin> & { description?: string; gradient?: string }) =>
    api.post<CourseAdmin>('/courses', d),
  update: (id: number, d: Partial<CourseAdmin> & { description?: string; gradient?: string }) =>
    api.put<CourseAdmin>(`/courses/${id}`, d),
  remove: (id: number) => api.del(`/courses/${id}`),
  uploadCover: (id: number, file: File) => api.upload<CourseAdmin>(`/courses/${id}/cover`, file),
};

export const lessonApi = {
  listByCourse: (courseId: number | string) => api.get<ApiLesson[]>(`/courses/${courseId}/lessons`),
  create: (courseId: number | string, d: { title: string; description?: string; durationMin?: number }) =>
    api.post<ApiLesson>(`/courses/${courseId}/lessons`, d),
  update: (id: number, d: { title?: string; description?: string; order?: number; durationMin?: number }) =>
    api.put<ApiLesson>(`/lessons/${id}`, d),
  remove: (id: number) => api.del(`/lessons/${id}`),
  uploadExperiment: (id: number, file: File) => api.upload<ApiLesson>(`/lessons/${id}/experiment`, file),
};

export const classApi = {
  list: (p: PageParams) => api.get<Page<ClassRow>>(`/classes?${qs(p)}`),
  listAll: async () => (await api.get<Page<ClassRow>>(`/classes?${qs(ALL)}`)).items,
  create: (d: { name: string; grade?: string; teacher_profile_id?: number | null }) =>
    api.post<ClassRow>('/classes', d),
  update: (id: number, d: { name: string; grade?: string; teacher_profile_id?: number | null }) =>
    api.put<ClassRow>(`/classes/${id}`, d),
  remove: (id: number) => api.del(`/classes/${id}`),
  available: () => api.get<CourseSummary[]>('/classes/available-courses'),
  assignments: () => api.get<AssignmentsMap>('/classes/assignments'),
  setCourses: (id: number, courseIds: number[]) =>
    api.put<number[]>(`/classes/${id}/courses`, { course_ids: courseIds }),
};

export const teacherApi = {
  list: (p: PageParams) => api.get<Page<Teacher>>(`/teachers?${qs(p)}`),
  listAll: async () => (await api.get<Page<Teacher>>(`/teachers?${qs(ALL)}`)).items,
  create: (d: { name: string; email?: string; username?: string; subject?: string }) =>
    api.post<Teacher>('/teachers', d),
  update: (id: number, d: { name?: string; email?: string; username?: string; subject?: string }) =>
    api.put<Teacher>(`/teachers/${id}`, d),
  remove: (id: number) => api.del(`/teachers/${id}`),
};

export const studentApi = {
  list: (p: PageParams) => api.get<Page<Student>>(`/students?${qs(p)}`),
  create: (d: { name: string; email?: string; username?: string; class_id?: number | null; status?: string }) =>
    api.post<Student>('/students', d),
  update: (id: number, d: { name?: string; email?: string; username?: string; class_id?: number | null; status?: string }) =>
    api.put<Student>(`/students/${id}`, d),
  remove: (id: number) => api.del(`/students/${id}`),
  resetPassword: (id: number) => api.post<{ password: string }>(`/students/${id}/reset-password`),
  import: (file: File) => api.upload<StudentImportResult>('/students/import', file),
  template: () => api.download('/students/template', 'mau-danh-sach-hoc-sinh.xlsx'),
};
