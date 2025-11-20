import { useEffect, useState } from 'react';
import { ClockIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useStaffSchedule } from '../../context/StaffScheduleContext';

const ShiftCard = () => {
  const { schedule, clockIn, clockOut, startBreak, endBreak } = useStaffSchedule();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const shift = schedule.currentShift;

  const statusColors = {
    not_started: 'bg-neutral-100 text-neutral-700',
    on_duty: 'bg-teal/10 text-teal border-teal/30',
    on_break: 'bg-gold/10 text-deepgreen border-gold/30',
    completed: 'bg-deepgreen/10 text-deepgreen border-deepgreen/30',
  };

  const statusLabels = {
    not_started: 'Not Started',
    on_duty: 'On Duty',
    on_break: 'On Break',
    completed: 'Shift Completed',
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-serif font-semibold text-deepgreen">Current Shift</h3>
          <p className="text-sm text-neutral-600 mt-1">{formatDate(currentTime)}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{formatTime(currentTime)}</div>
        </div>
      </div>

      {/* Shift Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-neutral-50 rounded-lg">
          <div className="text-xs text-neutral-600 mb-1">Shift Type</div>
          <div className="font-semibold text-neutral-900">{shift.shift}</div>
        </div>
        <div className="p-4 bg-neutral-50 rounded-lg">
          <div className="text-xs text-neutral-600 mb-1">Scheduled Hours</div>
          <div className="font-semibold text-neutral-900">
            {shift.startTime} - {shift.endTime}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">Status</span>
          <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${statusColors[shift.status]}`}>
            {statusLabels[shift.status]}
          </span>
        </div>
      </div>

      {/* Clock In/Out Info */}
      <div className="space-y-3 mb-6">
        {shift.clockInTime && (
          <div className="flex items-center justify-between p-3 bg-teal/5 rounded-lg border border-teal/20">
            <div className="flex items-center text-sm">
              <CheckCircleIcon className="h-5 w-5 text-teal mr-2" />
              <span className="text-neutral-700">Clocked In</span>
            </div>
            <span className="font-semibold text-teal">{shift.clockInTime}</span>
          </div>
        )}

        {shift.breakStart && (
          <div className="flex items-center justify-between p-3 bg-gold/5 rounded-lg border border-gold/20">
            <div className="flex items-center text-sm">
              <ClockIcon className="h-5 w-5 text-gold mr-2" />
              <span className="text-neutral-700">Break Started</span>
            </div>
            <span className="font-semibold text-deepgreen">{shift.breakStart}</span>
          </div>
        )}

        {shift.breakEnd && (
          <div className="flex items-center justify-between p-3 bg-teal/5 rounded-lg border border-teal/20">
            <div className="flex items-center text-sm">
              <CheckCircleIcon className="h-5 w-5 text-teal mr-2" />
              <span className="text-neutral-700">Break Ended</span>
            </div>
            <span className="font-semibold text-teal">{shift.breakEnd}</span>
          </div>
        )}

        {shift.clockOutTime && (
          <div className="flex items-center justify-between p-3 bg-deepgreen/5 rounded-lg border border-deepgreen/20">
            <div className="flex items-center text-sm">
              <CheckCircleIcon className="h-5 w-5 text-deepgreen mr-2" />
              <span className="text-neutral-700">Clocked Out</span>
            </div>
            <span className="font-semibold text-deepgreen">{shift.clockOutTime}</span>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center text-sm text-neutral-600 mb-6 p-3 bg-neutral-50 rounded-lg">
        <MapPinIcon className="h-4 w-4 mr-2" />
        {shift.location}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {!shift.clockInTime && shift.status !== 'completed' && (
          <button
            onClick={clockIn}
            className="w-full px-4 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors font-medium"
          >
            Clock In
          </button>
        )}

        {shift.clockInTime && shift.status === 'on_duty' && !shift.clockOutTime && (
          <>
            <button
              onClick={startBreak}
              className="w-full px-4 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors font-medium"
            >
              Start Break
            </button>
            <button
              onClick={clockOut}
              className="w-full px-4 py-3 bg-deepgreen text-white rounded-lg hover:bg-deepgreen/90 transition-colors font-medium"
            >
              Clock Out
            </button>
          </>
        )}

        {shift.status === 'on_break' && (
          <button
            onClick={endBreak}
            className="w-full px-4 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors font-medium"
          >
            End Break
          </button>
        )}

        {shift.status === 'completed' && (
          <div className="text-center p-4 bg-deepgreen/10 rounded-lg border border-deepgreen/20">
            <CheckCircleIcon className="h-12 w-12 text-deepgreen mx-auto mb-2" />
            <p className="text-sm font-medium text-deepgreen">Shift Completed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftCard;
