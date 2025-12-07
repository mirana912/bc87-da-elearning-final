// src/types/enrollment.types.ts
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  userName?: string;
  userEmail?: string;
  courseName?: string;
  courseImage?: string;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  enrolledAt: string;
  completedAt?: string;
}

// ==========================================