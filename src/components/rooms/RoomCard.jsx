import { useState } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

const RoomCard = ({ room, onStatusChange, onChecklistUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    dirty: {
      color: 'bg-gold text-white',
      label: 'Dirty',
      action: 'Start Cleaning',
      nextStatus: 'in_progress',
    },
    in_progress: {
      color: 'bg-teal text-white',
      label: 'In Progress',
      action: 'Finish Cleaning',
      nextStatus: 'clean',
    },
    clean: {
      color: 'bg-deepgreen text-white',
      label: 'Clean',
      action: 'Completed',
      nextStatus: null,
    },
  };

  const priorityColors = {
    high: 'border-l-4 border-l-gold',
    medium: 'border-l-4 border-l-teal',
    low: 'border-l-4 border-l-beige',
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
    <div className={`bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden ${priorityColors[room.priority]}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-serif font-bold text-deepgreen">
                Room {room.roomNumber}
              </h3>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusConfig[room.status].color}`}>
                {statusConfig[room.status].label}
              </span>
            </div>
            <p className="text-sm text-neutral-600">Floor {room.floor} • {room.roomType}</p>
          </div>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {room.guestCheckout && (
            <div className="p-3 bg-neutral-50 rounded-lg">
              <div className="text-xs text-neutral-600 mb-1">Guest Checkout</div>
              <div className="text-sm font-semibold text-neutral-900">{room.guestCheckout}</div>
            </div>
          )}
          {room.nextGuestCheckin && (
            <div className="p-3 bg-neutral-50 rounded-lg">
              <div className="text-xs text-neutral-600 mb-1">Next Check-in</div>
              <div className="text-sm font-semibold text-neutral-900">{room.nextGuestCheckin}</div>
            </div>
          )}
          <div className="p-3 bg-neutral-50 rounded-lg">
            <div className="text-xs text-neutral-600 mb-1">Estimated Time</div>
            <div className="text-sm font-semibold text-neutral-900 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {room.estimatedTime}
            </div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg">
            <div className="text-xs text-neutral-600 mb-1">Assigned At</div>
            <div className="text-sm font-semibold text-neutral-900">{room.assignedAt.split(' ')[3] + ' ' + room.assignedAt.split(' ')[4]}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-neutral-700 font-medium">Cleaning Progress</span>
            <span className="text-neutral-600">{completedItems}/{totalItems} tasks</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                room.status === 'clean' ? 'bg-deepgreen' : room.status === 'in_progress' ? 'bg-teal' : 'bg-gold'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4"
        >
          <span>Cleaning Checklist</span>
          {expanded ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>

        {/* Checklist */}
        {expanded && (
          <div className="mb-4 space-y-2 p-4 bg-neutral-50 rounded-lg">
            {room.cleaningChecklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) => handleChecklistToggle(item.id, e.target.checked)}
                  disabled={room.status === 'clean'}
                  className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary disabled:opacity-50"
                />
                <span className={`text-sm flex-1 ${item.completed ? 'text-neutral-400 line-through' : 'text-neutral-700'}`}>
                  {item.item}
                </span>
                {item.completed && (
                  <CheckCircleIcon className="h-4 w-4 text-deepgreen" />
                )}
              </label>
            ))}
          </div>
        )}

        {/* Special Requests */}
        {room.specialRequests && room.specialRequests.length > 0 && (
          <div className="mb-4 p-3 bg-beige/20 rounded-lg border border-beige/30">
            <p className="text-xs font-medium text-neutral-700 mb-2">Special Requests:</p>
            <ul className="space-y-1">
              {room.specialRequests.map((request, index) => (
                <li key={index} className="text-sm text-neutral-600 flex items-start">
                  <span className="mr-2">•</span>
                  {request}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {room.notes && (
          <div className="mb-4 p-3 bg-gold/10 rounded-lg border border-gold/30">
            <p className="text-xs font-medium text-neutral-700 mb-1">Notes:</p>
            <p className="text-sm text-neutral-600">{room.notes}</p>
          </div>
        )}

        {/* Action Button */}
        {room.status !== 'clean' && (
          <button
            onClick={handleStatusChange}
            className={`w-full px-4 py-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
              room.status === 'dirty'
                ? 'bg-teal hover:bg-teal/90'
                : 'bg-deepgreen hover:bg-deepgreen/90'
            }`}
          >
            {room.status === 'dirty' && <PlayIcon className="h-5 w-5" />}
            {room.status === 'in_progress' && <CheckCircleIcon className="h-5 w-5" />}
            {statusConfig[room.status].action}
          </button>
        )}

        {room.status === 'clean' && room.completedAt && (
          <div className="text-center p-4 bg-deepgreen/10 rounded-lg border border-deepgreen/20">
            <CheckCircleIcon className="h-10 w-10 text-deepgreen mx-auto mb-2" />
            <p className="text-sm font-medium text-deepgreen">Completed at {room.completedAt.split(' ')[3] + ' ' + room.completedAt.split(' ')[4]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
