import { useState, useEffect } from 'react';
import CleaningTimer from './CleaningTimer';

const statusColors = {
  dirty: 'text-red-600 bg-red-50',
  inprogress: 'text-[#CDB261] bg-[#CDB261]/10',
  clean: 'text-green-600 bg-green-50',
  inspected: 'text-[#5C9BA4] bg-[#5C9BA4]/10',
};

export default function LiveCleaningFeed({ activeCleanings }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (activeCleanings.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-[#4E5840] mb-4">Live Cleaning Feed</h3>
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto text-neutral-300 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-[#6B6F63]">No active cleanings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#4E5840]">Live Cleaning Feed</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-[#6B6F63]">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-xs font-medium text-[#6B6F63] pb-2">Room</th>
              <th className="text-left text-xs font-medium text-[#6B6F63] pb-2">Staff</th>
              <th className="text-left text-xs font-medium text-[#6B6F63] pb-2">Status</th>
              <th className="text-center text-xs font-medium text-[#6B6F63] pb-2">Time</th>
              <th className="text-right text-xs font-medium text-[#6B6F63] pb-2">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {activeCleanings.map((cleaning) => {
              const elapsed = cleaning.startedAt
                ? Math.round((Date.now() - new Date(cleaning.startedAt).getTime()) / 60000)
                : 0;
              const progress = Math.min((elapsed / cleaning.estimatedTimeMinutes) * 100, 100);
              const isOvertime = elapsed > cleaning.estimatedTimeMinutes;

              return (
                <tr key={cleaning.id} className="group hover:bg-neutral-50">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#4E5840]">
                        {cleaning.roomNumber}
                      </span>
                      {cleaning.vip && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#CDB261]/20 text-[#CDB261]">
                          VIP
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#6B6F63]">{cleaning.type}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-[#4E5840]">{cleaning.staffName}</span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[cleaning.status]}`}>
                      {cleaning.pausedAt ? 'Paused' : 'Cleaning'}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <CleaningTimer
                      startedAt={cleaning.startedAt}
                      estimatedMinutes={cleaning.estimatedTimeMinutes}
                      isPaused={!!cleaning.pausedAt}
                      size="sm"
                    />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 bg-neutral-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            isOvertime ? 'bg-red-500' : 'bg-[#5C9BA4]'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${isOvertime ? 'text-red-500' : 'text-[#6B6F63]'}`}>
                        {elapsed}m
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
