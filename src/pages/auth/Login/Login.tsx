// src/pages/auth/Login/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store/store";
import { loginAsync } from "../../../store/slices/authSlice";

interface LoginForm {
  taiKhoan: string;
  matKhau: string;
  rememberMe: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<LoginForm>({
    taiKhoan: "",
    matKhau: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!formData.taiKhoan) {
      newErrors.taiKhoan = "Tài khoản là bắt buộc";
    }

    if (!formData.matKhau) {
      newErrors.matKhau = "Mật khẩu là bắt buộc";
    } else if (formData.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof LoginForm]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await dispatch(
        loginAsync({
          taiKhoan: formData.taiKhoan,
          matKhau: formData.matKhau,
        }) as any
      );

      if (loginAsync.fulfilled.match(result)) {
        const payload = result.payload ?? ({} as any);
        const user = payload.user ?? payload;
        const maLoaiNguoiDung =
          (user?.maLoaiNguoiDung as string | undefined) ??
          (user?.role as string | undefined);
        const token = payload.accessToken ?? payload.token ?? null;
        if (token) {
          localStorage.setItem("token", token);
        }

        if (maLoaiNguoiDung === "GV" || maLoaiNguoiDung === "admin") {
          navigate("/admin/users");
        } else {
          navigate("/");
        }
      } else {
        // result rejected or fulfilled without payload
        const err = (result as any).payload ?? (result as any).error ?? null;
        setApiError(typeof err === "string" ? err : "Đăng nhập thất bại");
      }
    } catch (error: any) {
      setApiError(error?.message ?? "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-display-4 font-bold text-white mb-2">
            E-Learning
          </h1>
          <p className="text-body-1 text-white/80">Đăng nhập vào hệ thống</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl-material p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* API Error Alert */}
            {apiError && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-material text-body-1">
                {apiError}
              </div>
            )}

            {/* Tai Khoan Field */}
            <div>
              <label
                htmlFor="taiKhoan"
                className="block text-body-2 text-gray-700 mb-2"
              >
                Tài khoản
              </label>
              <input
                type="text"
                id="taiKhoan"
                name="taiKhoan"
                value={formData.taiKhoan}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-material focus:outline-none focus:ring-2 transition-all duration-material ${
                  errors.taiKhoan
                    ? "border-error-500 focus:ring-error-500"
                    : "border-gray-300 focus:ring-primary-500"
                }`}
                placeholder="Nhập tài khoản hoặc email"
              />
              {errors.taiKhoan && (
                <p className="mt-1 text-caption text-error-500">
                  {errors.taiKhoan}
                </p>
              )}
            </div>

            {/* Mat Khau Field */}
            <div>
              <label
                htmlFor="matKhau"
                className="block text-body-2 text-gray-700 mb-2"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="matKhau"
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-material focus:outline-none focus:ring-2 transition-all duration-material ${
                  errors.matKhau
                    ? "border-error-500 focus:ring-error-500"
                    : "border-gray-300 focus:ring-primary-500"
                }`}
                placeholder="••••••••"
              />
              {errors.matKhau && (
                <p className="mt-1 text-caption text-error-500">
                  {errors.matKhau}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-body-1 text-gray-700">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-body-1 text-primary-600 hover:text-primary-800 transition-colors duration-material"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 rounded-material hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-material disabled:opacity-50 disabled:cursor-not-allowed text-body-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-body-1 text-gray-500">hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-body-1 text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-800 font-medium transition-colors duration-material"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
