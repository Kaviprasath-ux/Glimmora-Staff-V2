import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from './components/layout/StaffLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TasksPage from './pages/TasksPage';
import StaffSchedulePage from './pages/StaffSchedulePage';
import RoomsAssignedPage from './pages/RoomsAssignedPage';
import WorkOrdersPage from './pages/WorkOrdersPage';
import MaintenanceTasksPage from './pages/MaintenanceTasksPage';
import EquipmentIssuesPage from './pages/EquipmentIssuesPage';
import DeliveryTasksPage from './pages/DeliveryTasksPage';
import PickupRequestsPage from './pages/PickupRequestsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import MaintenanceDashboard from './pages/MaintenanceDashboard';
import WorkOrderDetails from './pages/WorkOrderDetails';
import HousekeepingOverview from './pages/housekeeping/Overview';
import RunnerDashboard from './pages/RunnerDashboard';
import RunnerTaskDetails from './pages/RunnerTaskDetails';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StaffLayout title="Dashboard">
                <Dashboard />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <StaffLayout title="My Tasks">
                <TasksPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <StaffLayout title="My Schedule">
                <StaffSchedulePage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <StaffLayout title="My Rooms">
                <RoomsAssignedPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/housekeeping"
          element={
            <ProtectedRoute>
              <StaffLayout title="Housekeeping Dashboard">
                <HousekeepingOverview />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/work-orders"
          element={
            <ProtectedRoute>
              <StaffLayout title="Work Orders">
                <WorkOrdersPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <StaffLayout title="Maintenance Dashboard">
                <MaintenanceDashboard />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance/:id"
          element={
            <ProtectedRoute>
              <StaffLayout title="Work Order Details">
                <WorkOrderDetails />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance-tasks"
          element={
            <ProtectedRoute>
              <StaffLayout title="Maintenance Tasks">
                <MaintenanceTasksPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment-issues"
          element={
            <ProtectedRoute>
              <StaffLayout title="Equipment Issues">
                <EquipmentIssuesPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery-tasks"
          element={
            <ProtectedRoute>
              <StaffLayout title="Delivery Tasks">
                <DeliveryTasksPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pickup-requests"
          element={
            <ProtectedRoute>
              <StaffLayout title="Pickup Requests">
                <PickupRequestsPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <StaffLayout title="Notifications">
                <NotificationsPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <StaffLayout title="My Profile">
                <ProfilePage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/runner"
          element={
            <ProtectedRoute>
              <StaffLayout title="Runner Dashboard">
                <RunnerDashboard />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/runner/tasks/:id"
          element={
            <ProtectedRoute>
              <StaffLayout title="Task Details">
                <RunnerTaskDetails />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
