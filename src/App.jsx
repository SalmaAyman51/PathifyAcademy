import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AcademicBot from './components/AcademicBot';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import ProfessorLayout from './layouts/ProfessorLayout'; // ADDED

// Shared Pages
import Welcome from './pages/Welcome';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminOverview from './pages/admin/Overview';
import AdminStudents from './pages/admin/Students';
import AdminProfessors from './pages/admin/Professors';
import AdminCourses from './pages/admin/Courses';
import AdminProjects from './pages/admin/Projects';
import AdminEnrollments from './pages/admin/Enrollments';
import AdminProfile from './pages/admin/Profile';

// --- NEWLY ADDED ADMIN PAGES ---
import PendingAccounts from './pages/admin/PendingAccounts';
import PendingProjects from './pages/admin/PendingProjects';

// SuperAdmin
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentProjects from './pages/student/Projects';
import StudentProfile from './pages/student/Profile';

// Professor Pages (NEW)
import InternalProfessor from './pages/professor/InternalProfessor';
import ExternalProfessor from './pages/professor/ExternalProfessor';
import ProfessorProfile from './pages/professor/Profile';

// Auth Flow Pages
import ForgotPassword from './pages/login/ForgotPassword';
import VerifyCode from './pages/login/VerifyCode';
import ResetPassword from './pages/login/ResetPassword';

// Redirect helper
import { useAuth } from './context/AuthContext';

const isProfessor = (role) =>
  role === 'professor' || role === 'internalprofessor' || role === 'externalprofessor';

const NavigateToDashboard = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/welcome" replace />;

  if (user.role === 'superadmin') return <Navigate to="/superadmin/dashboard" replace />;

  if (isProfessor(user.role)) {
    return (
      <Navigate
        to={user.role === 'externalprofessor' ? '/professor/external' : '/professor/internal'}
        replace
      />
    );
  }
  return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
};

const ProfessorIndexRedirect = () => {
  const { user } = useAuth();
  return (
    <Navigate to={user?.role === 'externalprofessor' ? 'external' : 'internal'} replace />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Root Redirect */}
          <Route path="/" element={<NavigateToDashboard />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="professors" element={<AdminProfessors />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="enrollments" element={<AdminEnrollments />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="pending-accounts" element={<PendingAccounts />} />
            <Route path="pending-projects" element={<PendingProjects />} />
          </Route>

          {/* SuperAdmin */}
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />

          {/* Professor Routes (NEWLY ADDED) */}
          <Route 
            path="/professor" 
            element={
              <ProtectedRoute allowedRoles={['professor', 'internalprofessor', 'externalprofessor', 'admin']}>
  <ProfessorLayout />
</ProtectedRoute>
            }
          >
           <Route index element={<ProfessorIndexRedirect />} />
            <Route path="internal" element={<InternalProfessor />} />
            <Route path="external" element={<ExternalProfessor />} />
            <Route path="profile" element={<ProfessorProfile />} />
          </Route>

          {/* Student Routes */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
                <AcademicBot />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="projects" element={<StudentProjects />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}