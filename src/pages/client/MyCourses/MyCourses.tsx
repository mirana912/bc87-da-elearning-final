// src/pages/client/MyCourses/MyCourses.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, Eye, X } from "lucide-react";
import { userApi } from "../../../services/api/userApi";
import { courseApi, type Course } from "../../../services/api/courseApi";
import type { RootState } from "../../../store/store/store";
import { CourseImage } from "../../../components/common/CourseImage/CourseImage";

const MyCourses = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [approvedCourses, setApprovedCourses] = useState<Course[]>([]);
  const [pendingCourses, setPendingCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"approved" | "pending">(
    "approved"
  );

  useEffect(() => {
    if (user?.taiKhoan) {
      loadMyCourses();
    }
  }, [user]);

  const loadMyCourses = async () => {
    if (!user?.taiKhoan) return;
    setLoading(true);
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        userApi.getCoursesApproved(user.taiKhoan).catch(() => ({ data: [] })),
        userApi
          .getCoursesWaitingApproval(user.taiKhoan)
          .catch(() => ({ data: [] })),
      ]);
      setApprovedCourses(
        Array.isArray(approvedRes.data) ? approvedRes.data : []
      );
      setPendingCourses(Array.isArray(pendingRes.data) ? pendingRes.data : []);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnrollment = async (
    e: React.MouseEvent,
    course: Course
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.taiKhoan) return;
    if (
      !confirm(
        `Bạn có chắc chắn muốn hủy đăng ký khóa học "${course.tenKhoaHoc}"?`
      )
    )
      return;

    try {
      await courseApi.cancelEnrollment({
        maKhoaHoc: course.maKhoaHoc,
        taiKhoan: user.taiKhoan,
      });
      loadMyCourses();
      alert("Hủy đăng ký thành công!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Hủy đăng ký thất bại");
    }
  };

  const renderCourseCard = (course: Course, showCancel = false) => (
    <div
      key={course.maKhoaHoc}
      className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {showCancel && (
        <button
          onClick={(e) => handleCancelEnrollment(e, course)}
          className="absolute top-4 right-4 p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors z-10"
          title="Hủy đăng ký"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <Link to={`/courses/${course.maKhoaHoc}`} className="block">
        <div className="mb-4 aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
          <CourseImage
            src={course.hinhAnh}
            alt={course.tenKhoaHoc}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {course.tenKhoaHoc}
          </h3>
          {course.moTa && (
            <p className="text-sm text-gray-600 line-clamp-2">{course.moTa}</p>
          )}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {course.luotXem && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {course.luotXem}
                </span>
              )}
              {course.danhGia && (
                <span className="flex items-center gap-1 text-primary-600">
                  <Star className="w-3 h-3 fill-primary-600" />
                  {course.danhGia}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">
              Tiếp tục học →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Khóa học của tôi
          </h1>
          <p className="text-gray-600">
            Quản lý và tiếp tục học các khóa học đã đăng ký
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("approved")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "approved"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Đã duyệt ({approvedCourses.length})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "pending"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Chờ duyệt ({pendingCourses.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                {activeTab === "approved" && (
                  <>
                    {approvedCourses.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {approvedCourses.map((course) =>
                          renderCourseCard(course, true)
                        )}
                      </div>
                    ) : (
                      <div className="py-20 text-center">
                        <p className="text-gray-500 mb-4">
                          Bạn chưa có khóa học nào đã được duyệt.
                        </p>
                        <Link
                          to="/courses"
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Khám phá khóa học →
                        </Link>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "pending" && (
                  <>
                    {pendingCourses.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pendingCourses.map((course) =>
                          renderCourseCard(course, true)
                        )}
                      </div>
                    ) : (
                      <div className="py-20 text-center">
                        <p className="text-gray-500">
                          Không có khóa học nào đang chờ duyệt.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;

// ==========================================
