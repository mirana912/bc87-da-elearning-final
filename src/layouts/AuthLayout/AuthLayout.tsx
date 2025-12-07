// src/layouts/AuthLayout/AuthLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from './../../store/store/store';

const AuthLayout = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // If already logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

// ==========================================