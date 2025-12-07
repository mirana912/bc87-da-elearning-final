// src/pages/client/Courses/Courses.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import { courseApi, type Course } from '../../../services/api/courseApi';
import { CourseImage } from '../../../components/common/CourseImage/CourseImage';

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    loadCourses();
  }, [searchTerm, selectedCategory, page]);

    const loadCategories = async () => {
        try {
            const response = await courseApi.getCategories();
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

  const loadCourses = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedCategory) {
        response = await courseApi.getCoursesByCategory({
          maDanhMuc: selectedCategory,
          MaNhom: 'GP01',
        });
        setCourses(Array.isArray(response.data) ? response.data : []);
        setTotal(Array.isArray(response.data) ? response.data.length : 0);
      } else {
        const params: any = { MaNhom: 'GP01', page, pageSize };
        if (searchTerm) params.tenKhoaHoc = searchTerm;
        response = await courseApi.getCoursesPaginated(params);
        const data = response.data;
        setCourses(Array.isArray(data?.items || data) ? (data.items || data) : []);
        setTotal(data?.totalCount || data?.total || 0);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Khóa học</h1>
                    <p className="text-gray-600">Khám phá các khóa học phù hợp với bạn</p>
                </div>

                <div className="mb-8 flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 md:w-64"
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((cat) => (
                            <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                                {cat.tenDanhMuc}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <Link
                                key={course.maKhoaHoc}
                                to={`/courses/${course.maKhoaHoc}`}
                                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="mb-4 aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
                                    <CourseImage
                                        src={course.hinhAnh}
                                        alt={course.tenKhoaHoc}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-500">
                                        <span>{course.maDanhMucKhoaHoc || 'Khóa học'}</span>
                                        {course.danhGia && (
                                            <span className="flex items-center gap-1 text-primary-600">
                                                <Star className="w-3 h-3 fill-primary-600" />
                                                {course.danhGia}
                                            </span>
                                        )}
                                    </div>
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
                                                    {course.luotXem} lượt xem
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
                    </div>
                )}

        {!loading && courses.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-500">Không tìm thấy khóa học nào.</p>
          </div>
        )}

        {!selectedCategory && total > pageSize && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Trang {page} / {Math.ceil(total / pageSize)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / pageSize)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;

// ==========================================

