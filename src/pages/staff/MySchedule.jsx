import { useStaffSchedule } from '../../context/StaffScheduleContext';
import ShiftCard from '../../components/schedule/ShiftCard';
import ScheduleTable from '../../components/schedule/ScheduleTable';

const MySchedule = () => {
  const { schedule, getWeeklyHours } = useStaffSchedule();
  const weeklyHours = getWeeklyHours();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Schedule</h1>
        <p className="text-neutral-600">{weeklyHours} hours this week</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-neutral-900">{weeklyHours} hrs</div>
          <div className="text-sm text-neutral-600 mt-1">This Week</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-teal capitalize">
            {schedule.currentShift.status.replace('_', ' ')}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Current Status</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-neutral-900">{schedule.overtimeHours} hrs</div>
          <div className="text-sm text-neutral-600 mt-1">Overtime</div>
        </div>
      </div>

      {/* Current Shift */}
      <ShiftCard />

      {/* Weekly Schedule */}
      <ScheduleTable weeklySchedule={schedule.weeklySchedule} />
    </div>
  );
};

export default MySchedule;
