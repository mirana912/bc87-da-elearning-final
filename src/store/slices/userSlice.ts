// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  userApi,
  type User,
  type UserListParams,
} from "./../../services/api/userApi";

interface UserState {
  users: User[];
  currentUser: User | null;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  total: 0,
  isLoading: false,
  error: null,
};

/**
 * Helper: normalize payload payload to support different API shapes:
 * - API may return: { data: User[], total: number }
 * - or return: User[] directly
 * - or in single create/update return: { data: User } or User
 */
const normalizeListPayload = (
  payload: any
): { items: User[]; total: number } => {
  if (!payload) return { items: [], total: 0 };

  // case: { data: User[], total: number }
  if (Array.isArray(payload.data)) {
    return {
      items: payload.data as User[],
      total:
        typeof payload.total === "number" ? payload.total : payload.data.length,
    };
  }

  // case: direct array
  if (Array.isArray(payload)) {
    return { items: payload as User[], total: payload.length };
  }

  // unknown shape -> try to find array inside
  if (Array.isArray(payload.items)) {
    return {
      items: payload.items as User[],
      total:
        typeof payload.total === "number"
          ? payload.total
          : payload.items.length,
    };
  }

  return { items: [], total: 0 };
};

const normalizeSinglePayload = (payload: any): User | null => {
  if (!payload) return null;
  if (payload.data && typeof payload.data === "object")
    return payload.data as User;
  if (typeof payload === "object" && !Array.isArray(payload))
    return payload as User;
  return null;
};

// ---------------------------------------------
// Async thunks (use generic typing to allow rejectValue)
export const getUsersAsync = createAsyncThunk<
  // fulfilled return type (we allow any and normalize later)
  any,
  // arg type
  UserListParams,
  // thunkAPI config
  { rejectValue: string }
>("user/getUsers", async (params: UserListParams, { rejectWithValue }) => {
  try {
    const response = await userApi.getUsers(params);
    // return whatever the API returned (could be response.data or response)
    return response.data ?? response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});

export const createUserAsync = createAsyncThunk<
  any,
  Partial<User>,
  { rejectValue: string }
>("user/createUser", async (userData: Partial<User>, { rejectWithValue }) => {
  try {
    const response = await userApi.createUser(userData as any);
    return response.data ?? response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create user"
    );
  }
});

export const updateUserAsync = createAsyncThunk<
  any,
  { taiKhoan: string; data: Partial<User> },
  { rejectValue: string }
>("user/updateUser", async ({ taiKhoan, data }, { rejectWithValue }) => {
  try {
    // some APIs expect (id, data), some expect single object. Cast to any to be safe.
    const response = await (userApi.updateUser as any)(taiKhoan, data);
    return response.data ?? response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update user"
    );
  }
});

export const deleteUserAsync = createAsyncThunk<
  string, // fulfilled return type
  string, // arg type (taiKhoan)
  { rejectValue: string }
>("user/deleteUser", async (taiKhoan, { rejectWithValue }) => {
  try {
    await userApi.deleteUser(taiKhoan);
    return taiKhoan; // chỉ cần trả lại id/taiKhoan để reducer xóa
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete user"
    );
  }
});

// ---------------------------------------------
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get users
    builder
      .addCase(getUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // normalize payload to extract items & total
        const { items, total } = normalizeListPayload(action.payload);
        state.users = items;
        state.total = total;
      })
      .addCase(getUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create user
    builder.addCase(createUserAsync.fulfilled, (state, action) => {
      const newUser = normalizeSinglePayload(action.payload);
      if (newUser) {
        state.users.unshift(newUser);
        state.total = (state.total || 0) + 1;
      }
    });

    // Update user
    builder.addCase(updateUserAsync.fulfilled, (state, action) => {
      const updatedUser = normalizeSinglePayload(action.payload);
      if (!updatedUser) return;

      // use 'taiKhoan' as key (adapt if your API uses different key)
      const key = (updatedUser.taiKhoan ?? (updatedUser as any).id) as
        | string
        | undefined;
      if (!key) return;

      const index = state.users.findIndex(
        (u) => (u.taiKhoan ?? (u as any).id) === key
      );
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    });

    // Delete user
    builder.addCase(deleteUserAsync.fulfilled, (state, action) => {
      const taiKhoan = action.payload as string;
      state.users = state.users.filter(
        (u) => (u.taiKhoan ?? (u as any).id) !== taiKhoan
      );
      state.total = Math.max(0, (state.total || 0) - 1);
    });

    // handle rejections for create/update/delete
    builder
      .addCase(createUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
