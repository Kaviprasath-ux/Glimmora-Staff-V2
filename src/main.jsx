import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { StaffNotificationsProvider } from './context/StaffNotificationsContext';
import { StaffScheduleProvider } from './context/StaffScheduleContext';
import { StaffTasksProvider } from './context/StaffTasksContext';
import { StaffRoomsProvider } from './context/StaffRoomsContext';
import { StaffMaintenanceProvider } from './context/StaffMaintenanceContext';
import { WorkOrdersProvider } from './context/WorkOrdersContext';
import { HousekeepingProvider } from './context/HousekeepingContext';
import { RunnerProvider } from './context/RunnerContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <StaffNotificationsProvider>
        <StaffScheduleProvider>
          <StaffTasksProvider>
            <StaffRoomsProvider>
              <StaffMaintenanceProvider>
                <WorkOrdersProvider>
                  <HousekeepingProvider>
                    <RunnerProvider>
                      <App />
                    </RunnerProvider>
                  </HousekeepingProvider>
                </WorkOrdersProvider>
              </StaffMaintenanceProvider>
            </StaffRoomsProvider>
          </StaffTasksProvider>
        </StaffScheduleProvider>
      </StaffNotificationsProvider>
    </AuthProvider>
  </StrictMode>
);
