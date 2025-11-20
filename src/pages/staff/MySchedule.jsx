import { useStaffSchedule } from '../../context/StaffScheduleContext';
import ShiftCard from '../../components/schedule/ShiftCard';
import ScheduleTable from '../../components/schedule/ScheduleTable';
import { ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const MySchedule = () => {
  const { schedule, getWeeklyHours } = useStaffSchedule();
  const weeklyHours = getWeeklyHours();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-deepgreen">My Schedule</h1>
        <p className="text-neutral-600 mt-1">View your shifts and manage attendance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-neutral-600 text-sm">This Week</div>
            <CalendarDaysIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">{weeklyHours} hrs</div>
          <div className="text-xs text-neutral-500 mt-1">Total hours worked</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-neutral-600 text-sm">Current Status</div>
            <ClockIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-teal capitalize">
            {schedule.currentShift.status.replace('_', ' ')}
          </div>
          <div className="text-xs text-neutral-500 mt-1">{schedule.currentShift.shift}</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-neutral-600 text-sm">Overtime</div>
            <ClockIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">{schedule.overtimeHours} hrs</div>
          <div className="text-xs text-neutral-500 mt-1">This week</div>
        </div>
      </div>

      {/* Current Shift Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ShiftCard />
        </div>

        {/* Quick Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-serif font-semibold text-deepgreen mb-4">
              Shift Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <span className="text-neutral-700">Today's Shift</span>
                <span className="font-semibold text-neutral-900">
                  {schedule.currentShift.shift}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <span className="text-neutral-700">Scheduled Hours</span>
                <span className="font-semibold text-neutral-900">
                  {schedule.currentShift.startTime} - {schedule.currentShift.endTime}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <span className="text-neutral-700">Location</span>
                <span className="font-semibold text-neutral-900">
                  {schedule.currentShift.location}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <span className="text-neutral-700">Date</span>
                <span className="font-semibold text-neutral-900">
                  {new Date(schedule.currentShift.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-beige/20 border border-beige/30 rounded-xl p-6">
            <h4 className="font-semibold text-deepgreen mb-3">Attendance Tips</h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Always clock in at the start of your shift</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Remember to clock out for breaks and at end of shift</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Report any schedule conflicts to your supervisor</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Table */}
      <ScheduleTable weeklySchedule={schedule.weeklySchedule} />
    </div>
  );
};

export default MySchedule;
