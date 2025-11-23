import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const ScheduleTable = ({ weeklySchedule }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    scheduled: 'bg-yellow-100 text-yellow-700',
    off: 'bg-neutral-100 text-neutral-500',
  };

  const attendanceIcons = {
    present: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
    absent: <XCircleIcon className="h-5 w-5 text-red-600" />,
    scheduled: <ClockIcon className="h-5 w-5 text-yellow-500" />,
    off: <span className="text-neutral-400">-</span>,
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900">Weekly Schedule</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                Day
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                Shift
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                Hours
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 uppercase">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {weeklySchedule.map((day, index) => (
              <tr
                key={index}
                className={`${
                  day.status === 'in_progress' ? 'bg-neutral-50' : ''
                } hover:bg-neutral-50 transition-colors`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-neutral-900">{day.day}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                  {day.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                  {day.shift}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                  {day.startTime !== '-' ? `${day.startTime} - ${day.endTime}` : '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                  {day.hoursWorked > 0 ? `${day.hoursWorked} hrs` : '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs font-medium rounded ${
                      statusColors[day.status]
                    }`}
                  >
                    {day.status === 'in_progress'
                      ? 'In Progress'
                      : day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {attendanceIcons[day.attendance]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
