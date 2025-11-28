import { createContext, useContext, useState } from 'react';
import { staffSchedule } from '../data/staffSchedule';

const StaffScheduleContext = createContext(null);

export function StaffScheduleProvider({ children }) {
  const [schedule, setSchedule] = useState(staffSchedule);

  return <StaffScheduleContext.Provider value={{ schedule, setSchedule }}>{children}</StaffScheduleContext.Provider>;
}

export function useStaffSchedule() {
  const context = useContext(StaffScheduleContext);
  if (!context) {
    throw new Error('useStaffSchedule must be used within a StaffScheduleProvider');
  }
  return context;
}

