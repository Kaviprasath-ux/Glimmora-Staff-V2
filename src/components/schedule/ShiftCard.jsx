import { useEffect, useState } from 'react';
import { MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
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
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-1">Current Shift</h2>
          <p className="text-sm text-neutral-600">{formatDate(currentTime)}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-neutral-900">{formatTime(currentTime)}</div>
          <span className={`inline-block px-3 py-1 rounded text-xs font-medium mt-2 ${
            shift.status === 'on_duty' ? 'bg-green-600 text-white' :
            shift.status === 'on_break' ? 'bg-yellow-500 text-white' :
            shift.status === 'completed' ? 'bg-blue-500 text-white' :
            'bg-neutral-100 text-neutral-700'
          }`}>
            {statusLabels[shift.status]}
          </span>
        </div>
      </div>

      {/* Shift Info */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-neutral-50 rounded">
          <div className="text-xs text-neutral-600 mb-1">Shift</div>
          <div className="font-semibold text-neutral-900">{shift.shift}</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded">
          <div className="text-xs text-neutral-600 mb-1">Hours</div>
          <div className="font-semibold text-neutral-900">
            {shift.startTime} - {shift.endTime}
          </div>
        </div>
        <div className="p-3 bg-neutral-50 rounded">
          <div className="text-xs text-neutral-600 mb-1">Location</div>
          <div className="font-semibold text-neutral-900 flex items-center">
            <MapPinIcon className="h-3.5 w-3.5 mr-1" />
            {shift.location}
          </div>
        </div>
      </div>

      {/* Time Logs */}
      {(shift.clockInTime || shift.breakStart || shift.breakEnd || shift.clockOutTime) && (
        <div className="space-y-2 mb-6">
          {shift.clockInTime && (
            <div className="flex items-center justify-between text-sm py-2 border-b border-neutral-200">
              <span className="text-neutral-600">Clocked In</span>
              <span className="font-medium text-neutral-900">{shift.clockInTime}</span>
            </div>
          )}
          {shift.breakStart && (
            <div className="flex items-center justify-between text-sm py-2 border-b border-neutral-200">
              <span className="text-neutral-600">Break Start</span>
              <span className="font-medium text-neutral-900">{shift.breakStart}</span>
            </div>
          )}
          {shift.breakEnd && (
            <div className="flex items-center justify-between text-sm py-2 border-b border-neutral-200">
              <span className="text-neutral-600">Break End</span>
              <span className="font-medium text-neutral-900">{shift.breakEnd}</span>
            </div>
          )}
          {shift.clockOutTime && (
            <div className="flex items-center justify-between text-sm py-2">
              <span className="text-neutral-600">Clocked Out</span>
              <span className="font-medium text-neutral-900">{shift.clockOutTime}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        {!shift.clockInTime && shift.status !== 'completed' && (
          <button
            onClick={clockIn}
            className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Clock In
          </button>
        )}

        {shift.clockInTime && shift.status === 'on_duty' && !shift.clockOutTime && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={startBreak}
              className="px-4 py-2.5 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors font-medium"
            >
              Start Break
            </button>
            <button
              onClick={clockOut}
              className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Clock Out
            </button>
          </div>
        )}

        {shift.status === 'on_break' && (
          <button
            onClick={endBreak}
            className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            End Break
          </button>
        )}

        {shift.status === 'completed' && (
          <div className="text-center py-4">
            <CheckCircleIcon className="h-10 w-10 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-700">Shift Completed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftCard;
