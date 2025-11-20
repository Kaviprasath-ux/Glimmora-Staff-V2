import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const ScheduleTable = ({ weeklySchedule }) => {
  const statusColors = {
    completed: 'bg-deepgreen/10 text-deepgreen',
    in_progress: 'bg-teal/10 text-teal',
    scheduled: 'bg-beige/20 text-neutral-700',
    off: 'bg-neutral-100 text-neutral-500',
  };

  const attendanceIcons = {
    present: <CheckCircleIcon className="h-5 w-5 text-deepgreen" />,
    absent: <XCircleIcon className="h-5 w-5 text-red-600" />,
    scheduled: <ClockIcon className="h-5 w-5 text-neutral-400" />,
    off: <span className="text-neutral-400">-</span>,
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h3 className="text-xl font-serif font-semibold text-deepgreen">Weekly Schedule</h3>
        <p className="text-sm text-neutral-600 mt-1">Your shift schedule for this week</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Shift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {weeklySchedule.map((day, index) => (
              <tr
                key={index}
                className={`${
                  day.status === 'in_progress' ? 'bg-teal/5' : 'hover:bg-neutral-50'
                } transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-neutral-900">{day.day}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {day.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {day.shift}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {day.startTime !== '-' ? `${day.startTime} - ${day.endTime}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {day.hoursWorked > 0 ? `${day.hoursWorked} hrs` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-lg ${
                      statusColors[day.status]
                    }`}
                  >
                    {day.status === 'in_progress'
                      ? 'In Progress'
                      : day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
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
