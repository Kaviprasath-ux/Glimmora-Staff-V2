export default function RunnerKPIBar({ kpis }) {
  const kpiItems = [
    {
      label: 'Active Tasks',
      value: kpis.pending + kpis.accepted + kpis.inProgress,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-[#A57865]/10 text-[#A57865]'
    },
    {
      label: 'Completed Today',
      value: kpis.completedToday,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Deliveries',
      value: kpis.deliveries,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-[#5C9BA4]/10 text-[#5C9BA4]'
    },
    {
      label: 'Pickups',
      value: kpis.pickups,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
      color: 'bg-[#CDB261]/10 text-[#CDB261]'
    },
    {
      label: 'Avg Time',
      value: `${kpis.avgCompletionTime}m`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-[#4E5840]/10 text-[#4E5840]'
    },
    {
      label: 'On-Time Rate',
      value: `${kpis.onTimeRate}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: kpis.onTimeRate >= 90 ? 'bg-green-100 text-green-600' : kpis.onTimeRate >= 70 ? 'bg-[#CDB261]/10 text-[#CDB261]' : 'bg-red-100 text-red-600'
    }
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mx-auto mb-2`}>
              {item.icon}
            </div>
            <p className="text-2xl font-bold text-[#4E5840]">{item.value}</p>
            <p className="text-xs text-[#6B6F63]">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Urgent Alert */}
      {kpis.urgentCount > 0 && (
        <div className="mt-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium text-red-600">
            {kpis.urgentCount} urgent task{kpis.urgentCount > 1 ? 's' : ''} require immediate attention
          </span>
        </div>
      )}
    </div>
  );
}
