// src/pages/admin/QuanLyKhoaHoc/QuanLyKhoaHoc.tsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { courseApi, type Course } from '../../../services/api/courseApi';
import type { RootState } from '../../../store/store/store';

const QuanLyKhoaHoc = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    maKhoaHoc: '',
    tenKhoaHoc: '',
    moTa: '',
    maDanhMucKhoaHoc: '',
    maNhom: 'GP01',
  });

  useEffect(() => {
    loadCategories();
    loadCourses();
  }, [searchTerm, selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await courseApi.getCategories();
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
      console.log('Loaded categories:', categoriesData);
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
      } else {
        const params: any = { MaNhom: 'GP01' };
        if (searchTerm) params.tenKhoaHoc = searchTerm;
        response = await courseApi.getCourses(params);
      }
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setFormData({
      maKhoaHoc: '',
      tenKhoaHoc: '',
      moTa: '',
      maDanhMucKhoaHoc: '',
      maNhom: 'GP01',
      luotXem: 0,
      danhGia: 0,
      hinhAnh: '',
      biDanh: '',
      taiKhoanNguoiTao: user?.taiKhoan || '',
    });
    setShowModal(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      ...course,
      maNhom: course.maNhom || 'GP01',
    });
    setShowModal(true);
  };

  const handleDelete = async (maKhoaHoc: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
    try {
      await courseApi.deleteCourse(maKhoaHoc);
      loadCourses();
    } catch (error) {
      alert('Xóa khóa học thất bại');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.maKhoaHoc?.trim()) {
      alert('Vui lòng nhập mã khóa học');
      return;
    }
    if (!formData.tenKhoaHoc?.trim()) {
      alert('Vui lòng nhập tên khóa học');
      return;
    }
    if (!formData.maDanhMucKhoaHoc?.trim()) {
      alert('Vui lòng chọn danh mục khóa học');
      return;
    }
    if (!user?.taiKhoan) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    // Format ngày theo định dạng yyyy-MM-ddTHH:mm:ss
    const now = new Date();
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const biDanhValue = formData.biDanh?.trim() ||
      formData.tenKhoaHoc.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // Tạo payload với đầy đủ các trường theo schema
    const payload: Course = {
      maKhoaHoc: formData.maKhoaHoc.trim(),
      biDanh: biDanhValue,
      tenKhoaHoc: formData.tenKhoaHoc.trim(),
      moTa: formData.moTa?.trim() || '',
      luotXem: 0,
      danhGia: 0,
      hinhAnh: formData.hinhAnh?.trim() || '',
      maNhom: formData.maNhom || 'GP01',
      ngayTao: editingCourse ? (formData.ngayTao || formatDate(now)) : formatDate(now),
      maDanhMucKhoaHoc: formData.maDanhMucKhoaHoc.trim(),
      taiKhoanNguoiTao: user.taiKhoan,
    };

    console.log('Creating course with payload:', JSON.stringify({ kh: payload }, null, 2));
    console.log('Categories available:', categories);
    console.log('Selected category:', formData.maDanhMucKhoaHoc);

    try {
      if (editingCourse) {
        await courseApi.updateCourse(payload);
        alert('Cập nhật khóa học thành công!');
      } else {
        const response = await courseApi.createCourse(payload);
        console.log('Create course response:', response);
        alert('Tạo khóa học thành công!');
      }
      setShowModal(false);
      loadCourses();
    } catch (error: any) {
      console.error('Error creating/updating course:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Payload sent:', JSON.stringify({ kh: payload }, null, 2));

      let errorMessage = 'Thao tác thất bại';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Lỗi: ${errorMessage}\n\nVui lòng kiểm tra console để xem chi tiết.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Thêm khóa học
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                {cat.tenDanhMuc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã khóa học</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên khóa học</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lượt xem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.maKhoaHoc} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.maKhoaHoc}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.tenKhoaHoc}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{course.moTa || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.luotXem || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.danhGia || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(course.maKhoaHoc)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {courses.length === 0 && (
              <div className="p-8 text-center text-gray-500">Không có dữ liệu</div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingCourse ? 'Sửa khóa học' : 'Thêm khóa học'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã khóa học</label>
                <input
                  type="text"
                  required
                  value={formData.maKhoaHoc}
                  onChange={(e) => setFormData({ ...formData, maKhoaHoc: e.target.value })}
                  disabled={!!editingCourse}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên khóa học</label>
                <input
                  type="text"
                  required
                  value={formData.tenKhoaHoc}
                  onChange={(e) => setFormData({ ...formData, tenKhoaHoc: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.moTa || ''}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.maDanhMucKhoaHoc || ''}
                  onChange={(e) => setFormData({ ...formData, maDanhMucKhoaHoc: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                      {cat.tenDanhMuc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingCourse ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyKhoaHoc;

// ==========================================

