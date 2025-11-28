export default function KPIBar({ kpis }) {
  const { total = 0, todo = 0, inProgress = 0, completed = 0 } = kpis || {};

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      color: 'bg-[#4E5840]',
      textColor: 'text-[#4E5840]',
    },
    {
      label: 'To Do',
      value: todo,
      color: 'bg-gray-400',
      textColor: 'text-gray-600',
    },
    {
      label: 'In Progress',
      value: inProgress,
      color: 'bg-[#CDB261]',
      textColor: 'text-[#CDB261]',
    },
    {
      label: 'Completed',
      value: completed,
      color: 'bg-[#5C9BA4]',
      textColor: 'text-[#5C9BA4]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4"
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
