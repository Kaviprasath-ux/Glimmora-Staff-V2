import { useState, useEffect, useMemo } from 'react';

const priorityStyles = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-[#5C9BA4]/15 text-[#5C9BA4]',
  high: 'bg-[#CDB261]/20 text-[#CDB261]',
  urgent: 'bg-red-100 text-red-600 animate-pulse'
};

const statusStyles = {
  pending: 'bg-gray-100 text-gray-600',
  accepted: 'bg-[#5C9BA4]/15 text-[#5C9BA4]',
  inprogress: 'bg-[#CDB261]/20 text-[#CDB261]',
  completed: 'bg-green-100 text-green-600'
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Accepted',
  inprogress: 'In Progress',
  completed: 'Completed'
};

export default function RunnerTaskCard({ task, onClick, onAccept, onStart, onComplete }) {
  const timeAgo = useMemo(() => {
    const now = new Date();
    const created = new Date(task.createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }, [task.createdAt]);

  // FIX RN-M01: Real-time elapsed timer using state and interval
  const [elapsedTime, setElapsedTime] = useState(() => {
    if (!task.startedAt || task.status === 'completed') return null;
    const now = new Date();
    const started = new Date(task.startedAt);
    return Math.floor((now - started) / 60000);
  });

  useEffect(() => {
    // Only set up interval for in-progress tasks
    if (!task.startedAt || task.status === 'completed') {
      setElapsedTime(null);
      return;
    }

    // Calculate and set initial elapsed time
    const calcElapsed = () => {
      const now = new Date();
      const started = new Date(task.startedAt);
      return Math.floor((now - started) / 60000);
    };
    setElapsedTime(calcElapsed());

    // Update every 30 seconds for more responsive timer
    const interval = setInterval(() => {
      setElapsedTime(calcElapsed());
    }, 30000);

    return () => clearInterval(interval);
  }, [task.startedAt, task.status]);

  const isOvertime = elapsedTime && elapsedTime > task.estimatedMinutes;

  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-all ${
        task.priority === 'urgent' ? 'border-red-300 ring-1 ring-red-200' : 'border-neutral-200'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Task Type Icon */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            task.type === 'delivery' ? 'bg-[#A57865]/10' : 'bg-[#5C9BA4]/10'
          }`}>
            {task.type === 'delivery' ? (
              <svg className="w-4 h-4 text-[#A57865]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[#5C9BA4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </div>
          <div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              task.type === 'delivery' ? 'bg-[#A57865]/10 text-[#A57865]' : 'bg-[#5C9BA4]/10 text-[#5C9BA4]'
            }`}>
              {task.type === 'delivery' ? 'Delivery' : 'Pickup'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>
            {statusLabels[task.status]}
          </span>
        </div>
      </div>

      {/* Title & Room */}
      <h3 className="font-semibold text-[#4E5840] mb-1">{task.title}</h3>
      <div className="flex items-center gap-2 text-sm text-[#6B6F63] mb-3">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span>Room {task.room}</span>
        {task.guestName && (
          <>
            <span>•</span>
            <span>{task.guestName}</span>
          </>
        )}
      </div>

      {/* Location Flow */}
      <div className="flex items-center gap-2 text-xs text-[#6B6F63] mb-3 bg-neutral-50 rounded-lg p-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#5C9BA4]"></div>
          <span>{task.pickupLocation}</span>
        </div>
        <svg className="w-4 h-4 text-[#6B6F63]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#A57865]"></div>
          <span>{task.deliveryLocation}</span>
        </div>
      </div>

      {/* Timer for In Progress */}
      {task.status === 'inprogress' && elapsedTime !== null && (
        <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg ${
          isOvertime ? 'bg-red-50 text-red-600' : 'bg-[#CDB261]/10 text-[#CDB261]'
        }`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">
            {elapsedTime} min {isOvertime ? `(+${elapsedTime - task.estimatedMinutes} overtime)` : `/ ${task.estimatedMinutes} min`}
          </span>
        </div>
      )}

      {/* Special Instructions */}
      {task.specialInstructions && (
        <div className="flex items-start gap-2 mb-3 text-xs text-[#A57865] bg-[#A57865]/5 rounded-lg p-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{task.specialInstructions}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
        <div className="flex items-center gap-3 text-xs text-[#6B6F63]">
          <span>{timeAgo}</span>
          {task.notes.length > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>{task.notes.length}</span>
            </div>
          )}
          {task.qrVerified && (
            <div className="flex items-center gap-1 text-green-600">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>QR</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {task.status === 'pending' && onAccept && (
            <button
              onClick={() => onAccept(task.id)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#5C9BA4] rounded-lg hover:bg-[#4A8A94] transition-colors"
            >
              Accept
            </button>
          )}
          {task.status === 'accepted' && onStart && (
            <button
              onClick={() => onStart(task.id)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
            >
              Start
            </button>
          )}
          {task.status === 'inprogress' && onComplete && (
            <button
              onClick={() => onComplete(task.id)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#4E5840] rounded-lg hover:bg-[#3E4830] transition-colors"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
