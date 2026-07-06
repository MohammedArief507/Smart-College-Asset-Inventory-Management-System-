import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PageLoader from "@/components/common/PageLoader";

const LoginPage            = lazy(() => import("@/pages/auth/LoginPage"));
const ForgotPasswordPage   = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage    = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const DashboardPage        = lazy(() => import("@/pages/dashboard/DashboardPage"));
const UsersPage            = lazy(() => import("@/pages/users/UsersPage"));
const DepartmentsPage      = lazy(() => import("@/pages/departments/DepartmentsPage"));
const LaboratoriesPage     = lazy(() => import("@/pages/labs/LaboratoriesPage"));
const AssetsPage           = lazy(() => import("@/pages/assets/AssetsPage"));
const RequestsPage         = lazy(() => import("@/pages/requests/RequestsPage"));
const ReportsPage          = lazy(() => import("@/pages/reports/ReportsPage"));
const NotificationsPage    = lazy(() => import("@/pages/notifications/NotificationsPage"));
const ActivityLogsPage     = lazy(() => import("@/pages/activity/ActivityLogsPage"));
const NotFoundPage         = lazy(() => import("@/pages/errors/NotFoundPage"));
const ForbiddenPage        = lazy(() => import("@/pages/errors/ForbiddenPage"));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login"                 element={<LoginPage />} />
            <Route path="/forgot-password"       element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"     element={<DashboardPage />} />
              <Route path="/users"         element={<UsersPage />} />
              <Route path="/departments"   element={<DepartmentsPage />} />
              <Route path="/laboratories"  element={<LaboratoriesPage />} />
              <Route path="/assets"        element={<AssetsPage />} />
              <Route path="/requests"      element={<RequestsPage />} />
              <Route path="/reports"       element={<ReportsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/activity-logs" element={<ActivityLogsPage />} />
            </Route>

            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/"    element={<Navigate to="/dashboard" replace />} />
            <Route path="*"    element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;