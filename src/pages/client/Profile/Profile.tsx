// src/pages/client/Profile/Profile.tsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userApi, type User } from "../../../services/api/userApi";
import { getCurrentUserAsync } from "../../../store/slices/authSlice";
import type { RootState } from "../../../store/store/store";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Partial<User>>({
    hoTen: "",
    email: "",
    soDT: "",
  });
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        hoTen: user.hoTen || "",
        email: user.email || "",
        soDT: user.soDT || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.taiKhoan) return;

    setSaving(true);
    setMessage(null);
    try {
      await userApi.updateUser({
        ...user,
        ...formData,
      });
      await dispatch(getCurrentUserAsync() as any);
      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Cập nhật thất bại",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {message && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tài khoản
              </label>
              <input
                type="text"
                value={user?.taiKhoan || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Tài khoản không thể thay đổi
              </p>
            </div>

            <div>
              <label
                htmlFor="hoTen"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="hoTen"
                name="hoTen"
                required
                value={formData.hoTen}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="soDT"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="soDT"
                name="soDT"
                value={formData.soDT || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// ==========================================
