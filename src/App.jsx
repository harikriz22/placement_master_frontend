import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPreview from './pages/DashboardPreview';
import StudentPage from './pages/StudentPage';
import BatchPage from './pages/BatchPage';
import CourseStudentsPage from './pages/CourseStudentsPage';
import BatchSwitchPage from './pages/BatchSwitchPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
              <DashboardPreview />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              // <ProtectedRoute>
              <StudentPage />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/batches"
            element={
              // <ProtectedRoute>
              <BatchPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/batches/:course"
            element={
              // <ProtectedRoute>
              <CourseStudentsPage />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/batch-switch"
            element={
              // <ProtectedRoute>
              <BatchSwitchPage />
              // </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
