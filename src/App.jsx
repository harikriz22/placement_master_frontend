import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPreview from './pages/DashboardPreview';
import PlaceholderPage from './pages/PlaceholderPage';
import StudentPage from './pages/StudentPage';

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
              <ProtectedRoute>
                <DashboardPreview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/batches"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Batches Overview"
                  section="Batches Page"
                  description="Browse courses, then select a batch to view its students, metrics, and eligibility summary."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/batch-switch"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Batch Switch Audit Log"
                  section="Batch Switch Page"
                  description="Table of all student batch switches, newest first, with previous and new batch tracking."
                />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
