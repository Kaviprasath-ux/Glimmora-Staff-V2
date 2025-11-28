import { useState } from 'react';
import Checklist from './Checklist';

const priorityStyles = {
  high: 'bg-[#D9534F]/15 text-[#D9534F]',
  medium: 'bg-[#CDB261]/20 text-[#8C742A]',
  low: 'bg-[#5C9BA4]/15 text-[#5C9BA4]',
};

const statusStyles = {
  todo: 'bg-gray-100 text-gray-600',
  inprogress: 'bg-[#CDB261]/20 text-[#CDB261]',
  completed: 'bg-[#5C9BA4]/20 text-[#5C9BA4]',
};

const statusLabels = {
  todo: 'To Do',
  inprogress: 'In Progress',
  completed: 'Completed',
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleChecklist,
  onAddChecklistItem,
  onRemoveChecklistItem,
}) {
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!task) return null;

  const completedItems = task.checklist?.filter(item => item.completed).length || 0;
  const totalItems = task.checklist?.length || 0;
  const hasIncompleteChecklist = totalItems > 0 && completedItems < totalItems;

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'completed' && hasIncompleteChecklist) {
      setShowConfirmComplete(true);
    } else {
      onStatusChange(task.id, newStatus);
    }
  };

  const confirmComplete = () => {
    onStatusChange(task.id, 'completed');
    setShowConfirmComplete(false);
  };

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-[#4E5840] truncate">
                {task.title}
              </h3>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  priorityStyles[task.priority] || priorityStyles.medium
                }`}
              >
                {task.priority}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#6B6F63]">
              {task.room && <span>Room {task.room}</span>}
              {task.dueTime && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Due {task.dueTime}
                </span>
              )}
            </div>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
              statusStyles[task.status] || statusStyles.todo
            }`}
          >
            {statusLabels[task.status] || 'To Do'}
          </span>
        </div>

        {/* Description preview */}
        {task.description && (
          <p className="text-sm text-[#6B6F63] line-clamp-2">{task.description}</p>
        )}

        {/* Checklist progress */}
        {totalItems > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-[#4E5840] hover:text-[#A57865] transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-24 bg-neutral-200 rounded-full h-1.5">
                <div
                  className="bg-[#5C9BA4] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(completedItems / totalItems) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium">
                {completedItems}/{totalItems} completed
              </span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* Expanded checklist */}
        {expanded && totalItems > 0 && (
          <div className="pt-2 border-t border-neutral-100">
            <Checklist
              items={task.checklist}
              taskId={task.id}
              onToggle={onToggleChecklist}
              onAdd={onAddChecklistItem}
              onRemove={onRemoveChecklistItem}
              editable={task.status !== 'completed'}
            />
          </div>
        )}

        {/* Status change buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
          {['todo', 'inprogress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                task.status === status
                  ? 'bg-[#A57865] text-white'
                  : 'bg-neutral-100 text-[#6B6F63] hover:bg-neutral-200'
              }`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onEdit(task)}
            className="flex-1 px-3 py-2 text-sm font-medium text-[#A57865] border border-[#A57865] rounded-lg hover:bg-[#A57865]/10 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[#4E5840] mb-2">
              Incomplete Checklist
            </h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              This task has {totalItems - completedItems} incomplete checklist items.
              Mark as complete anyway?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmComplete(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmComplete}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554]"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
