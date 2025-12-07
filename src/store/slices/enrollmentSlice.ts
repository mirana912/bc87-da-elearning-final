// src/store/slices/enrollmentSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface EnrollmentState {
  enrollments: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  isLoading: false,
  error: null,
};

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {},
});

export default enrollmentSlice.reducer;