import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from './layouts/StaffLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Login Page
import Login from './pages/Login';

// Housekeeping Pages
import HousekeepingDashboard from './pages/housekeeping/Dashboard';
import HousekeepingRooms from './pages/housekeeping/Rooms';
import HousekeepingTasks from './pages/housekeeping/Tasks';
import RoomDetails from './pages/housekeeping/RoomDetails';

// Maintenance Pages
import MaintenanceDashboard from './pages/maintenance/Dashboard';
import WorkOrders from './pages/maintenance/WorkOrders';
import MaintenanceTasks from './pages/maintenance/MaintenanceTasks';
import EquipmentIssues from './pages/maintenance/EquipmentIssues';

// Runner Pages
import RunnerDashboard from './pages/runner/Dashboard';
import PickupRequests from './pages/runner/PickupRequests';
import Deliveries from './pages/runner/Deliveries';

// Common Pages
import Profile from './pages/profile/Profile';
import Notifications from './pages/notifications/Notifications';

// Auth-aware redirect component
const AuthRedirect = () => {
  const { isAuthenticated, user, loading, getDashboardPath } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/login" element={<Login />} />

        {/* Housekeeping Routes */}
        <Route
          path="/housekeeping/dashboard"
          element={
            <ProtectedRoute allowedRoles={['housekeeping']}>
              <StaffLayout>
                <HousekeepingDashboard />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/housekeeping"
          element={
            <ProtectedRoute allowedRoles={['housekeeping']}>
              <StaffLayout>
                <HousekeepingDashboard />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/housekeeping/rooms"
          element={
            <ProtectedRoute allowedRoles={['housekeeping']}>
              <StaffLayout>
                <HousekeepingRooms />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/housekeeping/rooms/:id"
          element={
            <ProtectedRoute allowedRoles={['housekeeping']}>
              <StaffLayout>
                <RoomDetails />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/housekeeping/tasks"
          element={
            <ProtectedRoute allowedRoles={['housekeeping']}>
              <StaffLayout>
                <HousekeepingTasks />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/housekeeping/notifications"
          element={
            <ProtectedRoute allowedRoles={['housekeeping']}>
              <StaffLayout>
                <Notifications />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/housekeeping/profile"
          element={
            <ProtectedRoute allowedRoles={['housekeeping']}>
              <StaffLayout>
                <Profile />
              </StaffLayout>
            </ProtectedRoute>
          }
        />

        {/* Maintenance Routes */}
        <Route
          path="/maintenance/dashboard"
          element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <StaffLayout>
                <MaintenanceDashboard />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <StaffLayout>
                <MaintenanceDashboard />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance/work-orders"
          element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <StaffLayout>
                <WorkOrders />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance/work-orders/:id"
          element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <StaffLayout>
                <WorkOrders />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance/tasks"
          element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <StaffLayout>
                <MaintenanceTasks />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance/equipment"
          element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <StaffLayout>
                <EquipmentIssues />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance/notifications"
          element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <StaffLayout>
                <Notifications />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance/profile"
          element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <StaffLayout>
                <Profile />
              </StaffLayout>
            </ProtectedRoute>
          }
        />

        {/* Runner Routes */}
        <Route
          path="/runner/dashboard"
          element={
            <ProtectedRoute allowedRoles={['runner']}>
              <StaffLayout>
                <RunnerDashboard />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/runner"
          element={
            <ProtectedRoute allowedRoles={['runner']}>
              <StaffLayout>
                <RunnerDashboard />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/runner/pickups"
          element={
            <ProtectedRoute allowedRoles={['runner']}>
              <StaffLayout>
                <PickupRequests />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/runner/deliveries"
          element={
            <ProtectedRoute allowedRoles={['runner']}>
              <StaffLayout>
                <Deliveries />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/runner/notifications"
          element={
            <ProtectedRoute allowedRoles={['runner']}>
              <StaffLayout>
                <Notifications />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/runner/profile"
          element={
            <ProtectedRoute allowedRoles={['runner']}>
              <StaffLayout>
                <Profile />
              </StaffLayout>
            </ProtectedRoute>
          }
        />

        {/* Shared Routes (accessible by all authenticated users) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['housekeeping', 'maintenance', 'runner']}>
              <StaffLayout>
                <Profile />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['housekeeping', 'maintenance', 'runner']}>
              <StaffLayout>
                <Notifications />
              </StaffLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Redirects */}
        <Route path="/" element={<AuthRedirect />} />
        <Route path="*" element={<AuthRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
