import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const RoomCard = ({ room, onStatusChange, onChecklistUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    dirty: {
      color: 'bg-yellow-500 text-white',
      label: 'Dirty',
      action: 'Start Cleaning',
      nextStatus: 'in_progress',
    },
    in_progress: {
      color: 'bg-blue-500 text-white',
      label: 'In Progress',
      action: 'Finish Cleaning',
      nextStatus: 'clean',
    },
    clean: {
      color: 'bg-green-600 text-white',
      label: 'Clean',
      action: 'Completed',
      nextStatus: null,
    },
  };

  const priorityColors = {
    high: 'border-l-4 border-l-red-500',
    medium: 'border-l-4 border-l-yellow-500',
    low: 'border-l-4 border-l-green-500',
  };

  const handleStatusChange = () => {
    const nextStatus = statusConfig[room.status].nextStatus;
    if (nextStatus) {
      onStatusChange(room.id, nextStatus);
    }
  };

  const handleChecklistToggle = (checklistId, completed) => {
    onChecklistUpdate(room.id, checklistId, completed);
  };

  const completedItems = room.cleaningChecklist.filter(item => item.completed).length;
  const totalItems = room.cleaningChecklist.length;
  const progress = (completedItems / totalItems) * 100;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-1">
            Room {room.roomNumber}
          </h3>
          <p className="text-sm text-neutral-600">Floor {room.floor} • {room.roomType}</p>
        </div>
        <span className={`px-2.5 py-1 rounded text-xs font-medium ${statusConfig[room.status].color}`}>
          {statusConfig[room.status].label}
        </span>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        {room.guestCheckout && (
          <div>
            <div className="text-neutral-600">Checkout</div>
            <div className="font-medium text-neutral-900">{room.guestCheckout}</div>
          </div>
        )}
        {room.nextGuestCheckin && (
          <div>
            <div className="text-neutral-600">Next Check-in</div>
            <div className="font-medium text-neutral-900">{room.nextGuestCheckin}</div>
          </div>
        )}
        <div>
          <div className="text-neutral-600">Est. Time</div>
          <div className="font-medium text-neutral-900">{room.estimatedTime}</div>
        </div>
        <div>
          <div className="text-neutral-600">Assigned</div>
          <div className="font-medium text-neutral-900">
            {room.assignedAt.split(' ')[3] + ' ' + room.assignedAt.split(' ')[4]}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-neutral-600 mb-2">
          <span>Progress</span>
          <span className="font-medium">{completedItems}/{totalItems}</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              room.status === 'clean' ? 'bg-green-600' :
              room.status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full py-2 text-sm font-medium text-neutral-900 hover:text-neutral-700 transition-colors"
        >
          <span>Checklist ({completedItems}/{totalItems})</span>
          <svg
            className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expanded && (
          <div className="mt-3 space-y-2 pt-3 border-t border-neutral-200">
            {room.cleaningChecklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) => handleChecklistToggle(item.id, e.target.checked)}
                  disabled={room.status === 'clean'}
                  className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary disabled:opacity-50"
                />
                <span className={`flex-1 text-sm ${
                  item.completed ? 'text-neutral-400 line-through' : 'text-neutral-700'
                }`}>
                  {item.item}
                </span>
                {item.completed && (
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Special Requests */}
      {room.specialRequests && room.specialRequests.length > 0 && (
        <div className="mb-4 p-3 bg-neutral-50 rounded">
          <p className="text-xs font-medium text-neutral-700 mb-2">Special Requests</p>
          <ul className="space-y-1">
            {room.specialRequests.map((request, index) => (
              <li key={index} className="text-sm text-neutral-600">• {request}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {room.notes && (
        <div className="mb-4 p-3 bg-neutral-50 rounded">
          <p className="text-xs font-medium text-neutral-700 mb-1">Notes</p>
          <p className="text-sm text-neutral-600">{room.notes}</p>
        </div>
      )}

      {/* Spacer to push actions to bottom */}
      <div className="flex-grow"></div>

      {/* Actions - Always at bottom */}
      <div className="mt-4 pt-4 border-t border-neutral-200">
        {room.status !== 'clean' ? (
          <button
            onClick={handleStatusChange}
            className="w-full px-4 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            {statusConfig[room.status].action}
          </button>
        ) : (
          <div className="text-center py-3">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-green-700">
              Completed at {room.completedAt.split(' ')[3] + ' ' + room.completedAt.split(' ')[4]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
