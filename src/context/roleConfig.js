export const ROLE_CONFIG = {
  housekeeping: {
    name: 'Housekeeping Staff',
    showTasks: true,
    showRooms: true,
    showMaintenance: false,
    showRunnerTasks: false,
    showSchedule: true,
  },
  runner: {
    name: 'Runner',
    showTasks: true,
    showRooms: false,
    showMaintenance: false,
    showRunnerTasks: true,
    showSchedule: true,
  },
  maintenance: {
    name: 'Maintenance Technician',
    showTasks: true,
    showRooms: true,
    showMaintenance: true,
    showRunnerTasks: false,
    showSchedule: true,
  },
  frontdesk: {
    name: 'Front Desk Assistant',
    showTasks: true,
    showRooms: true,
    showMaintenance: false,
    showRunnerTasks: false,
    showSchedule: true,
  },
};
