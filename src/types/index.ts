export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor';
}

export interface Course {
  id: string;
  name: string;
  code: string;
  professor: User;
}

export interface Class {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAttendanceActive: boolean;
  attendanceCode?: string;
  codeExpiresAt?: string;
}

export interface Attendance {
  id: string;
  classId: string;
  studentId: string;
  timestamp: string;
  isPresent: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrollment: string;
}

export interface AttendanceRecord {
  id: string;
  student: Student;
  classId: string;
  date: string;
  courseName: string;
  isPresent: boolean;
  timestamp?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

export interface AttendanceState {
  activeCourses: Course[];
  selectedCourse: Course | null;
  classes: Class[];
  selectedClass: Class | null;
  attendances: Attendance[];
  students: Student[];
  isLoading: boolean;
  error: string | null;
}
