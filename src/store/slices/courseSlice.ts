// src/store/slices/courseSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  courseApi,
  type Course,
  type CourseListParams,
} from "./../../services/api/courseApi";

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  total: 0,
  isLoading: false,
  error: null,
};

/**
 * Normalize payload to support different API shapes:
 * - { data: Course[], total: number }
 * - Course[]
 * - { items: Course[], total: number }
 */
const normalizeCourseListPayload = (
  payload: any
): { items: Course[]; total: number } => {
  if (!payload) return { items: [], total: 0 };

  // shape: { data: Course[], total: number }
  if (payload.data && Array.isArray(payload.data)) {
    return {
      items: payload.data as Course[],
      total:
        typeof payload.total === "number" ? payload.total : payload.data.length,
    };
  }

  // direct array
  if (Array.isArray(payload)) {
    return { items: payload as Course[], total: payload.length };
  }

  // other shape: { items: Course[], total }
  if (payload.items && Array.isArray(payload.items)) {
    return {
      items: payload.items as Course[],
      total:
        typeof payload.total === "number"
          ? payload.total
          : payload.items.length,
    };
  }

  return { items: [], total: 0 };
};

export const getCoursesAsync = createAsyncThunk<
  any, // fulfilled return type (normalize later)
  CourseListParams,
  { rejectValue: string }
>(
  "course/getCourses",
  async (params: CourseListParams, { rejectWithValue }) => {
    try {
      const response = await courseApi.getCourses(params);
      // return whatever the API returned (response.data or response)
      return response.data ?? response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch courses"
      );
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCoursesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCoursesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const { items, total } = normalizeCourseListPayload(action.payload);
        state.courses = items;
        state.total = total;
      })
      .addCase(getCoursesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default courseSlice.reducer;
