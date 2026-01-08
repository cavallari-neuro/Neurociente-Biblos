// Domain Entities

export interface Tenant {
  id: string;
  name: string;
  type: 'SCHOOL' | 'CHURCH';
  logoUrl?: string;
  primaryColor: string; // Used for accent injection
}

export enum LessonStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Lesson {
  id: string;
  title: string;
  reference: string; // e.g., "Lucas 1:1-4"
  pageNumber: number; // Physical bible page
  videoUrl?: string;
  durationMinutes: number;
  status: LessonStatus;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface UserProgress {
  userId: string;
  completedLessonIds: string[];
  currentStreak: number;
  totalInsights: number;
}