// src/hooks/useAuth.ts
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState, type AppDispatch } from "./../store/store/store";
import { loginAsync, registerAsync, logout } from "../store/slices/authSlice";
import {
  type LoginRequest,
  type RegisterRequest,
} from "../services/api/authApi";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: LoginRequest) => {
    const result = await dispatch(loginAsync(credentials));
    if (loginAsync.fulfilled.match(result)) {
      const payload = (result.payload ?? {}) as any;
      const foundUser = payload.user ?? payload;
      const role = foundUser?.role;
      if (role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/");
      }
    }
  };

  const register = async (userData: RegisterRequest) => {
    const result = await dispatch(registerAsync(userData));
    if (registerAsync.fulfilled.match(result)) {
      navigate("/");
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
  };
};

// ==========================================
