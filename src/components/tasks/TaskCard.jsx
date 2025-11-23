import { useState, useRef, useEffect } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useStaffTasks } from '../../context/StaffTasksContext';

const TaskCard = ({ task }) => {
  const [showChecklist, setShowChecklist] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { updateTaskStatus, updateTaskChecklist, deleteTask } = useStaffTasks();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = (newStatus) => {
    updateTaskStatus(task.id, newStatus);
    setShowStatusDropdown(false);
  };

  const statusConfig = {
    todo: {
      label: 'To Do',
      color: 'text-neutral-600',
      bgColor: 'bg-neutral-100',
    },
    in_progress: {
      label: 'In Progress',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    completed: {
      label: 'Completed',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  };

  const currentStatus = statusConfig[task.status];

  const handleChecklistToggle = (checklistId, completed) => {
    updateTaskChecklist(task.id, checklistId, completed);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const completedItems = task.checklist.filter(item => item.completed).length;
  const totalItems = task.checklist.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 hover:border-neutral-300 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-neutral-900">{task.title}</h3>
            {task.priority === 'high' && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                High Priority
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-600">{task.description}</p>
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete task"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 mb-4 text-sm text-neutral-600">
        {task.roomNumber && task.roomNumber !== 'N/A' && (
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="h-4 w-4" />
            <span>Room {task.roomNumber}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <ClockIcon className="h-4 w-4" />
          <span>{task.dueTime}</span>
        </div>
      </div>

      {/* Progress */}
      {totalItems > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-2">
            <span>Progress</span>
            <span className="font-medium">{completedItems}/{totalItems}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Dropdown */}
      <div className="mb-4 relative" ref={dropdownRef}>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">Status</label>
        <button
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          className={`w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-left text-sm font-medium transition-colors hover:border-neutral-300 flex items-center justify-between ${currentStatus.bgColor} ${currentStatus.color}`}
        >
          <span>{currentStatus.label}</span>
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showStatusDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => handleStatusChange('todo')}
              className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-neutral-50 flex items-center justify-between ${
                task.status === 'todo' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600'
              }`}
            >
              <span>To Do</span>
              {task.status === 'todo' && <CheckCircleIcon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => handleStatusChange('in_progress')}
              className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-blue-50 flex items-center justify-between ${
                task.status === 'in_progress' ? 'bg-blue-100 text-blue-900' : 'text-neutral-600'
              }`}
            >
              <span>In Progress</span>
              {task.status === 'in_progress' && <CheckCircleIcon className="h-4 w-4 text-blue-600" />}
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-green-50 flex items-center justify-between ${
                task.status === 'completed' ? 'bg-green-100 text-green-900' : 'text-neutral-600'
              }`}
            >
              <span>Completed</span>
              {task.status === 'completed' && <CheckCircleIcon className="h-4 w-4 text-green-600" />}
            </button>
          </div>
        )}
      </div>

      {/* Checklist */}
      {totalItems > 0 && (
        <div>
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-neutral-900 hover:text-neutral-700 transition-colors"
          >
            <span>Checklist ({completedItems}/{totalItems})</span>
            <svg
              className={`h-4 w-4 transition-transform ${showChecklist ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showChecklist && (
            <div className="mt-3 space-y-2 pt-3 border-t border-neutral-200">
              {task.checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => handleChecklistToggle(item.id, e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <span className={`flex-1 text-sm ${item.completed ? 'text-neutral-400 line-through' : 'text-neutral-700'}`}>
                    {item.text}
                  </span>
                  {item.completed && (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {task.notes && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-xs font-medium text-neutral-500 mb-1">Notes</p>
          <p className="text-sm text-neutral-700">{task.notes}</p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
