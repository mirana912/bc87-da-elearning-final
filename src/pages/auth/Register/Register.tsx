// src/pages/auth/Register/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerAsync } from "../../../store/slices/authSlice";

interface RegisterForm {
  taiKhoan: string;
  matKhau: string;
  confirmPassword: string;
  hoTen: string;
  soDT: string;
  email: string;
  maNhom: string;
}

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<RegisterForm>({
    taiKhoan: "",
    matKhau: "",
    confirmPassword: "",
    hoTen: "",
    soDT: "",
    email: "",
    maNhom: "GP01",
  });

  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};

    if (!formData.taiKhoan) {
      newErrors.taiKhoan = "Tài khoản là bắt buộc";
    } else if (formData.taiKhoan.length < 3) {
      newErrors.taiKhoan = "Tài khoản phải có ít nhất 3 ký tự";
    }

    if (!formData.matKhau) {
      newErrors.matKhau = "Mật khẩu là bắt buộc";
    } else if (formData.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.matKhau !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!formData.hoTen) {
      newErrors.hoTen = "Họ tên là bắt buộc";
    }

    if (!formData.soDT) {
      newErrors.soDT = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.soDT)) {
      newErrors.soDT = "Số điện thoại không hợp lệ";
    }

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof RegisterForm]) {
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
        registerAsync({
          taiKhoan: formData.taiKhoan,
          matKhau: formData.matKhau,
          hoTen: formData.hoTen,
          soDT: formData.soDT,
          email: formData.email,
          maNhom: formData.maNhom,
        }) as any
      );

      if (registerAsync.fulfilled.match(result)) {
        navigate("/login");
      } else {
        setApiError((result.payload as string) || "Đăng ký thất bại");
      }
    } catch (error: any) {
      setApiError(error.message || "Đăng ký thất bại");
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
          <p className="text-body-1 text-white/80">Tạo tài khoản mới</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-xl-material p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Nhập tài khoản"
              />
              {errors.taiKhoan && (
                <p className="mt-1 text-caption text-error-500">
                  {errors.taiKhoan}
                </p>
              )}
            </div>

            {/* Ho Ten Field */}
            <div>
              <label
                htmlFor="hoTen"
                className="block text-body-2 text-gray-700 mb-2"
              >
                Họ tên
              </label>
              <input
                type="text"
                id="hoTen"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-material focus:outline-none focus:ring-2 transition-all duration-material ${
                  errors.hoTen
                    ? "border-error-500 focus:ring-error-500"
                    : "border-gray-300 focus:ring-primary-500"
                }`}
                placeholder="Nhập họ tên"
              />
              {errors.hoTen && (
                <p className="mt-1 text-caption text-error-500">
                  {errors.hoTen}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-body-2 text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-material focus:outline-none focus:ring-2 transition-all duration-material ${
                  errors.email
                    ? "border-error-500 focus:ring-error-500"
                    : "border-gray-300 focus:ring-primary-500"
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-caption text-error-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* So DT Field */}
            <div>
              <label
                htmlFor="soDT"
                className="block text-body-2 text-gray-700 mb-2"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="soDT"
                name="soDT"
                value={formData.soDT}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-material focus:outline-none focus:ring-2 transition-all duration-material ${
                  errors.soDT
                    ? "border-error-500 focus:ring-error-500"
                    : "border-gray-300 focus:ring-primary-500"
                }`}
                placeholder="0123456789"
              />
              {errors.soDT && (
                <p className="mt-1 text-caption text-error-500">
                  {errors.soDT}
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-body-2 text-gray-700 mb-2"
              >
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-material focus:outline-none focus:ring-2 transition-all duration-material ${
                  errors.confirmPassword
                    ? "border-error-500 focus:ring-error-500"
                    : "border-gray-300 focus:ring-primary-500"
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-caption text-error-500">
                  {errors.confirmPassword}
                </p>
              )}
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
                "Đăng ký"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-body-1 text-gray-500">hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-body-1 text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-800 font-medium transition-colors duration-material"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

// ==========================================
