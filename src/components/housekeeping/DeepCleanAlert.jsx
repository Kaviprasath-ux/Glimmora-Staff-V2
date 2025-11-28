export default function DeepCleanAlert({ alerts, onMarkComplete }) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-semibold text-[#4E5840] mb-3">Deep Clean Alerts</h3>
        <div className="text-center py-6">
          <svg
            className="w-10 h-10 mx-auto text-green-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-[#6B6F63]">All rooms up to date</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#4E5840]">Deep Clean Alerts</h3>
        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
          {alerts.length} due
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              alert.isOverdue ? 'bg-red-50 border border-red-200' : 'bg-[#CDB261]/10 border border-[#CDB261]/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                alert.isOverdue ? 'bg-red-100' : 'bg-[#CDB261]/20'
              }`}>
                <svg
                  className={`w-4 h-4 ${alert.isOverdue ? 'text-red-600' : 'text-[#CDB261]'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#4E5840]">
                    Room {alert.roomNumber}
                  </span>
                  {alert.vip && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#CDB261]/20 text-[#CDB261] rounded">
                      VIP
                    </span>
                  )}
                </div>
                <span className={`text-xs ${alert.isOverdue ? 'text-red-600' : 'text-[#CDB261]'}`}>
                  {alert.isOverdue
                    ? `${Math.abs(alert.daysUntilDue)} days overdue`
                    : alert.daysUntilDue === 0
                    ? 'Due today'
                    : `Due in ${alert.daysUntilDue} days`}
                </span>
              </div>
            </div>
            {onMarkComplete && (
              <button
                onClick={() => onMarkComplete(alert.id)}
                className="px-2 py-1 text-xs font-medium text-[#5C9BA4] hover:bg-[#5C9BA4]/10 rounded transition-colors"
              >
                Mark Done
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
