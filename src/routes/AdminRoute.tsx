// src/routes/AdminRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "./../store/store/store";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (user?.role !== 'admin') {
  //   return <Navigate to="/" replace />;
  // }

  return <>{children}</>;
};

export default AdminRoute;

// ==========================================
