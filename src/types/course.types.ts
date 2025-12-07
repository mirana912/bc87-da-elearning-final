// src/types/course.types.ts
export interface Course {
  id: string;
  name: string;
  description: string;
  content: string;
  image: string;
  price: number;
  discount?: number;
  categoryId: string;
  categoryName?: string;
  instructorId: string;
  instructorName: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  students: number;
  rating: number;
  reviews: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  courseCount: number;
}

export interface CourseLesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

// ==========================================