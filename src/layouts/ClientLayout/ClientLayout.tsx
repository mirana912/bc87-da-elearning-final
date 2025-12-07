// src/layouts/ClientLayout/ClientLayout.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import type { RootState } from '../../store/store/store';

const ClientLayout = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold tracking-tight text-gray-900">
            E-Learning
          </Link>
          
          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <Link to="/courses" className="hover:text-gray-900 transition-colors">
              Khóa học
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-courses" className="hover:text-gray-900 transition-colors">
                  Khóa học của tôi
                </Link>
                <Link to="/profile" className="hover:text-gray-900 transition-colors">
                  Hồ sơ
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="hidden items-center gap-3 md:flex hover:opacity-80 transition-opacity"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.hoTen}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-medium text-sm">
                      {(user?.hoTen || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-gray-50 mt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">E-Learning</h3>
              <p className="text-sm text-gray-600">
                Học tập trực tuyến với các khóa học chất lượng cao.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Khóa học</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/courses" className="hover:text-gray-900">Tất cả khóa học</Link></li>
                <li><Link to="/courses" className="hover:text-gray-900">Khóa học mới</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Trợ giúp</a></li>
                <li><a href="#" className="hover:text-gray-900">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Tài khoản</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {isAuthenticated ? (
                  <>
                    <li><Link to="/my-courses" className="hover:text-gray-900">Khóa học của tôi</Link></li>
                    <li><button onClick={handleLogout} className="hover:text-gray-900">Đăng xuất</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className="hover:text-gray-900">Đăng nhập</Link></li>
                    <li><Link to="/register" className="hover:text-gray-900">Đăng ký</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 E-Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;

// ==========================================

