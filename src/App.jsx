import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from './layouts/StaffLayout';
import Tasks from './pages/staff/Tasks';
import MySchedule from './pages/staff/MySchedule';
import Rooms from './pages/staff/Rooms';
import Notifications from './pages/staff/Notifications';
import Profile from './pages/staff/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /staff/tasks */}
        <Route path="/" element={<Navigate to="/staff/tasks" replace />} />

        {/* Staff Routes */}
        <Route
          path="/staff/tasks"
          element={
            <StaffLayout>
              <Tasks />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/schedule"
          element={
            <StaffLayout>
              <MySchedule />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/rooms"
          element={
            <StaffLayout>
              <Rooms />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/notifications"
          element={
            <StaffLayout>
              <Notifications />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/profile"
          element={
            <StaffLayout>
              <Profile />
            </StaffLayout>
          }
        />

        {/* Catch all - redirect to tasks */}
        <Route path="*" element={<Navigate to="/staff/tasks" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
