export default function KPIBar({ kpis }) {
  const {
    total = 0,
    new: newCount = 0,
    inprogress = 0,
    paused = 0,
    completed = 0,
    criticalCount = 0,
  } = kpis || {};

  const stats = [
    {
      label: 'Total Orders',
      value: total,
      color: 'bg-[#4E5840]',
      textColor: 'text-[#4E5840]',
    },
    {
      label: 'New',
      value: newCount,
      color: 'bg-gray-400',
      textColor: 'text-gray-600',
    },
    {
      label: 'In Progress',
      value: inprogress,
      color: 'bg-[#CDB261]',
      textColor: 'text-[#CDB261]',
    },
    {
      label: 'Paused',
      value: paused,
      color: 'bg-[#A57865]',
      textColor: 'text-[#A57865]',
    },
    {
      label: 'Completed',
      value: completed,
      color: 'bg-[#5C9BA4]',
      textColor: 'text-[#5C9BA4]',
    },
    {
      label: 'Critical',
      value: criticalCount,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      highlight: criticalCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white border rounded-xl shadow-sm p-4 ${
            stat.highlight ? 'border-red-300 bg-red-50/50' : 'border-neutral-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-8 rounded-full ${stat.color}`} />
            <div>
              <p className="text-xs text-[#6B6F63] font-medium">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
