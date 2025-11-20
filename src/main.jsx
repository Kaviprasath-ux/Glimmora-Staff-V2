import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { StaffTasksProvider } from './context/StaffTasksContext';
import { StaffScheduleProvider } from './context/StaffScheduleContext';
import { StaffNotificationsProvider } from './context/StaffNotificationsContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StaffNotificationsProvider>
      <StaffScheduleProvider>
        <StaffTasksProvider>
          <App />
        </StaffTasksProvider>
      </StaffScheduleProvider>
    </StaffNotificationsProvider>
  </StrictMode>
);
