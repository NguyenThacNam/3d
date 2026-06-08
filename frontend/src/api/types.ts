export type RoleCode = 'admin' | 'school' | 'teacher' | 'student';

export interface Profile {
  id: number;
  roleCode: RoleCode;
  name: string;
  email: string;
  role: string;
  org: string;
  phone: string;
  joined: string;
  initials: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: RoleCode;
  user: Profile;
}

export interface ApiExperiment {
  id: number;
  name: string;
  htmlPath: string;
  description: string;
}

export interface ApiLesson {
  id: number;
  title: string;
  description: string;
  order: number;
  durationMin: number;
  experiment: ApiExperiment | null;
}

export interface CourseSummary {
  id: number;
  title: string;
  subject: string;
  level: string;
  gradient: string;
  coverUrl: string | null;
  description: string;
  lessons: number;
}

export interface CourseDetail {
  id: number;
  title: string;
  subject: string;
  level: string;
  gradient: string;
  coverUrl: string | null;
  description: string;
  lessons: ApiLesson[];
}

export interface CourseAdmin {
  id: number;
  title: string;
  subject: string;
  level: string;
  description: string;
  lessons: number;
  published: boolean;
  coverUrl: string | null;
}

export interface School {
  id: number;
  name: string;
  address: string;
  email: string;
  classes: number;
  students: number;
}

export interface ClassRow {
  id: number;
  name: string;
  grade: string;
  teacher: string;
  teacher_profile_id: number | null;
  students: number;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
  classes: number;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  className: string;
  class_id: number | null;
  status: 'active' | 'inactive';
}

export interface StudentImportResult {
  created: number;
  skipped: number;
  students: Student[];
}

export type AssignmentsMap = Record<string, number[]>;

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export interface PageParams {
  page: number;
  pageSize: number;
  q?: string;
}
