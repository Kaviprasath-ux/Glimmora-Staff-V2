import { createContext, useContext, useState } from 'react';
import { maintenanceTasks } from '../data/maintenanceTasks';

const StaffMaintenanceContext = createContext(null);

export function StaffMaintenanceProvider({ children }) {
  const [workOrders, setWorkOrders] = useState(maintenanceTasks);

  return (
    <StaffMaintenanceContext.Provider value={{ workOrders, setWorkOrders }}>
      {children}
    </StaffMaintenanceContext.Provider>
  );
}

export function useStaffMaintenance() {
  const context = useContext(StaffMaintenanceContext);
  if (!context) {
    throw new Error('useStaffMaintenance must be used within a StaffMaintenanceProvider');
  }
  return context;
}

