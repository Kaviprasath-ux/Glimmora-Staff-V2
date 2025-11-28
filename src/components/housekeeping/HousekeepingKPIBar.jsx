export default function HousekeepingKPIBar({ kpis }) {
  const {
    dirty = 0,
    inProgress = 0,
    clean = 0,
    inspected = 0,
    vipRooms = 0,
    deepCleanDue = 0,
    avgCleaningTime = 0,
    minibarRevenue = 0,
  } = kpis || {};

  const stats = [
    {
      label: 'Dirty',
      value: dirty,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      highlight: dirty > 0,
    },
    {
      label: 'In Progress',
      value: inProgress,
      color: 'bg-[#CDB261]',
      textColor: 'text-[#CDB261]',
    },
    {
      label: 'Clean',
      value: clean,
      color: 'bg-[#5C9BA4]',
      textColor: 'text-[#5C9BA4]',
    },
    {
      label: 'Inspected',
      value: inspected,
      color: 'bg-[#4E5840]',
      textColor: 'text-[#4E5840]',
    },
    {
      label: 'VIP Rooms',
      value: vipRooms,
      color: 'bg-[#CDB261]',
      textColor: 'text-[#CDB261]',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      label: 'Deep Clean Due',
      value: deepCleanDue,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      highlight: deepCleanDue > 0,
    },
    {
      label: 'Avg Clean Time',
      value: `${avgCleaningTime}m`,
      color: 'bg-[#A57865]',
      textColor: 'text-[#A57865]',
    },
    {
      label: 'Minibar Revenue',
      value: `$${minibarRevenue}`,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white border rounded-xl shadow-sm p-3 ${
            stat.highlight ? 'border-red-300 bg-red-50/30' : 'border-neutral-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-8 rounded-full ${stat.color}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-[10px] text-[#6B6F63] font-medium truncate">{stat.label}</p>
                {stat.icon && <span className={stat.textColor}>{stat.icon}</span>}
              </div>
              <p className={`text-lg font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
