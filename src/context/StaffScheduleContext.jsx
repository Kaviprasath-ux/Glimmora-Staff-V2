import { createContext, useContext, useState, useEffect } from 'react';
import { staffSchedule as initialSchedule } from '../data/staffSchedule';

const StaffScheduleContext = createContext();

export const useStaffSchedule = () => {
  const context = useContext(StaffScheduleContext);
  if (!context) {
    throw new Error('useStaffSchedule must be used within StaffScheduleProvider');
  }
  return context;
};

export const StaffScheduleProvider = ({ children }) => {
  const [schedule, setSchedule] = useState(() => {
    const savedSchedule = localStorage.getItem('glimmora_staff_schedule');
    return savedSchedule ? JSON.parse(savedSchedule) : initialSchedule;
  });

  useEffect(() => {
    localStorage.setItem('glimmora_staff_schedule', JSON.stringify(schedule));
  }, [schedule]);

  const clockIn = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);

    setSchedule(prev => ({
      ...prev,
      currentShift: {
        ...prev.currentShift,
        status: 'on_duty',
        clockInTime: timeString,
      }
    }));
  };

  const clockOut = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);

    setSchedule(prev => ({
      ...prev,
      currentShift: {
        ...prev.currentShift,
        status: 'completed',
        clockOutTime: timeString,
      }
    }));
  };

  const startBreak = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);

    setSchedule(prev => ({
      ...prev,
      currentShift: {
        ...prev.currentShift,
        status: 'on_break',
        breakStart: timeString,
      }
    }));
  };

  const endBreak = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);

    setSchedule(prev => ({
      ...prev,
      currentShift: {
        ...prev.currentShift,
        status: 'on_duty',
        breakEnd: timeString,
      }
    }));
  };

  const updateShiftStatus = (status) => {
    setSchedule(prev => ({
      ...prev,
      currentShift: {
        ...prev.currentShift,
        status,
      }
    }));
  };

  const getCurrentShiftStatus = () => {
    return schedule.currentShift.status;
  };

  const getWeeklyHours = () => {
    return schedule.totalHoursThisWeek;
  };

  const value = {
    schedule,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    updateShiftStatus,
    getCurrentShiftStatus,
    getWeeklyHours,
  };

  return (
    <StaffScheduleContext.Provider value={value}>
      {children}
    </StaffScheduleContext.Provider>
  );
};
