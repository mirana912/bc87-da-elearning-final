// src/services/api/courseApi.ts
import { axiosInstance } from "./axiosConfig";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export interface Course {
  maKhoaHoc: string;
  biDanh?: string;
  tenKhoaHoc: string;
  moTa?: string;
  hinhAnh?: string;
  luotXem?: number;
  danhGia?: number;
  maNhom?: string;
  ngayTao?: string;
  maDanhMucKhoaHoc?: string;
  // data?: string;
  // total?: string;
  taiKhoanNguoiTao?: string;
}

export interface CourseListParams {
  tenKhoaHoc?: string;
  MaNhom?: string;
  page?: number;
  pageSize?: number;
  maDanhMuc?: string;
}

export interface CourseEnrollPayload {
  maKhoaHoc: string;
  taiKhoan: string;
}

export const courseApi = {
  getCourses: (params: CourseListParams = {}) =>
    axiosInstance.get<Course[]>(API_ENDPOINTS.COURSES.LIST, { params }),

  getCoursesPaginated: (params: CourseListParams = {}) =>
    axiosInstance.get<{ items: Course[]; totalCount?: number; total?: number }>(
      API_ENDPOINTS.COURSES.LIST_PAGINATED,
      { params }
    ),

  getCoursesByCategory: (params: { maDanhMuc?: string; MaNhom?: string }) =>
    axiosInstance.get<Course[]>(API_ENDPOINTS.COURSES.BY_CATEGORY, { params }),

  getCategories: () => axiosInstance.get(API_ENDPOINTS.COURSES.CATEGORIES),

  getCourseDetail: (maKhoaHoc: string) =>
    axiosInstance.get<Course>(API_ENDPOINTS.COURSES.DETAIL, {
      params: { maKhoaHoc },
    }),

  getCourseStudents: (maKhoaHoc: string) =>
    axiosInstance.get(API_ENDPOINTS.COURSES.STUDENTS, {
      params: { maKhoaHoc },
    }),

  createCourse: (data: Course) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.CREATE, { kh: data }),

  updateCourse: (data: Course) =>
    axiosInstance.put(API_ENDPOINTS.COURSES.UPDATE, { kh: data }),

  deleteCourse: (maKhoaHoc: string) =>
    axiosInstance.delete(API_ENDPOINTS.COURSES.DELETE, {
      params: { MaKhoaHoc: maKhoaHoc },
    }),

  enrollCourse: (payload: CourseEnrollPayload) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.ENROLL, payload),

  registerCourse: (payload: CourseEnrollPayload) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.REGISTER, payload),

  cancelEnrollment: (payload: CourseEnrollPayload) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.CANCEL_ENROLL, payload),

  uploadCourseImage: (formData: FormData) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.UPLOAD_IMAGE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  createCourseWithImage: (formData: FormData) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.UPLOAD_CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateCourseWithImage: (formData: FormData) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.UPLOAD_UPDATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  uploadGeneric: (
    formData: FormData,
    params?: { tenKhoaHoc?: string; maNhom?: string }
  ) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.UPLOAD_GENERIC, formData, {
      params,
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ==========================================
