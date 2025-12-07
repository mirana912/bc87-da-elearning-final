// src/pages/client/home/index.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, Eye, Target, GraduationCap, BookOpen } from "lucide-react";
import { courseApi, type Course } from "../../../services/api/courseApi";
import { userApi } from "../../../services/api/userApi";
import type { RootState } from "../../../store/store/store";
import { CourseImage } from "../../../components/common/CourseImage/CourseImage";

const Home = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeaturedCourses();
    if (isAuthenticated && user?.taiKhoan) {
      loadCurrentCourse();
    }
  }, [isAuthenticated, user]);

  const loadFeaturedCourses = async () => {
    setLoading(true);
    try {
      const response = await courseApi.getCourses({ MaNhom: "GP01" });
      const courses = Array.isArray(response.data) ? response.data : [];
      setFeaturedCourses(courses.slice(0, 6));
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentCourse = async () => {
    if (!user?.taiKhoan) return;
    try {
      const response = await userApi.getCoursesApproved(user.taiKhoan);
      const courses = Array.isArray(response.data) ? response.data : [];
      if (courses.length > 0) {
        setCurrentCourse(courses[0]);
      }
    } catch (error) {
      console.error("Error loading current course:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-6">
        <section className="flex flex-col gap-10 py-16 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-primary-600 font-medium">
              Học tập trực tuyến
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl">
              Học tập hiệu quả
              <br className="hidden md:block" /> với các khóa học chất lượng cao
            </h1>
            <p className="max-w-xl text-lg text-gray-600">
              Khám phá hàng ngàn khóa học được biên soạn bởi các chuyên gia hàng
              đầu, học mọi lúc mọi nơi với giao diện thân thiện và dễ sử dụng.
            </p>
            <div className="flex gap-3">
              <Link
                to="/courses"
                className="rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors shadow-sm"
              >
                Khám phá khóa học
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Đăng ký ngay
                </Link>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 pt-4">
              <div>
                <div className="text-base font-semibold text-gray-900">
                  4.8/5
                </div>
                <div>Đánh giá trung bình</div>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <div className="text-base font-semibold text-gray-900">
                  1000+
                </div>
                <div>Khóa học</div>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <div className="text-base font-semibold text-gray-900">
                  50k+
                </div>
                <div>Học viên</div>
              </div>
            </div>
          </div>
          <div className="flex-1 rounded-2xl border border-gray-200 bg-linear-to-br from-primary-50 to-white p-6 shadow-sm">
            {currentCourse && isAuthenticated ? (
              <>
                <div className="rounded-xl bg-primary-600 px-5 py-4 text-white shadow-lg">
                  <div className="text-sm text-primary-100">Đang học</div>
                  <div className="mt-2 text-lg font-semibold line-clamp-2">
                    {currentCourse.tenKhoaHoc}
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-primary-700">
                    <div className="h-2 w-3/4 rounded-full bg-white/90"></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-primary-100">
                    <span>Tiếp tục học</span>
                    <span>75%</span>
                  </div>
                </div>
                <Link
                  to={`/courses/${currentCourse.maKhoaHoc}`}
                  className="mt-6 block rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="font-semibold text-gray-900">
                    Tiếp tục khóa học này
                  </div>
                  <p className="mt-1 text-gray-500">Nhấp để xem chi tiết</p>
                </Link>
              </>
            ) : (
              <>
                <div className="rounded-xl bg-gray-900 px-5 py-4 text-white shadow-lg">
                  <div className="text-sm text-gray-300">Bắt đầu học ngay</div>
                  <div className="mt-2 text-lg font-semibold">
                    Đăng ký khóa học đầu tiên
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-gray-800">
                    <div className="h-2 w-1/4 rounded-full bg-white/80"></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-300">
                    <span>Sẵn sàng bắt đầu</span>
                    <span>0%</span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-gray-900 font-semibold">
                      Học mọi lúc
                    </div>
                    <p className="mt-2 text-gray-500">
                      Truy cập không giới hạn, học theo tốc độ của bạn.
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-gray-900 font-semibold">
                      Nội dung chất lượng
                    </div>
                    <p className="mt-2 text-gray-500">
                      Được biên soạn bởi các chuyên gia hàng đầu.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <section id="courses" className="border-t border-gray-200 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Khóa học nổi bật
              </h2>
              <p className="mt-2 text-gray-600">
                Các khóa học được yêu thích nhất
              </p>
            </div>
            <Link
              to="/courses"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Xem tất cả →
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <Link
                  key={course.maKhoaHoc}
                  to={`/courses/${course.maKhoaHoc}`}
                  className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <CourseImage
                      src={course.hinhAnh}
                      alt={course.tenKhoaHoc}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-500 mb-2">
                      <span>{course.maDanhMucKhoaHoc || "Khóa học"}</span>
                      {course.danhGia && (
                        <span className="flex items-center gap-1 text-primary-600">
                          <Star className="w-3 h-3 fill-primary-600" />
                          {course.danhGia}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                      {course.tenKhoaHoc}
                    </h3>
                    {course.moTa && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {course.moTa}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {course.luotXem && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {course.luotXem}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">
                        Xem chi tiết →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {featuredCourses.length === 0 && !loading && (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <p>Chưa có khóa học nào</p>
                </div>
              )}
            </div>
          )}
        </section>

        <section id="benefits" className="border-t border-gray-200 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-gray-600">
              Những lý do khiến hàng ngàn học viên tin tưởng
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Học tập linh hoạt",
                desc: "Học mọi lúc mọi nơi, theo tốc độ của riêng bạn với giao diện thân thiện và dễ sử dụng.",
              },
              {
                icon: GraduationCap,
                title: "Giảng viên chuyên nghiệp",
                desc: "Đội ngũ giảng viên giàu kinh nghiệm, luôn sẵn sàng hỗ trợ và giải đáp thắc mắc của bạn.",
              },
              {
                icon: BookOpen,
                title: "Nội dung chất lượng",
                desc: "Khóa học được biên soạn kỹ lưỡng, cập nhật thường xuyên với các kiến thức mới nhất.",
              },
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className="text-center space-y-4 p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="flex justify-center">
                    <IconComponent className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="cta" className="border-t border-gray-200 py-16">
          <div className="rounded-3xl border border-gray-200 bg-linear-to-br from-primary-50 to-white px-8 py-12 shadow-sm md:px-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.2em] text-primary-600 font-medium">
                  Sẵn sàng bắt đầu
                </p>
                <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  Bắt đầu hành trình học tập của bạn ngay hôm nay
                </h3>
                <p className="max-w-2xl text-gray-600">
                  Tham gia cùng hàng ngàn học viên đang học tập và phát triển kỹ
                  năng mỗi ngày. Khám phá các khóa học phù hợp với bạn và đạt
                  được mục tiêu học tập.
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/courses"
                  className="rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors shadow-sm whitespace-nowrap"
                >
                  Khám phá khóa học
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Đăng ký miễn phí
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
