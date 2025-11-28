import { useHousekeeping } from '../../context/HousekeepingContext';

export default function StaffEfficiencyCard({ compact = false }) {
  const { housekeepingStaff, calculateStaffEfficiency, rooms } = useHousekeeping();

  const staffWithStats = housekeepingStaff.map(staff => {
    const efficiency = calculateStaffEfficiency(staff.id);
    const activeRooms = rooms.filter(
      r => r.assignedTo === staff.id && r.status === 'inprogress'
    ).length;
    const todayCompleted = rooms.filter(
      r => r.assignedTo === staff.id &&
        (r.status === 'clean' || r.status === 'inspected') &&
        r.completedAt &&
        new Date(r.completedAt).toDateString() === new Date().toDateString()
    ).length;

    return {
      ...staff,
      efficiency: efficiency?.avgEfficiency || staff.efficiency,
      onTimeRate: efficiency?.onTimeRate || 100,
      roomsCleaned: efficiency?.roomsCleaned || 0,
      vipHandled: efficiency?.vipHandled || 0,
      activeRooms,
      todayCompleted,
    };
  }).sort((a, b) => b.efficiency - a.efficiency);

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return 'text-green-600 bg-green-50';
    if (efficiency >= 70) return 'text-[#CDB261] bg-[#CDB261]/10';
    return 'text-red-600 bg-red-50';
  };

  if (compact) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-semibold text-[#4E5840] mb-3">Staff Efficiency</h3>
        <div className="space-y-2">
          {staffWithStats.slice(0, 4).map((staff, index) => (
            <div key={staff.id} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-[#A57865]/20 flex items-center justify-center text-xs font-medium text-[#A57865]">
                {index + 1}
              </span>
              <span className="flex-1 text-sm text-[#4E5840] truncate">{staff.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEfficiencyColor(staff.efficiency)}`}>
                {staff.efficiency}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-[#4E5840]">Staff Efficiency Table</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left text-xs font-medium text-[#6B6F63] px-4 py-2">Staff</th>
              <th className="text-center text-xs font-medium text-[#6B6F63] px-4 py-2">Today</th>
              <th className="text-center text-xs font-medium text-[#6B6F63] px-4 py-2">Efficiency</th>
              <th className="text-center text-xs font-medium text-[#6B6F63] px-4 py-2">On Time</th>
              <th className="text-center text-xs font-medium text-[#6B6F63] px-4 py-2">VIP</th>
              <th className="text-center text-xs font-medium text-[#6B6F63] px-4 py-2">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {staffWithStats.map((staff) => (
              <tr key={staff.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#A57865]/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-[#A57865]">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[#4E5840]">{staff.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-[#4E5840]">{staff.todayCompleted}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getEfficiencyColor(staff.efficiency)}`}>
                    {staff.efficiency}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-sm ${staff.onTimeRate >= 80 ? 'text-green-600' : 'text-[#CDB261]'}`}>
                    {staff.onTimeRate}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-[#4E5840]">{staff.vipHandled}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  {staff.activeRooms > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#CDB261]/20 text-[#CDB261]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CDB261] animate-pulse" />
                      {staff.activeRooms}
                    </span>
                  ) : (
                    <span className="text-xs text-[#6B6F63]">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
