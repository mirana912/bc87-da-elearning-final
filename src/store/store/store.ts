// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './../slices/authSlice';
import userReducer from './../slices/userSlice';
import courseReducer from './../slices/courseSlice';
import enrollmentReducer from './../slices/enrollmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    course: courseReducer,
    enrollment: enrollmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ==========================================