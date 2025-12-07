import { axiosInstance } from './axiosConfig';
import { API_ENDPOINTS } from '../constant/apiEndpoints';

export interface EnrollmentPayload {
  maKhoaHoc: string;
  taiKhoan: string;
}

export const enrollmentApi = {
  enroll: (payload: EnrollmentPayload) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.ENROLL, payload),

  register: (payload: EnrollmentPayload) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.REGISTER, payload),

  cancel: (payload: EnrollmentPayload) =>
    axiosInstance.post(API_ENDPOINTS.COURSES.CANCEL_ENROLL, payload),
};

// ==========================================

