// src/services/api/userApi.ts
import { axiosInstance } from './axiosConfig';
import { API_ENDPOINTS } from '../constant/apiEndpoints';

export interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT?: string;
  maLoaiNguoiDung?: string;
  maNhom?: string;
}

export interface UserListParams {
  MaNhom?: string;
  tuKhoa?: string;
  page?: number;
  pageSize?: number;
}

export interface CourseByUserParams {
  taiKhoan: string;
}

export interface CourseByCourseParams {
  maKhoaHoc: string;
}

export const userApi = {
  getUsers: (params: UserListParams = {}) =>
    axiosInstance.get<User[]>(API_ENDPOINTS.USERS.LIST, { params }),

  getUsersPaginated: (params: UserListParams = {}) =>
    axiosInstance.get<{ items: User[]; totalCount?: number; total?: number }>(
      API_ENDPOINTS.USERS.LIST_PAGINATED,
      { params }
    ),

  searchUsers: (params: UserListParams = {}) =>
    axiosInstance.get<User[]>(API_ENDPOINTS.USERS.SEARCH, { params }),

  getUserTypes: () => axiosInstance.get(API_ENDPOINTS.USERS.TYPES),

  createUser: (data: User) =>
    axiosInstance.post(API_ENDPOINTS.USERS.CREATE, data),

  updateUser: (data: User) =>
    axiosInstance.put(API_ENDPOINTS.USERS.UPDATE, data),

  deleteUser: (taiKhoan: string) =>
    axiosInstance.delete(API_ENDPOINTS.USERS.DELETE, { params: { TaiKhoan: taiKhoan } }),

  getCoursesNotEnrolled: (taiKhoan: string) =>
    axiosInstance.post(API_ENDPOINTS.USERS.COURSES_NOT_ENROLLED, null, { params: { TaiKhoan: taiKhoan } }),

  getCoursesWaitingApproval: (taiKhoan: string) =>
    axiosInstance.post(API_ENDPOINTS.USERS.COURSES_WAITING_APPROVAL, { taiKhoan }),

  getCoursesApproved: (taiKhoan: string) =>
    axiosInstance.post(API_ENDPOINTS.USERS.COURSES_APPROVED, { taiKhoan }),

  getUsersNotEnrolledForCourse: (maKhoaHoc: string) =>
    axiosInstance.post(API_ENDPOINTS.USERS.NOT_ENROLLED_FOR_COURSE, { maKhoaHoc }),

  getUsersPendingForCourse: (maKhoaHoc: string) =>
    axiosInstance.post(API_ENDPOINTS.USERS.PENDING_APPROVAL_FOR_COURSE, { maKhoaHoc }),

  getUsersApprovedForCourse: (maKhoaHoc: string) =>
    axiosInstance.post(API_ENDPOINTS.USERS.APPROVED_FOR_COURSE, { maKhoaHoc }),
};
// ==========================================