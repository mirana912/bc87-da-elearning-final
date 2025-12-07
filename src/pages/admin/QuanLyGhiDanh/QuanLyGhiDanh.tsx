// src/pages/admin/QuanLyGhiDanh/QuanLyGhiDanh.tsx
import { useState, useEffect } from 'react';
import { courseApi, type Course } from '../../../services/api/courseApi';
import { userApi, type User } from '../../../services/api/userApi';

const QuanLyGhiDanh = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [enrolledUsers, setEnrolledUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [notEnrolledUsers, setNotEnrolledUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'enrolled' | 'pending' | 'notEnrolled'>('enrolled');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadEnrollmentData();
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const response = await courseApi.getCourses({ MaNhom: 'GP01' });
      setCourses(Array.isArray(response.data) ? response.data : []);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0].maKhoaHoc);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadEnrollmentData = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const [enrolledRes, pendingRes, notEnrolledRes] = await Promise.all([
        courseApi.getCourseStudents(selectedCourse).catch(() => ({ data: [] })),
        userApi.getUsersPendingForCourse(selectedCourse).catch(() => ({ data: [] })),
        userApi.getUsersNotEnrolledForCourse(selectedCourse).catch(() => ({ data: [] })),
      ]);
      setEnrolledUsers(Array.isArray(enrolledRes.data) ? enrolledRes.data : []);
      setPendingUsers(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      setNotEnrolledUsers(Array.isArray(notEnrolledRes.data) ? notEnrolledRes.data : []);
    } catch (error) {
      console.error('Error loading enrollment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (taiKhoan: string) => {
    try {
      await courseApi.enrollCourse({ maKhoaHoc: selectedCourse, taiKhoan });
      loadEnrollmentData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ghi danh thất bại');
    }
  };

  const handleApprove = async (taiKhoan: string) => {
    try {
      await courseApi.registerCourse({ maKhoaHoc: selectedCourse, taiKhoan });
      loadEnrollmentData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Duyệt thất bại');
    }
  };

  const handleCancel = async (taiKhoan: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy ghi danh?')) return;
    try {
      await courseApi.cancelEnrollment({ maKhoaHoc: selectedCourse, taiKhoan });
      loadEnrollmentData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Hủy ghi danh thất bại');
    }
  };

  const renderUserList = (users: User[], actionLabel: string, onAction: (taiKhoan: string) => void) => {
    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;
    if (users.length === 0) return <div className="p-8 text-center text-gray-500">Không có dữ liệu</div>;

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tài khoản</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.taiKhoan} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.taiKhoan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.hoTen}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onAction(user.taiKhoan)}
                    className={`${
                      actionLabel === 'Hủy' ? 'text-red-600 hover:text-red-900' : 'text-primary-600 hover:text-primary-900'
                    }`}
                  >
                    {actionLabel}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý ghi danh</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn khóa học</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Chọn khóa học</option>
          {courses.map((course) => (
            <option key={course.maKhoaHoc} value={course.maKhoaHoc}>
              {course.tenKhoaHoc}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'enrolled'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Đã ghi danh ({enrolledUsers.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'pending'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Chờ duyệt ({pendingUsers.length})
              </button>
              <button
                onClick={() => setActiveTab('notEnrolled')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'notEnrolled'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Chưa ghi danh ({notEnrolledUsers.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'enrolled' &&
              renderUserList(enrolledUsers, 'Hủy', handleCancel)}
            {activeTab === 'pending' &&
              renderUserList(pendingUsers, 'Duyệt', handleApprove)}
            {activeTab === 'notEnrolled' &&
              renderUserList(notEnrolledUsers, 'Ghi danh', handleEnroll)}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyGhiDanh;

// ==========================================

