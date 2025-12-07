// src/pages/client/CourseDetail/CourseDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, Eye, Calendar, CheckCircle2, Clock } from "lucide-react";
import { courseApi, type Course } from "../../../services/api/courseApi";
import { userApi } from "../../../services/api/userApi";
import type { RootState } from "../../../store/store/store";
import { CourseImage } from "../../../components/common/CourseImage/CourseImage";

const CourseDetail = () => {
  const { maKhoaHoc } = useParams<{ maKhoaHoc: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<
    "none" | "pending" | "approved"
  >("none");

  useEffect(() => {
    if (maKhoaHoc) {
      loadCourseDetail();
      if (isAuthenticated && user?.taiKhoan) {
        checkEnrollmentStatus();
      }
    }
  }, [maKhoaHoc, isAuthenticated, user]);

  const loadCourseDetail = async () => {
    if (!maKhoaHoc) return;
    setLoading(true);
    try {
      const response = await courseApi.getCourseDetail(maKhoaHoc);
      setCourse(response.data);
    } catch (error) {
      console.error("Error loading course:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    if (!user?.taiKhoan) return;
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        userApi.getCoursesApproved(user.taiKhoan).catch(() => ({ data: [] })),
        userApi
          .getCoursesWaitingApproval(user.taiKhoan)
          .catch(() => ({ data: [] })),
      ]);
      const approved = Array.isArray(approvedRes.data) ? approvedRes.data : [];
      const pending = Array.isArray(pendingRes.data) ? pendingRes.data : [];

      if (approved.some((c: Course) => c.maKhoaHoc === maKhoaHoc)) {
        setIsEnrolled(true);
        setEnrollmentStatus("approved");
      } else if (pending.some((c: Course) => c.maKhoaHoc === maKhoaHoc)) {
        setIsEnrolled(true);
        setEnrollmentStatus("pending");
      } else {
        setIsEnrolled(false);
        setEnrollmentStatus("none");
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!maKhoaHoc || !user?.taiKhoan) return;

    setEnrolling(true);
    try {
      await courseApi.enrollCourse({
        maKhoaHoc,
        taiKhoan: user.taiKhoan,
      });
      setIsEnrolled(true);
      setEnrollmentStatus("pending");
      alert("Đăng ký khóa học thành công! Vui lòng chờ duyệt.");
    } catch (error: any) {
      alert(error.response?.data?.message || "Đăng ký khóa học thất bại");
    } finally {
      setEnrolling(false);
    }
  };

  const handleCancelEnrollment = async () => {
    if (!maKhoaHoc || !user?.taiKhoan) return;
    if (!confirm("Bạn có chắc chắn muốn hủy đăng ký khóa học này?")) return;

    setEnrolling(true);
    try {
      await courseApi.cancelEnrollment({
        maKhoaHoc,
        taiKhoan: user.taiKhoan,
      });
      setIsEnrolled(false);
      setEnrollmentStatus("none");
      alert("Hủy đăng ký khóa học thành công!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Hủy đăng ký thất bại");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Không tìm thấy khóa học</p>
          <button
            onClick={() => navigate("/courses")}
            className="text-primary-600 hover:text-primary-700"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8 aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
              <CourseImage
                src={course.hinhAnh}
                alt={course.tenKhoaHoc}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {course.tenKhoaHoc}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {course.luotXem && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {course.luotXem} lượt xem
                    </span>
                  )}
                  {course.danhGia && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary-600 text-primary-600" />
                      {course.danhGia} đánh giá
                    </span>
                  )}
                  {course.ngayTao && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(course.ngayTao).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </div>
              </div>

              {course.moTa && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Mô tả khóa học
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {course.moTa}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    Miễn phí
                  </div>
                  <p className="text-sm text-gray-600">
                    Đăng ký ngay để bắt đầu học
                  </p>
                </div>

                {isEnrolled ? (
                  <>
                    {enrollmentStatus === "approved" && (
                      <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Đã được duyệt</span>
                        </div>
                        <p className="text-sm text-green-600">
                          Bạn có thể bắt đầu học ngay bây giờ
                        </p>
                      </div>
                    )}
                    {enrollmentStatus === "pending" && (
                      <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                        <div className="flex items-center gap-2 text-yellow-700 mb-2">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">Đang chờ duyệt</span>
                        </div>
                        <p className="text-sm text-yellow-600">
                          Vui lòng chờ admin duyệt đăng ký của bạn
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleCancelEnrollment}
                      disabled={enrolling}
                      className="w-full rounded-full border border-red-300 bg-red-50 px-6 py-3 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? "Đang xử lý..." : "Hủy đăng ký"}
                    </button>
                    {enrollmentStatus === "approved" && (
                      <Link
                        to="/my-courses"
                        className="mt-3 block w-full text-center rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                      >
                        Vào học ngay
                      </Link>
                    )}
                  </>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? "Đang xử lý..." : "Đăng ký khóa học"}
                  </button>
                )}

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-primary-600">✓</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Truy cập trọn đời
                      </div>
                      <div className="text-xs text-gray-600">
                        Học mọi lúc, mọi nơi
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary-600">✓</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Nội dung chất lượng
                      </div>
                      <div className="text-xs text-gray-600">
                        Được biên soạn bởi chuyên gia
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary-600">✓</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Hỗ trợ học viên
                      </div>
                      <div className="text-xs text-gray-600">
                        Đội ngũ hỗ trợ 24/7
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

// ==========================================
