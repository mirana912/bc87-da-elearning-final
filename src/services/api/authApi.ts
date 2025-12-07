import { axiosInstance } from "./axiosConfig";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export interface LoginRequest {
  taiKhoan?: string;
  matKhau?: string;
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maNhom: string;
  email: string;
}

export interface AuthUser {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT?: string;
  maLoaiNguoiDung?: string;
  role?: string;
  maNhom?: string;
  accessToken?: string;
}

export interface LoginResponse {
  accessToken: string;
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT?: string;
  maLoaiNguoiDung?: string;
  role?: string;
  maNhom?: string;
  user?: AuthUser;
  token?: string;
}

export interface RegisterResponse {
  message?: string;
  user?: AuthUser;
}

export const authApi = {
  login: (data: LoginRequest) => {
    const payload = {
      taiKhoan: data.taiKhoan ?? data.email ?? "",
      matKhau: data.matKhau ?? data.password ?? "",
    };
    return axiosInstance.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
  },

  register: (data: RegisterRequest) =>
    axiosInstance.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data),

  getCurrentUser: () =>
    axiosInstance.post<AuthUser>(API_ENDPOINTS.AUTH.CURRENT_USER),

  getAccountInfo: () =>
    axiosInstance.post<AuthUser>(API_ENDPOINTS.AUTH.ACCOUNT_INFO),
};

// ==========================================
