// src/App.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUserAsync } from './store/slices/authSlice';
import { type AppDispatch } from './store/store/store';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUserAsync());
    }
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;

// ==========================================