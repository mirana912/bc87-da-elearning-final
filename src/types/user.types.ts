// src/types/user.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  rrole?: string;
  avatar?: string;
  bio?: string;
  address?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  enrolledCourses: string[];
  completedCourses: string[];
}

export type UserRole = "admin" | "user" | "instructor";

// ==========================================
