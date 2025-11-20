export const staffSchedule = {
  currentShift: {
    date: "2025-11-20",
    shift: "Morning Shift",
    startTime: "07:00",
    endTime: "15:00",
    status: "on_duty",
    clockInTime: "07:02",
    clockOutTime: null,
    breakStart: null,
    breakEnd: null,
    location: "Housekeeping Department"
  },
  weeklySchedule: [
    {
      day: "Monday",
      date: "2025-11-17",
      shift: "Morning Shift",
      startTime: "07:00",
      endTime: "15:00",
      status: "completed",
      hoursWorked: "8.0",
      attendance: "present"
    },
    {
      day: "Tuesday",
      date: "2025-11-18",
      shift: "Morning Shift",
      startTime: "07:00",
      endTime: "15:00",
      status: "completed",
      hoursWorked: "8.0",
      attendance: "present"
    },
    {
      day: "Wednesday",
      date: "2025-11-19",
      shift: "Morning Shift",
      startTime: "07:00",
      endTime: "15:00",
      status: "completed",
      hoursWorked: "7.5",
      attendance: "present"
    },
    {
      day: "Thursday",
      date: "2025-11-20",
      shift: "Morning Shift",
      startTime: "07:00",
      endTime: "15:00",
      status: "in_progress",
      hoursWorked: "0",
      attendance: "present"
    },
    {
      day: "Friday",
      date: "2025-11-21",
      shift: "Morning Shift",
      startTime: "07:00",
      endTime: "15:00",
      status: "scheduled",
      hoursWorked: "0",
      attendance: "scheduled"
    },
    {
      day: "Saturday",
      date: "2025-11-22",
      shift: "Off",
      startTime: "-",
      endTime: "-",
      status: "off",
      hoursWorked: "0",
      attendance: "off"
    },
    {
      day: "Sunday",
      date: "2025-11-23",
      shift: "Off",
      startTime: "-",
      endTime: "-",
      status: "off",
      hoursWorked: "0",
      attendance: "off"
    }
  ],
  totalHoursThisWeek: 23.5,
  overtimeHours: 0
};
