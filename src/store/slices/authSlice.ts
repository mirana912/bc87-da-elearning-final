// src/store/slices/authSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  authApi,
  type LoginRequest,
  type RegisterRequest,
} from "./../../services/api/authApi";

interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT?: string;
  maLoaiNguoiDung?: string;
  role?: string;
  maNhom?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem("token", response.data.accessToken);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerAsync = createAsyncThunk(
  "auth/register",
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const getCurrentUserAsync = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.user = payload.user || {
          taiKhoan: payload.taiKhoan || "",
          hoTen: payload.hoTen || "",
          email: payload.email || "",
          soDT: payload.soDT,
          maLoaiNguoiDung: payload.maLoaiNguoiDung,
          maNhom: payload.maNhom,
        };
        state.token = payload.accessToken || payload.token || "";
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        if (payload.user) {
          state.user = payload.user;
          state.token = payload.user.accessToken || "";
          state.isAuthenticated = true;
        }
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get current user
    builder
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.user = {
          taiKhoan: payload.taiKhoan || "",
          hoTen: payload.hoTen || "",
          email: payload.email || "",
          soDT: payload.soDT,
          maLoaiNguoiDung: payload.maLoaiNguoiDung,
          maNhom: payload.maNhom,
        };
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUserAsync.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("token");
      });
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// ==========================================
